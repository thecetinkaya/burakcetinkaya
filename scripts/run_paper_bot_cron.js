/**
 * Standalone Headless Node.js Paper Trading Bot Cron Runner
 * Runs autonomously in the background (GitHub Actions / Netlify Cron / Terminal).
 * Connects to Supabase PostgreSQL database, scans BIST market prices,
 * evaluates technical indicators, and executes paper trades.
 */

import { createClient } from "@supabase/supabase-js";

// Read Supabase Credentials from Environment Variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://qapgyjnhgywszwdfegam.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "sb_publishable_vXj3Ad7pWMoW5t-PaoR8Iw_Z1Z6eRUt";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_SYMBOLS = [
  "TTRAK", "THYAO", "GARAN", "EREGL", "ASELS", "KCHOL", "TUPRS", "AKBNK",
  "SISE", "BIMAS", "SAHOL", "ISCTR", "YKBNK", "ARCLK", "FROTO", "TOASO",
  "HEKTS", "SASA", "KRDMD", "PETKM", "KOZAL", "ODAS", "ENKAI", "GUBRF"
];

// Helper: Calculate RSI
function calculateRSI(prices, period = 14) {
  if (!prices || prices.length <= period) return 45;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

// Helper: Calculate SMA
function calculateSMA(prices, period = 20) {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(prices.length - period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return parseFloat((sum / period).toFixed(2));
}

// Fetch historical chart prices from Yahoo Finance API directly
async function fetchChartHistory(symbol) {
  try {
    const cleanSym = symbol.toUpperCase().replace(".IS", "").trim() + ".IS";
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSym}?range=3mo&interval=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const closePrices = (result.indicators?.quote?.[0]?.close || []).filter(p => p !== null && p > 0);
    const currentPrice = result.meta?.regularMarketPrice || closePrices[closePrices.length - 1];

    return {
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      closePrices
    };
  } catch (err) {
    console.warn(`[Cron] Fetch failed for ${symbol}:`, err.message);
    return null;
  }
}

async function fetchAllBistStocksWithIndicators(limit = 600) {
  try {
    const res = await fetch("https://scanner.tradingview.com/turkey/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: [
          { left: "type", operation: "in_range", right: ["stock"] }
        ],
        options: { lang: "tr" },
        markets: ["turkey"],
        symbols: { query: { types: [] }, tickers: [] },
        columns: ["name", "close", "change", "volume", "RSI", "SMA20", "Recommend.All"],
        sort: { sortBy: "volume", sortOrder: "desc" },
        range: [0, limit]
      })
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map(row => {
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
    console.error("[Cron] All BIST Stocks Scan Error:", err.message);
    return [];
  }
}

async function safeInsertTradeHistory(tableName, tradeItem) {
  try {
    const { error } = await supabase.from(tableName).insert([tradeItem]);
    if (error) {
      const fallbackType = tradeItem.type === "PARTIAL_TP" ? "TAKE_PROFIT" : tradeItem.type === "TRAILING_STOP" ? "SELL" : tradeItem.type;
      await supabase.from(tableName).insert([{ ...tradeItem, type: fallbackType }]);
    }
  } catch (err) {
    console.warn(`[Cron] Insert history warning for ${tableName}:`, err.message);
  }
}

async function runCronPaperBot() {
  const cronLogs = [];
  const log = (msg) => {
    const time = new Date().toLocaleTimeString("tr-TR");
    const entry = `[${time}] ${msg}`;
    cronLogs.push(entry);
    console.log(msg);
  };

  log("=================================================");
  log(`🤖 [7/24 Borsa Bot Cron] Başlatıldı: ${new Date().toLocaleString("tr-TR")}`);
  log("=================================================");

  // 1. Fetch User Profile
  const { data: userProfile, error: profileErr } = await supabase
    .from("paper_users")
    .select("*")
    .eq("id", "paper-user-main")
    .maybeSingle();

  if (profileErr) console.warn("User fetch warning:", profileErr.message);

  const userId = userProfile?.id || "paper-user-main";
  let currentBalance = parseFloat(userProfile?.virtual_balance) || 100000.00;

  console.log(`💰 Mevcut Sanal Bakiye: ₺${currentBalance.toLocaleString("tr-TR")}`);

  // 2. Fetch Active Holdings
  const { data: activeHoldings } = await supabase
    .from("paper_portfolios")
    .select("*");

  const portfolioMap = new Map((activeHoldings || []).map(p => [p.symbol, p]));
  console.log(`💼 Mevcut Açık Pozisyonlar: ${portfolioMap.size} adet`);

  // Strategy Parameters
  const rsiBuyThreshold = 35;
  const rsiSellThreshold = 70;
  const stopLossPct = 4;
  const takeProfitPct = 8;
  const positionAllocationPct = 10;

  let tradesExecuted = 0;

  // Dynamically fetch ALL BIST stocks (600 Tickers) via TradingView Scan API
  const allBistStocks = await fetchAllBistStocksWithIndicators(600);
  console.log(`🔍 Borsa İstanbul Tüm Hisseleri (${allBistStocks.length} Hisse) Taranıyor ve Değerlendiriliyor...`);

  // Process each of the 600 BIST stocks
  for (const stockItem of allBistStocks) {
    const sym = stockItem.symbol;
    const currentPrice = stockItem.currentPrice;
    const rsi = stockItem.rsi;
    const sma20 = stockItem.sma20;

    let score = 0;
    const reasons = [];

    if (rsi <= rsiBuyThreshold) {
      score += 40;
      reasons.push(`RSI(${rsi}) ≤ ${rsiBuyThreshold} (Aşırı satım dip seviyesi)`);
    } else if (rsi <= rsiBuyThreshold + 10) {
      score += 20;
      reasons.push(`RSI(${rsi}) cazip alım bölgesinde`);
    }

    if (currentPrice >= sma20) {
      score += 20;
      reasons.push(`Fiyat (₺${currentPrice}) ≥ 20 SMA (₺${sma20})`);
    }

    let signalType = "HOLD";
    if (score >= 40 || rsi <= rsiBuyThreshold) {
      signalType = "STRONG_BUY";
      reasons.unshift(`[GÜÇLÜ AL] Hassas Analiz Skoru: %${score + 20}/100`);
    } else if (score >= 20) {
      signalType = "BUY";
      reasons.unshift(`[AL] Hassas Analiz Skoru: %${score + 20}/100`);
    } else if (rsi >= rsiSellThreshold) {
      signalType = "SELL";
      reasons.unshift(`[SAT] RSI(${rsi}) ≥ ${rsiSellThreshold}`);
    } else {
      signalType = "HOLD";
      reasons.unshift(`[BEKLE] Skor: %${score}/100`);
    }

    // Save signal record
    await supabase.from("paper_signals").insert([{
      symbol: sym,
      signal_type: signalType,
      price: currentPrice,
      metadata: { score: score + 20, rsi, sma20, reasons }
    }]);

    const holding = portfolioMap.get(sym);

    // 3. Risk Management for existing holdings
    if (holding) {
      const avgCost = parseFloat(holding.average_cost);
      const qty = parseInt(holding.quantity);
      let peakPrice = parseFloat(holding.highest_price || holding.peak_price || avgCost);

      if (currentPrice > peakPrice) {
        peakPrice = currentPrice;
      }

      let stopPrice = parseFloat(holding.stop_loss_price || (avgCost * (1 - stopLossPct / 100)).toFixed(2));
      const tpPrice = parseFloat(holding.take_profit_price || (avgCost * (1 + takeProfitPct / 100)).toFixed(2));

      // Breakeven Protection: If position gains +2.5%, lock stop-loss at entry cost
      if (peakPrice >= avgCost * 1.025 && stopPrice < avgCost) {
        stopPrice = avgCost;
        holding.stop_loss_price = avgCost;
        console.log(`🛡️ [Cron Başabaş Koruması] ${sym} için Stop-Loss maliyete (₺${avgCost}) çekildi!`);
        await supabase
          .from("paper_portfolios")
          .update({ stop_loss_price: avgCost, updated_at: new Date().toISOString() })
          .eq("symbol", sym);
      }

      const trailingStopPct = 2.5; // %2.5 trailing stop
      const trailingStopThreshold = parseFloat((peakPrice * (1 - trailingStopPct / 100)).toFixed(2));

      let sellType = null;
      let reasonMsg = "";

      if (peakPrice >= avgCost * 1.02 && currentPrice <= trailingStopThreshold) {
        sellType = "TRAILING_STOP";
        reasonMsg = `🛡️ İzleyen Stop (-%${trailingStopPct}): Zirve Fiyat (₺${peakPrice}) -> Anlık (₺${currentPrice}) ≤ İzleyen Stop (₺${trailingStopThreshold})`;
      } else if (currentPrice <= stopPrice) {
        sellType = "STOP_LOSS";
        reasonMsg = `Zarar Kes (-%${stopLossPct}): Fiyat (₺${currentPrice}) ≤ Stop (₺${stopPrice})`;
      } else if (currentPrice >= tpPrice) {
        sellType = "TAKE_PROFIT";
        reasonMsg = `Kâr Al (+%${takeProfitPct}): Fiyat (₺${currentPrice}) ≥ Hedef (₺${tpPrice})`;
      } else if (signalType === "SELL") {
        sellType = "SELL";
        reasonMsg = `Teknik Sat Sinyali: RSI(${rsi}) ≥ ${rsiSellThreshold}`;
      }

      if (sellType) {
        console.log(`🔴 [${sellType}] ${sym} Satılıyor! Price: ₺${currentPrice}, Qty: ${qty}`);
        const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
        const totalCost = parseFloat((qty * avgCost).toFixed(2));
        const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
        const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

        currentBalance += totalAmount;

        await safeInsertTradeHistory("paper_trade_history", {
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

        await supabase.from("paper_portfolios").delete().eq("symbol", sym);
        portfolioMap.delete(sym);
        tradesExecuted++;
        console.log(`✅ ${sym} Satıldı. PnL: ${pnlTL >= 0 ? '+' : ''}₺${pnlTL} (%${pnlPct})`);
      }
    } else {
      // 4. Open New Paper Positions on Buy Signal
      if (signalType === "STRONG_BUY" || signalType === "BUY") {
        console.log(`🟢 [${signalType}] ${sym} Dip Alım Sinyali! RSI: ${rsi}`);
        const maxBudget = currentBalance * (positionAllocationPct / 100);
        const lotQty = Math.floor(maxBudget / currentPrice);
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

          await supabase.from("paper_portfolios").insert([newHolding]);
          portfolioMap.set(sym, newHolding);

          await supabase.from("paper_trade_history").insert([{
            user_id: userId,
            symbol: sym,
            type: "BUY",
            price: currentPrice,
            quantity: lotQty,
            total_amount: totalCost,
            profit_loss: 0,
            profit_loss_pct: 0,
            reason: reasons.join(" | ")
          }]);

          tradesExecuted++;
          console.log(`✅ ${sym} Sanal Alındı! ${lotQty} Lot @ ₺${currentPrice} (Toplam: ₺${totalCost})`);
        }
      }
    }
  }

  // 5. Update user profile virtual balance
  await supabase
    .from("paper_users")
    .upsert([{ id: userId, virtual_balance: currentBalance, updated_at: new Date().toISOString() }]);

async function fetchDynamicBistTopSymbols() {
  try {
    const res = await fetch("https://scanner.tradingview.com/turkey/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: [
          { left: "type", operation: "in_range", right: ["stock"] },
          { left: "volume", operation: "greater", right: 100000 }
        ],
        options: { lang: "tr" },
        markets: ["turkey"],
        symbols: { query: { types: [] }, tickers: [] },
        columns: ["name", "volume", "close", "change"],
        sort: { sortBy: "volume", sortOrder: "desc" },
        range: [0, 30]
      })
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map(row => (row.s || "").replace("BIST:", "").trim()).filter(s => s.length > 0);
  } catch {
    return [];
  }
}

  // 6. Day Trading IPO Scalper Autonomous Execution
  console.log("\n⚡ [Day Trading Scalper Cron] Canlı Günlük BIST Hacim Liderleri Taranıyor...");
  try {
    const { data: dtProfile } = await supabase.from("paper_day_users").select("*").maybeSingle();
    let dtBalance = parseFloat(dtProfile?.virtual_balance) || 50000.00;
    const dtUserId = dtProfile?.id || "day-trading-user-main";

    const { data: dtHoldings } = await supabase.from("paper_day_portfolios").select("*");
    const dtMap = new Map((dtHoldings || []).map(p => [p.symbol, p]));

    console.log(`📡 Borsa İstanbul Genel Hisseleri (${allBistStocks.length} Hisse) Day Trading Radarında...`);

    let dtTrades = 0;

    const nowTRT = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
    const dayOfWeek = nowTRT.getDay();
    const currentHour = nowTRT.getHours();
    const currentMin = nowTRT.getMinutes();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isEODClose = isWeekday && ((currentHour === 17 && currentMin >= 55) || (currentHour === 18 && currentMin <= 30));

    for (const item of allBistStocks) {
      const sym = item.symbol;
      const currentPrice = item.currentPrice;
      const rsi = item.rsi;
      if (!currentPrice || currentPrice <= 0) continue;
      const holding = dtMap.get(sym);

      if (holding) {
        const avgCost = parseFloat(holding.average_cost);
        const qty = parseInt(holding.quantity);
        let peakPrice = parseFloat(holding.highest_price || holding.peak_price || avgCost);

        if (currentPrice > peakPrice) {
          peakPrice = currentPrice;
        }

        let stopPrice = parseFloat(holding.stop_loss_price || (avgCost * 0.985).toFixed(2));
        const tpPrice = parseFloat(holding.take_profit_price || (avgCost * 1.03).toFixed(2));

        // Scalp Breakeven Protection: If position gains +1.0%, lock stop-loss at entry cost
        if (peakPrice >= avgCost * 1.010 && stopPrice < avgCost) {
          stopPrice = avgCost;
          holding.stop_loss_price = avgCost;
          console.log(`🛡️ [Scalp Cron Başabaş Koruması] ${sym} için Stop-Loss maliyete (₺${avgCost}) çekildi!`);
          await supabase
            .from("paper_day_portfolios")
            .update({ stop_loss_price: avgCost, updated_at: new Date().toISOString() })
            .eq("symbol", sym);
        }

        const trailingStopPct = 1.0; // %1.0 tight trailing stop for scalps
        const trailingStopThreshold = parseFloat((peakPrice * (1 - trailingStopPct / 100)).toFixed(2));

        let sellType = null;
        let reasonMsg = "";

        if (peakPrice >= avgCost * 1.010 && currentPrice <= trailingStopThreshold) {
          sellType = "TRAILING_STOP";
          reasonMsg = `🛡️ Scalp Hızlı İzleyen Stop (-%${trailingStopPct}): Zirve Fiyat (₺${peakPrice}) -> Anlık (₺${currentPrice}) ≤ İzleyen Stop (₺${trailingStopThreshold})`;
        } else if (currentPrice <= stopPrice) {
          sellType = "STOP_LOSS";
          reasonMsg = `⚡ Scalp Stop (-%1.5): Fiyat (₺${currentPrice}) ≤ Stop (₺${stopPrice})`;
        } else if (currentPrice >= tpPrice) {
          sellType = "TAKE_PROFIT";
          reasonMsg = `🎯 Scalp Kâr Al (+%3.0): Fiyat (₺${currentPrice}) ≥ Hedef (₺${tpPrice})`;
        } else if (isEODClose) {
          sellType = "SELL";
          reasonMsg = `🌇 Gün Sonu Otomatik Scalp Kapanışı (17:55 EOD Kapanış)`;
        }

        if (sellType) {
          console.log(`🔴 [Scalp Cron ${sellType}] ${sym} Satılıyor! Price: ₺${currentPrice}, Qty: ${qty}`);
          const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
          const totalCost = parseFloat((qty * avgCost).toFixed(2));
          const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
          const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

          dtBalance += totalAmount;

          await safeInsertTradeHistory("paper_day_trade_history", {
            user_id: dtUserId,
            symbol: sym,
            type: sellType,
            price: currentPrice,
            quantity: qty,
            total_amount: totalAmount,
            profit_loss: pnlTL,
            profit_loss_pct: pnlPct,
            reason: reasonMsg
          });

          await supabase.from("paper_day_portfolios").delete().eq("symbol", sym);
          dtMap.delete(sym);
          dtTrades++;
          console.log(`✅ Scalp ${sym} Satıldı. PnL: ${pnlTL >= 0 ? '+' : ''}₺${pnlTL} (%${pnlPct})`);
        }
      } else {
        // Execute New Scalp Position on Dip / Momentum Sizing (Max 5 concurrent scalps)
        const rsi = calculateRSI(data.closePrices, 14);
        const sma20 = calculateSMA(data.closePrices, 20) || parseFloat((currentPrice * 0.98).toFixed(2));

        let scalpScore = 0;
        const scalpReasons = [];

        if (rsi <= 42) {
          scalpScore += 45;
          scalpReasons.push(`RSI(${rsi}) Dip Alım Fırsatı (≤42)`);
        } else if (rsi <= 55) {
          scalpScore += 25;
          scalpReasons.push(`RSI(${rsi}) Pozitif Momentum Bölgesi`);
        }

        if (currentPrice >= sma20) {
          scalpScore += 25;
          scalpReasons.push(`Fiyat (₺${currentPrice}) ≥ 20 SMA (₺${sma20})`);
        }

        if (scalpScore >= 45 && dtMap.size < 5) {
          console.log(`🚀 [Scalp Cron AL] ${sym} Dip/Momentum Alım Sinyali! RSI: ${rsi}, Skor: ${scalpScore}`);
          const targetBudget = dtBalance * 0.20; // %20 per position slot
          const lotQty = currentPrice > 0 ? Math.floor(targetBudget / currentPrice) : 0;
          const totalCost = parseFloat((lotQty * currentPrice).toFixed(2));

          if (lotQty > 0 && dtBalance >= totalCost) {
            dtBalance -= totalCost;
            const stopLossPrice = parseFloat((currentPrice * 0.985).toFixed(2)); // -1.5% scalp stop
            const takeProfitPrice = parseFloat((currentPrice * 1.03).toFixed(2));  // +3.0% scalp TP

            const newHolding = {
              user_id: dtUserId,
              symbol: sym,
              average_cost: currentPrice,
              quantity: lotQty,
              total_spent: totalCost,
              stop_loss_price: stopLossPrice,
              take_profit_price: takeProfitPrice
            };

            await supabase.from("paper_day_portfolios").upsert([newHolding], { onConflict: "user_id,symbol" });
            dtMap.set(sym, newHolding);

            await safeInsertTradeHistory("paper_day_trade_history", {
              user_id: dtUserId,
              symbol: sym,
              type: "BUY",
              price: currentPrice,
              quantity: lotQty,
              total_amount: totalCost,
              profit_loss: 0,
              profit_loss_pct: 0,
              reason: scalpReasons.join(" | ")
            });

            dtTrades++;
            console.log(`✅ Scalp ${sym} Alındı! ${lotQty} Lot @ ₺${currentPrice} (Toplam: ₺${totalCost})`);
          }
        }
      }
    }

    await supabase.from("paper_day_users").upsert([{ id: dtUserId, virtual_balance: dtBalance, updated_at: new Date().toISOString() }]);
    console.log(`⚡ [Day Trading Scalper Cron] İşlem Tamamlandı. Satılan Scalp: ${dtTrades}, Bakiye: ₺${dtBalance.toLocaleString("tr-TR")}`);
  } catch (dtErr) {
    console.warn("⚠️ Day Trading Scalper Cron Warning:", dtErr.message);
  }

  console.log("=================================================");
  console.log(`🎉 [7/24 Cron] İşlem Tamamlandı! Yürütülen İşlem: ${tradesExecuted}`);
  console.log(`💰 Güncel Kasa Bakiyesi: ₺${currentBalance.toLocaleString("tr-TR")}`);
  console.log("=================================================");

  // Persist cron logs to Supabase paper_bot_logs table
  if (cronLogs.length > 0) {
    try {
      const rows = cronLogs.map(msg => ({
        user_id: userId,
        log_type: msg.includes("🔴") ? "SELL" : msg.includes("🟢") ? "BUY" : msg.includes("🛡️") ? "RISK" : "INFO",
        message: msg
      }));
      await supabase.from("paper_bot_logs").insert(rows);
    } catch (logErr) {
      console.warn("⚠️ Cron log save warning:", logErr.message);
    }
  }
}

runCronPaperBot().catch(err => {
  console.error("❌ Cron Bot Hata:", err);
  process.exit(1);
});
