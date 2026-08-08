import React, { useState, useEffect, useMemo, useCallback } from "react";
import tarihKartlari, { kategoriMeta } from "../../data/tarihKartlari";

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
const FlipIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" />
    <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ShuffleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const CardStackIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 3H8l-2 4h16l-2-4z" />
  </svg>
);

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
const TarihKartlariTab = ({ theme }) => {
  const isDark = theme === "dark";

  // State
  const [activeKategori, setActiveKategori] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // card | grid
  const [onlySinavda, setOnlySinavda] = useState(false);
  const [masteredCards, setMasteredCards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tarih_mastered") || "[]");
    } catch { return []; }
  });
  const [starredCards, setStarredCards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tarih_starred") || "[]");
    } catch { return []; }
  });
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);
  const [zorlukFilter, setZorlukFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Persist
  useEffect(() => {
    localStorage.setItem("tarih_mastered", JSON.stringify(masteredCards));
  }, [masteredCards]);
  useEffect(() => {
    localStorage.setItem("tarih_starred", JSON.stringify(starredCards));
  }, [starredCards]);

  // Filtered cards
  const filteredCards = useMemo(() => {
    let cards = [...tarihKartlari];
    if (activeKategori !== "all") cards = cards.filter(c => c.kategori === activeKategori);
    if (onlySinavda) cards = cards.filter(c => c.sinavdaCikabilir);
    if (showOnlyStarred) cards = cards.filter(c => starredCards.includes(c.id));
    if (zorlukFilter !== "all") cards = cards.filter(c => c.zorluk === zorlukFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(c =>
        c.baslik.toLowerCase().includes(q) ||
        c.icerik.toLowerCase().includes(q) ||
        c.kategori.toLowerCase().includes(q)
      );
    }
    return cards;
  }, [activeKategori, onlySinavda, showOnlyStarred, starredCards, zorlukFilter, searchQuery]);

  const currentCard = filteredCards[currentIndex];

  // Navigation
  const goNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(i => (i + 1) % filteredCards.length), 150);
  }, [filteredCards.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(i => (i - 1 + filteredCards.length) % filteredCards.length), 150);
  }, [filteredCards.length]);

  const shuffleCards = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  }, [filteredCards.length]);

  // Reset index when filter changes
  useEffect(() => { setCurrentIndex(0); setIsFlipped(false); }, [activeKategori, onlySinavda, showOnlyStarred, zorlukFilter, searchQuery]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); setIsFlipped(f => !f); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const toggleMastered = (id) => {
    setMasteredCards(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleStarred = (id) => {
    setStarredCards(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const kategoriler = useMemo(() => {
    const cats = [...new Set(tarihKartlari.map(c => c.kategori))];
    return cats;
  }, []);

  const progressPercent = tarihKartlari.length > 0
    ? Math.round((masteredCards.length / tarihKartlari.length) * 100) : 0;

  // Zorluk badge renkleri
  const zorlukRenk = {
    kolay: { bg: isDark ? "bg-emerald-500/15" : "bg-emerald-100", text: isDark ? "text-emerald-400" : "text-emerald-700", border: isDark ? "border-emerald-500/30" : "border-emerald-200" },
    orta: { bg: isDark ? "bg-amber-500/15" : "bg-amber-100", text: isDark ? "text-amber-400" : "text-amber-700", border: isDark ? "border-amber-500/30" : "border-amber-200" },
    zor: { bg: isDark ? "bg-rose-500/15" : "bg-rose-100", text: isDark ? "text-rose-400" : "text-rose-700", border: isDark ? "border-rose-500/30" : "border-rose-200" },
  };

  // Color tokens
  const t = {
    bg: isDark ? "bg-[#090e1a]" : "bg-slate-50",
    cardBg: isDark ? "bg-[#0f1525]/90" : "bg-white",
    cardBorder: isDark ? "border-white/[0.06]" : "border-black/[0.06]",
    text1: isDark ? "text-white/90" : "text-slate-900",
    text2: isDark ? "text-white/50" : "text-slate-500",
    text3: isDark ? "text-white/30" : "text-slate-400",
    btnBg: isDark ? "bg-white/[0.04]" : "bg-black/[0.03]",
    btnHover: isDark ? "hover:bg-white/[0.08]" : "hover:bg-black/[0.06]",
    btnActive: isDark ? "bg-white/[0.10]" : "bg-black/[0.08]",
    inputBg: isDark ? "bg-white/[0.03]" : "bg-black/[0.02]",
    inputBorder: isDark ? "border-white/[0.06]" : "border-black/[0.08]",
  };

  return (
    <div className="animate-fade-in pb-16 w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className={`rounded-[28px] p-6 md:p-8 mb-6 border relative overflow-hidden ${isDark ? "bg-gradient-to-br from-orange-500/[0.08] via-red-500/[0.05] to-purple-500/[0.08] border-white/5" : "bg-gradient-to-br from-orange-50 via-red-50/50 to-purple-50 border-orange-100/50"}`}>
        {/* Decorative */}
        <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-25 ${isDark ? "bg-orange-500" : "bg-orange-300"}`}></div>
        <div className={`absolute -left-16 -bottom-16 w-56 h-56 rounded-full blur-3xl opacity-25 ${isDark ? "bg-red-500" : "bg-red-300"}`}></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">📚</span>
                <h1 className={`text-[26px] md:text-[30px] font-black tracking-tight ${t.text1}`}>
                  KPSS Tarih Kartları
                </h1>
              </div>
              <p className={`text-[13px] leading-relaxed max-w-xl ${t.text2}`}>
                Ahmet Uğur Karakuza – Yediiklim Yayıncılık | 2026 KPSS Atölye Serisi & Genel Tekrar Kampı ders notlarından derlenmiştir. 
                <span className="font-bold text-orange-500"> ⭐ Sınavda çıkabilir </span> işaretli kartlara dikkat!
              </p>
            </div>

            {/* Stats mini cards */}
            <div className="flex gap-3 shrink-0">
              <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-white/[0.03] border-white/5" : "bg-white border-black/5"}`}>
                <div className={`text-xl font-black ${t.text1}`}>{tarihKartlari.length}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${t.text3}`}>Toplam Kart</div>
              </div>
              <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"}`}>
                <div className={`text-xl font-black ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{masteredCards.length}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-emerald-500/60" : "text-emerald-600/60"}`}>Öğrenildi</div>
              </div>
              <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-orange-500/10 border-orange-500/20" : "bg-orange-50 border-orange-100"}`}>
                <div className={`text-xl font-black ${isDark ? "text-orange-400" : "text-orange-600"}`}>{tarihKartlari.filter(c => c.sinavdaCikabilir).length}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-orange-500/60" : "text-orange-600/60"}`}>Çıkabilir</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold ${t.text2}`}>Genel İlerleme</span>
              <span className={`text-[11px] font-black ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>{progressPercent}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={`rounded-2xl p-4 mb-5 border ${isDark ? "bg-white/[0.015] border-white/5" : "bg-white border-black/[0.04]"}`}>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.text3}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Kart ara... (konu, tarih, olay)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${t.inputBg} ${t.inputBorder} ${t.text1} placeholder:${t.text3} focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Zorluk Filter */}
            <select
              value={zorlukFilter}
              onChange={e => setZorlukFilter(e.target.value)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer focus:outline-none ${t.btnBg} ${t.cardBorder} ${t.text1}`}
            >
              <option value="all">Tüm Zorluklar</option>
              <option value="kolay">🟢 Kolay</option>
              <option value="orta">🟡 Orta</option>
              <option value="zor">🔴 Zor</option>
            </select>

            {/* Toggle buttons */}
            <button
              onClick={() => setOnlySinavda(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                onlySinavda
                  ? isDark ? "bg-orange-500/15 border-orange-500/30 text-orange-400" : "bg-orange-100 border-orange-200 text-orange-700"
                  : `${t.btnBg} ${t.cardBorder} ${t.text2} ${t.btnHover}`
              }`}
            >
              <FireIcon /> Çıkabilir
            </button>

            <button
              onClick={() => setShowOnlyStarred(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showOnlyStarred
                  ? isDark ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400" : "bg-yellow-100 border-yellow-200 text-yellow-700"
                  : `${t.btnBg} ${t.cardBorder} ${t.text2} ${t.btnHover}`
              }`}
            >
              <StarIcon filled={showOnlyStarred} /> Yıldızlı
            </button>

            {/* View mode */}
            <div className={`flex items-center rounded-xl border overflow-hidden ${t.cardBorder}`}>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2.5 transition-all cursor-pointer ${viewMode === "card" ? (isDark ? "bg-white/10 text-white" : "bg-black/10 text-black") : `${t.btnBg} ${t.text2}`}`}
              >
                <CardStackIcon />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-all cursor-pointer ${viewMode === "grid" ? (isDark ? "bg-white/10 text-white" : "bg-black/10 text-black") : `${t.btnBg} ${t.text2}`}`}
              >
                <GridIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveKategori("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            activeKategori === "all"
              ? isDark ? "bg-white/10 text-white border-white/15 shadow-lg" : "bg-black/10 text-black border-black/10 shadow-sm"
              : `${t.btnBg} ${t.text2} ${t.cardBorder} ${t.btnHover}`
          }`}
        >
          📋 Tümü ({tarihKartlari.length})
        </button>
        {kategoriler.map(kat => {
          const meta = kategoriMeta[kat] || { renk: "#666", ikon: "📄" };
          const count = tarihKartlari.filter(c => c.kategori === kat).length;
          const isActive = activeKategori === kat;
          return (
            <button
              key={kat}
              onClick={() => setActiveKategori(kat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? `shadow-lg`
                  : `${t.btnBg} ${t.cardBorder} ${t.btnHover}`
              }`}
              style={isActive ? {
                backgroundColor: `${meta.renk}20`,
                borderColor: `${meta.renk}40`,
                color: meta.renk
              } : {
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
              }}
            >
              {meta.ikon} {kat} ({count})
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      {filteredCards.length === 0 ? (
        <div className={`text-center py-20 rounded-3xl border ${isDark ? "bg-white/[0.01] border-white/5" : "bg-white border-black/5"}`}>
          <span className="text-4xl block mb-4">🔍</span>
          <p className={`text-lg font-bold ${t.text1}`}>Kart bulunamadı</p>
          <p className={`text-sm mt-1 ${t.text2}`}>Filtrelerinizi değiştirmeyi deneyin.</p>
        </div>
      ) : viewMode === "card" ? (
        /* ═══════════════ CARD VIEW ═══════════════ */
        <div className="flex flex-col items-center">
          {/* Card counter */}
          <div className={`flex items-center gap-3 mb-5 ${t.text2}`}>
            <span className="text-xs font-bold">{currentIndex + 1} / {filteredCards.length}</span>
            <div className={`flex gap-1`}>
              {filteredCards.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex ? "w-6 bg-orange-500" : `w-1.5 ${isDark ? "bg-white/10" : "bg-black/10"}`
                  }`}
                  onClick={() => { setIsFlipped(false); setCurrentIndex(i); }}
                />
              ))}
            </div>
          </div>

          {/* The Card */}
          <div className="relative w-full max-w-2xl" style={{ perspective: "1200px" }}>
            <div
              onClick={() => setIsFlipped(f => !f)}
              className="cursor-pointer w-full transition-transform duration-500 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                minHeight: "380px",
              }}
            >
              {/* FRONT SIDE */}
              <div
                className={`absolute inset-0 rounded-[28px] border p-7 md:p-9 flex flex-col ${t.cardBg} ${t.cardBorder} shadow-2xl`}
                style={{ backfaceVisibility: "hidden" }}
              >
                {currentCard && (
                  <>
                    {/* Top bar */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                          style={{
                            backgroundColor: `${(kategoriMeta[currentCard.kategori]?.renk || "#666")}15`,
                            borderColor: `${(kategoriMeta[currentCard.kategori]?.renk || "#666")}30`,
                            color: kategoriMeta[currentCard.kategori]?.renk || "#666"
                          }}
                        >
                          {kategoriMeta[currentCard.kategori]?.ikon} {currentCard.kategori}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${zorlukRenk[currentCard.zorluk]?.bg} ${zorlukRenk[currentCard.zorluk]?.text} ${zorlukRenk[currentCard.zorluk]?.border}`}>
                          {currentCard.zorluk === "kolay" ? "🟢" : currentCard.zorluk === "orta" ? "🟡" : "🔴"} {currentCard.zorluk.charAt(0).toUpperCase() + currentCard.zorluk.slice(1)}
                        </span>
                        {currentCard.sinavdaCikabilir && (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${isDark ? "bg-orange-500/15 border-orange-500/25 text-orange-400" : "bg-orange-100 border-orange-200 text-orange-600"}`}>
                            🔥 Çıkabilir
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={e => { e.stopPropagation(); toggleStarred(currentCard.id); }}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            starredCards.includes(currentCard.id) ? "text-yellow-400" : `${t.text3} ${t.btnHover}`
                          }`}
                        >
                          <StarIcon filled={starredCards.includes(currentCard.id)} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); toggleMastered(currentCard.id); }}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            masteredCards.includes(currentCard.id) ? (isDark ? "text-emerald-400 bg-emerald-500/15" : "text-emerald-600 bg-emerald-100") : `${t.text3} ${t.btnHover}`
                          }`}
                        >
                          <CheckIcon />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className={`text-[22px] md:text-[26px] font-black tracking-tight leading-tight mb-5 ${t.text1}`}>
                      {currentCard.baslik}
                    </h2>

                    {/* Content */}
                    <div className={`flex-1 text-[13px] md:text-[14px] leading-[1.9] font-medium whitespace-pre-line ${isDark ? "text-white/70" : "text-slate-600"}`}>
                      {currentCard.icerik}
                    </div>

                    {/* Footer hint */}
                    <div className={`mt-5 pt-4 border-t flex items-center justify-between ${isDark ? "border-white/5" : "border-black/5"}`}>
                      <div className="flex items-center gap-1.5">
                        <FlipIcon />
                        <span className={`text-[11px] font-bold ${t.text3}`}>Kartı çevir → İpucu</span>
                      </div>
                      {currentCard.soruSayisi && currentCard.soruSayisi !== "-" && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? "bg-white/5 text-white/30" : "bg-black/5 text-black/30"}`}>
                          ~{currentCard.soruSayisi} soru/yıl
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* BACK SIDE */}
              <div
                className={`absolute inset-0 rounded-[28px] border p-7 md:p-9 flex flex-col items-center justify-center text-center ${t.cardBorder} shadow-2xl`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: isDark
                    ? `linear-gradient(135deg, ${(kategoriMeta[currentCard?.kategori]?.renk || "#666")}10, #0f1525)`
                    : `linear-gradient(135deg, ${(kategoriMeta[currentCard?.kategori]?.renk || "#666")}08, white)`
                }}
              >
                {currentCard && (
                  <>
                    <div className="mb-6">
                      <span className="text-4xl block mb-3">💡</span>
                      <h3 className={`text-lg font-black ${t.text1}`}>Hocanın İpucu</h3>
                    </div>
                    <p className={`text-[15px] md:text-[16px] font-bold leading-relaxed max-w-md ${isDark ? "text-white/80" : "text-slate-700"}`}>
                      "{currentCard.ipucu}"
                    </p>
                    <p className={`mt-6 text-[11px] font-bold ${t.text3}`}>
                      <FlipIcon /> Geri dönmek için tıklayın
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6">
            <button onClick={goPrev} className={`p-3 rounded-2xl border transition-all cursor-pointer ${t.btnBg} ${t.cardBorder} ${t.text2} ${t.btnHover} hover:scale-105 active:scale-95`}>
              <ChevronLeftIcon />
            </button>
            <button onClick={shuffleCards} className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${t.btnBg} ${t.cardBorder} ${t.text2} ${t.btnHover} hover:scale-105 active:scale-95`}>
              <ShuffleIcon /> Karıştır
            </button>
            <button onClick={goNext} className={`p-3 rounded-2xl border transition-all cursor-pointer ${t.btnBg} ${t.cardBorder} ${t.text2} ${t.btnHover} hover:scale-105 active:scale-95`}>
              <ChevronRightIcon />
            </button>
          </div>

          {/* Keyboard hint */}
          <p className={`mt-4 text-[10px] font-bold tracking-wide ${t.text3}`}>
            ← → ok tuşları ile gezin &nbsp;|&nbsp; Space ile çevirin
          </p>
        </div>
      ) : (
        /* ═══════════════ GRID VIEW ═══════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCards.map(card => {
            const meta = kategoriMeta[card.kategori] || { renk: "#666", ikon: "📄" };
            const isMastered = masteredCards.includes(card.id);
            const isStarred = starredCards.includes(card.id);
            return (
              <div
                key={card.id}
                className={`group rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 relative overflow-hidden ${
                  isMastered
                    ? isDark ? "bg-emerald-500/[0.04] border-emerald-500/15" : "bg-emerald-50/50 border-emerald-200/50"
                    : `${t.cardBg} ${t.cardBorder}`
                } hover:shadow-xl`}
                onClick={() => {
                  setViewMode("card");
                  const idx = filteredCards.findIndex(c => c.id === card.id);
                  setCurrentIndex(idx >= 0 ? idx : 0);
                  setIsFlipped(false);
                }}
              >
                {/* Glow */}
                <div
                  className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: meta.renk }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${meta.renk}15`,
                        borderColor: `${meta.renk}30`,
                        color: meta.renk
                      }}
                    >
                      {meta.ikon} {card.kategori}
                    </span>
                    <div className="flex items-center gap-1">
                      {card.sinavdaCikabilir && <span className="text-[10px]">🔥</span>}
                      {isStarred && <span className="text-yellow-400 text-xs">★</span>}
                      {isMastered && <span className={`text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>✓</span>}
                    </div>
                  </div>
                  <h3 className={`text-[14px] font-black tracking-tight mb-2 leading-snug ${t.text1}`}>
                    {card.baslik}
                  </h3>
                  <p className={`text-[11px] leading-relaxed line-clamp-3 ${t.text2}`}>
                    {card.icerik.replace(/[•→]/g, "").substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${zorlukRenk[card.zorluk]?.bg} ${zorlukRenk[card.zorluk]?.text}`}>
                      {card.zorluk}
                    </span>
                    {card.soruSayisi && card.soruSayisi !== "-" && (
                      <span className={`text-[9px] font-bold ${t.text3}`}>~{card.soruSayisi} soru</span>
                    )}
                  </div>
                </div>

                {/* Action buttons on hover */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); toggleStarred(card.id); }}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${isStarred ? "text-yellow-400" : t.text3}`}
                  >
                    <StarIcon filled={isStarred} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); toggleMastered(card.id); }}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isMastered ? (isDark ? "text-emerald-400" : "text-emerald-600") : t.text3
                    }`}
                  >
                    <CheckIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CATEGORY BREAKDOWN – Stats */}
      <div className={`mt-10 rounded-[24px] border p-6 md:p-8 ${isDark ? "bg-white/[0.015] border-white/5" : "bg-white border-black/[0.04]"}`}>
        <h3 className={`text-lg font-black tracking-tight mb-5 ${t.text1}`}>📊 Kategori Bazlı İlerleme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kategoriler.map(kat => {
            const meta = kategoriMeta[kat] || { renk: "#666", ikon: "📄", soruSayisi: "?" };
            const total = tarihKartlari.filter(c => c.kategori === kat).length;
            const mastered = tarihKartlari.filter(c => c.kategori === kat && masteredCards.includes(c.id)).length;
            const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
            return (
              <div
                key={kat}
                className={`rounded-2xl border p-4 transition-all cursor-pointer hover:-translate-y-0.5 ${t.cardBorder} ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.01]"}`}
                onClick={() => { setActiveKategori(kat); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{meta.ikon}</span>
                  <span className={`text-xs font-bold truncate ${t.text1}`}>{kat}</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[10px] font-bold" style={{ color: meta.renk }}>{mastered}/{total}</span>
                  <span className={`text-[10px] font-bold ${t.text3}`}>~{meta.soruSayisi} soru</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: meta.renk }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TarihKartlariTab;
