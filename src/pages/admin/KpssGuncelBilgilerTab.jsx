import React, { useState, useEffect } from "react";
import {
  LuBookOpen, LuChevronRight, LuStar, LuGlobe,
  LuBookmark, LuSparkles, LuTarget, LuLightbulb,
  LuLandmark, LuUsers, LuScale, LuCircleCheck,
  LuTrophy, LuCalendar, LuFlag, LuBuilding,
  LuShield, LuGraduationCap, LuZap, LuRotateCw,
  LuCheck, LuX, LuSearch, LuFilter, LuLayers,
  LuChevronLeft, LuAward, LuRocket
} from "react-icons/lu";

// ══════════════════════════════════════════════════════════════════
// 2026 KPSS BİREBİR VE %100 BİLGİ KAYNAKLI GÜNCEL BİLGİLER VERİTABANI
// Doğrulanmış Kaynaklar: TÜRKSOY, UNESCO, TFF, UEFA, FIFA, G20, Resmi Gazete
// ══════════════════════════════════════════════════════════════════

const GUNCEL_BILGILER = [
  // ── SERİ 1: 2026 KÜLTÜR & KİTAP BAŞKENTLERİ ──
  {
    id: "guncel-2026-01",
    no: 1,
    icon: "🇺🇿",
    color: "emerald",
    category: "🏛️ 2026 Kültür & Başkentler",
    title: "2026 TÜRK DÜNYASI KÜLTÜR BAŞKENTİ — ANDİCAN",
    badge: "2026 Resmi Karar",
    summary: "Türk Devletleri Teşkilatı ve TÜRKSOY tarafından 2026 yılı Türk Dünyası Kültür Başkenti olarak ilan edilen şehir.",
    frontQuestion: "TÜRKSOY tarafından 2026 yılı Türk Dünyası Kültür Başkenti seçilen şehir hangisidir?",
    backAnswer: "Özbekistan'ın ANDİCAN şehri (2026 Türk Dünyası Kültür Başkenti ilan edilmiştir).",
    goldNote: "2024 Kültür Başkenti Anev (Türkmenistan), 2025 Kültür Başkenti Aktau (Kazakistan), 2026 Kültür Başkenti ise Özbekistan'ın Andican kentidir!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2026 Kültür Başkenti", def: "Andican (Özbekistan)." },
          { term: "İlan Eden Kurum", def: "TÜRKSOY (Uluslararası Türk Kültürü Teşkilatı) ve TDT." },
          { term: "Önceki Başkentler", def: "2022 Bursa (Türkiye), 2023 Şuşa (Azerbaycan), 2024 Anev (Türkmenistan), 2025 Aktau (Kazakistan)." }
        ]
      }
    ]
  },
  {
    id: "guncel-2026-02",
    no: 2,
    icon: "🇹🇷",
    color: "red",
    category: "🏛️ 2026 Kültür & Başkentler",
    title: "2026 TÜRK DÜNYASI TURİZM BAŞKENTİ — ANKARA",
    badge: "2026 Türkiye Zaferi",
    summary: "Türk Devletleri Teşkilatı (TDT) Turizm Bakanları Toplantısı'nda 2026 yılı için turizm başkenti seçilen ilimiz.",
    frontQuestion: "Türk Devletleri Teşkilatı (TDT) tarafından 2026 yılı 'Türk Dünyası Turizm Başkenti' seçilen şehrimiz hangisidir?",
    backAnswer: "ANKARA (2026 Türk Dünyası Turizm Başkenti seçilmiştir).",
    goldNote: "ÖSYM 'Turizm Başkenti' ile 'Kültür Başkenti' sorularını çeldirici olarak sorar. 2026 Turizm Başkenti ANKARA, Kültür Başkenti ANDİCAN'dır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2026 Turizm Başkenti", def: "Ankara (T.C. Başkenti)." },
          { term: "Karar Verici", def: "Türk Devletleri Teşkilatı (TDT)." },
          { term: "Önemli Vurgu", def: "Anadolu'nun tarihi köklü mirasını Türk dünyasıyla buluşturmaktadır." }
        ]
      }
    ]
  },
  {
    id: "guncel-2026-03",
    no: 3,
    icon: "📚",
    color: "purple",
    category: "🏛️ 2026 Kültür & Başkentler",
    title: "2026 UNESCO DÜNYA KİTAP BAŞKENTİ — RABAT",
    badge: "2026 UNESCO İlanı",
    summary: "UNESCO tarafından 2026 yılı Dünya Kitap Başkenti ilan edilen şehir.",
    frontQuestion: "UNESCO tarafından 2026 yılı 'Dünya Kitap Başkenti' ilan edilen şehir hangisidir?",
    backAnswer: "RABAT (Fas'ın başkenti).",
    goldNote: "UNESCO her yıl Dünya Kitap ve Telif Hakları Günü (23 Nisan) kapsamında bir şehri Dünya Kitap Başkenti seçer. 2026 Dünya Kitap Başkenti Rabat (Fas)'tır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2026 UNESCO Kitap Başkenti", def: "Rabat (Fas)." },
          { term: "UNESCO Genel Merkezi", def: "Paris (Fransa)." },
          { term: "Seçim Kriteri", def: "Okuma kültürünün yaygınlaştırılması ve yayıncılık faaliyetleri." }
        ]
      }
    ]
  },

  // ── SERİ 2: 2026 SPOR & OLİMPİYATLAR ──
  {
    id: "guncel-2026-04",
    no: 4,
    icon: "⚽",
    color: "amber",
    category: "⚽ 2026 Spor & Organizasyonlar",
    title: "2026 UEFA AVRUPA LİGİ FİNALİ — İSTANBUL TÜPRAŞ STADYUMU",
    badge: "2026 Türkiye Ev Sahibi",
    summary: "UEFA Yönetim Kurulu kararıyla 2026 UEFA Avrupa Ligi finaline ev sahipliği yapan stadyumumuz.",
    frontQuestion: "2026 UEFA Avrupa Ligi final maçı Türkiye'de hangi stadyumda oynanacaktır?",
    backAnswer: "İstanbul — Beşiktaş Park (Tüpraş Stadyumu).",
    goldNote: "Ayrıca 2027 UEFA Konferans Ligi final maçı ise Yeni Ankara Stadyumu'nda oynanacaktır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2026 UEFA Avrupa Ligi Finali", def: "İstanbul Beşiktaş Park (Tüpraş Stadyumu) — 20 Mayıs 2026." },
          { term: "2027 UEFA Konferans Ligi Finali", def: "Yeni Ankara Stadyumu." },
          { term: "EURO 2032 Ev Sahipliği", def: "Türkiye & İtalya ortaklığı." }
        ]
      }
    ]
  },
  {
    id: "guncel-2026-05",
    no: 5,
    icon: "❄️",
    color: "cyan",
    category: "⚽ 2026 Spor & Organizasyonlar",
    title: "2026 KIŞ OLİMPİYATLARI — MİLANO VE CORTINA D'AMPEZZO",
    badge: "2026 Olimpiyatları",
    summary: "25. Kış Olimpiyat Oyunları'na ev sahipliği yapan kentler.",
    frontQuestion: "2026 Kış Olimpiyat Oyunları (25. Kış Olimpiyatları) hangi ülkede ve şehirlerde düzenlenmektedir?",
    backAnswer: "İtalya — Milano ve Cortina d'Ampezzo kentlerinde (Şubat 2026).",
    goldNote: "2024 Yaz Olimpiyatları Paris'te (Fransa), 2026 Kış Olimpiyatları İtalya'da (Milano-Cortina), 2028 Yaz Olimpiyatları ise Los Angeles'ta (ABD) düzenlenecektir!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2026 Kış Olimpiyatları", def: "Milano & Cortina d'Ampezzo (İtalya)." },
          { term: "2028 Yaz Olimpiyatları", def: "Los Angeles (ABD)." },
          { term: "2032 Yaz Olimpiyatları", def: "Brisbane (Avustralya)." }
        ]
      }
    ]
  },
  {
    id: "guncel-2026-06",
    no: 6,
    icon: "🌎",
    color: "blue",
    category: "⚽ 2026 Spor & Organizasyonlar",
    title: "2026 FIFA DÜNYA KUPASI — ABD, KANADA VE MEKSİKA",
    badge: "48 Takımlı İlk Kupa",
    summary: "Tarihte ilk kez 3 ülkenin ortaklığında ve 48 takımla düzenlenen 2026 FIFA Dünya Kupası.",
    frontQuestion: "2026 FIFA Dünya Kupası hangi ülkelerin ortak ev sahipliğinde düzenlenmektedir?",
    backAnswer: "ABD, Kanada ve Meksika (3 ülkenin ortak ev sahipliğinde).",
    goldNote: "2026 Dünya Kupası, tarihte ilk kez 32 takım yerine 48 takımın katılımıyla düzenlenen ilk Dünya Kupası'dır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Ev Sahibi Ülkeler", def: "ABD, Kanada, Meksika (11 Haziran - 19 Temmuz 2026)." },
          { term: "Takım Sayısı", def: "48 Takım (Tarihteki en geniş katılımlı Dünya Kupası)." },
          { term: "Final Maçı", def: "MetLife Stadyumu (New Jersey / ABD)." }
        ]
      }
    ]
  },

  // ── SERİ 3: 2026 ULUSLARARASI ZİRVELER VE BAŞKANLIKLAR ──
  {
    id: "guncel-2026-07",
    no: 7,
    icon: "🌐",
    color: "amber",
    category: "🌍 2026 Diplomatisi & Zirveler",
    title: "2026 G20 DÖNEM BAŞKANI — ABD (MİAMİ ZİRVESİ)",
    badge: "2026 G20 Zirvesi",
    summary: "Dünyanın en büyük 20 ekonomisinin oluşturduğu G20'nin 2026 yılı dönem başkanlığı ve liderler zirvesi.",
    frontQuestion: "2026 yılı G20 Dönem Başkanlığını hangi ülke yürütmektedir ve Liderler Zirvesi nerede yapılacaktır?",
    backAnswer: "Dönem Başkanı: ABD (G20 Liderler Zirvesi Aralık 2026'da Miami'de düzenlenmektedir).",
    goldNote: "G20 Dönem Başkanlıkları Sıralaması: 2023 Hindistan, 2024 Brezilya, 2025 Güney Afrika, 2026 ABD!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2026 G20 Başkanı", def: "Amerika Birleşik Devletleri (ABD)." },
          { term: "Zirve Şehri", def: "Miami (Florida / ABD)." },
          { term: "G20 Üyeliği", def: "Türkiye G20'nin kurucu üyesidir." }
        ]
      }
    ]
  },
  {
    id: "guncel-2026-08",
    no: 8,
    icon: "🛡️",
    color: "sky",
    category: "🌍 2026 Diplomatisi & Zirveler",
    title: "NATO 32. ÜYE VE GÜNCEL GENEL SEKRETERİ",
    badge: "Güvenlik İttifakı",
    summary: "NATO'nun 2024-2026 döneminde göreve başlayan Genel Sekreteri ve son üye ülkeleri.",
    frontQuestion: "NATO'nun 32. üye ülkesi hangisidir ve 2024'ten beri Genel Sekreterlik görevini kim yürütmektedir?",
    backAnswer: "32. Üye: İsveç (Mart 2024)\nGenel Sekreter: Mark Rutte (Eski Hollanda Başbakanı)",
    goldNote: "NATO'nun 31. üyesi Finlandiya, 32. üyesi İsveç'tir. Türkiye 1952 yılından beri NATO üyesidir.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "32. Üye Ülke", def: "İsveç (Mart 2024'te resmi olarak katıldı)." },
          { term: "Genel Sekreter", def: "Mark Rutte (1 Ekim 2024 itibarıyla atandı)." },
          { term: "NATO Merkezi", def: "Brüksel (Belçika)." }
        ]
      }
    ]
  },

  // ── SERİ 4: TÜRKİYE MİLLİ TEKNOLOJİ HEDEFLERİ ──
  {
    id: "guncel-2026-09",
    no: 9,
    icon: "🚀",
    color: "purple",
    category: "🚀 Milli Teknoloji 2026",
    title: "TÜRKSAT 6A VE KIZILELMA OPERASYONEL GÖREVLERİ",
    badge: "Milli Gurur",
    summary: "Türkiye'nin uzay ve havacılık alanında 2024-2026 yıllarında elde ettiği tarihi başarılar.",
    frontQuestion: "Türkiye'nin uzaya gönderdiği İLK YERLİ VE MİLLİ haberleşme uydusu hangisidir?",
    backAnswer: "TÜRKSAT 6A (Temmuz 2024'te fırlatılmış, kapsama alanımızı Hindistan dahil 5 milyarlık nüfusa ulaştırmıştır).",
    goldNote: "TÜRKSAT 6A ile Türkiye, dünyada kendi haberleşme uydusunu üretebilen 10 ülke arasına girmiştir!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "TÜRKSAT 6A", def: "İlk yerli ve milli haberleşme uydumuz." },
          { term: "KAAN (TF-X)", def: "Türkiye'nin 5. nesil milli muharip savaş uçağı." },
          { term: "İlk Astronotumuz", def: "Alper Gezeravcı (Axiom-3 uzay görevi / 13 bilimsel deney)." },
          { term: "İkinci Astronotumuz", def: "Tuva Cihangir Atasever (Yörünge altı araştırma uçuşu)." }
        ]
      }
    ]
  },

  // ── SERİ 5: ANAYASA & YÜKSEK GÖREVLİLER ──
  {
    id: "guncel-2026-10",
    no: 10,
    icon: "⚖️",
    color: "rose",
    category: "⚖️ Yüksek Makamlar 2026",
    title: "ANAYASA MAHKEMESİ VE MERKEZ BANKASI BAŞKANLARI",
    badge: "Anayasal Görevliler",
    summary: "2026 itibarıyla Türkiye'nin yüksek yargı ve ekonomi kurumlarının başkanları.",
    frontQuestion: "2026 itibarıyla Anayasa Mahkemesi (AYM) Başkanı ve Merkez Bankası (TCMB) Başkanı kimlerdir?",
    backAnswer: "AYM Başkanı: Kadir Özkaya (Nisan 2024-)\nTCMB Başkanı: Fatih Karahan (Şubat 2024-)",
    goldNote: "TBMM Başkanı Numan Kurtulmuş, Cumhurbaşkanı Yardımcısı Cevdet Yılmaz, Kamu Başdenetçisi (Ombudsman) Şeref Malkoç'tur.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "AYM Başkanı", def: "Kadir Özkaya (Anayasa Mahkemesi)." },
          { term: "TCMB Başkanı", def: "Fatih Karahan (Türkiye Cumhuriyet Merkez Bankası)." },
          { term: "TBMM Başkanı", def: "Numan Kurtulmuş (28. Dönem)." },
          { term: "CB Yardımcısı", def: "Cevdet Yılmaz." }
        ]
      }
    ]
  }
];

const CATEGORIES = [
  "Tüm Seriler",
  "🏛️ 2026 Kültür & Başkentler",
  "⚽ 2026 Spor & Organizasyonlar",
  "🌍 2026 Diplomatisi & Zirveler",
  "🚀 Milli Teknoloji 2026",
  "⚖️ Yüksek Makamlar 2026"
];

const KpssGuncelBilgilerTab = ({ theme }) => {
  const isDark = theme === "dark";

  // States
  const [viewMode, setViewMode] = useState("flashcards"); // 'flashcards' | 'grid'
  const [selectedCategory, setSelectedCategory] = useState("Tüm Seriler");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState(() => {
    try {
      const saved = localStorage.getItem("kpss_guncel_learned");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filtered Cards
  const filteredCards = GUNCEL_BILGILER.filter(card => {
    const matchesCategory =
      selectedCategory === "Tüm Seriler" || card.category === selectedCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.frontQuestion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Save Learned Cards
  useEffect(() => {
    localStorage.setItem("kpss_guncel_learned", JSON.stringify(learnedCards));
  }, [learnedCards]);

  // Reset index on filter change
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, searchQuery]);

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const toggleLearned = (id) => {
    setLearnedCards(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER BANNER ── */}
      <div className={`rounded-2xl border p-6 md:p-8 transition-colors ${
        isDark
          ? "bg-[#111726] border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
              isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}>
              📰
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                  isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  2026 Yılı Birebir Resmi Kaynaklar
                </span>
                <span className="text-xs font-bold text-slate-400">ÖSYM Nokta Atışı Formatında</span>
              </div>
              <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                KPSS 2026 Birebir Güncel Bilgiler Kartları
              </h2>
              <p className={`text-xs md:text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                2026 Türk Dünyası Kültür Başkenti Andican, Turizm Başkenti Ankara, UNESCO Rabat, 2026 Milano Olimpiyatları, G20 ABD Zirvesi ve UEFA İstanbul Finali!
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">2026 Bilgi Sayısı</div>
              <div className="text-lg font-black text-cyan-400 mt-0.5">{GUNCEL_BILGILER.length} Konu</div>
            </div>
            <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tamamlanan</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">{learnedCards.length} Kart</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODE SWITCHER & FILTERS ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-500 shadow-md shadow-cyan-500/20"
                  : isDark
                    ? "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => setViewMode("flashcards")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              viewMode === "flashcards"
                ? "bg-cyan-600 text-white border-cyan-500"
                : isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <LuRotateCw size={14} /> Kart Çevirme Modu
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-cyan-600 text-white border-cyan-500"
                : isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            <LuLayers size={14} /> Detaylı Liste Modu
          </button>
        </div>
      </div>

      {/* ══ 1. FLASHCARD MODE ══ */}
      {viewMode === "flashcards" && (
        <div className="max-w-3xl mx-auto space-y-6">
          {filteredCards.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${isDark ? "bg-slate-900/50 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
              Aradığınız kriterde 2026 güncel bilgi kartı bulunamadı.
            </div>
          ) : (
            <>
              {/* Card Container */}
              <div className="relative perspective-1000 min-h-[380px]">
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full min-h-[380px] rounded-3xl border p-8 transition-all duration-500 transform cursor-pointer relative shadow-2xl flex flex-col justify-between select-none ${
                    isDark
                      ? "bg-slate-900/90 border-slate-800 hover:border-cyan-500/50"
                      : "bg-white border-slate-200/90 hover:border-cyan-400"
                  }`}
                >
                  {/* Top Badge & Progress */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                      <span>{currentCard.icon}</span>
                      {currentCard.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Kart {currentCardIndex + 1} / {filteredCards.length}
                    </span>
                  </div>

                  {/* Card Front vs Back Content */}
                  {!isFlipped ? (
                    /* FRONT SIDE */
                    <div className="my-auto text-center space-y-4 py-6">
                      <div className="text-3xl animate-bounce">{currentCard.icon}</div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                        2026 ÖSYM SORU POTANSİYELİ
                      </span>
                      <h3 className={`text-xl md:text-2xl font-black leading-snug px-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        "{currentCard.frontQuestion}"
                      </h3>
                      <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1">
                        <LuRotateCw size={14} className="text-cyan-400 animate-spin" />
                        Cevabı görmek için karta tıklayın!
                      </p>
                    </div>
                  ) : (
                    /* BACK SIDE */
                    <div className="my-auto space-y-4 py-4 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px] border border-emerald-500/30">
                          ✓ 2026 DOĞRU CEVAP
                        </span>
                        <h4 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                          {currentCard.title}
                        </h4>
                      </div>

                      <div className={`p-4 rounded-2xl border text-sm font-bold leading-relaxed ${
                        isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}>
                        {currentCard.backAnswer}
                      </div>

                      {/* Gold Note */}
                      <div className={`p-4 rounded-2xl border ${isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                        <div className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 mb-1">
                          <LuSparkles size={16} /> ÖSYM ALTIN İPUCU
                        </div>
                        <p className="text-xs font-medium leading-relaxed">
                          {currentCard.goldNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottom Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLearned(currentCard.id); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                        learnedCards.includes(currentCard.id)
                          ? "bg-emerald-500 text-white"
                          : isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <LuCheck size={14} />
                      {learnedCards.includes(currentCard.id) ? "Öğrendim ✓" : "Öğrendim İşaretle"}
                    </button>
                    <span className="text-xs font-extrabold text-cyan-400">
                      {isFlipped ? "Soru Yüzüne Dön ↩" : "Cevabı Gör ↪"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrevCard}
                  className={`px-5 py-3 rounded-2xl border text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                    isDark ? "bg-slate-900 border-slate-800 text-white hover:bg-slate-800" : "bg-white border-slate-200 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <LuChevronLeft size={16} /> Önceki Kart
                </button>

                <div className="text-xs font-bold text-slate-400">
                  2026 Güncel Serisi
                </div>

                <button
                  onClick={handleNextCard}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition cursor-pointer"
                >
                  Sonraki Kart <LuChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ 2. DETAILED GRID LIST MODE ══ */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCards.map(item => (
            <div
              key={item.id}
              className={`rounded-3xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <span>{item.icon}</span>
                    {item.category}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className={`text-base font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {item.summary}
                </p>

                {item.blocks?.map((block, bIdx) => (
                  <div key={bIdx} className="space-y-2">
                    {block.items.map((bItem, iIdx) => (
                      <div
                        key={iIdx}
                        className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                          isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-cyan-400 mr-1.5">{bItem.term}:</strong>
                          <span className={isDark ? "text-slate-300" : "text-slate-700"}>{bItem.def}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KpssGuncelBilgilerTab;
