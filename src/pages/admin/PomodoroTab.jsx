import React, { useState, useEffect, useRef } from "react";
import {
  LuPlay, LuPause, LuRotateCcw, LuClock, LuFlame, LuTarget,
  LuAward, LuCheckCheck, LuZap, LuCoffee, LuMinus, LuPlus,
  LuSettings, LuTrendingUp, LuCalendar, LuSparkles, LuBookOpen
} from "react-icons/lu";

const PRESETS = [
  { key: "classic", label: "🍅 Klasik (25 / 5)", workSec: 25 * 60, breakSec: 5 * 60 },
  { key: "deep",    label: "🚀 Derin Odak (50 / 10)", workSec: 50 * 60, breakSec: 10 * 60 },
  { key: "sprint",  label: "⚡ Hızlı Seri (15 / 3)", workSec: 15 * 60, breakSec: 3 * 60 },
];

const SUBJECTS = [
  { id: "cografya", label: "Coğrafya", color: "emerald" },
  { id: "tarih",    label: "Tarih",    color: "amber" },
  { id: "vatandaslik", label: "Vatandaşlık", color: "purple" },
  { id: "tekrar",   label: "Genel Tekrar", color: "blue" },
];

const PomodoroTab = ({ theme }) => {
  const isDark = theme === "dark";

  // Preset Selection
  const [selectedPreset, setSelectedPreset] = useState("deep");
  const currentPreset = PRESETS.find(p => p.key === selectedPreset) || PRESETS[1];

  // Timer State
  const [mode, setMode] = useState("work"); // 'work' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(currentPreset.workSec);
  const [isRunning, setIsRunning] = useState(false);

  // Daily Goal State
  const [targetHours, setTargetHours] = useState(8);
  const [studiedHours, setStudiedHours] = useState(() => {
    const saved = localStorage.getItem("pomodoro_studied_today");
    return saved ? parseFloat(saved) : 4;
  });

  // Session Logs State
  const [selectedSubject, setSelectedSubject] = useState("tarih");
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem("pomodoro_completed_sessions");
    return saved ? JSON.parse(saved) : [
      { id: "s-1", time: "10:30", duration: "50 dk", mode: "work", subject: "Tarih", icon: "🏛️" },
      { id: "s-2", time: "11:30", duration: "10 dk", mode: "break", subject: "Mola", icon: "☕" },
      { id: "s-3", time: "11:40", duration: "50 dk", mode: "work", subject: "Coğrafya", icon: "🗺️" }
    ];
  });

  // Persist Studied Hours & Sessions
  useEffect(() => {
    localStorage.setItem("pomodoro_studied_today", studiedHours);
  }, [studiedHours]);

  useEffect(() => {
    localStorage.setItem("pomodoro_completed_sessions", JSON.stringify(completedSessions));
  }, [completedSessions]);

  // Timer Interval Effect
  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      const isWork = mode === "work";
      const nextMode = isWork ? "break" : "work";
      
      // Auto Log Completed Session
      const nowTime = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      const durationMin = Math.round((isWork ? currentPreset.workSec : currentPreset.breakSec) / 60);
      const subj = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];

      const newSession = {
        id: "s-" + Date.now(),
        time: nowTime,
        duration: `${durationMin} dk`,
        mode: mode,
        subject: isWork ? subj.label : "Mola",
        icon: isWork ? (selectedSubject === "tarih" ? "🏛️" : selectedSubject === "cografya" ? "🗺️" : "📚") : "☕"
      };

      setCompletedSessions(prev => [newSession, ...prev]);

      if (isWork) {
        setStudiedHours(h => parseFloat((h + durationMin / 60).toFixed(1)));
      }

      setMode(nextMode);
      setSecondsLeft(nextMode === "work" ? currentPreset.workSec : currentPreset.breakSec);

      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(isWork ? "🍅 Odak Oturumu Bitti!" : "☕ Mola Bitti!", {
            body: isWork ? "Harika iş çıkardın! Şimdi dinlenme zamanı." : "Mola bitti! Yeni odak oturumuna hazırsın."
          });
        }
      } catch {}
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, currentPreset, selectedSubject]);

  // Handle Preset Change
  const handlePresetSelect = (presetKey) => {
    const p = PRESETS.find(pr => pr.key === presetKey);
    if (p) {
      setSelectedPreset(presetKey);
      setIsRunning(false);
      setMode("work");
      setSecondsLeft(p.workSec);
    }
  };

  // Reset Timer
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === "work" ? currentPreset.workSec : currentPreset.breakSec);
  };

  // Toggle Work/Break Mode Manually
  const handleToggleMode = () => {
    setIsRunning(false);
    const nextMode = mode === "work" ? "break" : "work";
    setMode(nextMode);
    setSecondsLeft(nextMode === "work" ? currentPreset.workSec : currentPreset.breakSec);
  };

  // Formatting Time
  const totalSec = mode === "work" ? currentPreset.workSec : currentPreset.breakSec;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const progressRatio = Math.max(0, Math.min(1, secondsLeft / totalSec));

  const totalWorkDoneCount = completedSessions.filter(s => s.mode === "work").length;
  const totalBreakDoneCount = completedSessions.filter(s => s.mode === "break").length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── HEADER BANNER ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 border-slate-800"
          : "bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200"
      }`}>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-12 h-12 rounded-2xl bg-[#13d179]/10 border border-[#13d179]/20 flex items-center justify-center text-2xl shadow-lg shadow-[#13d179]/10">
                ⏱️
              </span>
              <div>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Çalışma & Pomodoro Stüdyosu
                </h2>
                <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Odaklanın, hedeflerinize ulaşın ve günlük çalışma istatistiklerinizi canlı takip edin.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="text-[10px] font-black uppercase text-slate-400">Tamamlanan</div>
              <div className="text-lg font-black text-[#13d179] mt-0.5">{totalWorkDoneCount} 🍅</div>
            </div>
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="text-[10px] font-black uppercase text-slate-400">Mola</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">{totalBreakDoneCount} ☕</div>
            </div>
            <div className={`p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="text-[10px] font-black uppercase text-slate-400">Bugün</div>
              <div className="text-lg font-black text-blue-400 mt-0.5">{studiedHours}h</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN STUDIO GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── SOL / ORTA: MAIN POMODORO TIMER CARD (col-span-7) ── */}
        <div className="lg:col-span-7 space-y-6">

          <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-300 relative overflow-hidden ${
            isDark
              ? "bg-slate-900/60 border-slate-800 shadow-2xl"
              : "bg-white border-slate-200 shadow-xl"
          }`}>

            {/* Top Bar Mode Indicator */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full animate-pulse ${
                  mode === "work" ? "bg-[#13d179]" : "bg-amber-400"
                }`} />
                <span className={`text-xs font-black uppercase tracking-wider ${
                  mode === "work" ? "text-[#13d179]" : "text-amber-400"
                }`}>
                  {mode === "work" ? "🔥 ODAK OTURUMU" : "☕ MOLA ZAMANI"}
                </span>
              </div>

              {/* Subject Tag Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 mr-1">Ders:</span>
                {SUBJECTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer border ${
                      selectedSubject === s.id
                        ? "bg-[#13d179]/15 text-[#13d179] border-[#13d179]/30"
                        : isDark
                          ? "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {PRESETS.map(p => (
                <button
                  key={p.key}
                  onClick={() => handlePresetSelect(p.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                    selectedPreset === p.key
                      ? "bg-[#13d179] text-[#0b0f19] border-[#13d179] shadow-lg shadow-[#13d179]/20"
                      : isDark
                        ? "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Timer Circular Ring */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full -rotate-90 drop-shadow-xl">
                  {/* Background Circle */}
                  <circle
                    cx="50%" cy="50%" r="42%"
                    strokeWidth="8"
                    fill="transparent"
                    className="stroke-slate-100 dark:stroke-slate-800"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50%" cy="50%" r="42%"
                    strokeWidth="8"
                    fill="transparent"
                    stroke={mode === "work" ? "#13d179" : "#f59e0b"}
                    strokeDasharray={2 * Math.PI * 115}
                    strokeDashoffset={2 * Math.PI * 115 * (1 - progressRatio)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className={`text-4xl md:text-5xl font-black tracking-tight tabular-nums ${
                    mode === "work" ? "text-[#13d179]" : "text-amber-400"
                  }`}>
                    {formattedMinutes}:{formattedSeconds}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                    {mode === "work" ? `${currentPreset.workSec / 60} DAKİKA ODAK` : `${currentPreset.breakSec / 60} DAKİKA MOLA`}
                  </span>
                  {isRunning && (
                    <span className="mt-2 text-[10px] font-black px-3 py-0.5 rounded-full bg-[#13d179]/10 text-[#13d179] border border-[#13d179]/20 animate-pulse">
                      ⏳ Sayaç Akıyor…
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Control Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {/* Reset */}
              <button
                onClick={handleReset}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
                    : "bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600"
                }`}
                title="Sıfırla"
              >
                <LuRotateCcw size={18} />
              </button>

              {/* Main Play / Pause */}
              <button
                onClick={() => setIsRunning(r => !r)}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition cursor-pointer shadow-xl hover:scale-105 active:scale-95 ${
                  mode === "work"
                    ? "bg-[#13d179] text-[#0b0f19] shadow-[#13d179]/25 hover:bg-emerald-400"
                    : "bg-amber-400 text-[#0b0f19] shadow-amber-400/25 hover:bg-amber-300"
                }`}
              >
                {isRunning ? <LuPause size={32} /> : <LuPlay size={32} className="ml-1" />}
              </button>

              {/* Toggle Mode */}
              <button
                onClick={handleToggleMode}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer border ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-[#13d179]"
                    : "bg-slate-100 border-slate-200 text-slate-500 hover:text-[#13d179]"
                }`}
                title="Odak / Mola Değiştir"
              >
                {mode === "work" ? <LuCoffee size={18} /> : <LuFlame size={18} />}
              </button>
            </div>

          </div>

        </div>

        {/* ── SAĞ: DAILY GOAL & LOGS PANEL (col-span-5) ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* ══ GÜNLÜK HEDEF KARTI ══ */}
          <div className={`rounded-2xl border p-6 transition-all ${
            isDark ? "bg-slate-900/60 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <LuTarget size={14} className="text-[#13d179]" />
                Günlük Hedef Süre
              </span>
              <span className="text-xs font-black text-[#13d179] px-2.5 py-0.5 rounded-full bg-[#13d179]/10 border border-[#13d179]/20">
                Hedef: {targetHours} Saat
              </span>
            </div>

            {/* Hedef İlerleme Çubuğu */}
            <div className="space-y-2 my-4">
              <div className="flex justify-between text-xs font-bold">
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>Tamamlanan: {studiedHours} saat</span>
                <span className="text-slate-400">%{Math.min(100, Math.round((studiedHours / targetHours) * 100))}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#13d179] to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (studiedHours / targetHours) * 100)}%` }}
                />
              </div>
            </div>

            {/* Hedef Ayar Butonları */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-semibold text-slate-400">Süreyi Düzenle:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStudiedHours(h => Math.max(0, parseFloat((h - 0.5).toFixed(1))))}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-400 transition cursor-pointer font-bold"
                  title="0.5 Saat Azalt"
                >
                  <LuMinus size={12} />
                </button>
                <span className="text-sm font-black w-10 text-center tabular-nums">{studiedHours}s</span>
                <button
                  onClick={() => setStudiedHours(h => parseFloat((h + 0.5).toFixed(1)))}
                  className="w-8 h-8 rounded-xl bg-[#13d179] text-[#0b0f19] flex items-center justify-center hover:bg-emerald-400 transition cursor-pointer font-bold"
                  title="0.5 Saat Ekle"
                >
                  <LuPlus size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* ══ GEÇMİŞ OTURUM LOGLARI ══ */}
          <div className={`rounded-2xl border p-6 transition-all ${
            isDark ? "bg-slate-900/60 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-lg"
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <LuCalendar size={14} className="text-amber-400" />
                Bugünün Oturum Geçmişi
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {completedSessions.length} Oturum
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {completedSessions.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Henüz oturum tamamlanmadı. İlk Pomodoro'yu başlat! 🚀
                </div>
              ) : (
                completedSessions.map(s => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      s.mode === "work"
                        ? isDark
                          ? "bg-emerald-500/5 border-emerald-500/15 text-slate-200"
                          : "bg-emerald-50 border-emerald-100 text-slate-800"
                        : isDark
                          ? "bg-amber-500/5 border-amber-500/15 text-slate-200"
                          : "bg-amber-50 border-amber-100 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{s.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{s.subject}</div>
                        <div className="text-[10px] text-slate-400">{s.time}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                      s.mode === "work"
                        ? "bg-[#13d179]/15 text-[#13d179]"
                        : "bg-amber-400/15 text-amber-500"
                    }`}>
                      {s.duration}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PomodoroTab;
