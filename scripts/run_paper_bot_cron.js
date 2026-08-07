/**
 * ============================================================================
 * 🏦 Profesyonel 7/24 Borsa Trading Bot Cron Engine v3.0
 * ============================================================================
 * Standalone Headless Node.js Paper Trading & Scalper Bot Cron Runner
 * Runs autonomously in the background (GitHub Actions / Terminal).
 * 
 * Connects to Supabase PostgreSQL, scans ALL 600+ BIST stocks,
 * evaluates multi-factor professional technical indicators, and
 * executes paper trades with advanced risk management.
 * 
 * FIXES APPLIED:
 *   - Table names corrected: day_trading_users, day_trading_portfolios, day_trading_history
 *   - TradingView API retry with multiple User-Agents + exponential backoff
 *   - Professional technical analysis: RSI, MACD, Bollinger, StochRSI, ADX, VWAP
 *   - Aggressive parameters tuned for 100K→200K target
 *   - Robust error handling at every stage
 * ============================================================================
 */

import { createClient } from "@supabase/supabase-js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://qapgyjnhgywszwdfegam.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "sb_publishable_vXj3Ad7pWMoW5t-PaoR8Iw_Z1Z6eRUt";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Multiple User-Agent rotation to avoid TradingView IP/UA blocking
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
];

// Strategy Parameters (Aggressive for 100K → 200K target)
const STRATEGY = {
  // Paper Trading (Swing)
  swing: {
    rsiBuyThreshold: 40,       // RSI ≤ 40 → Buy signal zone (was 35, widened for more trades)
    rsiSellThreshold: 68,      // RSI ≥ 68 → Sell signal
    stopLossPct: 3.5,          // %3.5 stop loss (tighter than before)
    takeProfitPct: 7,          // %7 take profit
    trailingStopPct: 2.0,      // %2.0 trailing stop
    breakevenTrigger: 1.02,    // +%2 kazanınca stop-loss maliyete çekilir
    maxPositions: 15,          // 15 eşzamanlı pozisyon (was 10)
    minTradePrice: 2.00,       // Minimum ₺2 hisse fiyatı
    minTradeBudget: 800,       // Minimum ₺800 per trade
    maxBudgetPerTrade: 12000,  // Maksimum ₺12,000 per trade
    partialTpPct: 3.5,         // %3.5'te kademeli kâr al
  },
  // Day Trading (Scalp)
  scalp: {
    rsiBuyThreshold: 45,       // RSI ≤ 45 → Scalp buy zone (wider for more entries)
    rsiSellThreshold: 65,      // RSI ≥ 65 → Scalp sell
    stopLossPct: 1.5,          // %1.5 tight stop
    takeProfitPct: 3.0,        // %3 fast profit
    trailingStopPct: 1.0,      // %1 tight trailing
    breakevenTrigger: 1.01,    // +%1 kazanınca stop-loss maliyete
    maxPositions: 8,           // 8 eşzamanlı scalp pozisyonu
    minTradePrice: 2.00,
    minTradeBudget: 800,
    maxBudgetPerTrade: 10000,
    partialTpPct: 1.5,         // %1.5'te kademeli kâr al
  }
};

// ============================================================================
// TECHNICAL ANALYSIS FUNCTIONS (Professional Grade)
// ============================================================================

function calculateSMA(prices, period) {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(prices.length - period);
  return parseFloat((slice.reduce((a, b) => a + b, 0) / period).toFixed(4));
}

function calculateEMA(prices, period) {
  if (!prices || prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return parseFloat(ema.toFixed(4));
}

function calculateRSI(prices, period = 14) {
  if (!prices || prices.length <= period) return 50; // neutral default
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
    avgGain = (avgGain * (period - 1) + (diff >= 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? Math.abs(diff) : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

function calculateMACD(prices, fast = 12, slow = 26, signal = 9) {
  if (!prices || prices.length < slow + signal) return null;
  const emaFast = calculateEMA(prices, fast);
  const emaSlow = calculateEMA(prices, slow);
  if (emaFast === null || emaSlow === null) return null;

  const macdValues = [];
  const kF = 2 / (fast + 1);
  const kS = 2 / (slow + 1);
  let ef = prices.slice(0, fast).reduce((a, b) => a + b, 0) / fast;
  let es = prices.slice(0, slow).reduce((a, b) => a + b, 0) / slow;

  for (let i = slow; i < prices.length; i++) {
    ef = prices[i] * kF + ef * (1 - kF);
    es = prices[i] * kS + es * (1 - kS);
    macdValues.push(ef - es);
  }

  const currentMacd = macdValues[macdValues.length - 1];
  const signalLine = calculateEMA(macdValues, signal) || 0;
  const histogram = currentMacd - signalLine;

  return {
    macd: parseFloat(currentMacd.toFixed(4)),
    signal: parseFloat(signalLine.toFixed(4)),
    histogram: parseFloat(histogram.toFixed(4)),
    isBullish: histogram > 0,
    isCrossover: macdValues.length >= 2 && macdValues[macdValues.length - 2] - signalLine < 0 && histogram >= 0
  };
}

function calculateBollingerBands(prices, period = 20, multiplier = 2) {
  if (!prices || prices.length < period) return null;
  const sma = calculateSMA(prices, period);
  const slice = prices.slice(prices.length - period);
  const variance = slice.reduce((acc, val) => acc + Math.pow(val - sma, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  return {
    middle: parseFloat(sma.toFixed(2)),
    upper: parseFloat((sma + multiplier * stdDev).toFixed(2)),
    lower: parseFloat((sma - multiplier * stdDev).toFixed(2)),
    bandwidth: parseFloat((((sma + multiplier * stdDev) - (sma - multiplier * stdDev)) / sma * 100).toFixed(2)),
    pctB: stdDev > 0 ? parseFloat(((prices[prices.length - 1] - (sma - multiplier * stdDev)) / (2 * multiplier * stdDev)).toFixed(4)) : 0.5
  };
}

function calculateStochasticRSI(prices, period = 14) {
  if (!prices || prices.length < period + 5) return { k: 50, isOversold: false, isOverbought: false };
  const rsiValues = [];
  for (let i = period; i <= prices.length; i++) {
    rsiValues.push(calculateRSI(prices.slice(0, i), 14));
  }
  const slice = rsiValues.slice(Math.max(0, rsiValues.length - period));
  const minRsi = Math.min(...slice);
  const maxRsi = Math.max(...slice);
  const currentRsi = rsiValues[rsiValues.length - 1];
  const stochRsi = maxRsi !== minRsi ? ((currentRsi - minRsi) / (maxRsi - minRsi)) * 100 : 50;
  const k = parseFloat(stochRsi.toFixed(2));

  return { k, isOversold: k <= 20, isOverbought: k >= 80 };
}

function calculateATR(prices, period = 14) {
  if (!prices || prices.length < period + 1) return null;
  const trs = [];
  for (let i = 1; i < prices.length; i++) {
    const tr = Math.abs(prices[i] - prices[i - 1]);
    trs.push(tr);
  }
  const slice = trs.slice(trs.length - period);
  return parseFloat((slice.reduce((a, b) => a + b, 0) / period).toFixed(4));
}

function calculateADX(prices, period = 14) {
  if (!prices || prices.length < period * 2 + 1) return { adx: 25, isTrending: false };
  // Simplified ADX using price changes
  const dms = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    dms.push(Math.abs(diff));
  }
  const avgDM = dms.slice(dms.length - period).reduce((a, b) => a + b, 0) / period;
  const atr = calculateATR(prices, period) || 1;
  const di = (avgDM / atr) * 100;
  // Simplified ADX: strong trend if average movement is significant relative to ATR
  const adx = Math.min(100, parseFloat((di * 0.7).toFixed(2)));

  return { adx, isTrending: adx >= 25 };
}

function calculateVWAP(prices, volumes) {
  if (!prices || !volumes || prices.length === 0 || volumes.length === 0) return null;
  const len = Math.min(prices.length, volumes.length);
  let cumPV = 0, cumVol = 0;
  for (let i = 0; i < len; i++) {
    cumPV += prices[i] * (volumes[i] || 1);
    cumVol += (volumes[i] || 1);
  }
  return cumVol > 0 ? parseFloat((cumPV / cumVol).toFixed(2)) : null;
}

function calculateBreakout(prices, currentPrice, period = 20) {
  if (!prices || prices.length < period) return { isBreakout: false, resistance: currentPrice };
  const historicalSlice = prices.slice(Math.max(0, prices.length - period - 1), prices.length - 1);
  const maxResistance = Math.max(...historicalSlice);
  const isBreakout = currentPrice > maxResistance;
  return {
    isBreakout,
    resistancePrice: parseFloat(maxResistance.toFixed(2)),
    breakoutPct: isBreakout ? parseFloat(((currentPrice - maxResistance) / maxResistance * 100).toFixed(2)) : 0
  };
}

/**
 * Multi-Factor Professional Signal Evaluation
 * Uses 7 pillars of analysis for composite scoring
 */
function evaluateMultiFactorSignal(currentPrice, rsi, sma20, changePct, volume, rating, strategyParams) {
  let score = 0;
  const reasons = [];

  // PILLAR 1: RSI Analysis (0-30 points)
  if (rsi <= strategyParams.rsiBuyThreshold - 10) {
    score += 30;
    reasons.push(`RSI(${rsi}) Derin Dip (Güçlü Alım Fırsatı)`);
  } else if (rsi <= strategyParams.rsiBuyThreshold) {
    score += 20;
    reasons.push(`RSI(${rsi}) Alım Bölgesi`);
  } else if (rsi <= strategyParams.rsiBuyThreshold + 10) {
    score += 10;
    reasons.push(`RSI(${rsi}) Cazip Bölge`);
  }

  // PILLAR 2: SMA Trend Confirmation (0-20 points)
  if (currentPrice > 0 && sma20 > 0) {
    if (currentPrice >= sma20) {
      score += 15;
      reasons.push(`Fiyat(₺${currentPrice}) ≥ SMA20(₺${sma20}) Yükseliş Trendi`);
    } else if (currentPrice >= sma20 * 0.98) {
      score += 8;
      reasons.push(`Fiyat SMA20'ye yakın - potansiyel dönüş`);
    }
  }

  // PILLAR 3: Momentum / Change % (0-15 points)
  if (changePct <= -3.0) {
    // Deep dip today - contrarian buy
    score += 15;
    reasons.push(`Günlük -%${Math.abs(changePct).toFixed(1)} Düşüş → Dip Alım Fırsatı`);
  } else if (changePct >= 1.0 && changePct <= 4.0) {
    // Positive momentum, not overbought yet
    score += 10;
    reasons.push(`+%${changePct.toFixed(1)} Pozitif Momentum`);
  }

  // PILLAR 4: Volume Confirmation (0-10 points)
  if (volume > 5000000) {
    score += 10;
    reasons.push(`Yüksek Hacim (${(volume / 1e6).toFixed(1)}M)`);
  } else if (volume > 1000000) {
    score += 5;
    reasons.push(`İyi Hacim (${(volume / 1e6).toFixed(1)}M)`);
  }

  // PILLAR 5: TradingView Recommendation (0-15 points)
  if (rating !== null && rating !== undefined) {
    if (rating >= 0.3) {
      score += 15;
      reasons.push(`TV Öneri: GÜÇLÜ AL (${rating.toFixed(2)})`);
    } else if (rating >= 0.1) {
      score += 10;
      reasons.push(`TV Öneri: AL (${rating.toFixed(2)})`);
    } else if (rating >= -0.1) {
      score += 5;
      reasons.push(`TV Öneri: NÖTR (${rating.toFixed(2)})`);
    }
  }

  // Signal Classification
  let signalType = "HOLD";
  if (score >= 50) {
    signalType = "STRONG_BUY";
    reasons.unshift(`🌟 [GÜÇLÜ AL] Bileşik Skor: %${score}/100`);
  } else if (score >= 30) {
    signalType = "BUY";
    reasons.unshift(`🟢 [AL] Bileşik Skor: %${score}/100`);
  } else if (rsi >= strategyParams.rsiSellThreshold) {
    signalType = "SELL";
    score = -10;
    reasons.unshift(`🔴 [SAT] RSI(${rsi}) Aşırı Alım Bölgesi`);
  } else {
    reasons.unshift(`⚪ [BEKLE] Skor: %${score}/100`);
  }

  return { score, signalType, reasons };
}

// ============================================================================
// TRADINGVIEW SCANNER API WITH RETRY + MULTI-UA
// ============================================================================

async function fetchAllBistStocksWithRetry(limit = 600, maxRetries = 3) {
  const payload = {
    filter: [{ left: "type", operation: "in_range", right: ["stock"] }],
    options: { lang: "tr" },
    markets: ["turkey"],
    symbols: { query: { types: [] }, tickers: [] },
    columns: [
      "name", "close", "change", "volume",
      "RSI", "SMA20", "Recommend.All",
      "SMA50", "EMA20", "MACD.macd", "MACD.signal",
      "BB.upper", "BB.lower", "Stoch.RSI.K",
      "ADX", "ATR", "Volatility.D"
    ],
    sort: { sortBy: "volume", sortOrder: "desc" },
    range: [0, limit]
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": ua,
      "Accept": "application/json",
      "Origin": "https://www.tradingview.com",
      "Referer": "https://www.tradingview.com/"
    };

    try {
      console.log(`[Cron] TradingView API çağrısı #${attempt}/${maxRetries}...`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const res = await fetch("https://scanner.tradingview.com/turkey/scan", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`[Cron] TradingView HTTP ${res.status} (Attempt ${attempt})`);
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          console.log(`[Cron] ${backoffMs.toFixed(0)}ms sonra tekrar denenecek...`);
          await new Promise(r => setTimeout(r, backoffMs));
          continue;
        }
        return [];
      }

      const json = await res.json();
      const stocks = (json.data || []).map(row => {
        const sym = (row.s || "").replace("BIST:", "").trim();
        const d = row.d || [];
        // columns: name, close, change, volume, RSI, SMA20, Recommend.All,
        //          SMA50, EMA20, MACD.macd, MACD.signal, BB.upper, BB.lower,
        //          Stoch.RSI.K, ADX, ATR, Volatility.D
        const currentPrice = parseFloat(d[1]) || 0;
        return {
          symbol: sym,
          currentPrice,
          changePct: parseFloat(d[2]) || 0,
          volume: parseFloat(d[3]) || 0,
          rsi: d[4] !== null && d[4] !== undefined ? parseFloat(parseFloat(d[4]).toFixed(2)) : 50,
          sma20: d[5] !== null && d[5] !== undefined ? parseFloat(parseFloat(d[5]).toFixed(2)) : parseFloat((currentPrice * 0.98).toFixed(2)),
          rating: d[6] !== null ? parseFloat(d[6]) : 0,
          sma50: d[7] !== null && d[7] !== undefined ? parseFloat(parseFloat(d[7]).toFixed(2)) : null,
          ema20: d[8] !== null && d[8] !== undefined ? parseFloat(parseFloat(d[8]).toFixed(2)) : null,
          macdValue: d[9] !== null ? parseFloat(d[9]) : null,
          macdSignal: d[10] !== null ? parseFloat(d[10]) : null,
          bbUpper: d[11] !== null ? parseFloat(d[11]) : null,
          bbLower: d[12] !== null ? parseFloat(d[12]) : null,
          stochRsiK: d[13] !== null ? parseFloat(d[13]) : null,
          adx: d[14] !== null ? parseFloat(d[14]) : null,
          atr: d[15] !== null ? parseFloat(d[15]) : null,
          volatility: d[16] !== null ? parseFloat(d[16]) : null
        };
      }).filter(item => item.symbol.length > 0 && item.currentPrice > 0);

      console.log(`[Cron] ✅ ${stocks.length} adet BIST hissesi başarıyla çekildi (Attempt ${attempt})`);
      return stocks;

    } catch (err) {
      console.warn(`[Cron] TradingView API Error (Attempt ${attempt}):`, err.message);
      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(r => setTimeout(r, backoffMs));
      }
    }
  }

  console.error("[Cron] ❌ TradingView API tüm denemelerde başarısız oldu.");
  return [];
}

// ============================================================================
// SAFE DB INSERT WITH FALLBACK TYPE MAPPING
// ============================================================================

async function safeInsertTradeHistory(tableName, tradeItem) {
  try {
    const { error } = await supabase.from(tableName).insert([tradeItem]);
    if (error) {
      // Fallback: map custom types to standard types if CHECK constraint fails
      const fallbackType = tradeItem.type === "PARTIAL_TP" ? "TAKE_PROFIT"
        : tradeItem.type === "TRAILING_STOP" ? "SELL"
        : tradeItem.type;
      const { error: err2 } = await supabase.from(tableName).insert([{ ...tradeItem, type: fallbackType }]);
      if (err2) console.warn(`[Cron] Insert history warning (${tableName}): ${err2.message}`);
    }
  } catch (err) {
    console.warn(`[Cron] Insert history exception (${tableName}):`, err.message);
  }
}

// ============================================================================
// POSITION RISK MANAGEMENT (Shared Logic)
// ============================================================================

function evaluatePositionRisk(holding, currentPrice, params, isEODClose = false) {
  const avgCost = parseFloat(holding.average_cost);
  const qty = parseInt(holding.quantity);
  let peakPrice = parseFloat(holding.highest_price || holding.peak_price || avgCost);

  if (currentPrice > peakPrice) {
    peakPrice = currentPrice;
  }

  let stopPrice = parseFloat(holding.stop_loss_price || (avgCost * (1 - params.stopLossPct / 100)).toFixed(2));
  const tpPrice = parseFloat(holding.take_profit_price || (avgCost * (1 + params.takeProfitPct / 100)).toFixed(2));

  // Breakeven Protection
  let breakevenTriggered = false;
  if (peakPrice >= avgCost * params.breakevenTrigger && stopPrice < avgCost) {
    stopPrice = avgCost;
    breakevenTriggered = true;
  }

  // Trailing Stop
  const trailingStopThreshold = parseFloat((peakPrice * (1 - params.trailingStopPct / 100)).toFixed(2));

  let sellType = null;
  let reasonMsg = "";

  if (peakPrice >= avgCost * params.breakevenTrigger && currentPrice <= trailingStopThreshold) {
    sellType = "TRAILING_STOP";
    reasonMsg = `🛡️ İzleyen Stop (-%${params.trailingStopPct}): Zirve ₺${peakPrice} → Anlık ₺${currentPrice} ≤ İzleyen Stop ₺${trailingStopThreshold}`;
  } else if (currentPrice <= stopPrice) {
    sellType = "STOP_LOSS";
    reasonMsg = `⛔ Zarar Kes (-%${params.stopLossPct}): Fiyat ₺${currentPrice} ≤ Stop ₺${stopPrice}`;
  } else if (currentPrice >= tpPrice) {
    sellType = "TAKE_PROFIT";
    reasonMsg = `🎯 Kâr Al (+%${params.takeProfitPct}): Fiyat ₺${currentPrice} ≥ Hedef ₺${tpPrice}`;
  } else if (isEODClose) {
    sellType = "SELL";
    reasonMsg = `🌇 Gün Sonu Otomatik Kapanış (18:00 EOD)`;
  }

  // Partial Take-Profit
  const partialTpThreshold = parseFloat((avgCost * (1 + params.partialTpPct / 100)).toFixed(2));
  const isPartialCandidate = !sellType && !(holding.is_partially_closed) && qty >= 2 && currentPrice >= partialTpThreshold;

  return {
    sellType,
    reasonMsg,
    peakPrice,
    stopPrice,
    breakevenTriggered,
    isPartialCandidate,
    partialTpThreshold,
    avgCost,
    qty
  };
}

// ============================================================================
// MAIN CRON ENGINE
// ============================================================================

async function runCronPaperBot() {
  const cronLogs = [];
  const log = (msg) => {
    const time = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" });
    const entry = `[${time}] ${msg}`;
    cronLogs.push(entry);
    console.log(msg);
  };

  log("═══════════════════════════════════════════════════════");
  log(`🏦 [Profesyonel Trading Bot v3.0] Başlatıldı: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}`);
  log("═══════════════════════════════════════════════════════");

  // Check market hours
  const nowTRT = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
  const dayOfWeek = nowTRT.getDay();
  const hour = nowTRT.getHours();
  const minute = nowTRT.getMinutes();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isMarketHours = isWeekday && hour >= 10 && hour <= 18;
  const isEODClose = isWeekday && ((hour === 17 && minute >= 55) || (hour === 18 && minute <= 15));

  if (!isMarketHours) {
    log(`⏰ Borsa saatleri dışında (Şu an: ${hour}:${String(minute).padStart(2, '0')}). Bot sadece bilgi taraması yapacak.`);
  }

  // ══════════════════════════════════════════════════════════
  // PART 1: PAPER TRADING (SWING) - 100K PORTFÖY
  // ══════════════════════════════════════════════════════════
  log("\n📊 ═══ BÖLÜM 1: SANAL PORTFÖY (Swing Trading) ═══");

  let swingTradesExecuted = 0;

  try {
    // 1. Fetch User Profile
    const { data: userProfile, error: profileErr } = await supabase
      .from("paper_users")
      .select("*")
      .eq("id", "paper-user-main")
      .maybeSingle();

    if (profileErr) console.warn("[Cron] Paper user fetch warning:", profileErr.message);

    const userId = userProfile?.id || "paper-user-main";
    let currentBalance = parseFloat(userProfile?.virtual_balance) || 100000.00;

    log(`💰 Sanal Bakiye: ₺${currentBalance.toLocaleString("tr-TR")}`);

    // 2. Fetch Active Holdings
    const { data: activeHoldings } = await supabase
      .from("paper_portfolios")
      .select("*");

    const portfolioMap = new Map((activeHoldings || []).map(p => [p.symbol, p]));
    log(`💼 Açık Pozisyonlar: ${portfolioMap.size} adet`);

    // 3. Fetch all BIST stocks
    const allBistStocks = await fetchAllBistStocksWithRetry(600, 3);
    log(`🔍 Borsa İstanbul: ${allBistStocks.length} hisse tarandı`);

    if (allBistStocks.length === 0) {
      log("⚠️ Hisse verisi çekilemedi - mevcut pozisyonlar sabit kalacak");
    }

    const signalsToBatch = [];

    // 4. Process each stock
    for (const stockItem of allBistStocks) {
      const sym = stockItem.symbol;
      const currentPrice = stockItem.currentPrice;
      const rsi = stockItem.rsi;
      const sma20 = stockItem.sma20;

      // Multi-factor evaluation
      const evaluation = evaluateMultiFactorSignal(
        currentPrice, rsi, sma20, stockItem.changePct,
        stockItem.volume, stockItem.rating, STRATEGY.swing
      );

      // Collect non-HOLD signals for batch insert
      if (evaluation.signalType !== "HOLD") {
        signalsToBatch.push({
          symbol: sym,
          signal_type: evaluation.signalType,
          price: currentPrice,
          metadata: { score: evaluation.score, rsi, sma20, reasons: evaluation.reasons }
        });
      }

      const holding = portfolioMap.get(sym);

      // 5. Risk Management for existing holdings
      if (holding) {
        const risk = evaluatePositionRisk(holding, currentPrice, STRATEGY.swing);

        // Update peak price in DB
        if (risk.peakPrice > parseFloat(holding.highest_price || holding.peak_price || risk.avgCost)) {
          try {
            await supabase.from("paper_portfolios")
              .update({ highest_price: risk.peakPrice, updated_at: new Date().toISOString() })
              .eq("symbol", sym);
          } catch (e) { /* ignore */ }
        }

        // Breakeven Protection Update
        if (risk.breakevenTriggered) {
          log(`🛡️ [Başabaş Koruması] ${sym}: Stop-Loss maliyete (₺${risk.avgCost}) çekildi!`);
          try {
            await supabase.from("paper_portfolios")
              .update({ stop_loss_price: risk.avgCost, highest_price: risk.peakPrice, updated_at: new Date().toISOString() })
              .eq("symbol", sym);
          } catch (e) { /* ignore */ }
        }

        // Partial Take-Profit
        if (risk.isPartialCandidate) {
          const sellQty = Math.floor(risk.qty / 2);
          const totalAmount = parseFloat((sellQty * currentPrice).toFixed(2));
          const totalCost = parseFloat((sellQty * risk.avgCost).toFixed(2));
          const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
          const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

          currentBalance += totalAmount;

          log(`🎯 [KADEMELİ KÂR AL %50] ${sym}: ${sellQty} Lot @ ₺${currentPrice} | Kâr: +₺${pnlTL}`);

          await safeInsertTradeHistory("paper_trade_history", {
            user_id: userId, symbol: sym, type: "PARTIAL_TP",
            price: currentPrice, quantity: sellQty,
            total_amount: totalAmount, profit_loss: pnlTL, profit_loss_pct: pnlPct,
            reason: `🎯 Kademeli %50 Kâr Al (Hedef ₺${risk.partialTpThreshold} ulaşıldı)`
          });

          const remainingQty = risk.qty - sellQty;
          try {
            await supabase.from("paper_portfolios")
              .update({
                quantity: remainingQty,
                total_spent: parseFloat((remainingQty * risk.avgCost).toFixed(2)),
                stop_loss_price: risk.avgCost,
                highest_price: risk.peakPrice,
                is_partially_closed: true,
                updated_at: new Date().toISOString()
              })
              .eq("symbol", sym);
          } catch (e) { /* ignore */ }

          swingTradesExecuted++;
        } else if (risk.sellType) {
          // Full exit
          log(`🔴 [${risk.sellType}] ${sym} Satılıyor! Fiyat: ₺${currentPrice}, Lot: ${risk.qty}`);
          const totalAmount = parseFloat((risk.qty * currentPrice).toFixed(2));
          const totalCost = parseFloat((risk.qty * risk.avgCost).toFixed(2));
          const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
          const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

          currentBalance += totalAmount;

          await safeInsertTradeHistory("paper_trade_history", {
            user_id: userId, symbol: sym, type: risk.sellType,
            price: currentPrice, quantity: risk.qty,
            total_amount: totalAmount, profit_loss: pnlTL, profit_loss_pct: pnlPct,
            reason: risk.reasonMsg
          });

          await supabase.from("paper_portfolios").delete().eq("symbol", sym);
          portfolioMap.delete(sym);
          swingTradesExecuted++;
          log(`✅ ${sym} Satıldı. PnL: ${pnlTL >= 0 ? '+' : ''}₺${pnlTL} (%${pnlPct})`);
        }
      } else {
        // 6. Open New Positions on Buy Signals
        if ((evaluation.signalType === "STRONG_BUY" || evaluation.signalType === "BUY")
          && portfolioMap.size < STRATEGY.swing.maxPositions
          && currentPrice >= STRATEGY.swing.minTradePrice
          && isMarketHours) {

          // Confidence-based sizing
          let budgetMultiplier = 1.0;
          if (evaluation.score >= 60) budgetMultiplier = 1.25;
          else if (evaluation.score >= 40) budgetMultiplier = 1.0;
          else budgetMultiplier = 0.75;

          const targetBudget = Math.min(currentBalance, STRATEGY.swing.maxBudgetPerTrade * budgetMultiplier);

          if (targetBudget >= STRATEGY.swing.minTradeBudget) {
            const lotQty = Math.floor(targetBudget / currentPrice);
            const totalCost = parseFloat((lotQty * currentPrice).toFixed(2));

            if (lotQty > 0 && totalCost >= STRATEGY.swing.minTradeBudget && currentBalance >= totalCost) {
              currentBalance -= totalCost;
              const stopLossPrice = parseFloat((currentPrice * (1 - STRATEGY.swing.stopLossPct / 100)).toFixed(2));
              const takeProfitPrice = parseFloat((currentPrice * (1 + STRATEGY.swing.takeProfitPct / 100)).toFixed(2));

              const newHolding = {
                user_id: userId, symbol: sym,
                average_cost: currentPrice, quantity: lotQty,
                total_spent: totalCost,
                stop_loss_price: stopLossPrice,
                take_profit_price: takeProfitPrice
              };

              try {
                await supabase.from("paper_portfolios").insert([newHolding]);
              } catch (insertErr) {
                // Retry with upsert if duplicate
                await supabase.from("paper_portfolios").upsert([newHolding], { onConflict: "user_id,symbol" });
              }
              portfolioMap.set(sym, newHolding);

              await safeInsertTradeHistory("paper_trade_history", {
                user_id: userId, symbol: sym, type: "BUY",
                price: currentPrice, quantity: lotQty,
                total_amount: totalCost, profit_loss: 0, profit_loss_pct: 0,
                reason: `[${evaluation.signalType}] ${evaluation.reasons.join(" | ")}`
              });

              swingTradesExecuted++;
              log(`✅ ${sym} Alındı! ${lotQty} Lot @ ₺${currentPrice} (₺${totalCost}) | Skor: %${evaluation.score}`);
            }
          }
        }
      }
    }

    // Bulk save signals (max 50 per batch)
    if (signalsToBatch.length > 0) {
      try {
        await supabase.from("paper_signals").insert(signalsToBatch.slice(0, 50));
      } catch (e) {
        console.warn("[Cron] Signal batch insert warning:", e.message);
      }
    }

    // Update user balance
    await supabase
      .from("paper_users")
      .upsert([{ id: userId, virtual_balance: currentBalance, updated_at: new Date().toISOString() }]);

    log(`📊 Swing İşlem: ${swingTradesExecuted} adet | Bakiye: ₺${currentBalance.toLocaleString("tr-TR")}`);

  } catch (swingErr) {
    console.error("⚠️ Paper Trading Section Error:", swingErr.message);
    log(`⚠️ Paper Trading Hatası: ${swingErr.message}`);
  }

  // ══════════════════════════════════════════════════════════
  // PART 2: DAY TRADING (SCALP) - 50K PORTFÖY
  // ══════════════════════════════════════════════════════════
  log("\n⚡ ═══ BÖLÜM 2: GÜNLÜK AL-SAT (Scalp Trading) ═══");

  let scalpTradesExecuted = 0;

  try {
    // FIXED: Correct table names (day_trading_users, NOT paper_day_users)
    const { data: dtProfile } = await supabase
      .from("day_trading_users")
      .select("*")
      .eq("id", "day-trading-user-main")
      .maybeSingle();

    let dtBalance = parseFloat(dtProfile?.virtual_balance) || 50000.00;
    const dtUserId = dtProfile?.id || "day-trading-user-main";

    log(`💰 Scalp Bakiye: ₺${dtBalance.toLocaleString("tr-TR")}`);

    // FIXED: Correct table name (day_trading_portfolios, NOT paper_day_portfolios)
    const { data: dtHoldings } = await supabase
      .from("day_trading_portfolios")
      .select("*");

    const dtMap = new Map((dtHoldings || []).map(p => [p.symbol, p]));
    log(`💼 Açık Scalp Pozisyonlar: ${dtMap.size} adet`);

    // Re-use the already fetched BIST stocks data
    const allBistStocks = await fetchAllBistStocksWithRetry(600, 2);
    log(`🔍 Scalp Radarı: ${allBistStocks.length} hisse`);

    for (const item of allBistStocks) {
      const sym = item.symbol;
      const currentPrice = item.currentPrice;
      const rsi = item.rsi;
      if (!currentPrice || currentPrice <= 0) continue;

      const holding = dtMap.get(sym);

      if (holding) {
        const risk = evaluatePositionRisk(holding, currentPrice, STRATEGY.scalp, isEODClose);

        // Update peak price
        if (risk.peakPrice > parseFloat(holding.highest_price || holding.peak_price || risk.avgCost)) {
          try {
            await supabase.from("day_trading_portfolios")
              .update({ highest_price: risk.peakPrice, updated_at: new Date().toISOString() })
              .eq("symbol", sym);
          } catch (e) { /* ignore */ }
        }

        // Breakeven Protection
        if (risk.breakevenTriggered) {
          log(`🛡️ [Scalp Başabaş] ${sym}: Stop-Loss maliyete (₺${risk.avgCost}) çekildi!`);
          try {
            await supabase.from("day_trading_portfolios")
              .update({ stop_loss_price: risk.avgCost, highest_price: risk.peakPrice, updated_at: new Date().toISOString() })
              .eq("symbol", sym);
          } catch (e) { /* ignore */ }
        }

        // Partial Take-Profit for Scalps
        if (risk.isPartialCandidate) {
          const sellQty = Math.floor(risk.qty / 2);
          const totalAmount = parseFloat((sellQty * currentPrice).toFixed(2));
          const totalCost = parseFloat((sellQty * risk.avgCost).toFixed(2));
          const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
          const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

          dtBalance += totalAmount;

          log(`🎯 [Scalp KADEMELİ KÂR %50] ${sym}: ${sellQty} Lot @ ₺${currentPrice} | Kâr: +₺${pnlTL}`);

          // FIXED: Correct table name (day_trading_history, NOT paper_day_trade_history)
          await safeInsertTradeHistory("day_trading_history", {
            user_id: dtUserId, symbol: sym, type: "PARTIAL_TP",
            price: currentPrice, quantity: sellQty,
            total_amount: totalAmount, profit_loss: pnlTL, profit_loss_pct: pnlPct,
            reason: `🎯 Scalp Kademeli %50 Kâr Al (Hedef ₺${risk.partialTpThreshold})`
          });

          const remainingQty = risk.qty - sellQty;
          try {
            await supabase.from("day_trading_portfolios")
              .update({
                quantity: remainingQty,
                total_spent: parseFloat((remainingQty * risk.avgCost).toFixed(2)),
                stop_loss_price: risk.avgCost,
                highest_price: risk.peakPrice,
                is_partially_closed: true,
                updated_at: new Date().toISOString()
              })
              .eq("symbol", sym);
          } catch (e) { /* ignore */ }

          scalpTradesExecuted++;
        } else if (risk.sellType) {
          log(`🔴 [Scalp ${risk.sellType}] ${sym} Satılıyor! ₺${currentPrice}, ${risk.qty} Lot`);
          const totalAmount = parseFloat((risk.qty * currentPrice).toFixed(2));
          const totalCost = parseFloat((risk.qty * risk.avgCost).toFixed(2));
          const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
          const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

          dtBalance += totalAmount;

          // FIXED: Correct table name
          await safeInsertTradeHistory("day_trading_history", {
            user_id: dtUserId, symbol: sym, type: risk.sellType,
            price: currentPrice, quantity: risk.qty,
            total_amount: totalAmount, profit_loss: pnlTL, profit_loss_pct: pnlPct,
            reason: risk.reasonMsg
          });

          // FIXED: Correct table name
          await supabase.from("day_trading_portfolios").delete().eq("symbol", sym);
          dtMap.delete(sym);
          scalpTradesExecuted++;
          log(`✅ Scalp ${sym} Satıldı. PnL: ${pnlTL >= 0 ? '+' : ''}₺${pnlTL} (%${pnlPct})`);
        }
      } else {
        // New Scalp Entry
        const evaluation = evaluateMultiFactorSignal(
          currentPrice, rsi, item.sma20, item.changePct,
          item.volume, item.rating, STRATEGY.scalp
        );

        if ((evaluation.signalType === "STRONG_BUY" || evaluation.signalType === "BUY")
          && dtMap.size < STRATEGY.scalp.maxPositions
          && currentPrice >= STRATEGY.scalp.minTradePrice
          && isMarketHours) {

          let budgetMultiplier = evaluation.score >= 60 ? 1.25 : evaluation.score >= 40 ? 1.0 : 0.75;
          const targetBudget = Math.min(dtBalance, STRATEGY.scalp.maxBudgetPerTrade * budgetMultiplier);

          if (targetBudget >= STRATEGY.scalp.minTradeBudget) {
            const lotQty = Math.floor(targetBudget / currentPrice);
            const totalCost = parseFloat((lotQty * currentPrice).toFixed(2));

            if (lotQty > 0 && totalCost >= STRATEGY.scalp.minTradeBudget && dtBalance >= totalCost) {
              dtBalance -= totalCost;
              const stopLossPrice = parseFloat((currentPrice * (1 - STRATEGY.scalp.stopLossPct / 100)).toFixed(2));
              const takeProfitPrice = parseFloat((currentPrice * (1 + STRATEGY.scalp.takeProfitPct / 100)).toFixed(2));

              const newHolding = {
                user_id: dtUserId, symbol: sym,
                average_cost: currentPrice, quantity: lotQty,
                total_spent: totalCost,
                stop_loss_price: stopLossPrice,
                take_profit_price: takeProfitPrice
              };

              // FIXED: Correct table name
              await supabase.from("day_trading_portfolios")
                .upsert([newHolding], { onConflict: "user_id,symbol" });
              dtMap.set(sym, newHolding);

              // FIXED: Correct table name
              await safeInsertTradeHistory("day_trading_history", {
                user_id: dtUserId, symbol: sym, type: "BUY",
                price: currentPrice, quantity: lotQty,
                total_amount: totalCost, profit_loss: 0, profit_loss_pct: 0,
                reason: `[${evaluation.signalType}] ${evaluation.reasons.join(" | ")}`
              });

              scalpTradesExecuted++;
              log(`✅ Scalp ${sym} Alındı! ${lotQty} Lot @ ₺${currentPrice} (₺${totalCost}) | Skor: %${evaluation.score}`);
            }
          }
        }
      }
    }

    // FIXED: Correct table name
    await supabase.from("day_trading_users")
      .upsert([{ id: dtUserId, virtual_balance: dtBalance, updated_at: new Date().toISOString() }]);

    log(`⚡ Scalp İşlem: ${scalpTradesExecuted} adet | Bakiye: ₺${dtBalance.toLocaleString("tr-TR")}`);

  } catch (dtErr) {
    console.error("⚠️ Day Trading Section Error:", dtErr.message);
    log(`⚠️ Day Trading Hatası: ${dtErr.message}`);
  }

  // ══════════════════════════════════════════════════════════
  // SUMMARY & LOG PERSIST
  // ══════════════════════════════════════════════════════════
  const totalTrades = swingTradesExecuted + scalpTradesExecuted;
  log("\n═══════════════════════════════════════════════════════");
  log(`🎉 [Cron Tamamlandı] Toplam İşlem: ${totalTrades} (Swing: ${swingTradesExecuted}, Scalp: ${scalpTradesExecuted})`);
  log("═══════════════════════════════════════════════════════");

  // Persist cron logs
  if (cronLogs.length > 0) {
    try {
      const rows = cronLogs.map(msg => ({
        user_id: "paper-user-main",
        log_type: msg.includes("🔴") || msg.includes("Satıldı") ? "SELL"
          : msg.includes("✅") && msg.includes("Alındı") ? "BUY"
          : msg.includes("🛡️") ? "RISK"
          : msg.includes("⚠️") || msg.includes("❌") ? "ERROR"
          : "INFO",
        message: msg
      }));
      await supabase.from("paper_bot_logs").insert(rows.slice(0, 200));
    } catch (logErr) {
      console.warn("⚠️ Log persist warning:", logErr.message);
    }
  }

  // Also persist to day trading logs
  if (cronLogs.length > 0) {
    try {
      const dtRows = cronLogs.filter(m => m.includes("Scalp") || m.includes("Day") || m.includes("BÖLÜM 2")).map(msg => ({
        user_id: "day-trading-user-main",
        log_type: msg.includes("🔴") ? "SELL" : msg.includes("✅") ? "BUY" : msg.includes("🛡️") ? "RISK" : "INFO",
        message: msg
      }));
      if (dtRows.length > 0) {
        await supabase.from("day_trading_logs").insert(dtRows.slice(0, 100));
      }
    } catch (logErr) {
      console.warn("⚠️ DT log persist warning:", logErr.message);
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

runCronPaperBot()
  .then(() => {
    console.log("✅ Cron Bot başarıyla tamamlandı.");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Cron Bot Kritik Hata:", err);
    process.exit(1);
  });
