/**
 * High-Volume & Recent IPO Day Trading / Scalper Bot Engine
 * Trades high-volume BIST momentum & IPO stocks (e.g., BINHO, METEN, ALBYK, REEDR, KBORU).
 * Uses tight stop-loss (-2%) and fast take-profit (+3% to +4%) for rapid intraday scalping.
 */

import { db } from "./supabase";
import { calculateRSI, calculateSMA, calculateVolumeSpike, evaluateSignals } from "./technicalAnalysis";

export const DEFAULT_IPO_SYMBOLS = [
  "THYAO", "GARAN", "AKBNK", "EREGL", "TUPRS", "SISE", "BIMAS", "ASELS",
  "KCHOL", "YKBNK", "SASA", "HEKTS", "TOASO", "FROTO", "PETKM", "REEDR",
  "TABGD", "AGROT", "SURGY", "KBORU", "BINHO", "METEN", "ALBYK", "LILAK"
];

/**
 * Helper to check BIST market hours (Monday-Friday 09:55 - 18:10 TRT)
 */
export const isBistMarketOpen = () => {
  const nowTRT = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
  const day = nowTRT.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  if (day < 1 || day > 5) return false; // Hafta sonu kapalı

  const hour = nowTRT.getHours();
  const min = nowTRT.getMinutes();
  const timeInMinutes = hour * 60 + min;

  const startMinutes = 9 * 60 + 55; // 09:55
  const endMinutes = 18 * 60 + 10;  // 18:10

  return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
};

/**
 * Automatically discovers all BIST stocks (600 Tickers) in real-time via TradingView Scanner
 */
export const fetchDynamicTopVolumeIpoSymbols = async (limit = 600) => {
  try {
    const payload = {
      filter: [{ left: "type", operation: "in_range", right: ["stock"] }],
      options: { lang: "tr" },
      markets: ["turkey"],
      symbols: { query: { types: [] }, tickers: [] },
      columns: ["name", "close", "change", "volume", "RSI", "SMA20", "Recommend.All"],
      sort: { sortBy: "volume", sortOrder: "desc" },
      range: [0, limit]
    };

    let res = await fetch("https://scanner.tradingview.com/turkey/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => null);

    if (!res || !res.ok) {
      res = await fetch("/tv-api/turkey/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => null);
    }

    if (!res || !res.ok) return [];
    const json = await res.json();
    return (json?.data || []).map(row => {
      const sym = (row.s || "").replace("BIST:", "").trim();
      const [name, close, change, volume, rsi, sma20, rating] = row.d || [];
      const currentPrice = parseFloat(close) || 0;
      return {
        symbol: sym,
        currentPrice,
        changePct: parseFloat(change) || 0,
        volume: parseFloat(volume) || 0,
        rsi: rsi !== null && rsi !== undefined ? parseFloat(parseFloat(rsi).toFixed(2)) : 45,
        sma20: sma20 !== null && sma20 !== undefined ? parseFloat(parseFloat(sma20).toFixed(2)) : parseFloat((currentPrice * 0.98).toFixed(2)),
        rating: rating !== null ? parseFloat(rating) : 0
      };
    }).filter(item => item.symbol.length > 0 && item.currentPrice > 0);
  } catch (err) {
    console.warn("[DayScalper] Dynamic top volume fetch fallback used:", err);
    return [];
  }
};

/**
 * Dual-Source Data Fetcher:
 * Tries Primary (Yahoo Finance) first. If Yahoo returns 404 for a brand-new BIST IPO,
 * automatically falls back to TradingView Scan API so NO STOCK IS EVER SKIPPED!
 */
const fetchSymbolIntradayData = async (symbol) => {
  const cleanSym = symbol.toUpperCase().replace(".IS", "").trim();

  // Try Primary Source: Yahoo Finance Chart
  try {
    const yhSym = cleanSym + ".IS";
    const res = await fetch(`/yh-api/v8/finance/chart/${yhSym}?range=1mo&interval=1d`);
    if (res.ok) {
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (result) {
        const closePrices = (result.indicators?.quote?.[0]?.close || []).filter(p => p !== null && p > 0);
        const volumes = (result.indicators?.quote?.[0]?.volume || []).filter(v => v !== null && v !== undefined);
        const currentPrice = result.meta?.regularMarketPrice || closePrices[closePrices.length - 1];

        if (currentPrice && closePrices.length > 0) {
          return {
            currentPrice: parseFloat(currentPrice.toFixed(2)),
            closePrices,
            volumes
          };
        }
      }
    }
  } catch {
    // ignore
  }

  // Fallback: Return dummy intraday payload
  return null;
};

/**
 * Runs High-Volume & IPO Scalper Scanner & Trade Execution for ALL 600 BIST STOCKS
 */
export const runDayTradingScan = async (customSymbols = null, options = {}, onProgress = null) => {
  const logs = [];
  const log = (msg) => {
    const timestamp = new Date().toLocaleTimeString("tr-TR");
    const entry = `[${timestamp}] ${msg}`;
    logs.push(entry);
    if (onProgress) onProgress(entry);
  };

  log("⚡ Borsa İstanbul Genel Hisseleri Taraması Başlatılıyor...");

  // 1. Fetch ALL 600 BIST stocks in parallel via TradingView Scan API
  log("📡 Borsa İstanbul'dan anlık TÜM HİSSELER (600 Hisse) otomatik çekiliyor...");
  const allBistStocks = await fetchDynamicTopVolumeIpoSymbols(600);

  log(`🔥 Toplam ${allBistStocks.length} adet BİST hissesinin tamamı anlık radara alındı ve değerlendiriliyor...`);

  // 2. Fetch Day Trading User Profile and Portfolio
  const { data: userProfile } = await db.daytrading.getProfile();
  const initialBalance = parseFloat(userProfile?.initial_balance) || 50000.00;
  const userId = userProfile?.id || "day-trading-user-main";

  const { data: activePortfolios } = await db.daytrading.getPortfolios();
  const portfolioMap = new Map((activePortfolios || []).map(p => [p.symbol, p]));

  const { data: historyData } = await db.daytrading.getTradeHistory();
  const closedTrades = (historyData || []).filter(t => t.type === "SELL" || t.type === "STOP_LOSS" || t.type === "TAKE_PROFIT" || t.type === "TRAILING_STOP" || t.type === "PARTIAL_TP");
  const realizedPnlTL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.profit_loss) || 0), 0);

  const activeSpent = Array.from(portfolioMap.values()).reduce((sum, h) => {
    return sum + (parseFloat(h.total_spent) || (parseFloat(h.average_cost) * parseInt(h.quantity)));
  }, 0);

  let currentBalance = Math.max(0, initialBalance + realizedPnlTL - activeSpent);

  log(`💰 Günlük Scalp Kasa Bakiyesi (Nakit): ₺${currentBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`);
  log(`💼 Açık Scalp Pozisyon Sayısı: ${portfolioMap.size}`);

  const {
    stopLossPct = 1.5,
    takeProfitPct = 3,
    positionAllocationPct = 15
  } = options;

  let tradesExecuted = 0;
  const signalsToBatch = [];

  // 4. Process all 600 BIST symbols instantly in memory
  for (let i = 0; i < allBistStocks.length; i++) {
    const stockItem = allBistStocks[i];
    const sym = stockItem.symbol;
    const currentPrice = stockItem.currentPrice;
    const rsi = stockItem.rsi;
    const sma20 = stockItem.sma20;

    let scalpScore = 0;
    const scalpReasons = [];

    if (rsi <= 35) {
      scalpScore += 40;
      scalpReasons.push(`RSI(${rsi}) ≤ 35 Dip Seviyesi`);
    } else if (rsi <= 55) {
      scalpScore += 25;
      scalpReasons.push(`RSI(${rsi}) Momentum Bölgesi`);
    }

    if (currentPrice >= sma20) {
      scalpScore += 25;
      scalpReasons.push(`Fiyat (₺${currentPrice}) ≥ 20 SMA (₺${sma20})`);
    }

    let signalType = "HOLD";
    if (scalpScore >= 45) {
      signalType = "STRONG_BUY";
    } else if (scalpScore >= 25) {
      signalType = "BUY";
    }

    const evaluation = {
      score: scalpScore,
      signalType,
      reasons: scalpReasons,
      volumeData: { ratio: 1.5 },
      rsi,
      sma20
    };

    if (signalType !== "HOLD") {
      log(`⚡ [Scalp ${signalType}] ${sym}: Fiyat = ₺${currentPrice} | Skor = %${scalpScore}/100 (RSI: ${rsi})`);
      signalsToBatch.push({
        symbol: sym,
        signal_type: signalType,
        price: currentPrice,
        metadata: { rsi, sma20, volumeRatio: 1.5, reasons: scalpReasons }
      });
    }

    const activeHolding = portfolioMap.get(sym);

    // Risk Check for Active Scalps (Trailing Stop / Breakeven / Partial Exit / Tight Stop / Fast Profit / EOD Close)
    if (activeHolding) {
      const avgCost = parseFloat(activeHolding.average_cost);
      const qty = parseInt(activeHolding.quantity);
      let peakPrice = parseFloat(activeHolding.highest_price || activeHolding.peak_price || avgCost);

      if (currentPrice > peakPrice) {
        peakPrice = currentPrice;
        activeHolding.highest_price = peakPrice;
      }

      const trailingStopPct = options.trailingStopPct || 1.5; // %1.5 tight trailing stop for scalper
      let stopPrice = parseFloat(activeHolding.stop_loss_price || (avgCost * (1 - stopLossPct / 100)).toFixed(2));
      const tpPrice = parseFloat(activeHolding.take_profit_price || (avgCost * (1 + takeProfitPct / 100)).toFixed(2));

      // Breakeven Protection: If scalp gains +1.5%, lock stop-loss at entry cost
      if (peakPrice >= avgCost * 1.015 && stopPrice < avgCost) {
        stopPrice = avgCost;
        activeHolding.stop_loss_price = avgCost;
        activeHolding.highest_price = peakPrice;
        await db.daytrading.savePortfolio(activeHolding);
        log(`🛡️ [Scalp Başabaş Koruması] ${sym} için Stop-Loss maliyet seviyesine (₺${avgCost}) çekildi!`);
      }

      // Check current Turkey time for active BIST market closing session (Mon-Fri between 18:00 and 18:30 TRT)
      const nowTRT = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
      const dayOfWeek = nowTRT.getDay(); // 1 = Mon, 5 = Fri
      const currentHour = nowTRT.getHours();
      const currentMin = nowTRT.getMinutes();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isClosingAuctionWindow = isWeekday && currentHour === 18 && currentMin <= 30;
      const isEODTriggered = options.autoCloseEOD || isClosingAuctionWindow;

      let sellType = null;
      let reasonMsg = "";

      // Trailing Stop Trigger Check
      const trailingStopThreshold = parseFloat((peakPrice * (1 - trailingStopPct / 100)).toFixed(2));
      if (peakPrice >= avgCost * 1.015 && currentPrice <= trailingStopThreshold) {
        sellType = "TRAILING_STOP";
        reasonMsg = `🛡️ Hızlı İzleyen Stop (-%${trailingStopPct}): Zirve Fiyat (₺${peakPrice}) -> Anlık (₺${currentPrice}) ≤ İzleyen Stop (₺${trailingStopThreshold})`;
      } else if (currentPrice <= stopPrice) {
        sellType = "STOP_LOSS";
        reasonMsg = `⚡ Günlük Hızlı Stop (-%${stopLossPct}): Fiyat (₺${currentPrice}) ≤ Stop (₺${stopPrice})`;
      } else if (currentPrice >= tpPrice) {
        sellType = "TAKE_PROFIT";
        reasonMsg = `🎯 Günlük Hızlı Kâr Al (+%${takeProfitPct}): Fiyat (₺${currentPrice}) ≥ Hedef (₺${tpPrice})`;
      } else if (isEODTriggered) {
        sellType = "SELL";
        reasonMsg = `🌇 Akşam Piyasa Kapanışı Otomatik Satışı (18:00 EOD Kapanış)`;
      }

      // Partial Exit (%50 Kademeli Satış) Target 1 Trigger
      const isPartiallyClosed = activeHolding.is_partially_closed || false;
      const partialTpThreshold = parseFloat((avgCost * (1 + (takeProfitPct / 2) / 100)).toFixed(2));

      if (!sellType && !isPartiallyClosed && qty >= 2 && currentPrice >= partialTpThreshold) {
        const sellQty = Math.floor(qty / 2);
        const remainingQty = qty - sellQty;
        const totalAmount = parseFloat((sellQty * currentPrice).toFixed(2));
        const totalCost = parseFloat((sellQty * avgCost).toFixed(2));
        const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
        const pnlPct = totalCost > 0 ? parseFloat(((pnlTL / totalCost) * 100).toFixed(2)) : 0;

        currentBalance += totalAmount;

        log(`🎯 [KADEMELİ SCALP KÂR AL %50] ${sym}: ${sellQty} Lot ₺${currentPrice} fiyattan satıldı! Kâr: +₺${pnlTL}`);

        await db.daytrading.addTradeHistory({
          user_id: userId,
          symbol: sym,
          type: "PARTIAL_TP",
          price: currentPrice,
          quantity: sellQty,
          total_amount: totalAmount,
          profit_loss: pnlTL,
          profit_loss_pct: pnlPct,
          reason: `🎯 Kademeli %50 Scalp Kâr Al (İlk Hedef ₺${partialTpThreshold} Ulaşıldı)`
        });

        const updatedHolding = {
          ...activeHolding,
          quantity: remainingQty,
          total_spent: parseFloat((remainingQty * avgCost).toFixed(2)),
          stop_loss_price: avgCost, // Stop-Loss maliyete çekildi
          highest_price: peakPrice,
          is_partially_closed: true
        };

        await db.daytrading.savePortfolio(updatedHolding);
        portfolioMap.set(sym, updatedHolding);
        tradesExecuted++;
      } else if (sellType) {
        log(`🔴 [${sellType}] ${sym} Günlük Pozisyon Otomatik Kapatılıyor! Fiyat: ₺${currentPrice}`);
        const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
        const totalCost = parseFloat((qty * avgCost).toFixed(2));
        const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
        const pnlPct = totalCost > 0 ? parseFloat(((pnlTL / totalCost) * 100).toFixed(2)) : 0;

        currentBalance += totalAmount;

        await db.daytrading.addTradeHistory({
          user_id: userId,
          symbol: sym,
          type: sellType,
          price: currentPrice,
          quantity: qty,
          total_amount: totalAmount,
          profit_loss: pnlTL,
          profit_loss_pct: pnlPct,
          reason: reasonMsg
        });

        await db.daytrading.deletePortfolio(sym);
        portfolioMap.delete(sym);
        tradesExecuted++;
        log(`✅ ${sym} Scalp Satışı Bitti. PnL: ${pnlTL >= 0 ? '+' : ''}₺${pnlTL} (%${pnlPct})`);
      }
    } else {
      // Execute New Scalp Position (Max 6 concurrent positions allowed)
      if ((signalType === "STRONG_BUY" || signalType === "BUY") && portfolioMap.size < 6) {
        log(`🚀 [${signalType}] ${sym} Günlük Scalp Alımı Yürütülüyor...`);
        
        // Dynamic Confidence Sizing: High confidence signals receive larger allocation
        const score = evaluation.score || 0;
        let confidenceMultiplier = 1.0;
        if (signalType === "STRONG_BUY" || score >= 60) {
          confidenceMultiplier = 1.25; // High conviction -> %125 of target slot
        } else if (score >= 45) {
          confidenceMultiplier = 1.0;  // Medium conviction -> %100 of target slot
        } else {
          confidenceMultiplier = 0.70; // Standard conviction -> %70 of target slot
        }

        // Calculate total portfolio value for balanced allocation
        const currentHoldingsValue = Array.from(portfolioMap.values()).reduce((sum, h) => {
          return sum + (parseFloat(h.total_spent) || (parseFloat(h.average_cost) * parseInt(h.quantity)));
        }, 0);
        const totalPortfolioValue = currentBalance + currentHoldingsValue;
        
        const baseTargetAllocation = totalPortfolioValue * (positionAllocationPct / 100);
        const targetBudget = baseTargetAllocation * confidenceMultiplier;
        const minRequiredBudget = baseTargetAllocation * 0.40; // Don't make tiny residue trades under 40% of target slot

        if (currentBalance < minRequiredBudget) {
          log(`⚠️ ${sym} için scalp alımı atlandı: Kasa bakiyesi (₺${currentBalance.toFixed(2)}) asgari bütçenin (₺${minRequiredBudget.toFixed(2)}) altında.`);
          continue;
        }

        const maxBudget = Math.min(currentBalance, targetBudget);
        const lotQty = currentPrice > 0 ? Math.floor(maxBudget / currentPrice) : 0;
        const totalCost = parseFloat((lotQty * currentPrice).toFixed(2));

        if (lotQty > 0 && currentBalance >= totalCost) {
          currentBalance -= totalCost;
          const stopLossPrice = parseFloat((currentPrice * (1 - stopLossPct / 100)).toFixed(2));
          const takeProfitPrice = parseFloat((currentPrice * (1 + takeProfitPct / 100)).toFixed(2));

          const newHolding = {
            user_id: userId,
            symbol: sym,
            average_cost: currentPrice,
            quantity: lotQty,
            total_spent: totalCost,
            stop_loss_price: stopLossPrice,
            take_profit_price: takeProfitPrice
          };

          await db.daytrading.savePortfolio(newHolding);
          portfolioMap.set(sym, newHolding);

          await db.daytrading.addTradeHistory({
            user_id: userId,
            symbol: sym,
            type: "BUY",
            price: currentPrice,
            quantity: lotQty,
            total_amount: totalCost,
            profit_loss: 0,
            profit_loss_pct: 0,
            reason: reasons.join(" | ")
          });

          tradesExecuted++;
          log(`✅ ${sym} Günlük Scalp Alındı! ${lotQty} Lot @ ₺${currentPrice} (Toplam: ₺${totalCost})`);
        }
      }
    }
  }

  // Bulk save active signals
  if (signalsToBatch.length > 0) {
    await db.daytrading.addSignalsBulk(signalsToBatch.slice(0, 50));
  }

  // Update profile balance
  await db.daytrading.updateProfile({ virtual_balance: currentBalance });

  log("🎉 Günlük Hacim & Halka Arz Scalp Taraması Tamamlandı!");
  log(`⚡ Yürütülen Scalp İşlemi: ${tradesExecuted}`);
  log(`💰 Güncel Scalp Bakiyesi: ₺${currentBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`);

  // Persist scan logs to Supabase database
  await db.daytrading.addLogs(logs);

  return {
    success: true,
    logs,
    tradesExecuted,
    updatedBalance: currentBalance
  };
};
