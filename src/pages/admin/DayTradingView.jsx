import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { runDayTradingScan, DEFAULT_IPO_SYMBOLS } from "../../lib/dayTradingBot";
import { 
  LuZap, LuPlay, LuRotateCcw, LuSettings, LuTrendingUp, LuTrendingDown,
  LuCoins, LuBriefcase, LuAward, LuHistory, LuRadar, LuPlus,
  LuX, LuChevronDown, LuChevronUp, LuTerminal, LuFlame
} from "react-icons/lu";

const DayTradingView = ({ theme }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bot execution state
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const [showLogTerminal, setShowLogTerminal] = useState(false);

  // Custom IPO symbols state
  const [symbols, setSymbols] = useState(() => {
    const saved = localStorage.getItem("day_trading_symbols");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const fixed = parsed.map(s => s === "BINKO" ? "BINHO" : s).filter(s => s !== "MOKPT" && s !== "MREIT" && s !== "MASFEN");
        return Array.from(new Set([...DEFAULT_IPO_SYMBOLS, ...fixed]));
      } catch {
        return DEFAULT_IPO_SYMBOLS;
      }
    }
    return DEFAULT_IPO_SYMBOLS;
  });

  const [newSymbolInput, setNewSymbolInput] = useState("");
  const [showAddSymbolModal, setShowAddSymbolModal] = useState(false);

  // Strategy configuration state
  const [config, setConfig] = useState({
    stopLossPct: 2,
    takeProfitPct: 4,
    positionAllocationPct: 15
  });

  // Auto-Pilot state (Auto scan & trade every 60s)
  const [isAutoPilot, setIsAutoPilot] = useState(() => {
    const saved = localStorage.getItem("day_trading_auto_pilot");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [countdown, setCountdown] = useState(60);

  // Active sub-tab inside Day Trading view
  const [activeTab, setActiveTab] = useState("positions"); // 'positions' | 'signals' | 'history'
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    fetchDayTradingData();
  }, []);

  useEffect(() => {
    localStorage.setItem("day_trading_symbols", JSON.stringify(symbols));
  }, [symbols]);

  useEffect(() => {
    localStorage.setItem("day_trading_auto_pilot", JSON.stringify(isAutoPilot));
  }, [isAutoPilot]);

  // Auto-Pilot countdown and automatic scan trigger
  useEffect(() => {
    if (!isAutoPilot) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (!isScanning) {
            handleStartScan();
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPilot, isScanning, symbols, config]);

  const fetchDayTradingData = async () => {
    setLoading(true);
    try {
      const [profileRes, portRes, historyRes, signalRes] = await Promise.all([
        db.daytrading.getProfile(),
        db.daytrading.getPortfolios(),
        db.daytrading.getTradeHistory(),
        db.daytrading.getSignals()
      ]);

      setUserProfile(profileRes.data || { virtual_balance: 50000.00, initial_balance: 50000.00 });
      setPortfolios(portRes.data || []);
      setTradeHistory(historyRes.data || []);
      setSignals(signalRes.data || []);

      if (portRes.data && portRes.data.length > 0) {
        fetchLivePricesForHoldings(portRes.data);
      }
    } catch (err) {
      console.warn("Day trading fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLivePricesForHoldings = async (holdings) => {
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
      const result = await runDayTradingScan(symbols, config, (logMsg) => {
        setScanLogs(prev => [...prev, logMsg]);
      });
      if (result.success) {
        await fetchDayTradingData();
      }
    } catch (err) {
      setScanLogs(prev => [...prev, `❌ Tarama hatası: ${err.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddSymbol = (e) => {
    e.preventDefault();
    if (!newSymbolInput.trim()) return;
    const cleanSym = newSymbolInput.trim().toUpperCase().replace(".IS", "");
    if (symbols.includes(cleanSym)) {
      alert("Bu hisse zaten listenizde ekli!");
      return;
    }
    setSymbols([...symbols, cleanSym]);
    setNewSymbolInput("");
    setShowAddSymbolModal(false);
  };

  const handleRemoveSymbol = (symToRemove) => {
    setSymbols(symbols.filter(s => s !== symToRemove));
  };

  const handleResetAccount = async () => {
    const confirmReset = window.confirm(
      "Günlük Halka Arz Scalp hesabını sıfırlamak istediğinize emin misiniz? Bütün açık pozisyonlar ve işlem geçmişi silinip bakiye 50.000 TL yapılacaktır."
    );
    if (!confirmReset) return;

    setLoading(true);
    try {
      await db.daytrading.resetAccount();
      setScanLogs([]);
      setShowLogTerminal(false);
      await fetchDayTradingData();
    } catch (err) {
      alert("Sıfırlama hatası: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualClosePosition = async (holding) => {
    const currentPrice = livePrices[holding.symbol] || parseFloat(holding.average_cost);
    const confirmClose = window.confirm(
      `${holding.symbol} scalp pozisyonunu anlık ₺${currentPrice} fiyattan kapatmak istiyor musunuz?`
    );
    if (!confirmClose) return;

    const qty = parseInt(holding.quantity);
    const avgCost = parseFloat(holding.average_cost);
    const totalAmount = parseFloat((qty * currentPrice).toFixed(2));
    const totalCost = parseFloat((qty * avgCost).toFixed(2));
    const pnlTL = parseFloat((totalAmount - totalCost).toFixed(2));
    const pnlPct = parseFloat(((pnlTL / totalCost) * 100).toFixed(2));

    const newBalance = (parseFloat(userProfile.virtual_balance) || 50000.00) + totalAmount;

    await db.daytrading.addTradeHistory({
      user_id: userProfile.id || "day-trading-user-main",
      symbol: holding.symbol,
      type: "SELL",
      price: currentPrice,
      quantity: qty,
      total_amount: totalAmount,
      profit_loss: pnlTL,
      profit_loss_pct: pnlPct,
      reason: "Manuel Günlük Scalp Kapatma"
    });

    await db.daytrading.deletePortfolio(holding.symbol);
    await db.daytrading.updateProfile({ virtual_balance: newBalance });
    await fetchDayTradingData();
  };

  // Calculations
  const cashBalance = parseFloat(userProfile?.virtual_balance) || 50000.00;
  const initialBalance = parseFloat(userProfile?.initial_balance) || 50000.00;

  const totalInvested = portfolios.reduce((sum, h) => {
    const price = livePrices[h.symbol] || parseFloat(h.average_cost);
    return sum + (parseInt(h.quantity) * price);
  }, 0);

  const totalPortfolioValue = cashBalance + totalInvested;
  const overallPnlTL = totalPortfolioValue - initialBalance;
  const overallPnlPct = (overallPnlTL / initialBalance) * 100;

  // Win Rate & Portfolio Profit Calculations (Includes both Open Scalps & Closed Trades)
  const closedTrades = tradeHistory.filter(t => t.type === "SELL" || t.type === "STOP_LOSS" || t.type === "TAKE_PROFIT");
  const winClosedTrades = closedTrades.filter(t => parseFloat(t.profit_loss) > 0);
  const totalRealizedPnlTL = closedTrades.reduce((sum, t) => sum + (parseFloat(t.profit_loss) || 0), 0);

  // Open Scalp Positions Profitability
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

  // Combined Win Rate
  const totalEvaluated = portfolios.length + closedTrades.length;
  const totalWins = openWinningPositions.length + winClosedTrades.length;
  const combinedWinRatePct = totalEvaluated > 0 ? (totalWins / totalEvaluated) * 100 : 0;

  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      {/* 🟢 TOP HEADER KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Scalp Cash Balance */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Günlük Scalp Bakiyesi
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <LuZap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight">
              ₺{cashBalance.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Toplam: ₺{totalPortfolioValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                overallPnlTL >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              }`}>
                {overallPnlTL >= 0 ? <LuTrendingUp className="w-3 h-3" /> : <LuTrendingDown className="w-3 h-3" />}
                {overallPnlTL >= 0 ? "+" : ""}{overallPnlPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Open Scalp Positions */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Açık Scalp Pozisyonları
            </span>
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <LuFlame className="w-5 h-5" />
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

        {/* Card 3: Win Rate */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Scalp Başarı Oranı
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

        {/* Card 4: IPO & Volume Symbols */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        } shadow-sm hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Takip Edilen Halka Arzlar
            </span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500">
              <LuRadar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight">
              {symbols.length} <span className="text-sm font-normal text-slate-400">Sembol</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              Stop: -%{config.stopLossPct} | TP: +%{config.takeProfitPct}
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 IPO SYMBOLS TAG BAR */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
      } space-y-3`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <LuFlame className="w-4 h-4" />
            Günlük Yüksek Hacim & Halka Arz Listesi ({symbols.length})
          </span>
          <button
            onClick={() => setShowAddSymbolModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span>Yeni Halka Arz Ekle</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {symbols.map(sym => (
            <span
              key={sym}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 border transition-all ${
                isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-white border-slate-300 text-amber-600 shadow-sm"
              }`}
            >
              <span>{sym}</span>
              <button
                onClick={() => handleRemoveSymbol(sym)}
                className="text-slate-500 hover:text-rose-500 transition-colors"
                title="Listeden Çıkar"
              >
                <LuX className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ⚡ ACTION CONTROL BAR */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* 🤖 AUTO-PILOT TOGGLE BUTTON */}
          <button
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border shadow-sm ${
              isAutoPilot
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
            title="Otomatik Kâr Al & Stop Taraması"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isAutoPilot ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
            <span>🤖 Oto-Pilot: {isAutoPilot ? "AÇIK" : "KAPALI"}</span>
            {isAutoPilot && (
              <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono text-emerald-300">
                {countdown}s
              </span>
            )}
          </button>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md ${
              isScanning 
                ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/20 active:scale-[0.98]"
            }`}
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Halka Arz Taranıyor...</span>
              </>
            ) : (
              <>
                <LuPlay className="w-4.5 h-4.5 fill-current" />
                <span>Şimdi Tara</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowLogTerminal(!showLogTerminal)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
              isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 border border-slate-200 text-slate-700"
            }`}
          >
            <LuTerminal className="w-4 h-4 text-amber-500" />
            <span>Scalp Logları</span>
            {showLogTerminal ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={handleResetAccount}
          className="px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all"
        >
          <LuRotateCcw className="w-4 h-4" />
          <span>Scalp Bakiyesini Sıfırla (50.000 TL)</span>
        </button>
      </div>

      {/* 💻 LOG TERMINAL PANEL */}
      {showLogTerminal && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-2xl space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-2 font-sans font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Halka Arz & Scalper Konsolu
            </span>
            <button onClick={() => setShowLogTerminal(false)} className="text-slate-500 hover:text-white">
              <LuX className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
            {scanLogs.length === 0 ? (
              <div className="text-slate-500 py-4 text-center">
                Henüz tarama başlatılmadı. "Halka Arz Taramasını Başlat" butonuna tıklayarak yüksek hacimli scalping taramasını çalıştırabilirsiniz.
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

      {/* 📌 SUB-TAB NAVIGATION */}
      <div className="border-b border-slate-700/50 flex items-center gap-6">
        <button
          onClick={() => setActiveTab("positions")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "positions" ? "border-amber-500 text-amber-500" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <LuBriefcase className="w-4 h-4" />
          <span>Açık Scalp Pozisyonları ({portfolios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("signals")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "signals" ? "border-amber-500 text-amber-500" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <LuRadar className="w-4 h-4" />
          <span>Yüksek Hacim Radarı ({signals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "history" ? "border-amber-500 text-amber-500" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <LuHistory className="w-4 h-4" />
          <span>Scalp İşlem Geçmişi ({tradeHistory.length})</span>
        </button>
      </div>

      {/* 📊 TAB 1: POSITIONS */}
      {activeTab === "positions" && (
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {portfolios.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <LuBriefcase className="w-12 h-12 mx-auto text-slate-600" />
              <p className="font-medium text-base">Henüz açık scalp pozisyonunuz bulunmuyor.</p>
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
                    <th className="px-6 py-4">Sıkı Risk (Stop -2% / TP +4%)</th>
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
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-mono">
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
                          <div className="text-rose-400">Stop: ₺{parseFloat(item.stop_loss_price || (avgCost * 0.98)).toFixed(2)}</div>
                          <div className="text-emerald-400">TP: ₺{parseFloat(item.take_profit_price || (avgCost * 1.04)).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleManualClosePosition(item)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all"
                          >
                            Scalp Pozisyonu Kapat
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
              <p className="font-medium text-base">Henüz yüksek hacim sinyali üretilmedi.</p>
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
                    <th className="px-6 py-4">Hacim Patlaması</th>
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
                        <td className="px-6 py-4 font-bold font-mono text-amber-500">{sig.symbol}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sig.signal_type === "STRONG_BUY"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : sig.signal_type === "BUY"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-500/20 text-slate-400"
                          }`}>
                            {sig.signal_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold">₺{sig.price}</td>
                        <td className="px-6 py-4 font-mono text-amber-400 font-bold">
                          {meta.volumeRatio ? `${meta.volumeRatio}x Kat` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                          {Array.isArray(meta.reasons) ? meta.reasons.join(", ") : "Hacim Scalp Taraması"}
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

      {/* 📜 TAB 3: HISTORY */}
      {activeTab === "history" && (
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {tradeHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <LuHistory className="w-12 h-12 mx-auto text-slate-600" />
              <p className="font-medium text-base">Geçmiş scalp işlem kaydı bulunmuyor.</p>
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
                    <th className="px-6 py-4">Lot</th>
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

      {/* ➕ ADD NEW IPO SYMBOL MODAL */}
      {showAddSymbolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <LuPlus className="w-5 h-5 text-amber-500" />
                Yeni Halka Arz / Hacim Hissesi Ekle
              </h3>
              <button onClick={() => setShowAddSymbolModal(false)} className="text-slate-400 hover:text-white">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSymbol} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Hisse Sembolü (Örn: METEN, MASFEN, BINBN)
                </label>
                <input
                  type="text"
                  required
                  placeholder="METEN"
                  value={newSymbolInput}
                  onChange={(e) => setNewSymbolInput(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono uppercase ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSymbolModal(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                    isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300"
                  }`}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-md"
                >
                  Listeye Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayTradingView;
