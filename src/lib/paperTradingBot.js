/**
 * Paper Trading Autonomous Scanner & Execution Engine
 * Scans BIST stocks, evaluates signals, executes simulated paper trades,
 * and manages stop-loss / take-profit risk rules.
 */

import { evaluateSignals } from "./technicalAnalysis";
import { db } from "./supabase";

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
    const regularMarketPrice = result.meta?.regularMarketPrice || closePrices[closePrices.length - 1];
    const filteredPrices = closePrices.filter(p => p !== null && p !== undefined && p > 0);

    return {
      currentPrice: parseFloat(regularMarketPrice.toFixed(2)),
      closePrices: filteredPrices
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

  log("🤖 Sanal Borsa Botu Taraması Başlatılıyor...");

  // 1. Fetch Paper User Profile and Portfolio
  const { data: userProfile } = await db.paper.getProfile();
  let currentBalance = parseFloat(userProfile?.virtual_balance) || 100000.00;
  const userId = userProfile?.id || "paper-user-main";

  const { data: activePortfolios } = await db.paper.getPortfolios();
  const portfolioMap = new Map((activePortfolios || []).map(p => [p.symbol, p]));

  log(`📊 Mevcut Sanal Bakiye: ${currentBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`);
  log(`💼 Açık Pozisyon Sayısı: ${portfolioMap.size}`);

  const scanResults = [];
  let tradesExecutedCount = 0;

  const {
    positionAllocationPct = 10,
    stopLossPct = 4,
    takeProfitPct = 8,
    rsiBuyThreshold = 30,
    smaPeriod = 20
  } = options;

  // 2. Iterate through symbols
  for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i].toUpperCase().trim();
    const isSymbol = sym.includes(".IS") ? sym : `${sym}.IS`;
    log(`🔍 (${i + 1}/${symbols.length}) ${sym} analizi yapılıyor...`);

    const data = await fetchSymbolHistory(sym);
    if (!data || !data.currentPrice) {
      log(`⚠️ ${sym}: Canlı fiyat verisine ulaşılamadı, atlanıyor.`);
      continue;
    }

    const { currentPrice, closePrices } = data;
    const evaluation = evaluateSignals(sym, currentPrice, closePrices, {
      rsiBuyThreshold,
      smaPeriod,
      stopLossPct,
      takeProfitPct
    });

    scanResults.push(evaluation);

    // Add signal record to database
    await db.paper.addSignal({
      symbol: sym,
      signal_type: evaluation.signalType,
      price: currentPrice,
      metadata: {
        rsi: evaluation.rsi,
        sma20: evaluation.sma20,
        macd: evaluation.macd,
        reasons: evaluation.reasons
      }
    });

    const activeHolding = portfolioMap.get(sym);

    // 3. Risk Check for Active Holdings (Stop-Loss / Take-Profit / Technical Sell)
    if (activeHolding) {
      const avgCost = parseFloat(activeHolding.average_cost);
      const qty = parseInt(activeHolding.quantity);
      const stopPrice = parseFloat(activeHolding.stop_loss_price || (avgCost * (1 - stopLossPct / 100)).toFixed(2));
      const tpPrice = parseFloat(activeHolding.take_profit_price || (avgCost * (1 + takeProfitPct / 100)).toFixed(2));

      let sellType = null;
      let reasonMsg = "";

      if (currentPrice <= stopPrice) {
        sellType = "STOP_LOSS";
        reasonMsg = `Zarar Kes (Stop-Loss -%${stopLossPct}): Fiyat (${currentPrice} TL) ≤ Stop Seviyesi (${stopPrice} TL)`;
      } else if (currentPrice >= tpPrice) {
        sellType = "TAKE_PROFIT";
        reasonMsg = `Kâr Al (Take-Profit +%${takeProfitPct}): Fiyat (${currentPrice} TL) ≥ Hedef Seviye (${tpPrice} TL)`;
      } else if (evaluation.signalType === "SELL") {
        sellType = "SELL";
        reasonMsg = `Teknik Sat Sinyali: ${evaluation.reasons.join(" | ")}`;
      }

      if (sellType) {
        log(`🔴 [${sellType}] ${sym} Pozisyonu Kapatılıyor! Fiyat: ${currentPrice} TL, Lot: ${qty}`);
        const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
        const totalCost = parseFloat((qty * avgCost).toFixed(2));
        const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
        const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

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

        log(`✅ ${sym} satışı gerçekleşti. Kâr/Zarar: ${pnlTL >= 0 ? '+' : ''}${pnlTL} TL (%${pnlPct})`);
      } else {
        log(`🔹 ${sym} Elde Tutuluyor (Maliyet: ${avgCost} TL, Anlık: ${currentPrice} TL, PnL: %${(((currentPrice - avgCost) / avgCost) * 100).toFixed(2)})`);
      }
    } else {
      // 4. Check Buy Signals for Non-Holdings
      if (evaluation.signalType === "STRONG_BUY" || evaluation.signalType === "BUY") {
        log(`🟢 [${evaluation.signalType}] ${sym} Alım Sinyali Tespit Edildi! (RSI: ${evaluation.rsi}, SMA20: ${evaluation.sma20})`);

        // Sizing: Allocates positionAllocationPct % of current available cash
        const maxBudget = currentBalance * (positionAllocationPct / 100);
        const lotQuantity = Math.floor(maxBudget / currentPrice);
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

  return {
    success: true,
    logs,
    scanResults,
    tradesExecutedCount,
    updatedBalance: currentBalance
  };
};
