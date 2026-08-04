/**
 * Paper Trading Autonomous Scanner & Execution Engine
 * Scans BIST stocks, evaluates signals, executes simulated paper trades,
 * and manages stop-loss / take-profit risk rules.
 */

import { evaluateSignals } from "./technicalAnalysis";
import { db } from "./supabase";
import { isBistMarketOpen } from "./dayTradingBot";

export { isBistMarketOpen };

export const DEFAULT_SCAN_SYMBOLS = [
  "TTRAK", "THYAO", "GARAN", "EREGL", "ASELS", "KCHOL", "TUPRS", "AKBNK",
  "SISE", "BIMAS", "SAHOL", "ISCTR", "YKBNK", "ARCLK", "FROTO", "TOASO",
  "HEKTS", "SASA", "KRDMD", "PETKM", "KOZAL", "ODAS", "ENKAI", "GUBRF"
];

// Helper to fetch live chart/candle prices for a symbol using Yahoo proxy
const fetchSymbolHistory = async (symbol) => {
  try {
    const cleanSym = symbol.toUpperCase().replace(".IS", "").trim() + ".IS";
    const res = await fetch(`/yh-api/v8/finance/chart/${cleanSym}?range=3mo&interval=1d`);
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const closePrices = result.indicators?.quote?.[0]?.close || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];
    const regularMarketPrice = result.meta?.regularMarketPrice || closePrices[closePrices.length - 1];
    const filteredPrices = closePrices.filter(p => p !== null && p !== undefined && p > 0);
    const filteredVolumes = volumes.filter(v => v !== null && v !== undefined);

    return {
      currentPrice: parseFloat(regularMarketPrice.toFixed(2)),
      closePrices: filteredPrices,
      volumes: filteredVolumes
    };
  } catch (err) {
    console.warn(`[PaperBot] History fetch error for ${symbol}:`, err);
    return null;
  }
};

/**
 * Runs full BIST Market Scan & Paper Trading Simulation Execution
 * @param {Array<string>} symbols - Symbols to scan
 * @param {Object} options - Strategy parameters
 * @param {Function} onProgress - Callback for live UI scanner status updates
 * @returns {Object} Execution summary report
 */
export const runMarketScan = async (symbols = DEFAULT_SCAN_SYMBOLS, options = {}, onProgress = null) => {
  const logs = [];
  const log = (msg) => {
    const timestamp = new Date().toLocaleTimeString("tr-TR");
    const entry = `[${timestamp}] ${msg}`;
    logs.push(entry);
    if (onProgress) onProgress(entry);
  };

  log("🤖 Gelişmiş Hassas Borsa Botu Taraması Başlatılıyor...");

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

  // 2. Fetch symbol data concurrently in parallel for maximum speed
  log(`🔍 ${symbols.length} hisse için canlı fiyat, hacim ve indikatör verisi paralel çekiliyor...`);
  
  const historyPromises = symbols.map(async (sym) => {
    const cleanSym = sym.toUpperCase().trim();
    const data = await fetchSymbolHistory(cleanSym);
    return { symbol: cleanSym, data };
  });

  const historyResults = await Promise.allSettled(historyPromises);
  const fetchedDataMap = new Map();

  historyResults.forEach(res => {
    if (res.status === "fulfilled" && res.value?.data) {
      fetchedDataMap.set(res.value.symbol, res.value.data);
    }
  });

  // 3. Process each symbol
  for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i].toUpperCase().trim();
    const data = fetchedDataMap.get(sym);

    if (!data || !data.currentPrice) {
      log(`⚠️ (${i + 1}/${symbols.length}) ${sym}: Canlı fiyat verisi alınamadı, atlanıyor.`);
      continue;
    }

    const { currentPrice, closePrices, volumes } = data;
    const evaluation = evaluateSignals(sym, currentPrice, closePrices, volumes, {
      rsiBuyThreshold,
      smaPeriod,
      stopLossPct,
      takeProfitPct
    });

    log(`📊 (${i + 1}/${symbols.length}) ${sym}: Fiyat = ₺${currentPrice} | Skor = %${evaluation.score}/100 | Sinyal = ${evaluation.signalType}`);
    scanResults.push(evaluation);

    // Add signal record to database
    await db.paper.addSignal({
      symbol: sym,
      signal_type: evaluation.signalType,
      price: currentPrice,
      metadata: {
        score: evaluation.score,
        rsi: evaluation.rsi,
        sma20: evaluation.sma20,
        macd: evaluation.macd,
        bollinger: evaluation.bollinger,
        breakout: evaluation.breakout,
        goldenCross: evaluation.goldenCross,
        volumeData: evaluation.volumeData,
        reasons: evaluation.reasons
      }
    });

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
        } else {
          log(`⚠️ ${sym} Alım yapılamadı: Yetersiz kasa bakiyesi (${currentBalance.toFixed(2)} TL) veya yetersiz lot bütçesi.`);
        }
      }
    }
  }

  // 5. Update user profile balance
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
