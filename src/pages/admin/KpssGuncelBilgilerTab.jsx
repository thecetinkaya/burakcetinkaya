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
// 2026 KPSS GÜNCEL BİLGİLER & ÖSYM NOKTA ATIŞI KART VERİ TABANI
// ══════════════════════════════════════════════════════════════════

const GUNCEL_BILGILER = [
  // ── SERİ 1: MİLLİ TEKNOLOJİ & UZAY ──
  {
    id: "guncel-tek-01",
    no: 1,
    icon: "🛰️",
    color: "purple",
    category: "🚀 Bilim & Uzay",
    title: "TÜRKSAT 6A — İLK YERLİ VE MİLLİ HABERLEŞME UYDUĞUMUZ",
    badge: "Kesin Çıkar",
    summary: "Türkiye'nin yerli ve milli imkânlarla ürettiği ilk haberleşme uydusu olan TÜRKSAT 6A.",
    frontQuestion: "Türkiye'nin ilk yerli ve milli haberleşme uydusu hangisidir ve ne zaman fırlatılmıştır?",
    backAnswer: "TÜRKSAT 6A — Temmuz 2024'te SpaceX Falcon 9 roketi ile Cape Canaveral'dan uzaya fırlatılmıştır.",
    goldNote: "TÜRKSAT 6A ile Türkiye, dünyada kendi haberleşme uydusunu üretebilen 10 ülke arasına girmiştir!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Fırlatma Tarihi", def: "8 Temmuz 2024 (SpaceX Falcon 9 roketi ile Florida'dan fırlatıldı)." },
          { term: "Üretici Konsorsiyum", def: "TÜBİTAK UZAY, TUSAŞ (TAİ), ASELSAN ve CTech ortaklığında geliştirildi." },
          { term: "Yörünge Konumu", def: "42° Doğu yörüngesinde hizmet vermektedir." },
          { letter: "ÖÖ", term: "ÖSYM Püf Noktası", def: "TÜRKSAT 5A ve 5B dışarıdan satın alınmıştır, TÜRKSAT 6A ise İLK YERLİ VE MİLLİ haberleşme uydumuzdur!" }
        ]
      }
    ]
  },
  {
    id: "guncel-tek-02",
    no: 2,
    icon: "🧑‍🚀",
    color: "blue",
    category: "🚀 Bilim & Uzay",
    title: "TÜRKİYE'NİN İLK VE İKİNCİ ASTRONOTLARI",
    badge: "Uzay Görevi",
    summary: "Milli Uzay Programı kapsamında uzaya giden ilk astronotumuz Alper Gezeravcı ve ikinci astronotumuz Tuva Cihangir Atasever.",
    frontQuestion: "Türkiye'nin ilk ve ikinci astronotları kimlerdir?",
    backAnswer: "1. Astronot: Alper Gezeravcı (Ocak 2024 / Axiom-3)\n2. Astronot: Tuva Cihangir Atasever (Haziran 2024 / Yörünge Altı Araştırma Uçuşu)",
    goldNote: "Alper Gezeravcı, ISS'te (Uluslararası Uzay İstasyonu) 13 farklı bilimsel deney gerçekleştirmiştir. İlk sözü: 'İstikbal göklerdedir!' olmuştur.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Alper Gezeravcı", def: "Ocak 2024'te Axiom Mission-3 (Ax-3) ile ISS'e giden İLK Türk astronottur." },
          { term: "Tuva Cihangir Atasever", def: "Haziran 2024'te Virgin Galactic firmasının VSS Unity uzay aracıyla yörünge altı bilimsel araştırma uçuşunu gerçekleştiren 2. astronotumuzdur." },
          { term: "İlk Uzay Sözü", def: "Mustafa Kemal Atatürk'ün 'İstikbal göklerdedir!' sözünü uzaydan yankılatmıştır." }
        ]
      }
    ]
  },
  {
    id: "guncel-tek-03",
    no: 3,
    icon: "✈️",
    color: "indigo",
    category: "🚀 Bilim & Uzay",
    title: "KAAN (TF-X) — 5. NESİL MİLLİ MUHARİP UÇAK",
    badge: "Milli Savunma",
    summary: "TUSAŞ tarafından geliştirilen Türkiye'nin ilk 5. nesil milli muharip savaş uçağı KAAN.",
    frontQuestion: "Türkiye'nin ilk 5. nesil milli muharip savaş uçağının adı nedir ve ilk uçuşunu ne zaman yapmıştır?",
    backAnswer: "KAAN — 21 Şubat 2024 tarihinde ilk başarılı test uçuşunu gerçekleştirmiştir.",
    goldNote: "KAAN ile Türkiye, dünyada 5. nesil savaş uçağı üretebilen 4 ülkeden (ABD, Rusya, Çin, Türkiye) biri olmuştur!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Geliştirici", def: "TUSAŞ (Türk Havacılık ve Uzay Sanayii)." },
          { term: "İsim Anlamı", def: "İsmi Devlet Bahçeli tarafından verilmiş olup 'Hükümdar / Hanlar Hanı' anlamına gelir." },
          { term: "Diğer Hava Araçlarımız", def: "ANKA-3 (İnsansız Savaş Uçağı), Bayraktar TB3 (TCG Anadolu'ya inen ilk SİHA), KIZILELMA (İnsansız Savaş Uçağı)." }
        ]
      }
    ]
  },

  // ── SERİ 2: UNESCO & KÜLTÜR ──
  {
    id: "guncel-kul-01",
    no: 4,
    icon: "🏛️",
    color: "amber",
    category: "🏛️ Kültür & UNESCO",
    title: "UNESCO DÜNYA MİRASI — GORDİON VE AHŞAP DİREKLİ CAMİLER",
    badge: "Sınav Klasiği",
    summary: "Türkiye'nin UNESCO Dünya Mirası Listesi'ne eklenen son kültürel varlıkları.",
    frontQuestion: "Türkiye'nin UNESCO Dünya Miras Listesi'ne eklenen 20. ve 21. miras alanları hangileridir?",
    backAnswer: "20. Miras: Gordion Antik Kenti (Ankara - 2023)\n21. Miras: Anadolu'nun Ortaçağ Dönemi Ahşap Hipostil (Direkli) Camileri (2023)",
    goldNote: "Ahşap Direkli Camiler listesinde 5 cami bulunur: Beyşehir Eşrefoğlu (Konya), Sivrihisar Ulu (Eskişehir), Kasaba Köyü Mahmut Bey (Kastamonu), Ahi Şerafeddin (Ankara), Afyonkarahisar Ulu Camii.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Gordion Antik Kenti", def: "Ankara'nın Polatlı ilçesinde yer alır. Frigya Krallığı'nın başkentidir (Kral Midas'ın ülkesi)." },
          { term: "Ahşap Direkli Camiler", def: "Anadolu Selçuklu ve Beylikler döneminden günümüze ulaşan ahşap tavanlı ve sütunlu camiler topluluğudur." },
          { term: "Arslantepe Höyüğü", def: "Malatya'da yer alır, 2021 yılında UNESCO listesine girmiştir." }
        ]
      }
    ]
  },
  {
    id: "guncel-kul-02",
    no: 5,
    icon: "🌍",
    color: "emerald",
    category: "🏛️ Kültür & UNESCO",
    title: "TÜRK DÜNYASI KÜLTÜR BAŞKENTLERİ",
    badge: "TDT Kararı",
    summary: "TÜRKSOY ve Türk Devletleri Teşkilatı tarafından ilan edilen Kültür Başkentleri.",
    frontQuestion: "2024 ve 2025 Türk Dünyası Kültür Başkentleri neresi seçilmiştir?",
    backAnswer: "2024: Anev (Türkmenistan)\n2025: Aktau (Kazakistan)",
    goldNote: "2022 Kültür Başkenti Bursa (Türkiye), 2023 Kültür Başkenti Şuşa (Azerbaycan) idi.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "2024 Kültür Başkenti", def: "Anev kenti (Türkmenistan)." },
          { term: "2025 Kültür Başkenti", def: "Aktau şehri (Kazakistan)." },
          { term: "TÜRKSOY", def: "Uluslararası Türk Kültürü Teşkilatı — Merkez: Ankara. Genel Sekreter: Sultan Raev." }
        ]
      }
    ]
  },

  // ── SERİ 3: SPOR GURURLARIMIZ ──
  {
    id: "guncel-spo-01",
    no: 6,
    icon: "🎯",
    color: "rose",
    category: "🥇 Spor Başarıları",
    title: "YUSUF DİKEÇ — 2024 PARİS OLİMPİYATLARININ İKONİK İSMİ",
    badge: "Dünya Gündemi",
    summary: "2024 Paris Olimpiyatları'nda kulaklıksız ve gözlüksüz duruşuyla dünya gündemine oturan milli atıcımız.",
    frontQuestion: "2024 Paris Olimpiyatları'nda hiçbir özel ekipman kullanmadan el cebinde atış yaparak gümüş madalya kazanan ve viral olan milli sporcumuz kimdir?",
    backAnswer: "Yusuf Dikeç (Şevval İlayda Tarhan ile birlikte 10m Havalı Tabanca Karışık Takım kategorisinde Gümüş Madalya kazanmıştır).",
    goldNote: "Bu madalya Türkiye'nin olimpiyat tarihinde atıcılık branşında kazandığı İLK MADALYA'dır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Kategori", def: "10 Metre Havalı Tabanca Karışık Takım." },
          { term: "Takım Arkadaşı", def: "Şevval İlayda Tarhan." },
          { term: "Önemi", def: "Atıcılıkta Türkiye'nin olimpiyat tarihindeki ilk madalyasıdır." }
        ]
      }
    ]
  },
  {
    id: "egit-spo-02",
    no: 7,
    icon: "⚽",
    color: "teal",
    category: "🥇 Spor Başarıları",
    title: "EURO 2032 — TÜRKİYE VE İTALYA ORTAKLIĞI",
    badge: "UEFA Kararı",
    summary: "2032 Avrupa Futbol Şampiyonası'na (EURO 2032) ev sahipliği yapacak ülkeler.",
    frontQuestion: "UEFA tarafından 2032 Avrupa Futbol Şampiyonası (EURO 2032) hangi iki ülkenin ev sahipliğinde düzenlenecektir?",
    backAnswer: "Türkiye ve İtalya (Ortak ev sahipliği yapılacaktır).",
    goldNote: "Türkiye ilk kez büyük bir erkekler A Milli düzey futbol turnuvasına ev sahipliği yapacaktır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "EURO 2024 Ev Sahibi", def: "Almanya (Şampiyon: İspanya, Türkiye Çeyrek Finalist)." },
          { term: "EURO 2028 Ev Sahibi", def: "İngiltere, İrlanda Cumhuriyeti, İskoçya, Galler, Kuzey İrlanda." },
          { term: "EURO 2032 Ev Sahibi", def: "Türkiye & İtalya." }
        ]
      }
    ]
  },

  // ── SERİ 4: ULUSLARARASI ÖRGÜTLER ──
  {
    id: "guncel-ulu-01",
    no: 8,
    icon: "🛡️",
    color: "sky",
    category: "🌍 Uluslararası Örgütler",
    title: "NATO'NUN 32. ÜYESİ VE YENİ GENEL SEKRETERİ",
    badge: "Güncel Diplomasi",
    summary: "NATO'ya katılan en son üye ülkeler ve 2024'te göreve başlayan yeni Genel Sekreter.",
    frontQuestion: "NATO'nun 31. ve 32. üye ülkeleri hangileridir? 2024'te atanan yeni NATO Genel Sekreteri kimdir?",
    backAnswer: "31. Üye: Finlandiya (2023)\n32. Üye: İsveç (Mart 2024)\nYeni Genel Sekreter: Mark Rutte (Eski Hollanda Başbakanı)",
    goldNote: "NATO'nun merkezi Brüksel'dedir (Belçika). Türkiye 1952 yılında Kore Savaşı sonrasında NATO'ya üye olmuştur.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "31. Üye", def: "Finlandiya (Nisan 2023)." },
          { term: "32. Üye", def: "İsveç (Mart 2024 - Türkiye TBMM onayı ile süreci tamamladı)." },
          { term: "Genel Sekreter", def: "Mark Rutte (Jens Stoltenberg'den görevi devraldı)." }
        ]
      }
    ]
  },

  // ── SERİ 5: ANAYASAL KURUMLAR VE BAŞKANLAR ──
  {
    id: "guncel-kur-01",
    no: 9,
    icon: "⚖️",
    color: "rose",
    category: "⚖️ Yargı & Görevliler",
    title: "ANAYASA MAHKEMESİ (AYM) YENİ BAŞKANI",
    badge: "Yüksek Görevliler",
    summary: "Anayasa Mahkemesi Başkanlığı'na seçilen Kadir Özkaya ve AYM yapısı.",
    frontQuestion: "2024 yılında Zühtü Arslan'ın görev süresinin dolmasıyla Anayasa Mahkemesi (AYM) Başkanlığı'na kim seçilmiştir?",
    backAnswer: "Kadir Özkaya (Nisan 2024 itibarıyla AYM Başkanı olmuştur).",
    goldNote: "AYM 15 üyeden oluşur. Üyelerin 12'sini Cumhurbaşkanı, 3'ünü TBMM seçer. Üyeler 12 yıl için seçilir.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "AYM Başkanı", def: "Kadir Özkaya (2024-)." },
          { term: "TCMB Başkanı", def: "Fatih Karahan (Türkiye Cumhuriyet Merkez Bankası)." },
          { term: "TBMM Başkanı", def: "Numan Kurtulmuş." },
          { term: "Kamu Başdenetçisi (Ombudsman)", def: "Şeref Malkoç." }
        ]
      }
    ]
  },

  // ── SERİ 6: TÜRKİYE'NİN EN'LERİ & PROJELERİ ──
  {
    id: "guncel-en-01",
    no: 10,
    icon: "🏗️",
    color: "amber",
    category: "🏆 Türkiye'nin En'leri",
    title: "YUSUFELİ BARAJIMIZ VE ZİGANA TÜNELİMİZ",
    badge: "Dev Projeler",
    summary: "Türkiye'nin ve dünyanın en yüksek yapıları ile en uzun karayolu tünelleri.",
    frontQuestion: "Türkiye'nin en yüksek kemer barajı ve Avrupa'nın en uzun çift tüplü karayolu tüneli hangileridir?",
    backAnswer: "En Yüksek Baraj: Yusufeli Barajı (Artvin — 275 metre yükseklik, Türkiye 1.si, Dünya 5.si)\nEn Uzun Çift Tüplü Tünel: Yeni Zigana Tüneli (Trabzon-Gümüşhane — 14.5 km)",
    goldNote: "Çanakkale 1915 Köprüsü, 2023 metre orta açıklığı ile dünyada 1. sıradadır!",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Yusufeli Barajı", def: "Artvin Çoruh Nehri üzerinde kuruldu. 275 metre ile Türkiye'nin en yüksek kemer barajıdır." },
          { term: "Yeni Zigana Tüneli", def: "Trabzon ile Gümüşhane arasında 14,5 km uzunluğunda Avrupa'nın en uzun çift tüp karayolu tünelidir." },
          { term: "Kop Tüneli", def: "Bayburt - Erzurum arasında yapımı tamamlanan stratejik yüksek tünelimizdir." }
        ]
      }
    ]
  }
];

const CATEGORIES = [
  "Tüm Seriler",
  "🚀 Bilim & Uzay",
  "🏛️ Kültür & UNESCO",
  "🥇 Spor Başarıları",
  "🌍 Uluslararası Örgütler",
  "⚖️ Yargı & Görevliler",
  "🏆 Türkiye'nin En'leri"
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
      <div className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/40 border-slate-800"
          : "bg-gradient-to-br from-cyan-50 via-white to-indigo-50 border-cyan-200"
      }`}>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/20 shrink-0">
              📰
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  2026 KPSS Güncel Bilgiler Serisi
                </span>
                <span className="text-xs font-bold text-slate-400">ÖSYM Nokta Atışı Formatında</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                KPSS 2026 Güncel Bilgiler Kart Çalışması
              </h2>
              <p className={`text-xs md:text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                ÖSYM'nin en çok sormayı sevdiği TÜRKSAT 6A, Alper Gezeravcı, KAAN, Yusuf Dikeç, Gordion ve Yüksek Görevliler serisi!
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Toplam Kart</div>
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
              Aradığınız kriterde güncel bilgi kartı bulunamadı.
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
                        ÖSYM TARZI SORU / İPUCU
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
                          ✓ DOĞRU CEVAP
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
                          <LuSparkles size={16} /> ÖSYM ALTIN NOTU
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
                  Klavye Yön Tuşlarıyla Gezebilirsin
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
