import React, { useState } from "react";
import HafizaTeknikleriEgitTab from "./HafizaTeknikleriEgitTab";
import {
  LuBrain, LuChevronRight, LuStar, LuBookOpen,
  LuBookmark, LuSparkles, LuTarget, LuLightbulb,
  LuRepeat, LuLayers, LuLink, LuMapPin,
  LuClock, LuCircleCheck, LuZap, LuGraduationCap
} from "react-icons/lu";

// ── Hafıza Teknikleri Verisi ──────────────────────────────────────
const HAFIZA_TEKNIKLERI = [
  {
    id: "loci",
    no: 1,
    icon: "🏛️",
    color: "blue",
    title: "LOCİ YÖNTEMİ (HAFIZA SARAYI)",
    badge: "En Güçlü Teknik",
    summary: "Zihninde tanıdığın bir mekânı (evin, okulun) hayal et. Her odaya/köşeye bir bilgiyi yerleştir. Geri çağırmak için o mekânda yürü.",
    blocks: [
      {
        type: "osym",
        title: "Bu Tekniği KPSS'de Nasıl Kullanırsın?",
        text: "Özellikle Tarih ve Coğrafya'da sıralı bilgiler (padişahlar, savaşlar, yer şekilleri) için birebir. Her padişahı evin bir odasına yerleştir."
      },
      {
        type: "rules",
        items: [
          { label: "1. Mekânı belirle", detail: "Evin, okulun veya iyi bildiğin bir rota. Her seferinde aynı mekânı kullan ki tutarlılık olsun.", color: "blue" },
          { label: "2. Durak noktalarını seç", detail: "Kapı, masa, pencere, buzdolabı gibi 10-20 sabit nokta belirle. Bunlar senin 'kancaların'.", color: "emerald" },
          { label: "3. Bilgiyi absürt bir görüntüyle yerleştir", detail: "Ne kadar komik, abartılı ve duyusal olursa o kadar kalıcı olur. Osmanlı padişahı mutfakta yemek pişiriyorsa bu unutulmaz!", color: "amber" },
          { label: "4. Zihinsel yürüyüş yap", detail: "Sınavda o mekânda yürüyormuş gibi hayal et. Her durakta bilgi kendiliğinden gelecek.", color: "purple" }
        ]
      },
      {
        type: "example",
        title: "Uygulama Örneği — Osmanlı Kuruluş Dönemi Padişahları",
        items: [
          "🚪 Kapı → Osman Bey kapıyı açıyor (kurucu, kapıyı açan)",
          "🛋️ Koltuk → Orhan Bey koltuğa oturmuş para basıyor (ilk sikke)",
          "🪞 Ayna → I. Murad aynada kendine bakıyor, 'Devşirme' yazıyor (devşirme sistemi)",
          "🍳 Mutfak → Yıldırım Bayezid mutfakta şimşek hızında yemek pişiriyor (hızlı fetihler)",
          "📚 Kitaplık → Çelebi Mehmet kitap okuyor, devleti 'yeniden' birleştiriyor (Fetret Devri sonu)"
        ]
      }
    ]
  },
  {
    id: "zincir",
    no: 2,
    icon: "🔗",
    color: "emerald",
    title: "ZİNCİRLEME (CHAIN) YÖNTEMİ",
    badge: "Sıralı Bilgiler İçin",
    summary: "Ezberlenecek öğeleri birbirine absürt hikâyelerle bağla. Her öğe bir sonrakini tetikler.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Mantığı", def: "A → B → C → D şeklinde her bilgi bir sonrakini çağrıştırır. Beyni zincir gibi düşün: bir halka koptuğunda bile diğerleri tutunur." },
          { term: "Altın Kural", def: "Bağlantılar ne kadar ABSÜRT, KOMİK ve ABARTILI olursa o kadar kalıcıdır. Beyniniz sıradan şeyleri unutur, tuhaf şeyleri hatırlar." }
        ]
      },
      {
        type: "example",
        title: "Uygulama — Türk Devletleri Sırası",
        items: [
          "🏹 HUNLAR bir ok attı → Ok bir GÖKTÜRK'ün zırhına saplandı",
          "🐺 GÖKTÜRK kurt gibi koştu → UYGUR tapınağına çarptı",
          "📜 UYGUR matbaada kitap basıyordu → Kitap KARAHANLI'nın kafasına düştü",
          "⚔️ KARAHANLI kılıcını çekti → GAZNELİ fili ürkütüp kaçırdı",
          "🐘 GAZNELİ fil SELÇUKLU çadırını ezdi → Tarih dizildi!"
        ]
      },
      {
        type: "alert",
        variant: "warning",
        title: "⚠️ Dikkat — Zincirleme Yöntemin Zayıf Noktası",
        text: "Eğer bir halka (öğe) unutulursa, zincir kopabilir. Bu yüzden uzun listeler için Loci Yöntemi ile birleştir veya 7±2 kuralına uy (bir zincirde en fazla 5-9 öğe)."
      }
    ]
  },
  {
    id: "cengel",
    no: 3,
    icon: "🪝",
    color: "amber",
    title: "ÇENGEL (PEG) SİSTEMİ",
    badge: "Sayılarla Ezberleme",
    summary: "Sayıları somut nesnelerle eşleştir, sonra bilgiyi o nesneye 'as'. 1=Kalem, 2=Kuğu, 3=Kalp...",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Peg (Çengel) Nedir?", def: "Her sayıya kalıcı bir nesne atarsın. Bu nesne senin 'çengelin'. Sonra ezberleyeceğin bilgiyi bu çengele asarsın." },
          { term: "Neden İşe Yarar?", def: "Sayılar soyuttur, beyin soyutu hatırlamakta zorlanır. Somut nesnelerle eşleştirince hafıza 10 kat güçlenir." }
        ]
      },
      {
        type: "cards",
        items: [
          { name: "Sayı-Nesne Eşleştirmesi", emoji: "🔢", color: "amber", points: [
            "1 = Kalem (dikey çubuk şekli)",
            "2 = Kuğu (2'nin eğrisi kuğuya benzer)",
            "3 = Kalp (yan dönünce kalp)",
            "4 = Yelkenli (4'ün üçgen şekli)",
            "5 = El (5 parmak)",
            "6 = Fil hortumu (6'nın kıvrımı)",
            "7 = Bayrak (7'nin şekli)",
            "8 = Gözlük (8'in iki halkası)",
            "9 = Balon (9'un şekli)",
            "0 = Top (yuvarlak)"
          ]},
          { name: "KPSS Uygulaması — Anayasa Tarihi", emoji: "📜", color: "purple", points: [
            "1 (Kalem) → 1876 Kanun-i Esasi — Kalemle ilk anayasa yazıldı",
            "2 (Kuğu) → 1921 Teşkilat-ı Esasiye — Kuğu gibi zarif ama kısa (en kısa anayasa)",
            "3 (Kalp) → 1924 Anayasası — Cumhuriyetin 'kalbi'",
            "4 (Yelkenli) → 1961 Anayasası — Özgürlük 'yelkenleri' açıldı (en özgürlükçü)",
            "5 (El) → 1982 Anayasası — Devletin 'eli' güçlendi (otoriter)"
          ]}
        ]
      }
    ]
  },
  {
    id: "hikaye",
    no: 4,
    icon: "📖",
    color: "purple",
    title: "HİKÂYELEŞTİRME YÖNTEMİ",
    badge: "Vatandaşlık & Tarih",
    summary: "Kuru bilgileri dramatik bir hikâyeye dönüştür. Beyin hikâyeleri %65 daha iyi hatırlar.",
    blocks: [
      {
        type: "features",
        items: [
          "Bir kahraman belirle (kendin, tarihî kişilik, hayali karakter)",
          "Bilgileri olaylar zinciri olarak kurgula — başlangıç, gelişme, sonuç",
          "Duygusal öğeler ekle: korku, kahkaha, şaşkınlık, zafer",
          "5 duyuyu dahil et: ses, koku, dokunuş, görüntü, tat",
          "Hikâyeyi her tekrarda biraz daha ayrıntılı hayal et"
        ]
      },
      {
        type: "example",
        title: "Uygulama — Atatürk İlkeleri (6 Ok) Hikâyesi",
        items: [
          "📍 Bir köyde yaşayan Cumhuriyet adında bir kız var (CUMHURİYETÇİLİK)",
          "🎓 Halk tarafından seçilerek muhtarlığa geldi (HALKÇİLIK)",
          "🔄 Köyün eski düzenini baştan değiştirdi (İNKILAPÇILIK)",
          "🏛️ Din ve devlet işlerini ayırdı, herkes özgür (LAİKLİK)",
          "🏭 Fabrikalar kurarak köyü kalkındırdı (DEVLETÇİLİK)",
          "🇹🇷 Tüm milletin birlik olmasını sağladı (MİLLİYETÇİLİK)"
        ]
      }
    ]
  },
  {
    id: "gruplama",
    no: 5,
    icon: "📦",
    color: "teal",
    title: "GRUPLAMA (CHUNKING) YÖNTEMİ",
    badge: "Miller Kuralı 7±2",
    summary: "Kısa süreli bellek aynı anda 7±2 öğe tutar. Bilgileri anlamlı gruplara böl.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Chunking Nedir?", def: "Büyük bilgi yığınını küçük, anlamlı gruplara bölme. Telefon numarasını 05XX-XXX-XX-XX şeklinde grupladığın gibi." },
          { term: "KPSS'de Uygulama", def: "Örneğin 30 tane savaşı kronolojik 5'er 5'er grupla. Her gruba bir tema ver (Kuruluş Savaşları, Yükseliş Savaşları vb.)." }
        ]
      },
      {
        type: "compare",
        left: {
          title: "❌ YANLIŞ — Tek Liste Halinde",
          color: "rose",
          items: [
            "Kösedağ, Ankara, Niğbolu, Varna, Kosova I, Kosova II, Mohaç, Preveze, Çaldıran, Mercidabık, Ridaniye... (Beyniniz karışır!)"
          ]
        },
        right: {
          title: "✅ DOĞRU — Gruplanmış",
          color: "emerald",
          items: [
            "🏗️ Kuruluş: Kösedağ, Bafeus, Koyunhisar",
            "📈 Yükseliş: Kosova I-II, Niğbolu, Varna, Mohaç",
            "⚓ Deniz: Preveze, İnebahtı, Çeşme",
            "🌍 Doğu: Çaldıran, Mercidabık, Ridaniye",
            "📉 Gerileme: Zitvatorok, Karlofça, Pasarofça"
          ]
        }
      }
    ]
  },
  {
    id: "aralikli",
    no: 6,
    icon: "📅",
    color: "rose",
    title: "ARALIKLI TEKRAR (SPACED REPETITION)",
    badge: "Bilimsel Olarak Kanıtlanmış",
    summary: "Ebbinghaus Unutma Eğrisi'ne göre bilgi 24 saat içinde %70 kaybolur. Aralıklı tekrar bunu önler.",
    blocks: [
      {
        type: "alert",
        variant: "danger",
        title: "⚠️ Ebbinghaus Unutma Eğrisi — Gerçek Tehlike",
        text: "Bir konuyu çalıştıktan 24 saat sonra %70'ini, 1 hafta sonra %90'ını unutursun. Ama doğru aralıklarla tekrar edersen, bilgi kalıcı belleğe geçer ve %95+ hatırlarsın."
      },
      {
        type: "chain",
        title: "Optimum Tekrar Takvimi",
        items: ["Aynı gün", "1 gün sonra", "3 gün sonra", "7 gün sonra", "21 gün sonra", "45 gün sonra"]
      },
      {
        type: "rules",
        items: [
          { label: "Aktif Geri Çağırma (Active Recall)", detail: "Notları tekrar okumak yerine, kitabı kapat ve aklından hatırlamaya çalış. Hatırlayamadıklarını not al, onları tekrar çalış. Bu yöntem pasif okumadan 3 kat daha etkili.", color: "emerald" },
          { label: "Blurting Yöntemi", detail: "Boş bir kâğıda konuyla ilgili aklına gelen HER ŞEYİ yaz. Sonra notlarınla karşılaştır. Eksiklerini gör.", color: "blue" },
          { label: "Feynman Tekniği", detail: "Konuyu 10 yaşında bir çocuğa anlatıyormuş gibi basitçe açıkla. Takıldığın yer = eksik anladığın yer.", color: "amber" },
          { label: "Pomodoro + Aralıklı Tekrar", detail: "25 dk çalış → 5 dk ara → Her pomodoro sonunda o konunun 3 ana noktasını tekrar et. Gün sonunda tüm konuları 1'er dakikada özetle.", color: "purple" }
        ]
      }
    ]
  },
  {
    id: "akrostiş",
    no: 7,
    icon: "🔤",
    color: "sky",
    title: "AKROSTİŞ VE KISALTMA YÖNTEMİ",
    badge: "Hızlı Ezber",
    summary: "Her kelimenin baş harfinden anlamlı bir kelime veya cümle oluştur.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "Atatürk İlkeleri — 'CHİLDM'", emoji: "🇹🇷", color: "sky", points: [
            "C → Cumhuriyetçilik",
            "H → Halkçılık",
            "İ → İnkılapçılık",
            "L → Laiklik",
            "D → Devletçilik",
            "M → Milliyetçilik"
          ]},
          { name: "Montrö Boğazlar Sözleşmesi — 'Ticari gemiler GEÇER'", emoji: "🚢", color: "blue", points: [
            "Ticaret gemileri serbestçe geçer",
            "Savaş gemileri sınırlıdır",
            "Türkiye'nin egemenlik hakları güvence altına alınmıştır"
          ]},
          { name: "İlk Türk Devletleri — 'AGHUK'", emoji: "⚔️", color: "amber", points: [
            "A → Asya Hun",
            "G → Göktürk",
            "H → Hazarlar (dini hoşgörü)",
            "U → Uygur (yerleşik + matbaa)",
            "K → Kırgız"
          ]},
          { name: "Kurtuluş Savaşı Cepheleri — 'BAD G'", emoji: "🎖️", color: "emerald", points: [
            "B → Batı Cephesi",
            "A → Atatürk (Başkomutan)",
            "D → Doğu Cephesi",
            "G → Güney Cephesi"
          ]}
        ]
      }
    ]
  },
  {
    id: "gorsel",
    no: 8,
    icon: "🗺️",
    color: "red",
    title: "GÖRSEL & ZİHİN HARİTASI TEKNİĞİ",
    badge: "Coğrafya & Vatandaşlık",
    summary: "Bilgileri renkli bir harita/diyagram olarak çiz. Beyin görsel bilgiyi metinden 60.000 kat hızlı işler.",
    blocks: [
      {
        type: "features",
        items: [
          "Ana konuyu merkeze yaz, dallar halinde alt başlıkları ekle",
          "Her dal için farklı renk kullan (beyinde farklı bölgeleri aktifleştirir)",
          "Mümkünse küçük ikonlar/çizimler ekle (görsel bellek tetiklenir)",
          "Sadece ANAHTAR KELİMELER yaz — uzun cümleler değil!",
          "Tek bir A4 kâğıda tüm konuyu sığdırmaya çalış (sınırlandırma = özetleme becerisi)"
        ]
      },
      {
        type: "tore",
        title: "Zihin Haritası İçin Renk Kodları",
        items: [
          { term: "🔴 Kırmızı", def: "Tarihler & Savaşlar" },
          { term: "🔵 Mavi", def: "Kavramlar & Tanımlar" },
          { term: "🟢 Yeşil", def: "Sonuçlar & Etkiler" },
          { term: "🟡 Sarı", def: "İsimler & Yerler" }
        ]
      },
      {
        type: "conclusion",
        text: "Coğrafya'da haritaya işaretleyerek çalışmak, düz okumaya göre %80 daha kalıcı. Vatandaşlık'ta Anayasa maddelerini şema olarak çizmek, ezberden 3 kat daha etkili."
      }
    ]
  },
  {
    id: "uyku",
    no: 9,
    icon: "😴",
    color: "indigo",
    title: "UYKU ÖNCESİ KODLAMA",
    badge: "Nörobilim Destekli",
    summary: "Uyumadan önceki 30 dakika, beynin en çok hafızaya aldığı zaman dilimi. Bunu değerlendir!",
    blocks: [
      {
        type: "rules",
        items: [
          { label: "Uyumadan 30 dk önce", detail: "O gün çalıştığın en zor konunun özetini oku veya ses kaydını dinle. Beyin uyku sırasında bu bilgiyi konsolide eder (kalıcı belleğe taşır).", color: "indigo" },
          { label: "Sabah ilk 10 dakika", detail: "Kalktığında telefona bakmadan ÖNCE dünkü konuyu hatırlamaya çalış. Bu 'uyanma geri çağırması' bilgiyi çimentolaştırır.", color: "blue" },
          { label: "Minimum 7 saat uyku", detail: "6 saatten az uyuyan kişilerde hafıza konsolidasyonu %40 azalır. KPSS maratonu koşarken uykudan kısma!", color: "rose" },
          { label: "Kısa uyku (Power Nap)", detail: "Öğleden sonra 20 dakikalık uyku, hafızayı %34 güçlendirir (NASA araştırması). Ama 30 dakikayı geçme, uyku ataletiöne girer.", color: "emerald" }
        ]
      }
    ]
  },
  {
    id: "pratik",
    no: 10,
    icon: "🎯",
    color: "orange",
    title: "KPSS'YE ÖZEL PRATİK İPUÇLARI",
    badge: "Sınav Stratejisi",
    summary: "Tüm teknikleri KPSS'ye nasıl entegre edeceğinin yol haritası.",
    blocks: [
      {
        type: "compare",
        left: {
          title: "📚 Ders Bazlı Teknik Eşleştirme",
          color: "emerald",
          items: [
            "Tarih → Loci + Zincir + Hikâye",
            "Coğrafya → Zihin Haritası + Görsel Kodlama",
            "Vatandaşlık → Akrostiş + Gruplama",
            "Türkçe → Feynman + Aktif Geri Çağırma",
            "Matematik → Problem Çöz + Blurting",
            "Eğitim Bilimleri → Peg + Hikâye"
          ]
        },
        right: {
          title: "⏰ Günlük Çalışma Planı",
          color: "blue",
          items: [
            "08:00-10:00 → Yeni konu (Pomodoro tekniği)",
            "10:15-11:00 → Dünkü konuyu Aktif Geri Çağır",
            "11:15-12:30 → Soru çöz (hatalıları not al)",
            "14:00-15:30 → Zihin haritası çiz",
            "15:45-17:00 → Zayıf konu tekrar",
            "22:30-23:00 → Uyku öncesi özet kodlama"
          ]
        }
      },
      {
        type: "conclusion",
        text: "Her tekniği tek başına kullanma, COMBO yap! Örneğin: Bir konuyu önce Loci ile kodla → Akrostiş ile kısalt → Aralıklı tekrar ile pekiştir → Uyku öncesi tekrar et. Bu döngü bilgiyi %95+ kalıcı yapar."
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
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  glow: "shadow-indigo-500/5",  dot: "bg-indigo-400",  accent: "text-indigo-300" },
  orange:  { bg: "bg-orange-500/10",  border: "border-orange-500/20",  text: "text-orange-400",  glow: "shadow-orange-500/5",  dot: "bg-orange-400",  accent: "text-orange-300" },
};

const getC = (name) => colorMap[name] || colorMap.emerald;

// ── Block Renderers ──────────────────────────────────────────────
const RenderChain = ({ block, isDark }) => (
  <div className="my-4">
    <div className={`text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
      <LuChevronRight size={10} className="text-blue-400" />
      {block.title}
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {block.items.map((item, i) => (
        <React.Fragment key={i}>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDark ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
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

const RenderAlert = ({ block, isDark }) => (
  <div className={`my-4 p-4 rounded-xl border-l-4 ${
    block.variant === "danger"
      ? isDark ? "bg-rose-500/5 border-rose-500 text-rose-300" : "bg-rose-50 border-rose-500 text-rose-700"
      : isDark ? "bg-amber-500/5 border-amber-500 text-amber-300" : "bg-amber-50 border-amber-500 text-amber-700"
  }`}>
    <div className="text-sm font-bold mb-1 flex items-center gap-2">
      <LuZap size={14} />
      {block.title}
    </div>
    <p className="text-xs leading-relaxed opacity-90">{block.text}</p>
  </div>
);

const RenderConclusion = ({ block, isDark }) => (
  <div className={`my-4 p-4 rounded-xl ${isDark ? "bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-blue-500/5 border border-emerald-500/15" : "bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200"}`}>
    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
      <LuTarget size={10} />
      SONUÇ
    </div>
    <p className={`text-sm leading-relaxed font-medium ${isDark ? "text-emerald-200/90" : "text-emerald-800"}`}>{block.text}</p>
  </div>
);

const RenderOsym = ({ block, isDark }) => (
  <div className={`my-4 p-4 rounded-xl ${isDark ? "bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/15" : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"}`}>
    <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
      <LuTarget size={10} />
      {block.title}
    </div>
    <p className={`text-xs leading-relaxed ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>{block.text}</p>
  </div>
);

const RenderRules = ({ block, isDark }) => (
  <div className="my-4 space-y-2.5">
    {block.items.map((rule, i) => {
      const c = getC(rule.color);
      return (
        <div key={i} className={`p-3.5 rounded-xl border ${c.bg} ${c.border} transition-all hover:scale-[1.01]`}>
          <div className={`text-xs font-black ${c.text} flex items-center gap-2 mb-1`}>
            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
            {rule.label}
          </div>
          <p className={`text-[11px] leading-relaxed pl-4 ${isDark ? "text-slate-300/80" : "text-slate-600"}`}>{rule.detail}</p>
        </div>
      );
    })}
  </div>
);

const RenderDefinition = ({ block, isDark }) => (
  <div className="my-4 space-y-3">
    {block.items.map((item, i) => (
      <div key={i} className="flex gap-3">
        <div className="shrink-0 mt-1">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${isDark ? "bg-slate-800 border border-slate-700/50 text-slate-400" : "bg-slate-100 border border-slate-200 text-slate-500"}`}>
            {i + 1}
          </span>
        </div>
        <div>
          <span className={`text-xs font-black ${isDark ? "text-white/90" : "text-slate-900"}`}>{item.term}</span>
          <p className={`text-[11px] leading-relaxed mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.def}</p>
        </div>
      </div>
    ))}
  </div>
);

const RenderFeatures = ({ block, isDark }) => (
  <div className="my-4 space-y-2">
    {block.items.map((item, i) => (
      <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors ${isDark ? "bg-purple-500/5 border-purple-500/10 hover:bg-purple-500/10" : "bg-purple-50 border-purple-100 hover:bg-purple-100"}`}>
        <span className={`mt-0.5 shrink-0 ${isDark ? "text-purple-400" : "text-purple-500"}`}>
          <LuSparkles size={11} />
        </span>
        <span className={`text-[11px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item}</span>
      </div>
    ))}
  </div>
);

const RenderCompare = ({ block, isDark }) => (
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
              <li key={j} className={`flex items-start gap-2 text-[11px] leading-relaxed ${isDark ? "text-slate-300/90" : "text-slate-600"}`}>
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

const RenderCards = ({ block, isDark }) => (
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
              <li key={j} className={`flex items-start gap-2 text-[11px] leading-relaxed ${isDark ? "text-slate-300/90" : "text-slate-600"}`}>
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

const RenderTore = ({ block, isDark }) => (
  <div className="my-4">
    <div className={`text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark ? "text-teal-400" : "text-teal-600"}`}>
      <LuLayers size={10} />
      {block.title}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {block.items.map((item, i) => (
        <div key={i} className={`p-3 rounded-xl text-center transition-colors ${isDark ? "bg-teal-500/5 border border-teal-500/15 hover:bg-teal-500/10" : "bg-teal-50 border border-teal-200 hover:bg-teal-100"}`}>
          <div className={`text-xs font-black ${isDark ? "text-teal-300" : "text-teal-700"}`}>{item.term}</div>
          <div className={`text-[10px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.def}</div>
        </div>
      ))}
    </div>
  </div>
);

const RenderExample = ({ block, isDark }) => (
  <div className="my-4">
    <div className={`text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
      <LuLightbulb size={10} />
      {block.title}
    </div>
    <div className="space-y-2">
      {block.items.map((item, i) => (
        <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors ${isDark ? "bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10" : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100"}`}>
          <span className={`text-[11px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Block Dispatcher ─────────────────────────────────────────────
const RenderBlock = ({ block, isDark }) => {
  switch (block.type) {
    case "chain":      return <RenderChain block={block} isDark={isDark} />;
    case "alert":      return <RenderAlert block={block} isDark={isDark} />;
    case "conclusion": return <RenderConclusion block={block} isDark={isDark} />;
    case "osym":       return <RenderOsym block={block} isDark={isDark} />;
    case "rules":      return <RenderRules block={block} isDark={isDark} />;
    case "definition": return <RenderDefinition block={block} isDark={isDark} />;
    case "features":   return <RenderFeatures block={block} isDark={isDark} />;
    case "compare":    return <RenderCompare block={block} isDark={isDark} />;
    case "cards":      return <RenderCards block={block} isDark={isDark} />;
    case "tore":       return <RenderTore block={block} isDark={isDark} />;
    case "example":    return <RenderExample block={block} isDark={isDark} />;
    default:           return null;
  }
};

// ── Main Component ───────────────────────────────────────────────
const HafizaTeknikleriTab = ({ theme }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState("rehber");
  const isDark = theme === "dark";

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── HEADER BANNER ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/20 border-slate-800"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200"
      }`}>
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px"
        }} />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${isDark ? "bg-indigo-500/10 border border-indigo-500/20 shadow-indigo-500/5" : "bg-indigo-100 border border-indigo-200 shadow-indigo-200/50"}`}>
                🧠
              </span>
              <div>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Hafıza Teknikleri & Yöntemleri
                </h2>
                <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  KPSS 2026 Lisans — Bilimsel Ezberleme Stratejileri
                </p>
              </div>
            </div>
            <p className={`text-[13px] leading-relaxed max-w-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Nörobilim destekli hafıza teknikleri ile KPSS'ye özel uygulamalı ezberleme yöntemleri. 
              Her teknik, KPSS dersleriyle entegre edilmiş gerçek örneklerle açıklanmıştır.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
              isDark ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-indigo-100 text-indigo-700 border border-indigo-200"
            }`}>
              <LuBrain size={14} />
              {HAFIZA_TEKNIKLERI.length} Teknik
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
              isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
            }`}>
              <LuGraduationCap size={14} />
              KPSS 2026
            </div>
          </div>
        </div>

        {/* Sub-view Navigation Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-700/40">
          <button
            onClick={() => setViewMode("rehber")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === "rehber"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs"
                : isDark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <LuBookOpen size={14} />
            📖 Hafıza Teknikleri Rehberi
          </button>
          <button
            onClick={() => setViewMode("egit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === "egit"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs"
                : isDark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <LuSparkles size={14} />
            🤖 KPSS Hafıza AI Alıştırma (Eğit)
          </button>
        </div>
      </div>

      {viewMode === "egit" ? (
        <HafizaTeknikleriEgitTab theme={theme} />
      ) : (
        <>

      {/* ── TABLE OF CONTENTS ── */}
      <div className={`rounded-2xl border p-5 ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className={`text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
          isDark ? "text-slate-500" : "text-slate-400"
        }`}>
          <LuBookmark size={10} className="text-indigo-400" />
          TEKNİKLER
        </div>
        <div className="flex flex-wrap gap-2">
          {HAFIZA_TEKNIKLERI.map((note) => {
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

      {/* ── TECHNIQUE CHAPTERS ── */}
      <div className="space-y-4">
        {HAFIZA_TEKNIKLERI.map((note) => {
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
                className={`w-full p-5 flex items-center gap-4 text-left cursor-pointer transition-colors group ${isDark ? "hover:bg-slate-800/20" : "hover:bg-slate-50"}`}
              >
                {/* Chapter Number Badge */}
                <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  {note.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                      Teknik {note.no}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                      {note.badge}
                    </span>
                  </div>
                  <h3 className={`text-sm md:text-base font-black mt-1 ${isDark ? "text-white/90" : "text-slate-900"}`}>
                    {note.title}
                  </h3>
                  {!isOpen && (
                    <p className={`text-[11px] mt-1 line-clamp-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
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
                    <p className={`text-xs font-semibold leading-relaxed ${c.accent}`}>
                      💡 {note.summary}
                    </p>
                  </div>

                  {/* Content Blocks */}
                  {note.blocks.map((block, i) => (
                    <RenderBlock key={i} block={block} isDark={isDark} />
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
          🧠 Bu hafıza teknikleri nörobilim araştırmaları ve bilişsel psikoloji çalışmalarına dayanmaktadır.
          Her teknik KPSS 2026 Lisans müfredatına uyarlanarak hazırlanmıştır.
        </p>
      </div>
        </>
      )}
    </div>
  );
};

export default HafizaTeknikleriTab;
