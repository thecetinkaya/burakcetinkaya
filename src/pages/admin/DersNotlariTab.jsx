import React, { useState } from "react";
import {
  LuBookOpen, LuChevronRight, LuStar, LuTriangleAlert, LuShield,
  LuCrown, LuScroll, LuLandmark, LuUsers, LuScale,
  LuBookmark, LuSparkles, LuTarget, LuGem, LuFlame
} from "react-icons/lu";

// ── Tarih Ders Notları Verisi ──────────────────────────────────────
const TARIH_NOTLARI = [
  {
    id: "gocebe",
    no: 1,
    icon: "🏕️",
    color: "emerald",
    title: "GÖÇEBE YAŞAM MANTIĞI VE SONUÇLARI",
    badge: "Altın Kural",
    videoRef: "Video 1-2",
    summary: "Orta Asya coğrafyasının sert iklimi ve bozkır olması, Türkleri hayvancılığa ve doğal olarak göçebe yaşama itmiştir.",
    blocks: [
      {
        type: "osym",
        title: "ÖSYM Nasıl Sorar?",
        text: "Soruda «göçebe yaşam» geçiyorsa şunları yapıştıracaksın:"
      },
      {
        type: "rules",
        items: [
          { label: "Özel Mülkiyet YOKTUR", detail: "Kendine ait tarla, arsa olmaz. Bu nedenle Sınıf Ayrımı da YOKTUR (Kölelik/Asillik görülmez).", color: "rose" },
          { label: "Mimari YOKTUR", detail: "Sanat eserleri taşınabilir malzemelerdendir (Çadır, kılıç, halı, kemer). Yerleşik yaşamla (Uygurlar) mimari başlar!", color: "amber" },
          { label: "Hapis Cezaları KISADIR", detail: "Sürekli göç edildiği için vatana ihanet gibi suçların cezası direkt idamdır, uzun hapis yoktur.", color: "purple" },
          { label: "Savaşçılık ve Bağımsızlık YÜKSEKTİR", detail: "Zorlu şartlar eril enerjiyi (savaşçılığı) diri tutar.", color: "blue" }
        ]
      }
    ]
  },
  {
    id: "federatif",
    no: 2,
    icon: "🏛️",
    color: "blue",
    title: "DEVLETİN OLUŞUMU VE FEDERATİF YAPI",
    badge: "Kesin Bilinmeli",
    videoRef: "Video 1-2",
    summary: "İlk Türk devletleri boyların birleşmesiyle (Boylar Birliği) oluşur.",
    blocks: [
      {
        type: "chain",
        title: "Devlet Oluşum Sıralaması",
        items: ["Oguş (Aile)", "Uruk (Sülale)", "Boy", "Budun (Millet)", "İl (Devlet)"]
      },
      {
        type: "alert",
        variant: "danger",
        title: "⚠️ ÖSYM Tuzağı — Yarı Özerklik",
        text: "Boy beyleri iç işlerinde serbest, dış işlerinde merkeze bağlıdır. Doğu-Batı (İkili Sistem) şeklinde yönetim de buna örnektir."
      },
      {
        type: "conclusion",
        text: "Soruda \"Boylar Birliği\" veya \"İkili Sistem\" varsa → Federatif (Yarı Özerk) Anlayış. Bu durum devletlerin çabuk sarsılmasına ve kısa sürede yıkılmasına sebep olmuştur."
      }
    ]
  },
  {
    id: "kut",
    no: 3,
    icon: "👑",
    color: "amber",
    title: "KUT İNANCI VE VERASET SİSTEMİ",
    badge: "En Çok Çıkan Soru Tipi",
    videoRef: "Video 1-2",
    summary: "Devleti yönetme yetkisinin Gök Tanrı tarafından Kağan'a verildiğine inanılmasıdır.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Kut", def: "Devleti yönetme yetkisinin Gök Tanrı tarafından Kağan'a verildiğine inanılmasıdır. (Devletin dini yönetildiği anlamına gelmez, egemenliğin tanrısal kaynaklı olduğunu gösterir)." },
          { term: "Taht Kavgaları", def: "Kut, kan yoluyla babadan oğula (erkeğe) geçer. «Ülke, hanedanın ortak malıdır» anlayışı doğar. Kimin tahta çıkacağı (Veraset) kesin olmadığı için sürekli taht kavgası yaşanır." },
          { term: "Ülüş", def: "Hükümdarın iktisadi gücüdür. Elde edilen zenginliğin boylara adil şekilde pay (hisse) edilmesidir." },
          { term: "Küç", def: "Hükümdarın askeri gücüdür." }
        ]
      }
    ]
  },
  {
    id: "kurultay",
    no: 4,
    icon: "⚖️",
    color: "purple",
    title: "KURULTAY (TOY / KENGEŞ)",
    badge: "Meclis Sistemi",
    videoRef: "Video 1-2",
    summary: "Boy beylerinin, Kağan'ın, Hatun'un ve devlet görevlilerinin katıldığı meclistir.",
    blocks: [
      {
        type: "features",
        items: [
          "Hatun'un katılması → Kadının siyasi yetkisi olduğunu gösterir.",
          "Son söz Kağan'a ait → \"Danışma Meclisi\" niteliğindedir.",
          "Devlete karşı işlenen suçların görüşüldüğü → \"Yüksek Mahkeme\" işlevi.",
          "Törenin (hukukun) güncellendiği, yeniden düzenlendiği yerdir."
        ]
      }
    ]
  },
  {
    id: "semboller",
    no: 5,
    icon: "🏴",
    color: "rose",
    title: "HÜKÜMDARLIK SEMBOLLERİ",
    badge: "Tuzaklara Düşme!",
    videoRef: "Video 1-2",
    summary: "İslamiyet öncesi ve sonrası sembolleri birbirine karıştırma!",
    blocks: [
      {
        type: "compare",
        left: {
          title: "✅ İslamiyet ÖNCESİ",
          color: "emerald",
          items: [
            "Otağ (Çadır)", "Örgün (Taht)", "Nevbet (Davul)",
            "Tuğ (Sancak)", "Kotuz/Sorguç (Püskül)", "Yarlığ (Emir)",
            "Unvanlar: Han, Hakan, Şanyü, İdikut"
          ]
        },
        right: {
          title: "🚫 İslamiyet SONRASI (Tuzak!)",
          color: "rose",
          items: [
            "Sikke/Para bastırmak", "Hutbe okutmak",
            "Hilat/Menşur almak",
            "Unvanlar: Şah, Padişah, Sultan",
            "⚠️ Bunları İlk Türk Devletleri testlerinde sakın işaretleme!"
          ]
        }
      }
    ]
  },
  {
    id: "devletler",
    no: 6,
    icon: "⚔️",
    color: "sky",
    title: "ÖNEMLİ DEVLETLERİN \"HAP\" KELİMELERİ",
    badge: "Hızlı Ezber",
    videoRef: "Video 1-2",
    summary: "Her devlet için aklında tutman gereken anahtar bilgiler.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "Asya Hun", emoji: "🏹", color: "amber", points: ["Mete Han", "Onluk askeri sistem", "Çin'i asimile olmamak için sadece vergiye bağlama"] },
          { name: "Avrupa Hun", emoji: "⚡", color: "red", points: ["Attila (Tanrının Kırbacı / Ares'in Kılıcı)", "Bizans'ı Margus ve Anatolios antlaşmalarıyla ezici vergiye bağlaması"] },
          { name: "Göktürkler", emoji: "🐺", color: "blue", points: ["Türk adını kullanan ilk devlet", "2. Göktürk (Kutluklar) → Orhun Abideleri (Kültigin, Bilge Kağan, Tonyukuk)", "Tonyukuk = Türklerin Bismarck'ı"] },
          { name: "Uygurlar", emoji: "📜", color: "emerald", points: ["\"Uygar\" kelimesinden aklına gelsin", "Bögü Kağan → Maniheizm → Et yasağı → Tarım → Yerleşik yaşam", "Matbaa, kâğıt, mimari (Tapınak/Fresko), yazılı hukuk onlarla başlar"] },
          { name: "Hazarlar", emoji: "✡️", color: "purple", points: ["Museviliği kabul eden ilk ve tek Türk devleti", "Dini hoşgörü hat safhada (Farklı dinlerden hakimler)", "Belencer Savaşı'nda Arapları durdurma", "Paralı askerlik sistemi"] }
        ]
      }
    ]
  },
  {
    id: "kultur",
    no: 7,
    icon: "📚",
    color: "teal",
    title: "KÜLTÜR VE HUKUK TERİMLERİ",
    badge: "Kavram Haritası",
    videoRef: "Video 1-2",
    summary: "Temel kültür ve hukuk terimleri, devlet görevlileri.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Balbal ve Kurgan", def: "Mezar (Kurgan) ve mezar taşına dikilen düşman heykeli (Balbal). Bu ikisi net bir şekilde Ahiret İnancının göstergesidir (İçinden eşya çıkarsa kesin kanıttır)." },
          { term: "Yuğ (Cenaze Töreni)", def: "Ahiret inancını göstermez, sadece insani bir yas/uğurlama ritüelidir." }
        ]
      },
      {
        type: "tore",
        title: "Töre (Hukuk) — Değişmez Kuralları",
        items: [
          { term: "Könilik", def: "Adalet" },
          { term: "Tüzlük", def: "Eşitlik" },
          { term: "Uzluk", def: "İyilik / Faydalılık" },
          { term: "Kişilik", def: "İnsanlık" }
        ]
      },
      {
        type: "definition",
        items: [
          { term: "Ayuki", def: "Hükümet" },
          { term: "Aygucı", def: "Vezir" },
          { term: "Buyruk", def: "Bakan" },
          { term: "Tudun / İmga", def: "Vergi toplayan vali" }
        ]
      }
    ]
  }
];

// ── Color Utilities ──────────────────────────────────────────────
const colorMap = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/5", dot: "bg-emerald-400", accent: "text-emerald-300" },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400",    glow: "shadow-blue-500/5",    dot: "bg-blue-400",    accent: "text-blue-300" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   glow: "shadow-amber-500/5",   dot: "bg-amber-400",   accent: "text-amber-300" },
  purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/20",  text: "text-purple-400",  glow: "shadow-purple-500/5",  dot: "bg-purple-400",  accent: "text-purple-300" },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400",    glow: "shadow-rose-500/5",    dot: "bg-rose-400",    accent: "text-rose-300" },
  sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-400",     glow: "shadow-sky-500/5",     dot: "bg-sky-400",     accent: "text-sky-300" },
  teal:    { bg: "bg-teal-500/10",    border: "border-teal-500/20",    text: "text-teal-400",    glow: "shadow-teal-500/5",    dot: "bg-teal-400",    accent: "text-teal-300" },
  red:     { bg: "bg-red-500/10",     border: "border-red-500/20",     text: "text-red-400",     glow: "shadow-red-500/5",     dot: "bg-red-400",     accent: "text-red-300" },
};

const getC = (name) => colorMap[name] || colorMap.emerald;

// ── Block Renderers ──────────────────────────────────────────────
const RenderChain = ({ block }) => (
  <div className="my-4">
    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
      <LuChevronRight size={10} className="text-blue-400" />
      {block.title}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {block.items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {item}
          </span>
          {i < block.items.length - 1 && (
            <span className="text-blue-400 text-sm font-bold">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const RenderAlert = ({ block }) => (
  <div className={`my-4 p-4 rounded-xl border-l-4 ${
    block.variant === "danger"
      ? "bg-rose-500/5 border-rose-500 text-rose-300"
      : "bg-amber-500/5 border-amber-500 text-amber-300"
  }`}>
    <div className="text-sm font-bold mb-1 flex items-center gap-2">
      <LuTriangleAlert size={14} />
      {block.title}
    </div>
    <p className="text-xs leading-relaxed opacity-90">{block.text}</p>
  </div>
);

const RenderConclusion = ({ block }) => (
  <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-blue-500/5 border border-emerald-500/15">
    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
      <LuTarget size={10} />
      SONUÇ
    </div>
    <p className="text-sm text-emerald-200/90 leading-relaxed font-medium">{block.text}</p>
  </div>
);

const RenderOsym = ({ block }) => (
  <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/15">
    <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1.5 flex items-center gap-1.5">
      <LuTarget size={10} />
      {block.title}
    </div>
    <p className="text-xs text-amber-200/80 leading-relaxed">{block.text}</p>
  </div>
);

const RenderRules = ({ block }) => (
  <div className="my-4 space-y-2.5">
    {block.items.map((rule, i) => {
      const c = getC(rule.color);
      return (
        <div key={i} className={`p-3.5 rounded-xl border ${c.bg} ${c.border} transition-all hover:scale-[1.01]`}>
          <div className={`text-xs font-black ${c.text} flex items-center gap-2 mb-1`}>
            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
            {rule.label}
          </div>
          <p className="text-[11px] text-slate-300/80 leading-relaxed pl-4">{rule.detail}</p>
        </div>
      );
    })}
  </div>
);

const RenderDefinition = ({ block }) => (
  <div className="my-4 space-y-3">
    {block.items.map((item, i) => (
      <div key={i} className="flex gap-3">
        <div className="shrink-0 mt-1">
          <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-[10px] font-black text-slate-400">
            {i + 1}
          </span>
        </div>
        <div>
          <span className="text-xs font-black text-white/90">{item.term}</span>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{item.def}</p>
        </div>
      </div>
    ))}
  </div>
);

const RenderFeatures = ({ block }) => (
  <div className="my-4 space-y-2">
    {block.items.map((item, i) => (
      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors">
        <span className="text-purple-400 mt-0.5 shrink-0">
          <LuSparkles size={11} />
        </span>
        <span className="text-[11px] text-slate-300 leading-relaxed">{item}</span>
      </div>
    ))}
  </div>
);

const RenderCompare = ({ block }) => (
  <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3">
    {[block.left, block.right].map((side, idx) => {
      const c = getC(side.color);
      return (
        <div key={idx} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
          <div className={`text-[11px] font-black uppercase tracking-wider ${c.text} mb-3`}>
            {side.title}
          </div>
          <ul className="space-y-1.5">
            {side.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-[11px] text-slate-300/90 leading-relaxed">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 shrink-0`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    })}
  </div>
);

const RenderCards = ({ block }) => (
  <div className="my-4 space-y-3">
    {block.items.map((card, i) => {
      const c = getC(card.color);
      return (
        <div key={i} className={`p-4 rounded-xl border ${c.bg} ${c.border} hover:scale-[1.005] transition-all group`}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-lg">{card.emoji}</span>
            <span className={`text-sm font-black ${c.text}`}>{card.name}</span>
          </div>
          <ul className="space-y-1.5 pl-1">
            {card.points.map((pt, j) => (
              <li key={j} className="flex items-start gap-2 text-[11px] text-slate-300/90 leading-relaxed">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 shrink-0`} />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      );
    })}
  </div>
);

const RenderTore = ({ block }) => (
  <div className="my-4">
    <div className="text-[11px] font-black uppercase tracking-widest text-teal-400 mb-3 flex items-center gap-2">
      <LuScale size={10} />
      {block.title}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {block.items.map((item, i) => (
        <div key={i} className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/15 text-center hover:bg-teal-500/10 transition-colors">
          <div className="text-xs font-black text-teal-300">{item.term}</div>
          <div className="text-[10px] text-slate-400 mt-1">{item.def}</div>
        </div>
      ))}
    </div>
  </div>
);

// ── Block Dispatcher ─────────────────────────────────────────────
const RenderBlock = ({ block }) => {
  switch (block.type) {
    case "chain":      return <RenderChain block={block} />;
    case "alert":      return <RenderAlert block={block} />;
    case "conclusion": return <RenderConclusion block={block} />;
    case "osym":       return <RenderOsym block={block} />;
    case "rules":      return <RenderRules block={block} />;
    case "definition": return <RenderDefinition block={block} />;
    case "features":   return <RenderFeatures block={block} />;
    case "compare":    return <RenderCompare block={block} />;
    case "cards":      return <RenderCards block={block} />;
    case "tore":       return <RenderTore block={block} />;
    default:           return null;
  }
};

// ── Main Component ───────────────────────────────────────────────
const DersNotlariTab = ({ theme }) => {
  const [expandedId, setExpandedId] = useState(null);
  const isDark = theme === "dark";

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── HEADER BANNER ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/20 border-slate-800"
          : "bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200"
      }`}>
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px"
        }} />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/5">
                📖
              </span>
              <div>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Ders Notları
                </h2>
                <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Ahmet Uğur KARAKUZA — "Tahta" ve "Hap Bilgi" Notları
                </p>
              </div>
            </div>
            <p className={`text-[13px] leading-relaxed max-w-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              İlk Türk Devletleri — Video 1-2 özet notları. ÖSYM tuzak sorularına karşı hazırlanmış, 
              sınav odaklı kısa ve öz "hap bilgi" formatında derlenmiştir.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
              isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-100 text-amber-700 border border-amber-200"
            }`}>
              <LuBookOpen size={14} />
              {TARIH_NOTLARI.length} Konu Başlığı
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
              isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
            }`}>
              <LuStar size={14} />
              KPSS Odaklı
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLE OF CONTENTS ── */}
      <div className={`rounded-2xl border p-5 ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className={`text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
          isDark ? "text-slate-500" : "text-slate-400"
        }`}>
          <LuBookmark size={10} className="text-amber-400" />
          İÇİNDEKİLER
        </div>
        <div className="flex flex-wrap gap-2">
          {TARIH_NOTLARI.map((note) => {
            const c = getC(note.color);
            const isActive = expandedId === note.id;
            return (
              <button
                key={note.id}
                onClick={() => toggle(note.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  isActive
                    ? `${c.bg} ${c.text} ${c.border}`
                    : isDark
                      ? "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {note.icon} {note.no}. {note.title.split(" ").slice(0, 3).join(" ")}…
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NOTE CHAPTERS ── */}
      <div className="space-y-4">
        {TARIH_NOTLARI.map((note) => {
          const c = getC(note.color);
          const isOpen = expandedId === note.id;

          return (
            <div
              key={note.id}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
              } ${isOpen ? `shadow-xl ${c.glow}` : "shadow-sm hover:shadow-md"}`}
            >
              {/* Chapter Header */}
              <button
                onClick={() => toggle(note.id)}
                className="w-full p-5 flex items-center gap-4 text-left cursor-pointer transition-colors hover:bg-slate-800/20 group"
              >
                {/* Chapter Number Badge */}
                <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  {note.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                      Bölüm {note.no}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                      {note.badge}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {note.videoRef}
                    </span>
                  </div>
                  <h3 className={`text-sm md:text-base font-black mt-1 ${isDark ? "text-white/90" : "text-slate-900"}`}>
                    {note.title}
                  </h3>
                  {!isOpen && (
                    <p className={`text-[11px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"} line-clamp-1`}>
                      {note.summary}
                    </p>
                  )}
                </div>

                <LuChevronRight
                  size={16}
                  className={`shrink-0 transition-transform duration-300 ${c.text} ${isOpen ? "rotate-90" : ""}`}
                />
              </button>

              {/* Chapter Content */}
              {isOpen && (
                <div className={`px-5 pb-6 border-t ${isDark ? "border-slate-800/80" : "border-slate-100"}`}>
                  {/* Summary Banner */}
                  <div className={`mt-4 p-3 rounded-lg ${c.bg} border ${c.border}`}>
                    <p className={`text-xs font-semibold ${c.accent} leading-relaxed`}>
                      💡 {note.summary}
                    </p>
                  </div>

                  {/* Content Blocks */}
                  {note.blocks.map((block, i) => (
                    <RenderBlock key={i} block={block} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div className={`rounded-2xl border p-5 text-center ${
        isDark ? "bg-slate-900/30 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          📌 Bu notlar Ahmet Uğur KARAKUZA hocanın İlk Türk Devletleri (Video 1-2) derslerinden derlenmiştir.
          Yeni videolar izlendikçe notlar güncellenecektir.
        </p>
      </div>
    </div>
  );
};

export default DersNotlariTab;
