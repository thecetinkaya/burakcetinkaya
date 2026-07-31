import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { runMarketScan, DEFAULT_SCAN_SYMBOLS } from "../../lib/paperTradingBot";
import { 
  LuBot, LuPlay, LuRotateCcw, LuSettings, LuTrendingUp, LuTrendingDown,
  LuCoins, LuBriefcase, LuAward, LuHistory, LuRadar, LuShieldAlert,
  LuX, LuChevronDown, LuChevronUp, LuTerminal
} from "react-icons/lu";

const PaperTradingView = ({ theme }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bot execution state
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const [showLogTerminal, setShowLogTerminal] = useState(false);

  // Strategy configuration state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("paper_bot_config");
    return saved ? JSON.parse(saved) : {
      rsiBuyThreshold: 30,
      smaPeriod: 20,
      stopLossPct: 4,
      takeProfitPct: 8,
      positionAllocationPct: 10
    };
  });

  // Active sub-tab inside Paper Trading dashboard
  const [activeTab, setActiveTab] = useState("positions"); // 'positions' | 'signals' | 'history'

  // Live price cache for open paper holdings
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    fetchPaperData();
  }, []);

  useEffect(() => {
    localStorage.setItem("paper_bot_config", JSON.stringify(config));
  }, [config]);

  const fetchPaperData = async () => {
    setLoading(true);
    try {
      const [profileRes, portRes, historyRes, signalRes] = await Promise.all([
        db.paper.getProfile(),
        db.paper.getPortfolios(),
        db.paper.getTradeHistory(),
        db.paper.getSignals()
      ]);

      setUserProfile(profileRes.data || { virtual_balance: 100000.00, initial_balance: 100000.00 });
      setPortfolios(portRes.data || []);
      setTradeHistory(historyRes.data || []);
      setSignals(signalRes.data || []);

      // Fetch live prices for active paper positions
      if (portRes.data && portRes.data.length > 0) {
        fetchLivePricesForHoldings(portRes.data);
      }
    } catch (err) {
      console.warn("Paper trading fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLivePricesForHoldings = async (holdings) => {
    if (!holdings || holdings.length === 0) return;
    const prices = {};
    const promises = holdings.map(async (h) => {
      try {
        const cleanSym = h.symbol.toUpperCase().replace(".IS", "") + ".IS";
        const res = await fetch(`/yh-api/v8/finance/chart/${cleanSym}?range=1d&interval=1d`);
        if (res.ok) {
          const json = await res.json();
          const metaPrice = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
          if (metaPrice) {
            prices[h.symbol] = parseFloat(metaPrice.toFixed(2));
          }
        }
      } catch {
        // ignore
      }
    });

    await Promise.allSettled(promises);
    setLivePrices(prev => ({ ...prev, ...prices }));
  };

  const handleStartScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setShowLogTerminal(true);
    setScanLogs([]);

    try {
      const result = await runMarketScan(DEFAULT_SCAN_SYMBOLS, config, (logMsg) => {
        setScanLogs(prev => [...prev, logMsg]);
      });
      if (result.success) {
        await fetchPaperData();
      }
    } catch (err) {
      setScanLogs(prev => [...prev, `❌ Tarama hatası: ${err.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleResetAccount = async () => {
    const confirmReset = window.confirm(
      "Sanal hesabı sıfırlamak istediğinize emin misiniz? Bütün açık pozisyonlar, sinyaller ve işlem geçmişi temizlenip bakiye 100.000 TL yapılacaktır."
    );
    if (!confirmReset) return;

    setLoading(true);
    try {
      await db.paper.resetAccount();
      setScanLogs([]);
      setShowLogTerminal(false);
      await fetchPaperData();
    } catch (err) {
      alert("Sıfırlama sırasında hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualClosePosition = async (holding) => {
    const currentPrice = livePrices[holding.symbol] || parseFloat(holding.average_cost);
    const confirmClose = window.confirm(
      `${holding.symbol} pozisyonunu anlık ${currentPrice} TL fiyattan manuel kapatmak istediğinize emin misiniz?`
    );
    if (!confirmClose) return;

    const qty = parseInt(holding.quantity);
    const avgCost = parseFloat(holding.average_cost);
    const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
    const totalCost = parseFloat((qty * avgCost).toFixed(2));
    const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
    const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

    const newBalance = (parseFloat(userProfile.virtual_balance) || 100000.00) + totalAmount;

    await db.paper.addTradeHistory({
      user_id: userProfile.id || "paper-user-main",
      symbol: holding.symbol,
      type: "SELL",
      price: currentPrice,
      quantity: qty,
      total_amount: totalAmount,
      profit_loss: pnlTL,
      profit_loss_pct: pnlPct,
      reason: "Kullanıcı Tarafından Manuel Pozisyon Kapatma"
    });

    await db.paper.deletePortfolio(holding.symbol);
    await db.paper.updateProfile({ virtual_balance: newBalance });
    await fetchPaperData();
  };

  // Portfolio Calculations
  const cashBalance = parseFloat(userProfile?.virtual_balance) || 100000.00;
  const initialBalance = parseFloat(userProfile?.initial_balance) || 100000.00;

  const totalInvested = portfolios.reduce((sum, h) => {
    const price = livePrices[h.symbol] || parseFloat(h.average_cost);
    return sum + (parseInt(h.quantity) * price);
  }, 0);

  const totalPortfolioValue = cashBalance + totalInvested;
  const overallPnlTL = totalPortfolioValue - initialBalance;
  const overallPnlPct = (overallPnlTL / initialBalance) * 100;

  // Win Rate & Portfolio Profit Calculations (Includes both Open Positions & Closed Trades)
  const closedTrades = tradeHistory.filter(t => t.type === "SELL" || t.type === "STOP_LOSS" || t.type === "TAKE_PROFIT");
  const winClosedTrades = closedTrades.filter(t => parseFloat(t.profit_loss) > 0);
  const totalRealizedPnlTL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.profit_loss) || 0), 0);

  // Open Positions Profitability
  const openWinningPositions = portfolios.filter(h => {
    const currentPrice = livePrices[h.symbol] || parseFloat(h.average_cost);
    const avgCost = parseFloat(h.average_cost);
    return currentPrice > avgCost;
  });

  const openPositionsPnlTL = portfolios.reduce((sum, h) => {
    const currentPrice = livePrices[h.symbol] || parseFloat(h.average_cost);
    const avgCost = parseFloat(h.average_cost);
    const qty = parseInt(h.quantity);
    return sum + ((currentPrice - avgCost) * qty);
  }, 0);

  // Combined Win Rate (Açık Kârdaki Hisseler + Kapanan Kârlı İşlemler)
  const totalEvaluated = portfolios.length + closedTrades.length;
  const totalWins = openWinningPositions.length + winClosedTrades.length;
  const combinedWinRatePct = totalEvaluated > 0 ? (totalWins / totalEvaluated) * 100 : 0;

  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* 🟢 TOP HEADER KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Virtual Cash & Balance */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Sanal Bakiye & Kasa
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <LuCoins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight">
              ₺{cashBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Toplam Değer: ₺{totalPortfolioValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                overallPnlTL >= 0 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-rose-500/10 text-rose-500"
              }`}>
                {overallPnlTL >= 0 ? <LuTrendingUp className="w-3 h-3" /> : <LuTrendingDown className="w-3 h-3" />}
                {overallPnlTL >= 0 ? "+" : ""}{overallPnlPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Positions */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Açık Pozisyonlar
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <LuBriefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight">
              {portfolios.length} <span className="text-sm font-normal text-slate-400">Hisse</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Yatırılan Bütçe: ₺{totalInvested.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Card 3: Combined Win Rate & Total Net Profit */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Başarı Oranı (Win Rate)
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <LuAward className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight flex items-baseline gap-2">
              %{combinedWinRatePct.toFixed(1)}
              <span className="text-xs font-medium text-slate-400">
                ({totalWins}/{totalEvaluated} Başarılı)
              </span>
            </div>
            <div className={`text-xs font-medium mt-1 flex flex-wrap items-center gap-1 ${overallPnlTL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span>Net Kâr/Zarar: {overallPnlTL >= 0 ? '+' : ''}₺{overallPnlTL.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              {openPositionsPnlTL !== 0 && (
                <span className="text-[10px] text-slate-400">
                  (Açık: {openPositionsPnlTL >= 0 ? '+' : ''}₺{openPositionsPnlTL.toFixed(0)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Bot & Scanner Status */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Otonom Bot Durumu
            </span>
            <div className={`p-2.5 rounded-xl ${isScanning ? "bg-amber-500/10 text-amber-500 animate-pulse" : "bg-emerald-500/10 text-emerald-500"}`}>
              <LuBot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
              <span className="text-lg font-bold">
                {isScanning ? "Taranıyor..." : "Aktif & Hazır"}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Kural: RSI &lt; {config.rsiBuyThreshold} | Stop: -%{config.stopLossPct} | TP: +%{config.takeProfitPct}
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ ACTION CONTROL BAR */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md ${
              isScanning 
                ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20 active:scale-[0.98]"
            }`}
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Piyasa Taranıyor...</span>
              </>
            ) : (
              <>
                <LuPlay className="w-4.5 h-4.5 fill-current" />
                <span>Şimdi Tarama Yap & Botu Çalıştır</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowLogTerminal(!showLogTerminal)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
            }`}
          >
            <LuTerminal className="w-4 h-4 text-emerald-500" />
            <span>Tarama Logları</span>
            {showLogTerminal ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigModal(true)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
            }`}
          >
            <LuSettings className="w-4 h-4" />
            <span>Strateji Ayarları</span>
          </button>

          <button
            onClick={handleResetAccount}
            className="px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all"
          >
            <LuRotateCcw className="w-4 h-4" />
            <span>Hesabı Sıfırla (100.000 TL)</span>
          </button>
        </div>
      </div>

      {/* 💻 LOG TERMINAL PANEL */}
      {showLogTerminal && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-2xl space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-2 font-sans font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Bot Tarama Konsolu & Loglar
            </span>
            <button
              onClick={() => setShowLogTerminal(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
            {scanLogs.length === 0 ? (
              <div className="text-slate-500 py-4 text-center">
                Henüz tarama çalıştırılmadı. "Şimdi Tarama Yap" butonuna basarak botu başlatabilirsiniz.
              </div>
            ) : (
              scanLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 📌 SUB-TAB DASHBOARD NAVIGATION */}
      <div className="border-b border-slate-700/50 flex items-center gap-6">
        <button
          onClick={() => setActiveTab("positions")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "positions"
              ? "border-emerald-500 text-emerald-500"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <LuBriefcase className="w-4 h-4" />
          <span>Açık Pozisyonlar ({portfolios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("signals")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "signals"
              ? "border-emerald-500 text-emerald-500"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <LuRadar className="w-4 h-4" />
          <span>Sinyal Radarı ({signals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "history"
              ? "border-emerald-500 text-emerald-500"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <LuHistory className="w-4 h-4" />
          <span>İşlem Geçmişi ({tradeHistory.length})</span>
        </button>
      </div>

      {/* 📊 TAB 1: ACTIVE POSITIONS */}
      {activeTab === "positions" && (
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {portfolios.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <LuBriefcase className="w-12 h-12 mx-auto text-slate-600" />
              <p className="font-medium text-base">Henüz açık sanal pozisyonunuz yok.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                "Şimdi Tarama Yap" butonuna bastığınızda, RSI ve 20 SMA şartlarına uyan hisseler otomatik olarak sanal portföyünüze eklenecektir.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`text-xs uppercase tracking-wider border-b ${
                  isDark ? "bg-slate-800/50 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  <tr>
                    <th className="px-6 py-4">Hisse</th>
                    <th className="px-6 py-4">Lot Adedi</th>
                    <th className="px-6 py-4">Alış Maliyeti</th>
                    <th className="px-6 py-4">Güncel Fiyat</th>
                    <th className="px-6 py-4">Toplam Tutar</th>
                    <th className="px-6 py-4">Kâr / Zarar</th>
                    <th className="px-6 py-4">Risk (Stop / TP)</th>
                    <th className="px-6 py-4 text-right">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-200"}`}>
                  {portfolios.map((item) => {
                    const currentPrice = livePrices[item.symbol] || parseFloat(item.average_cost);
                    const avgCost = parseFloat(item.average_cost);
                    const qty = parseInt(item.quantity);
                    const totalSpent = parseFloat(item.total_spent || (avgCost * qty).toFixed(2));
                    const currentValue = parseFloat((currentPrice * qty).toFixed(2));
                    const pnlTL = currentValue - totalSpent;
                    const pnlPct = ((currentPrice - avgCost) / avgCost) * 100;

                    return (
                      <tr key={item.id || item.symbol} className={`hover:bg-slate-800/30 transition-colors ${
                        isDark ? "" : "hover:bg-slate-50"
                      }`}>
                        <td className="px-6 py-4 font-bold text-base flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-mono">
                            {item.symbol}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">{qty} Lot</td>
                        <td className="px-6 py-4 font-mono">₺{avgCost.toFixed(2)}</td>
                        <td className="px-6 py-4 font-mono font-bold">₺{currentPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 font-mono">₺{currentValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4">
                          <div className={`font-bold flex items-center gap-1 ${
                            pnlTL >= 0 ? "text-emerald-500" : "text-rose-500"
                          }`}>
                            {pnlTL >= 0 ? <LuTrendingUp className="w-4 h-4" /> : <LuTrendingDown className="w-4 h-4" />}
                            <span>{pnlTL >= 0 ? "+" : ""}₺{pnlTL.toFixed(2)}</span>
                            <span className="text-xs font-normal">({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono space-y-0.5">
                          <div className="text-rose-400">Stop: ₺{parseFloat(item.stop_loss_price || (avgCost * 0.96)).toFixed(2)}</div>
                          <div className="text-emerald-400">TP: ₺{parseFloat(item.take_profit_price || (avgCost * 1.08)).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleManualClosePosition(item)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all"
                          >
                            Pozisyonu Kapat (Sat)
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ⚡ TAB 2: SIGNALS RADAR */}
      {activeTab === "signals" && (
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {signals.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <LuRadar className="w-12 h-12 mx-auto text-slate-600" />
              <p className="font-medium text-base">Henüz üretilmiş sinyal yok.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                "Şimdi Tarama Yap" butonuna tıkladığınızda BİST tarama sonuçları burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`text-xs uppercase tracking-wider border-b ${
                  isDark ? "bg-slate-800/50 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  <tr>
                    <th className="px-6 py-4">Tarih</th>
                    <th className="px-6 py-4">Hisse</th>
                    <th className="px-6 py-4">Sinyal Tipi</th>
                    <th className="px-6 py-4">Fiyat</th>
                    <th className="px-6 py-4">RSI (14)</th>
                    <th className="px-6 py-4">SMA (20)</th>
                    <th className="px-6 py-4">Gerekçe / Detay</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-200"}`}>
                  {signals.map((sig) => {
                    const dateStr = new Date(sig.created_at || sig.timestamp || Date.now()).toLocaleString("tr-TR");
                    const meta = sig.metadata || {};

                    return (
                      <tr key={sig.id} className={`hover:bg-slate-800/30 transition-colors ${
                        isDark ? "" : "hover:bg-slate-50"
                      }`}>
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{dateStr}</td>
                        <td className="px-6 py-4 font-bold font-mono text-emerald-500">{sig.symbol}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sig.signal_type === "STRONG_BUY"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : sig.signal_type === "BUY"
                              ? "bg-teal-500/20 text-teal-300"
                              : sig.signal_type === "SELL"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-slate-500/20 text-slate-400"
                          }`}>
                            {sig.signal_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">₺{sig.price}</td>
                        <td className="px-6 py-4 font-mono">{meta.rsi ?? 'N/A'}</td>
                        <td className="px-6 py-4 font-mono">₺{meta.sma20 ?? 'N/A'}</td>
                        <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                          {Array.isArray(meta.reasons) ? meta.reasons.join(", ") : "Standart Tarama"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 📜 TAB 3: TRADE HISTORY */}
      {activeTab === "history" && (
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {tradeHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <LuHistory className="w-12 h-12 mx-auto text-slate-600" />
              <p className="font-medium text-base">Geçmiş işlem kaydı bulunamadı.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`text-xs uppercase tracking-wider border-b ${
                  isDark ? "bg-slate-800/50 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  <tr>
                    <th className="px-6 py-4">Tarih</th>
                    <th className="px-6 py-4">Hisse</th>
                    <th className="px-6 py-4">İşlem Tipi</th>
                    <th className="px-6 py-4">Fiyat</th>
                    <th className="px-6 py-4">Lot Adedi</th>
                    <th className="px-6 py-4">Toplam Tutar</th>
                    <th className="px-6 py-4">Net Kâr / Zarar</th>
                    <th className="px-6 py-4">Açıklama</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-200"}`}>
                  {tradeHistory.map((item) => {
                    const dateStr = new Date(item.timestamp || Date.now()).toLocaleString("tr-TR");
                    const pnl = parseFloat(item.profit_loss) || 0;
                    const pnlPct = parseFloat(item.profit_loss_pct) || 0;

                    return (
                      <tr key={item.id} className={`hover:bg-slate-800/30 transition-colors ${
                        isDark ? "" : "hover:bg-slate-50"
                      }`}>
                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{dateStr}</td>
                        <td className="px-6 py-4 font-bold font-mono">{item.symbol}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.type === "BUY"
                              ? "bg-teal-500/20 text-teal-400"
                              : item.type === "TAKE_PROFIT"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.type === "STOP_LOSS"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">₺{item.price}</td>
                        <td className="px-6 py-4 font-mono">{item.quantity} Lot</td>
                        <td className="px-6 py-4 font-mono">₺{parseFloat(item.total_amount).toLocaleString("tr-TR")}</td>
                        <td className="px-6 py-4 font-mono font-bold">
                          {item.type === "BUY" ? (
                            <span className="text-slate-500">-</span>
                          ) : (
                            <span className={pnl >= 0 ? "text-emerald-500" : "text-rose-500"}>
                              {pnl >= 0 ? "+" : ""}₺{pnl.toFixed(2)} (%{pnlPct.toFixed(2)})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">
                          {item.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ⚙️ STRATEGY CONFIG MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <LuSettings className="w-5 h-5 text-emerald-500" />
                Bot Strateji Parametreleri
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  RSI Alım Eşik Değeri (Varsayılan: 30)
                </label>
                <input
                  type="number"
                  value={config.rsiBuyThreshold}
                  onChange={(e) => setConfig({ ...config, rsiBuyThreshold: parseInt(e.target.value) || 30 })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  SMA Trend Periyodu (Gün) (Varsayılan: 20)
                </label>
                <input
                  type="number"
                  value={config.smaPeriod}
                  onChange={(e) => setConfig({ ...config, smaPeriod: parseInt(e.target.value) || 20 })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Zarar Kes Oranı (Stop-Loss %) (Varsayılan: %4)
                </label>
                <input
                  type="number"
                  value={config.stopLossPct}
                  onChange={(e) => setConfig({ ...config, stopLossPct: parseFloat(e.target.value) || 4 })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Kâr Al Oranı (Take-Profit %) (Varsayılan: %8)
                </label>
                <input
                  type="number"
                  value={config.takeProfitPct}
                  onChange={(e) => setConfig({ ...config, takeProfitPct: parseFloat(e.target.value) || 8 })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Pozisyon Başına Kasa Payı (%) (Varsayılan: %10)
                </label>
                <input
                  type="number"
                  value={config.positionAllocationPct}
                  onChange={(e) => setConfig({ ...config, positionAllocationPct: parseFloat(e.target.value) || 10 })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-mono ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300"
                  }`}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20"
              >
                Ayarları Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperTradingView;
