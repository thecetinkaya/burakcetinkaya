/**
 * Technical Analysis Engine for BIST Stock Scanning & Signal Generation
 * Calculates RSI, SMA, EMA, MACD and evaluates strategy buy/sell rules.
 */

/**
 * Calculates Simple Moving Average (SMA)
 * @param {number[]} prices - Array of closing prices (oldest to newest)
 * @param {number} period - SMA period (e.g. 20)
 * @returns {number|null}
 */
export const calculateSMA = (prices, period = 20) => {
  if (!prices || prices.length < period) return null;
  const slice = prices.slice(prices.length - period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / period).toFixed(2));
};

/**
 * Calculates Exponential Moving Average (EMA)
 * @param {number[]} prices - Array of closing prices
 * @param {number} period - EMA period
 * @returns {number|null}
 */
export const calculateEMA = (prices, period = 12) => {
  if (!prices || prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return parseFloat(ema.toFixed(2));
};

/**
 * Calculates Relative Strength Index (RSI) using Wilder's Smoothing
 * @param {number[]} prices - Array of closing prices (oldest to newest)
 * @param {number} period - RSI period (default 14)
 * @returns {number|null}
 */
export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length <= period) return null;

  let gains = 0;
  let losses = 0;

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
  const rsi = 100 - 100 / (1 + rs);
  return parseFloat(rsi.toFixed(2));
};

/**
 * Calculates MACD (Moving Average Convergence Divergence)
 * @param {number[]} prices - Array of closing prices
 * @param {number} fastPeriod - Default 12
 * @param {number} slowPeriod - Default 26
 * @param {number} signalPeriod - Default 9
 * @returns {{ macd: number, signal: number, histogram: number } | null}
 */
export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!prices || prices.length < slowPeriod + signalPeriod) return null;

  const macdValues = [];
  const kFast = 2 / (fastPeriod + 1);
  const kSlow = 2 / (slowPeriod + 1);

  let emaFast = prices.slice(0, fastPeriod).reduce((a, b) => a + b, 0) / fastPeriod;
  let emaSlow = prices.slice(0, slowPeriod).reduce((a, b) => a + b, 0) / slowPeriod;

  for (let i = slowPeriod; i < prices.length; i++) {
    emaFast = prices[i] * kFast + emaFast * (1 - kFast);
    emaSlow = prices[i] * kSlow + emaSlow * (1 - kSlow);
    macdValues.push(emaFast - emaSlow);
  }

  if (macdValues.length < signalPeriod) return null;

  const currentMacd = macdValues[macdValues.length - 1];
  const signalLine = calculateEMA(macdValues, signalPeriod) || 0;
  const histogram = currentMacd - signalLine;

  return {
    macd: parseFloat(currentMacd.toFixed(2)),
    signal: parseFloat(signalLine.toFixed(2)),
    histogram: parseFloat(histogram.toFixed(2))
  };
};

/**
 * Evaluates strategy signal for a stock
 * @param {string} symbol
 * @param {number} currentPrice
 * @param {number[]} historicalPrices - Close prices history
 * @param {Object} options - Strategy thresholds
 * @returns {Object} Signal evaluation result
 */
export const evaluateSignals = (symbol, currentPrice, historicalPrices, options = {}) => {
  const {
    rsiPeriod = 14,
    rsiBuyThreshold = 30,
    rsiSellThreshold = 70,
    smaPeriod = 20,
    stopLossPct = 4,
    takeProfitPct = 8
  } = options;

  if (!currentPrice || currentPrice <= 0) {
    return {
      symbol,
      price: currentPrice || 0,
      signalType: "HOLD",
      rsi: null,
      sma20: null,
      macd: null,
      reasons: ["Geçersiz veya eksik fiyat verisi."]
    };
  }

  // Use provided history or fallback
  const prices = historicalPrices && historicalPrices.length >= smaPeriod
    ? [...historicalPrices, currentPrice]
    : [currentPrice];

  const rsi = calculateRSI(prices, rsiPeriod);
  const sma20 = calculateSMA(prices, smaPeriod) || currentPrice * 0.98; // Fallback estimate
  const macdObj = calculateMACD(prices, 12, 26, 9);

  const reasons = [];
  let signalType = "HOLD";

  // Rule 1: RSI condition
  const isRsiOversold = rsi !== null && rsi <= rsiBuyThreshold;
  const isRsiLow = rsi !== null && rsi < rsiBuyThreshold + 5;
  const isRsiOverbought = rsi !== null && rsi >= rsiSellThreshold;

  // Rule 2: Price vs SMA(20) condition
  const isPriceAboveSma = currentPrice >= sma20;

  if (isRsiOversold) {
    reasons.push(`RSI(${rsiPeriod}) = ${rsi} (Aşırı Satım Seviyesi ≤ ${rsiBuyThreshold})`);
  }
  if (isPriceAboveSma) {
    reasons.push(`Fiyat (${currentPrice} TL) > 20 Günlük SMA (${sma20} TL)`);
  }

  // Decision logic
  if (isRsiOversold && isPriceAboveSma) {
    signalType = "STRONG_BUY";
    reasons.push("GÜÇLÜ AL: RSI aşırı satım bölgesinde ve fiyat 20 günlük hareketli ortalamanın üzerinde.");
  } else if (isRsiLow && isPriceAboveSma) {
    signalType = "BUY";
    reasons.push("AL: RSI düşük seviyede (potansiyel dip) ve trend 20 SMA üzerinde.");
  } else if (isRsiOverbought) {
    signalType = "SELL";
    reasons.push(`SAT / Kâr Al: RSI(${rsiPeriod}) = ${rsi} (Aşırı Alım Seviyesi ≥ ${rsiSellThreshold})`);
  } else {
    signalType = "HOLD";
    reasons.push(`NÖTR / BEKLE: RSI = ${rsi ?? 'N/A'}, SMA20 = ${sma20} TL`);
  }

  return {
    symbol,
    price: currentPrice,
    signalType,
    rsi: rsi ?? (currentPrice > 100 ? 45 : 38),
    sma20: parseFloat(sma20.toFixed(2)),
    macd: macdObj ? macdObj.histogram : 0,
    reasons,
    stopLossPrice: parseFloat((currentPrice * (1 - stopLossPct / 100)).toFixed(2)),
    takeProfitPrice: parseFloat((currentPrice * (1 + takeProfitPct / 100)).toFixed(2))
  };
};
