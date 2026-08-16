import React, { useState, useEffect, useMemo } from "react";
import { KPSS_ANALIZ_SUBJECTS } from "../../data/kpssDenemeAnalizData";
import {
  LuSparkles, LuSearch, LuRotateCcw,
  LuFileText, LuTarget
} from "react-icons/lu";

const CELL_STATES = {
  EMPTY: "",   // Default / Doğru / Sorun Yok
  WRONG: "X",  // Yanlış / Zayıf Nokta (Red)
  UNSURE: "?"  // Emin Değildim / Tekrar Eksikliği (Yellow)
};

const DenemeAnalizCizelgesi = ({ theme, initialSubjectId = "vatandaslik" }) => {
  const isDark = theme === "dark";

  // Selected subject state
  const [activeSubjectId, setActiveSubjectId] = useState(initialSubjectId);

  // Analysis data state per subject: { [subjectId]: { topicStates: { [topicId]: { [denemeNum]: "X" | "?" | "" } }, notes: "" } }
  const [analizData, setAnalizData] = useState(() => {
    const saved = localStorage.getItem("kpss_deneme_analiz_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading deneme analiz data", e);
      }
    }
    return {};
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("kpss_deneme_analiz_v1", JSON.stringify(analizData));
  }, [analizData]);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'wrong', 'unsure', 'clean'
  const [tagFilter, setTagFilter] = useState("all"); // 'all', 'star', 'critical', 'caution'

  const activeSubject = useMemo(() => {
    return KPSS_ANALIZ_SUBJECTS.find(s => s.id === activeSubjectId) || KPSS_ANALIZ_SUBJECTS[0];
  }, [activeSubjectId]);

  // Get current topic states for active subject
  const currentSubjectData = analizData[activeSubjectId]?.topicStates || {};
  const currentNotes = analizData[activeSubjectId]?.notes || "";

  // Cycle topic status for a specific deneme column
  const toggleCellStatus = (topicId, denemeNum) => {
    setAnalizData(prev => {
      const subjectState = prev[activeSubjectId] || { topicStates: {}, notes: "" };
      const topicState = subjectState.topicStates[topicId] || {};
      const currentVal = topicState[denemeNum] || CELL_STATES.EMPTY;

      let nextVal = CELL_STATES.EMPTY;
      if (currentVal === CELL_STATES.EMPTY) nextVal = CELL_STATES.WRONG;
      else if (currentVal === CELL_STATES.WRONG) nextVal = CELL_STATES.UNSURE;
      else if (currentVal === CELL_STATES.UNSURE) nextVal = CELL_STATES.EMPTY;

      return {
        ...prev,
        [activeSubjectId]: {
          ...subjectState,
          topicStates: {
            ...subjectState.topicStates,
            [topicId]: {
              ...topicState,
              [denemeNum]: nextVal
            }
          }
        }
      };
    });
  };

  // Update notes
  const handleNotesChange = (text) => {
    setAnalizData(prev => ({
      ...prev,
      [activeSubjectId]: {
        ...(prev[activeSubjectId] || { topicStates: {} }),
        notes: text
      }
    }));
  };

  // Reset current subject data
  const handleResetSubject = () => {
    if (window.confirm(`${activeSubject.title} dersi için girdiğiniz tüm deneme işaretlemelerini sıfırlamak istediğinize emin misiniz?`)) {
      setAnalizData(prev => ({
        ...prev,
        [activeSubjectId]: {
          topicStates: {},
          notes: ""
        }
      }));
    }
  };

  // Compute live analytical highlights for active subject
  const analytics = useMemo(() => {
    const topicStats = [];

    activeSubject.units.forEach(unit => {
      unit.topics.forEach(topic => {
        const topicState = currentSubjectData[topic.id] || {};
        let wrongCount = 0;
        let unsureCount = 0;
        let totalSolves = 0;

        for (let d = 1; d <= 10; d++) {
          const val = topicState[d];
          if (val === CELL_STATES.WRONG) wrongCount++;
          if (val === CELL_STATES.UNSURE) unsureCount++;
          if (val) totalSolves++;
        }

        topicStats.push({
          ...topic,
          unitName: unit.name,
          wrongCount,
          unsureCount,
          hasErrors: wrongCount > 0 || unsureCount > 0
        });
      });
    });

    // Top Weak Topics (Most X)
    const weakTopics = [...topicStats]
      .filter(t => t.wrongCount > 0)
      .sort((a, b) => b.wrongCount - a.wrongCount);

    // Top Revision Topics (Most ?)
    const revisionTopics = [...topicStats]
      .filter(t => t.unsureCount > 0)
      .sort((a, b) => b.unsureCount - a.unsureCount);

    // Mastered Topics (0 X, 0 ?)
    const masteredTopics = topicStats.filter(t => !t.hasErrors);

    return {
      totalTopics: topicStats.length,
      weakTopics,
      revisionTopics,
      masteredCount: masteredTopics.length,
      topicStatsMap: Object.fromEntries(topicStats.map(t => [t.id, t]))
    };
  }, [activeSubject, currentSubjectData]);

  // Filter topics
  const filteredUnits = useMemo(() => {
    return activeSubject.units.map(unit => {
      const matchingTopics = unit.topics.filter(topic => {
        // Search filter
        const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.num.includes(searchQuery);

        if (!matchesSearch) return false;

        // Tag filter
        if (tagFilter === "star" && !topic.tags.some(t => t.startsWith("star"))) return false;
        if (tagFilter === "critical" && !topic.tags.includes("critical")) return false;
        if (tagFilter === "caution" && !topic.tags.includes("caution")) return false;

        // Status filter
        const stat = analytics.topicStatsMap[topic.id];
        if (statusFilter === "wrong" && stat.wrongCount === 0) return false;
        if (statusFilter === "unsure" && stat.unsureCount === 0) return false;
        if (statusFilter === "clean" && stat.hasErrors) return false;

        return true;
      });

      return {
        ...unit,
        topics: matchingTopics
      };
    }).filter(unit => unit.topics.length > 0);
  }, [activeSubject, searchQuery, tagFilter, statusFilter, analytics]);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ══ BANNER & TEACHER CREDIT HEADER ══ */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 bg-gradient-to-r ${activeSubject.headerBg} ${
        isDark ? "border-slate-800" : "border-slate-300 shadow-lg"
      }`}>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border tracking-wider ${activeSubject.badgeBg}`}>
                ⭐ ÖSYM Müfredat Uyumlu Dijital Çizelge
              </span>
              <span className="text-xs text-purple-400 font-extrabold flex items-center gap-1">
                <LuSparkles size={14} /> 10 Deneme Takibi
              </span>
            </div>
            
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {activeSubject.fullTitle}
            </h2>

            <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-slate-300">
              <span>Hazırlayan: <strong className="text-amber-400">Psikolojik Danışman MEHMET ALİ AYHAN</strong></span>
              <span>•</span>
              <a
                href="https://instagram.com/Psk_dan.mehmetaliayhan"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                📸 @Psk_dan.mehmetaliayhan
              </a>
            </div>
          </div>

          {/* Slogan Badge */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center shrink-0">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parola</div>
            <div className="text-sm font-black bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 bg-clip-text text-transparent mt-0.5">
              İstikrar, Plan, Analiz = BAŞARI!
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium italic">"Sen Yaparsın! ♡"</div>
          </div>
        </div>

        {/* ══ SUBJECT NAVIGATION TABS ══ */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-700/60 overflow-x-auto pb-1 scrollbar-thin">
          {KPSS_ANALIZ_SUBJECTS.map(subj => {
            const isActive = subj.id === activeSubjectId;
            return (
              <button
                key={subj.id}
                onClick={() => setActiveSubjectId(subj.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-white text-slate-900 border-white shadow-lg scale-105"
                    : isDark
                      ? "bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                      : "bg-slate-800/20 text-slate-200 border-slate-700 hover:bg-slate-800/40"
                }`}
              >
                <span className="text-base">{subj.icon}</span>
                <span>{subj.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ SMART ANALYTICS DASHBOARD (ANALİZİNİ DOĞRU YAP!) ══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Weak Points (Zayıf Noktan) */}
        <div className={`p-5 rounded-2xl border transition ${
          isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center text-lg font-bold">
                🎯
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-400">En Çok ✗ Olan Konular</h4>
                <div className="text-[11px] font-bold text-slate-400">ZAYIF NOKTAN!</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              {analytics.weakTopics.length} Konu
            </span>
          </div>

          {analytics.weakTopics.length === 0 ? (
            <div className="p-4 text-center text-xs font-bold text-emerald-400 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
              🎉 Harika! Henüz bu derste belirgin zayıf noktan yok.
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {analytics.weakTopics.slice(0, 5).map(t => (
                <div key={t.id} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 truncate max-w-[200px]" title={t.name}>
                    {t.num} {t.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-black text-[10px]">
                    {t.wrongCount} Yanlış (✗)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Revision Needed (Tekrar Eksikliğin) */}
        <div className={`p-5 rounded-2xl border transition ${
          isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-lg font-bold">
                ❓
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">En Çok ? Olan Konular</h4>
                <div className="text-[11px] font-bold text-slate-400">TEKRAR EKSİKLİĞİN!</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {analytics.revisionTopics.length} Konu
            </span>
          </div>

          {analytics.revisionTopics.length === 0 ? (
            <div className="p-4 text-center text-xs font-bold text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700/50">
              👍 Emin olunmayan konu bulunmuyor.
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {analytics.revisionTopics.slice(0, 5).map(t => (
                <div key={t.id} className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 truncate max-w-[200px]" title={t.name}>
                    {t.num} {t.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                    {t.unsureCount} Emin Değildin (?)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Mastered Topics (O Konu Tamam!) */}
        <div className={`p-5 rounded-2xl border transition ${
          isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-lg font-bold">
                ✅
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Hiç Hata Yoksa</h4>
                <div className="text-[11px] font-bold text-slate-400">O KONU TAMAM!</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {analytics.masteredCount} / {analytics.totalTopics}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-2xl font-black text-emerald-400">
              %{Math.round((analytics.masteredCount / (analytics.totalTopics || 1)) * 100)}
            </div>
            <div className="text-xs font-bold text-slate-300 mt-1">Konu Hakimiyet Oranı</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((analytics.masteredCount / (analytics.totalTopics || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ══ LEGEND & CONTROLS TOOLBAR ══ */}
      <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
        
        {/* Guide / Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          
          {/* Cell Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">Tıklama Kılavuzu:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span>✓ DOĞRU / SORUN YOK</span>
              <span className="text-[10px] opacity-60">(Varsayılan)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <span className="font-black">✗ YANLIŞ</span>
              <span className="text-[10px] opacity-60">(Kırmızı)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <span className="font-black">? EMİN DEĞİLDİN</span>
              <span className="text-[10px] opacity-60">(Sarı)</span>
            </div>
          </div>

          {/* Symbol Badges Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              ⭐ EN ÇOK ÇIKAN KONULAR
            </span>
            <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              🔥 KRİTİK KONULAR
            </span>
            <span className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              ⚠️ DİKKAT EDİLMESİ GEREKENLER
            </span>
          </div>

        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`${activeSubject.title} konularında ara...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500"
              }`}
            />
          </div>

          {/* Status & Tag Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border outline-none ${
                isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="wrong">Sadece Yanlışlar (✗)</option>
              <option value="unsure">Sadece Emin Olunmayanlar (?)</option>
              <option value="clean">Sadece Tamamlananlar (✓)</option>
            </select>

            <select
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border outline-none ${
                isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            >
              <option value="all">Tüm Semboller</option>
              <option value="star">⭐ Çok Çıkanlar</option>
              <option value="critical">🔥 Kritik Konular</option>
              <option value="caution">⚠️ Dikkat Edilecekler</option>
            </select>

            <button
              onClick={handleResetSubject}
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer flex items-center gap-1.5 ml-auto sm:ml-0"
              title="Bu dersin verilerini sıfırla"
            >
              <LuRotateCcw size={14} /> Sıfırla
            </button>
          </div>

        </div>

      </div>

      {/* ══ MAIN INTERACTIVE GRID TABLE ══ */}
      <div className={`rounded-2xl border overflow-hidden transition ${
        isDark ? "bg-slate-900/80 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-md"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header: 10 Deneme Columns */}
            <thead>
              <tr className={`border-b text-[11px] font-black uppercase tracking-wider ${
                isDark ? "bg-slate-950/80 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
              }`}>
                <th className="py-3.5 px-4 min-w-[280px]">🎯 KONULAR</th>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <th key={num} className="py-3.5 px-1.5 text-center min-w-[50px] border-l border-slate-200 dark:border-slate-800/60">
                    <div className="text-[10px] opacity-60">{num}.</div>
                    <div>DENEME</div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body: Units & Topics */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-bold">
                    Aradığınız kriterlere uygun konu bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUnits.map(unit => (
                  <React.Fragment key={unit.name}>
                    
                    {/* Unit Header Row */}
                    <tr className={`font-black uppercase text-[11px] tracking-wider ${
                      isDark ? "bg-slate-800/80 text-purple-300 border-t border-b border-purple-500/20" : "bg-purple-50 text-purple-900 border-t border-b border-purple-200"
                    }`}>
                      <td colSpan={11} className="py-2.5 px-4 flex items-center gap-2">
                        <span>{unit.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                          {unit.topics.length} Konu
                        </span>
                      </td>
                    </tr>

                    {/* Topic Rows */}
                    {unit.topics.map(topic => {
                      const topicState = currentSubjectData[topic.id] || {};

                      return (
                        <tr
                          key={topic.id}
                          className={`hover:bg-slate-500/10 transition ${
                            isDark ? "even:bg-slate-900/30" : "even:bg-slate-50/50"
                          }`}
                        >
                          {/* Topic Title & Badges */}
                          <td className="py-2.5 px-4 font-bold text-slate-200">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-400 font-mono text-[11px] shrink-0">{topic.num}</span>
                              <span className={isDark ? "text-slate-200" : "text-slate-800"}>{topic.name}</span>

                              {/* Tags */}
                              <div className="flex items-center gap-1 shrink-0">
                                {topic.tags.map((tag, idx) => {
                                  if (tag === "star" || tag.startsWith("star")) {
                                    const starCount = tag === "star3" ? 3 : tag === "star2" ? 2 : 1;
                                    return (
                                      <span key={idx} className="text-amber-400 font-black text-xs" title="En Çok Çıkan Konu">
                                        {"⭐".repeat(starCount)}
                                      </span>
                                    );
                                  }
                                  if (tag === "critical") {
                                    return (
                                      <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-0.5" title="Kritik Konu">
                                        🔥 KRİTİK
                                      </span>
                                    );
                                  }
                                  if (tag === "caution") {
                                    return (
                                      <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-0.5" title="Dikkat Edilmesi Gerekenler">
                                        ⚠️ DİKKAT
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                          </td>

                          {/* 10 Deneme Interactive Cells */}
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(denemeNum => {
                            const val = topicState[denemeNum] || CELL_STATES.EMPTY;

                            return (
                              <td
                                key={denemeNum}
                                onClick={() => toggleCellStatus(topic.id, denemeNum)}
                                className={`py-1 px-1 text-center border-l border-slate-200 dark:border-slate-800/60 cursor-pointer select-none transition ${
                                  val === CELL_STATES.WRONG
                                    ? "bg-rose-500/25 hover:bg-rose-500/35 text-rose-400 font-black text-sm"
                                    : val === CELL_STATES.UNSURE
                                      ? "bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 font-black text-sm"
                                      : "hover:bg-slate-500/20 text-emerald-400/40 hover:text-emerald-400"
                                }`}
                                title={`Deneme #${denemeNum} - ${topic.name}: Tıkla ve Durumu Değiştir (${val || "✓ Doğru"})`}
                              >
                                {val === CELL_STATES.WRONG && "✗"}
                                {val === CELL_STATES.UNSURE && "?"}
                                {val === CELL_STATES.EMPTY && <span className="opacity-20 text-[10px]">✓</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ KÜÇÜK NOTLAR PANEL (MATCHING THE ORIGINAL POSTER) ══ */}
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-md"}`}>
        <div className="flex items-center gap-2 mb-3">
          <LuFileText size={18} className="text-purple-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
            {activeSubject.title} — KÜÇÜK NOTLAR & ÖZEL TALİMATLAR
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Bu dersle ilgili denemelerde sık yaptığın hataları, unutulmaması gereken formülleri veya hoca notlarını buraya kaydedebilirsin.
        </p>
        <textarea
          rows={3}
          value={currentNotes}
          onChange={e => handleNotesChange(e.target.value)}
          placeholder={`Örn: ${activeSubject.title} denemelerinde süreye dikkat et, kavram karıştırmalarını engellemek için kodlama notlarını tekrar et...`}
          className={`w-full p-3 text-xs rounded-xl border outline-none transition ${
            isDark
              ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500"
              : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500"
          }`}
        />
      </div>

      {/* ══ FOOTER MOTIVATIONAL CARD ══ */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-rose-500/10 to-amber-500/10 border border-purple-500/20 text-center text-xs font-bold text-slate-300">
        📌 UNUTMA: PLAN YAPMAK KOLAYDIR, ÖNEMLİ OLAN PLANINA UYMAKTIR! ⭐ HER DENEMEDEN SONRA ANALİZ YAP, EKSİKLERİNİ KAPAT, HEDEFİNE ADIM ADIM YAKLAŞ! 🎯
      </div>

    </div>
  );
};

export default DenemeAnalizCizelgesi;
