/**
 * Paper Trading Autonomous Scanner & Execution Engine
 * Scans BIST stocks, evaluates signals, executes simulated paper trades,
 * and manages stop-loss / take-profit risk rules.
 */

import { evaluateSignals } from "./technicalAnalysis";
import { db } from "./supabase";
import { isBistMarketOpen } from "./dayTradingBot";

export { isBistMarketOpen };

export const DEFAULT_SCAN_SYMBOLS = [];

/**
 * Automatically discovers all BIST stocks (600 Tickers) in real-time via TradingView Scanner
 */
export const fetchAllBistStocksFromTradingView = async (limit = 600) => {
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
    console.warn("[PaperBot] TradingView scan error:", err);
    return [];
  }
};

/**
 * Runs full BIST Market Scan & Paper Trading Simulation Execution for ALL 600 BIST STOCKS
 */
export const runMarketScan = async (customSymbols = null, options = {}, onProgress = null) => {
  const logs = [];
  const log = (msg) => {
    const timestamp = new Date().toLocaleTimeString("tr-TR");
    const entry = `[${timestamp}] ${msg}`;
    logs.push(entry);
    if (onProgress) onProgress(entry);
  };

  log("🤖 Gelişmiş Hassas Borsa Botu Taraması Başlatılıyor...");
  log("📡 Borsa İstanbul Genel Hisseleri (600 Hisse) Canlı Radara Alınıyor...");

  // 1. Fetch Paper User Profile and Portfolio
  const { data: userProfile } = await db.paper.getProfile();
  const initialBalance = parseFloat(userProfile?.initial_balance) || 100000.00;
  const userId = userProfile?.id || "paper-user-main";

  const { data: activePortfolios } = await db.paper.getPortfolios();
  const portfolioMap = new Map((activePortfolios || []).map(p => [p.symbol, p]));

  const { data: historyData } = await db.paper.getTradeHistory();
  const closedTrades = (historyData || []).filter(t => t.type === "SELL" || t.type === "STOP_LOSS" || t.type === "TAKE_PROFIT" || t.type === "TRAILING_STOP" || t.type === "PARTIAL_TP");
  const realizedPnlTL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.profit_loss) || 0), 0);

  const activeSpent = Array.from(portfolioMap.values()).reduce((sum, h) => {
    return sum + (parseFloat(h.total_spent) || (parseFloat(h.average_cost) * parseInt(h.quantity)));
  }, 0);

  let currentBalance = Math.max(0, initialBalance + realizedPnlTL - activeSpent);

  log(`📊 Mevcut Sanal Kasa Bakiyesi (Nakit): ₺${currentBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`);
  log(`💼 Açık Pozisyon Sayısı: ${portfolioMap.size}`);

  const scanResults = [];
  let tradesExecutedCount = 0;

  const {
    positionAllocationPct = 10,
    stopLossPct = 4,
    takeProfitPct = 8,
    rsiBuyThreshold = 35,
    smaPeriod = 20
  } = options;

  // 2. Fetch all 600 BIST stocks via TradingView Scanner API
  log(`🔍 Borsa İstanbul Tüm Hisseleri (600 Hisse) canlı fiyat ve indikatör verileriyle paralelde değerlendiriliyor...`);
  const allBistStocks = await fetchAllBistStocksFromTradingView(600);
  log(`🔥 Toplam ${allBistStocks.length} adet BİST hissesi anlık radara alındı!`);

  const signalsToBatch = [];
  
  // 3. Process all 600 BIST symbols instantly in memory
  for (let i = 0; i < allBistStocks.length; i++) {
    const stockItem = allBistStocks[i];
    const sym = stockItem.symbol;
    const currentPrice = stockItem.currentPrice;
    const rsi = stockItem.rsi;
    const sma20 = stockItem.sma20;

    let score = 0;
    const reasons = [];

    if (rsi <= rsiBuyThreshold) {
      score += 40;
      reasons.push(`RSI(${rsi}) ≤ ${rsiBuyThreshold} Dip Seviyesi`);
    } else if (rsi <= rsiBuyThreshold + 15) {
      score += 20;
      reasons.push(`RSI(${rsi}) Uygun Alım Bölgesinde`);
    }

    if (currentPrice >= sma20) {
      score += 20;
      reasons.push(`Fiyat (₺${currentPrice}) ≥ 20 SMA (₺${sma20})`);
    }

    let signalType = "HOLD";
    if (score >= 40 || rsi <= rsiBuyThreshold) {
      signalType = "STRONG_BUY";
    } else if (score >= 20) {
      signalType = "BUY";
    }

    const evaluation = {
      symbol: sym,
      currentPrice,
      score: score + 20,
      signalType,
      rsi,
      sma20,
      reasons
    };

    scanResults.push(evaluation);

    if (signalType !== "HOLD") {
      log(`📊 [${signalType}] ${sym}: Fiyat = ₺${currentPrice} | Skor = %${evaluation.score}/100 (RSI: ${rsi})`);
      signalsToBatch.push({
        symbol: sym,
        signal_type: signalType,
        price: currentPrice,
        metadata: {
          score: evaluation.score,
          rsi,
          sma20,
          reasons
        }
      });
    }

    const activeHolding = portfolioMap.get(sym);

    // 3. Risk Check for Active Holdings (Trailing Stop / Breakeven / Partial Exit / Stop-Loss / Take-Profit)
    if (activeHolding) {
      const avgCost = parseFloat(activeHolding.average_cost);
      const qty = parseInt(activeHolding.quantity);
      let peakPrice = parseFloat(activeHolding.highest_price || activeHolding.peak_price || avgCost);

      if (currentPrice > peakPrice) {
        peakPrice = currentPrice;
        activeHolding.highest_price = peakPrice;
      }

      const trailingStopPct = options.trailingStopPct || 2.5; // %2.5 trailing stop
      let stopPrice = parseFloat(activeHolding.stop_loss_price || (avgCost * (1 - stopLossPct / 100)).toFixed(2));
      const tpPrice = parseFloat(activeHolding.take_profit_price || (avgCost * (1 + takeProfitPct / 100)).toFixed(2));

      // Breakeven Protection: If position gains +2.5%, lock stop-loss at entry cost
      if (peakPrice >= avgCost * 1.025 && stopPrice < avgCost) {
        stopPrice = avgCost;
        activeHolding.stop_loss_price = avgCost;
        activeHolding.highest_price = peakPrice;
        await db.paper.savePortfolio(activeHolding);
        log(`🛡️ [Başabaş Koruması] ${sym} için Stop-Loss maliyet seviyesine (₺${avgCost}) çekildi!`);
      }

      let sellType = null;
      let reasonMsg = "";

      // Trailing Stop Trigger Check
      const trailingStopThreshold = parseFloat((peakPrice * (1 - trailingStopPct / 100)).toFixed(2));
      if (peakPrice >= avgCost * 1.02 && currentPrice <= trailingStopThreshold) {
        sellType = "TRAILING_STOP";
        reasonMsg = `🛡️ İzleyen Stop (Trailing Stop -%${trailingStopPct}): Zirve Fiyat (₺${peakPrice}) -> Anlık (₺${currentPrice}) ≤ İzleyen Stop (₺${trailingStopThreshold})`;
      } else if (currentPrice <= stopPrice) {
        sellType = "STOP_LOSS";
        reasonMsg = `Zarar Kes (Stop-Loss -%${stopLossPct}): Fiyat (₺${currentPrice}) ≤ Stop Seviyesi (₺${stopPrice})`;
      } else if (currentPrice >= tpPrice) {
        sellType = "TAKE_PROFIT";
        reasonMsg = `🎯 Kâr Al (Take-Profit +%${takeProfitPct}): Fiyat (₺${currentPrice}) ≥ Hedef Seviye (₺${tpPrice})`;
      } else if (evaluation.signalType === "SELL") {
        sellType = "SELL";
        reasonMsg = `Teknik Sat Sinyali: ${evaluation.reasons.join(" | ")}`;
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

        log(`🎯 [KADEMELİ KÂR AL %50] ${sym}: ${sellQty} Lot ₺${currentPrice} fiyattan satıldı! Kâr: +₺${pnlTL}`);

        await db.paper.addTradeHistory({
          user_id: userId,
          symbol: sym,
          type: "PARTIAL_TP",
          price: currentPrice,
          quantity: sellQty,
          total_amount: totalAmount,
          profit_loss: pnlTL,
          profit_loss_pct: pnlPct,
          reason: `🎯 Kademeli %50 Kâr Al (İlk Hedef ₺${partialTpThreshold} Ulaşıldı)`
        });

        const updatedHolding = {
          ...activeHolding,
          quantity: remainingQty,
          total_spent: parseFloat((remainingQty * avgCost).toFixed(2)),
          stop_loss_price: avgCost, // Stop-Loss maliyete çekildi
          highest_price: peakPrice,
          is_partially_closed: true
        };

        await db.paper.savePortfolio(updatedHolding);
        portfolioMap.set(sym, updatedHolding);
        tradesExecutedCount++;
      } else if (sellType) {
        log(`🔴 [${sellType}] ${sym} Pozisyonu Kapatılıyor! Fiyat: ₺${currentPrice}, Lot: ${qty}`);
        const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
        const totalCost = parseFloat((qty * avgCost).toFixed(2));
        const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
        const pnlPct = totalCost > 0 ? parseFloat(((pnlTL / totalCost) * 100).toFixed(2)) : 0;

        currentBalance += totalAmount;

        // Log trade history
        await db.paper.addTradeHistory({
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

        // Delete from portfolio
        await db.paper.deletePortfolio(sym);
        portfolioMap.delete(sym);
        tradesExecutedCount++;

        log(`✅ ${sym} satışı gerçekleşti. Kâr/Zarar: ${pnlTL >= 0 ? '+' : ''}₺${pnlTL} (%${pnlPct})`);
      } else {
        const currentPnlPct = avgCost > 0 ? (((currentPrice - avgCost) / avgCost) * 100).toFixed(2) : '0.00';
        log(`🔹 ${sym} Elde Tutuluyor (Maliyet: ₺${avgCost}, Zirve: ₺${peakPrice}, Anlık: ₺${currentPrice}, PnL: %${currentPnlPct})`);
      }
    } else {
      // 4. Check Buy Signals for Non-Holdings
      if (evaluation.signalType === "STRONG_BUY" || evaluation.signalType === "BUY") {
        log(`🟢 [${evaluation.signalType}] ${sym} Alım Sinyali Tespit Edildi! (RSI: ${evaluation.rsi}, SMA20: ${evaluation.sma20})`);

        // Dynamic Confidence Sizing: High confidence signals receive larger allocation
        const score = evaluation.score || 0;
        let confidenceMultiplier = 1.0;
        if (evaluation.signalType === "STRONG_BUY" || score >= 60) {
          confidenceMultiplier = 1.25; // High conviction -> %125 of target slot
        } else if (score >= 45) {
          confidenceMultiplier = 1.0;  // Medium conviction -> %100 of target slot
        } else {
          confidenceMultiplier = 0.70; // Standard conviction -> %70 of target slot
        }

        // Sizing: Allocates positionAllocationPct % of total portfolio value multiplied by signal confidence
        const currentHoldingsValue = Array.from(portfolioMap.values()).reduce((sum, h) => {
          return sum + (parseFloat(h.total_spent) || (parseFloat(h.average_cost) * parseInt(h.quantity)));
        }, 0);
        const totalPortfolioValue = currentBalance + currentHoldingsValue;
        const baseTargetAllocation = totalPortfolioValue * (positionAllocationPct / 100);
        const targetBudget = baseTargetAllocation * confidenceMultiplier;
        const minRequiredBudget = baseTargetAllocation * 0.40; // Don't make tiny residue trades under 40% of target slot

        if (currentBalance < minRequiredBudget) {
          log(`⚠️ ${sym} için alım atlandı: Kasa bakiyesi (₺${currentBalance.toFixed(2)}) asgari pozisyon bütçesinin (₺${minRequiredBudget.toFixed(2)}) altında.`);
          continue;
        }

        const maxBudget = Math.min(currentBalance, targetBudget);
        const lotQuantity = currentPrice > 0 ? Math.floor(maxBudget / currentPrice) : 0;
        const tradeCost = parseFloat((lotQuantity * currentPrice).toFixed(2));

        if (lotQuantity > 0 && currentBalance >= tradeCost) {
          currentBalance -= tradeCost;

          const stopLossPrice = parseFloat((currentPrice * (1 - stopLossPct / 100)).toFixed(2));
          const takeProfitPrice = parseFloat((currentPrice * (1 + takeProfitPct / 100)).toFixed(2));

          const newHolding = {
            user_id: userId,
            symbol: sym,
            average_cost: currentPrice,
            quantity: lotQuantity,
            total_spent: tradeCost,
            stop_loss_price: stopLossPrice,
            take_profit_price: takeProfitPrice
          };

          await db.paper.savePortfolio(newHolding);
          portfolioMap.set(sym, newHolding);

          await db.paper.addTradeHistory({
            user_id: userId,
            symbol: sym,
            type: "BUY",
            price: currentPrice,
            quantity: lotQuantity,
            total_amount: tradeCost,
            profit_loss: 0,
            profit_loss_pct: 0,
            reason: evaluation.reasons.join(" | ")
          });

          tradesExecutedCount++;
          log(`✅ ${sym} Sanal Alım Yürütüldü! ${lotQuantity} Lot @ ${currentPrice} TL (Toplam: ${tradeCost} TL)`);
        }
      }
    }
  }

  // 5. Bulk save detected active signals to database
  if (signalsToBatch.length > 0) {
    await db.paper.addSignalsBulk(signalsToBatch.slice(0, 50));
  }

  // 6. Update user profile balance
  await db.paper.updateProfile({ virtual_balance: currentBalance });

  log("🎉 Sanal Borsa Tarama ve Simülasyon İşlemi Tamamlandı!");
  log(`📈 Yürütülen İşlem Sayısı: ${tradesExecutedCount}`);
  log(`💰 Güncel Sanal Kasa Bakiyesi: ${currentBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`);

  // Persist scan logs to Supabase database
  await db.paper.addLogs(logs);

  return {
    success: true,
    logs,
    scanResults,
    tradesExecutedCount,
    updatedBalance: currentBalance
  };
};
