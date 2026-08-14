import React, { useState, useEffect } from "react";
import {
  LuBrain, LuChevronRight, LuStar, LuBookOpen,
  LuBookmark, LuSparkles, LuTarget, LuLightbulb,
  LuRepeat, LuLayers, LuLink, LuMapPin,
  LuClock, LuCircleCheck, LuZap, LuGraduationCap,
  LuSearch, LuCopy, LuCheck, LuInfo, LuX, LuFilter
} from "react-icons/lu";

// ── MEHMET EĞİT (EĞİT AKADEMİ) MEŞHUR KPSS HAFIZA TEKNİKLERİ VERİSİ ──
const EGIT_HAFIZA_TEKNIKLERI = [
  // 🗺️ COĞRAFYA
  {
    id: "egit-cog-01",
    subject: "Coğrafya",
    no: 1,
    icon: "🌊",
    color: "blue",
    title: "TEKTONİK GÖLLER — TUZLU KÜÇÜK SAMAN",
    mnemonic: "TUZLU KÜÇÜK SAMAN",
    badge: "ÖSYM Garanti Soru",
    summary: "Türkiye'nin en yaygın göl tipi olan Tektonik Gölleri 'TUZLU KÜÇÜK SAMAN' kelime grubuyla saniyeler içinde hatırla!",
    story: "Tuzlu küçük bir saman balyası göle düşmüş, koyunlar tuzlu samanı yemek için yarışıyor!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifre Kırılımı (TUZLU KÜÇÜK SAMAN)",
        items: [
          { letter: "T", text: "Tuz Gölü", color: "blue" },
          { letter: "U", text: "Uluabat (Apolyont)", color: "cyan" },
          { letter: "Z", text: "İznik (Z harfi çağrışımı)", color: "indigo" },
          { letter: "L", text: "Ladık Gölü", color: "sky" },
          { letter: "U", text: "Urmiye / Ulubey", color: "blue" },
          { letter: "S", text: "Sapanca Gölü", color: "emerald" },
          { letter: "A", text: "Akşehir Gölü", color: "amber" },
          { letter: "M", text: "Manyas (Kuş Gölü)", color: "purple" },
          { letter: "A", text: "Amik Gölü", color: "rose" },
          { letter: "N", text: "Nazik / Nimet", color: "teal" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ Mehmet Eğit'ten ÖSYM Tuzağı Uyarısı!",
        text: "ÖSYM 'Aşağıdakilerden hangisi kartik oluşumlu değildir?' diye sorar ve şıklara İZNİK veya SAPANCA koyar. İki göl de Tektonik oluşumludur! Salda ve Suğla ile Karıştırma!"
      },
      {
        type: "practice_question",
        question: "Aşağıdaki göllerden hangisi tektonik kökenli bir göldür?",
        options: ["A) Salda Gölü", "B) Sapanca Gölü", "C) Meke Tuzlası", "D) Uzungöl"],
        answerIndex: 1,
        explanation: "Sapanca Gölü 'TUZLU KÜÇÜK SAMAN' şifresindeki 'S' harfidir ve Tektonik göldür. Salda Karstik, Meke Volkanik/Maar, Uzungöl ise Heyelan Set gölüdür."
      }
    ]
  },
  {
    id: "egit-cog-02",
    subject: "Coğrafya",
    no: 2,
    icon: "⛏️",
    color: "amber",
    title: "BAKIR ÇIKARILAN YERLER — KADER",
    mnemonic: "KADER",
    badge: "Madenler Şifresi",
    summary: "Türkiye'de Bakır madeninin çıkarıldığı 5 ana bölgeyi 'KADER' kelimesiyle unutulmaz yap.",
    story: "Bakır ustası kaderine razı olmuş, kasanın başına geçmiş bakır kapları işliyor!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifre Kırılımı (KADER)",
        items: [
          { letter: "K", text: "Kastamonu — Küre", color: "amber" },
          { letter: "A", text: "Artvin — Murgul", color: "emerald" },
          { letter: "D", text: "Diyarbakır — Ergani", color: "purple" },
          { letter: "E", text: "Elazığ — Maden", color: "blue" },
          { letter: "R", text: "Rize — Çayeli", color: "rose" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ ÖSYM Taktik Bilgisi",
        text: "Samsun'da bakır ÇIKARILMAZ, sadece İŞLENİR! (Karadeniz limanı ve hinterlandı geniş olduğu için Ulaşım kolaylığından dolayı işleme tesisi kurulmuştur)."
      }
    ]
  },
  {
    id: "egit-cog-03",
    subject: "Coğrafya",
    no: 3,
    icon: "🌋",
    color: "rose",
    title: "VOLKANİK DAĞLAR — KIRDA NEMLİ HASAT",
    mnemonic: "KIRDA NEMLİ HASAT",
    badge: "Fiziki Coğrafya",
    summary: "İç Anadolu ve Doğu Anadolu'daki volkanik dağ silsilesini tek hamlede ezberle.",
    story: "Kırda nemli bir havada buğday hasadı yaparken arkadaki volkanik dağ patlıyor!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifre Kırılımı (KIRDA NEMLİ HASAT)",
        items: [
          { letter: "K", text: "Kula (Manisa — En genç volkanik alan)", color: "rose" },
          { letter: "R", text: "Erciyes Dağı (Kayseri)", color: "amber" },
          { letter: "N", text: "Nemrut Dağı (Bitlis)", color: "blue" },
          { letter: "E", text: "Erciyes / Erçek", color: "cyan" },
          { letter: "M", text: "Melendiz Dağı (Niğde)", color: "purple" },
          { letter: "H", text: "Hasan Dağı (Aksaray)", color: "emerald" },
          { letter: "A", text: "Ağrı Dağı (Türkiye'nin En Yüksek Zirvesi)", color: "indigo" },
          { letter: "S", text: "Süphan Dağı (Van)", color: "teal" },
          { letter: "T", text: "Tendürek Dağı (Ağrı-Van)", color: "rose" }
        ]
      }
    ]
  },
  {
    id: "egit-cog-04",
    subject: "Coğrafya",
    no: 4,
    icon: "💨",
    color: "cyan",
    title: "RÜZGARLAR (YEREL RÜZGARLAR) — KAYIP SAKAL",
    mnemonic: "KAYIP SAKAL",
    badge: "İklim & Rüzgarlar",
    summary: "Türkiye'yi etkisi altına alan soğuk ve sıcak yerel rüzgarların esiş yönüyle şifresi.",
    story: "Kuzeyden gelen rüzgarlar soğuktan sakalımızı dondurdu, güneyden esenler sakalımızı yaktı!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Kuzeyden Esen Soğuk Rüzgarlar (KAYIP)",
        items: [
          { letter: "K", text: "Karayel (Kuzeybatıdan eser — Soğuk & Kar)", color: "blue" },
          { letter: "Y", text: "Yıldız (Kuzeyden eser — Karadeniz kıyıları)", color: "cyan" },
          { letter: "P", text: "Poyraz (Kuzeydoğudan eser — Buz gibi soğuk)", color: "indigo" }
        ]
      },
      {
        type: "code_breakdown",
        title: "Güneyden Esen Sıcak Rüzgarlar (SAKAL)",
        items: [
          { letter: "S", text: "Samyeli / Keşişleme (Güneydoğudan — Çöl sıcağı)", color: "amber" },
          { letter: "K", text: "Kıble (Güneyden eser — Sıcak & Nem)", color: "rose" },
          { letter: "L", text: "Lodos (Güneybatıdan eser — Göz yaşartan ılık lodos)", color: "purple" }
        ]
      }
    ]
  },
  {
    id: "egit-cog-05",
    subject: "Coğrafya",
    no: 5,
    icon: "🏔️",
    color: "emerald",
    title: "HEYELAN SET GÖLLERİ — UZUNGÖL'DE SERA",
    mnemonic: "SERA ABANT TORTUM",
    badge: "Karadeniz Gölleri",
    summary: "Heyelan sonucu akarsu önünün kapanmasıyla oluşan Karadeniz gölleri şifresi.",
    story: "Uzungöl'de bir Sera kurduk, Abant'a gidip Tortum şelalesinde piknik yaptık!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifreli Heyelan Set Gölleri",
        items: [
          { letter: "S", text: "Sera Gölü (Trabzon)", color: "emerald" },
          { letter: "A", text: "Abant Gölü (Bolu)", color: "teal" },
          { letter: "Y", text: "Yedigöller (Bolu)", color: "cyan" },
          { letter: "T", text: "Tortum Gölü (Erzurum)", color: "blue" },
          { letter: "Z", text: "Zinav Gölü (Tokat)", color: "indigo" },
          { letter: "B", text: "Borabay Gölü (Amasya)", color: "purple" }
        ]
      }
    ]
  },

  // 🏛️ TARİH
  {
    id: "egit-tar-01",
    subject: "Tarih",
    no: 6,
    icon: "⚔️",
    color: "rose",
    title: "OSMANLI HAÇLI SAVAŞLARI — SINAV II",
    mnemonic: "SINAV II",
    badge: "Kronolojik Savaşlar",
    summary: "Osmanlı Devleti'nin Avrupalı Haçlı ordularına karşı yaptığı tüm meydan savaşlarının sırası.",
    story: "Osmanlı ordusu Haçlılara karşı zorlu bir SINAV verdi ve peş peşe zaferler kazandı!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Savaş Kronolojisi (SINAV II)",
        items: [
          { letter: "S", text: "Sırpsındığı Savaşı (1364 - İlk Osmanlı-Haçlı Savaşı)", color: "rose" },
          { letter: "I", text: "I. Kosova Savaşı (1389 - I. Murad Şehit düştü)", color: "amber" },
          { letter: "N", text: "Niğbolu Savaşı (1396 - Yıldırım Bayezid Sultanu'r Rum)", color: "purple" },
          { letter: "A", text: "Ankara Savaşı (1402 - İki Türk hükümdarın savaşı)", color: "blue" },
          { letter: "V", text: "Varna Savaşı (1444 - II. Murad tekrar tahta geçti)", color: "emerald" },
          { letter: "II", text: "II. Kosova Savaşı (1448 - Balkanlar kesin Türk yurdu oldu)", color: "indigo" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ ÖSYM Püf Noktası!",
        text: "II. Kosova Savaşı ile Miryokefalon Savaşı'nın ortak özelliği: İkisi de YURTTUTAN / SAVUNMA savaşıdır ve yurt kesinleştirilmiştir!"
      }
    ]
  },
  {
    id: "egit-tar-02",
    subject: "Tarih",
    no: 7,
    icon: "📜",
    color: "purple",
    title: "DOĞU SINIRIMIZI ÇİZEN ANTLAŞMALAR — GAZİ MUSTAFA KEMAL",
    mnemonic: "GAZİ MUSTAFA KEMAL (G-M-K)",
    badge: "Kurtuluş Savaşı",
    summary: "Doğu sınırımızın sırasıyla çizildiği 3 tarihi antlaşma (GMK kuralı).",
    story: "Gazi Mustafa Kemal Paşa kalemi eline aldı, doğu sınırımıza çelikten bir sur çizdi!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifre Kırılımı (G - M - K)",
        items: [
          { letter: "G", text: "Gümrü Antlaşması (1920 — Ermenistan ile, TBMM'nin ilk siyasi zaferi)", color: "purple" },
          { letter: "M", text: "Moskova Antlaşması (1921 — Sovyet Rusya ile, ilk taviz Batum)", color: "indigo" },
          { letter: "K", text: "Kars Antlaşması (1921 — Kafkas Cumhuriyetleri ile, DOĞU SINIRI KESİNLEŞTİ)", color: "emerald" }
        ]
      }
    ]
  },
  {
    id: "egit-tar-03",
    subject: "Tarih",
    no: 8,
    icon: "🇹🇷",
    color: "emerald",
    title: "MİSAK-I MİLLİ KARARLARI — KAPAR",
    mnemonic: "KAPAR",
    badge: "Son Mebusan Meclisi",
    summary: "Son Osmanlı Mebusan Meclisi'nde kabul edilen Misak-ı Milli konuları.",
    story: "Türk milleti bağımsızlığı için kapıları kapatır, haklarını KAPAR!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifre Kırılımı (KAPAR)",
        items: [
          { letter: "K", text: "Kapitülasyonlar (Kaldırılmalıdır, ilk kez reddedildi)", color: "emerald" },
          { letter: "A", text: "Azınlık Hakları (Komşu ülkelerdeki Müslümanlar kadar olacak)", color: "teal" },
          { letter: "P", text: "Pasaport / Boğazlar (Güvenliği sağlandığında ticarete açılacak)", color: "blue" },
          { letter: "A", text: "Araplar (Arap topraklarında halk oylaması/referandum)", color: "purple" },
          { letter: "R", text: "Referandum (Kars, Ardahan, Batum ve Batı Trakya'da halk oylaması)", color: "rose" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ Mehmet Eğit'ten ÖSYM Tuzağı Uyarısı!",
        text: "Misak-ı Milli kararlarında ULUSAL EGEMENLİK (Milli İrade/Seçimler) ile ilgili HİÇBİR karar YOKTUR! Sadece Ulusal Bağımsızlık hedeflenmiştir."
      }
    ]
  },
  {
    id: "egit-tar-04",
    subject: "Tarih",
    no: 9,
    icon: "🤝",
    color: "indigo",
    title: "BALKAN ANTANTI ÜYELERİ — TAYYAR",
    mnemonic: "TAYYAR",
    badge: "Atatürk Dönemi Dış Politika",
    summary: "1934 yılında Almanya ve İtalya tehdidine karşı kurulan Balkan Antantı kurucu devletleri.",
    story: "TAYYAR uçakla Balkanlar üzerinde uçtu, dostluk pakını imzaladı!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Şifre Kırılımı (TAYYAR)",
        items: [
          { letter: "T", text: "Türkiye", color: "rose" },
          { letter: "A", text: "Yunanistan (A harfi çağrışımı)", color: "blue" },
          { letter: "Y", text: "Yugoslavya", color: "indigo" },
          { letter: "R", text: "Romanya", color: "purple" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ ÖSYM Tuzağı Uyarısı",
        text: "Bulgaristan ve Arnavutluk Balkan Antantı'na KATILMAMIŞTIR! Bulgaristan yayılmacı (revizyonist) politika izlediği için katılmadı."
      }
    ]
  },

  // ⚖️ VATANDAŞLIK
  {
    id: "egit-vat-01",
    subject: "Vatandaşlık",
    no: 10,
    icon: "🏛️",
    color: "purple",
    title: "YÜKSEK MAHKEMELER — SADECE 4 TANEDİR!",
    mnemonic: "AYDM (Anayasa, Yargıtay, Danıştay, Uyuşmazlık)",
    badge: "ÖSYM Şaşırtmacası",
    summary: "Türkiye Anayasası'na göre sadece 4 Yüksek Mahkeme vardır. ÖSYM'nin en sevdiği tuzak soru!",
    story: "Dört büyük sütunlu yüksek adalet sarayı: Anayasa, Yargıtay, Danıştay, Uyuşmazlık!",
    blocks: [
      {
        type: "code_breakdown",
        title: "4 Yüksek Mahkememiz",
        items: [
          { letter: "1", text: "Anayasa Mahkemesi (Norm denetimi & Bireysel başvuru)", color: "purple" },
          { letter: "2", text: "Yargıtay (Adli Yargının son inceleme mercii)", color: "indigo" },
          { letter: "3", text: "Danıştay (İdari Yargının son inceleme mercii)", color: "blue" },
          { letter: "4", text: "Uyuşmazlık Mahkemesi (Adli ve İdari yargı arasındaki görev uyuşmazlıkları)", color: "emerald" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ KRİTİK ÖSYM TUZAĞI (MEHMET EĞİT UYARISI)",
        text: "SAYIŞTAY ve YÜKSEK SEÇİM KURULU (YSK) yüksek mahkeme DEĞİLDİR! Ayrıca Askeri Yargıtay ve AYİM 2017 değişikliği ile KALDIRILMIŞTIR!"
      }
    ]
  },
  {
    id: "egit-vat-02",
    subject: "Vatandaşlık",
    no: 11,
    icon: "🗳️",
    color: "teal",
    title: "SİYASİ HAKLAR VE ÖDEVLER — DEVLETE KATILIM",
    mnemonic: "VATAN, ASKERLİK, DİLEKÇE, VERGİ, PARTİ",
    badge: "Temel Haklar",
    summary: "Anayasamızdaki 'Aktif Haklar' yani Siyasi Hak ve Ödevlerin pratik ayırımı.",
    story: "Vatandaş askerliğini yapar, vergisini öder, partiye üye olup dilekçesini verir!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Siyasi Haklar Listesi",
        items: [
          { letter: "V", text: "Vatandaşlık Hakkı (Türk devletine bağlık)", color: "teal" },
          { letter: "A", text: "Askerlik Hizmeti (Vatan hizmeti)", color: "emerald" },
          { letter: "D", text: "Dilekçe, Bilgi Edinme ve Kamu Denetçisine Başvuru", color: "blue" },
          { letter: "V", text: "Vergi Ödevi (Herkesin mali gücüne göre)", color: "amber" },
          { letter: "P", text: "Parti Kurma, Partilere Girme ve Partilerden Ayrılma", color: "purple" },
          { letter: "S", text: "Seçme, Seçilme ve Siyasi Faaliyette Bulunma", color: "rose" }
        ]
      }
    ]
  },

  // 📚 TÜRKÇE
  {
    id: "egit-tur-01",
    subject: "Türkçe",
    no: 12,
    icon: "📝",
    color: "rose",
    title: "KALIPLAŞMIŞ BİTİŞİK 'Kİ'LER — SOMBAHÇEMİ",
    mnemonic: "SOMBAHÇEMİ",
    badge: "Yazım Kuralları",
    summary: "Bağlaç olduğu halde kalıplaşarak istisna olarak BİTİŞİK yazılan 'ki'lerin şifresi.",
    story: "Sombahçemi sularken bağlaç olan ki'ler birbirine yapıştı, ayrılmaz oldu!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Bitişik Yazılan İstisna Ki'ler (SOMBAHÇEMİ)",
        items: [
          { letter: "S", text: "Sanki", color: "rose" },
          { letter: "O", text: "Oysaki", color: "amber" },
          { letter: "M", text: "Mademki", color: "purple" },
          { letter: "B", text: "Belki", color: "blue" },
          { letter: "A", text: "A (Boşluk / Dolgu)", color: "slate" },
          { letter: "H", text: "Halbuki", color: "indigo" },
          { letter: "Ç", text: "Çünkü", color: "emerald" },
          { letter: "E", text: "E (Boşluk / Dolgu)", color: "slate" },
          { letter: "M", text: "Meğerki", color: "teal" },
          { letter: "İ", text: "İllaki", color: "cyan" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ Pratik İpucu",
        text: "Kelimeye '-ler' eki getirdiğinde anlamlı oluyorsa bitişik, olmuyorsa ayrı yazılır: 'Sankiler' (anlamsız ama istisna olduğu için SOMBAHÇEMİ kuralı geçerlidir!)."
      }
    ]
  },
  {
    id: "egit-tur-02",
    subject: "Türkçe",
    no: 13,
    icon: "🥖",
    color: "amber",
    title: "ÜNSÜZ SERTLEŞMESİ — FISTIKÇI ŞAHAP",
    mnemonic: "FISTIKÇI ŞAHAP",
    badge: "Ses Olayları",
    summary: "Sert ünsüzle biten kelimeden sonra yumuşak ünsüzle başlayan ek geldiğinde sertleşme oluşur.",
    story: "Fıstıkçı Şahap fırından sıcak ekmek alırken sert konuşup ünsüzleri benzeştirdi!",
    blocks: [
      {
        type: "code_breakdown",
        title: "Sert Ünsüzlerimiz (FSTKÇŞHP)",
        items: [
          { letter: "F-S-T-K", text: "F, S, T, K harfleri", color: "amber" },
          { letter: "Ç-Ş-H-P", text: "Ç, Ş, H, P harfleri", color: "rose" }
        ]
      },
      {
        type: "osym_warning",
        title: "⚠️ ÖSYM Yazım Kuralları Uyarısı",
        text: "Sertleşme kuralına uyulmaması bir YAZIM HATASIDIR! Örn: '1923'de' yanlış, '1923'te' DOĞRUDUR."
      }
    ]
  }
];

const SUBJECT_BADGES = {
  "Coğrafya": { bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "🗺️" },
  "Tarih": { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: "🏛️" },
  "Vatandaşlık": { bg: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "⚖️" },
  "Türkçe": { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: "📚" }
};

const HafizaTeknikleriEgitTab = ({ theme }) => {
  const isDark = theme === "dark";

  // State
  const [selectedSubject, setSelectedSubject] = useState("Tüm Teknikler");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("egit_hafiza_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save Favorites
  useEffect(() => {
    localStorage.setItem("egit_hafiza_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const copyMnemonic = (item, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(`${item.title}: ${item.mnemonic}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtering
  const filteredTechniques = EGIT_HAFIZA_TEKNIKLERI.filter(item => {
    const matchesSubject =
      selectedSubject === "Tüm Teknikler" ||
      (selectedSubject === "⭐ Favorilerim" ? favorites.includes(item.id) : item.subject === selectedSubject);

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mnemonic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER BANNER ── */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 border-slate-800"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200"
      }`}>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/20 shrink-0">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Eğit Akademi Özel
                </span>
                <span className="text-xs font-bold text-slate-400">Mehmet Eğit Üslubuyla</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                KPSS Hafıza Teknikleri (Mehmet Eğit)
              </h2>
              <p className={`text-xs md:text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Coğrafya, Tarih, Vatandaşlık ve Türkçe derslerinin en kritik soru potansiyeline sahip kodlamaları, hikâyeleri ve ÖSYM soru tuzakları!
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Toplam Teknik</div>
              <div className="text-lg font-black text-purple-400 mt-0.5">{EGIT_HAFIZA_TEKNIKLERI.length} Şifre</div>
            </div>
            <div className={`px-4 py-3 rounded-2xl border text-center ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Favorilerim</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">{favorites.length} Kayıt</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["Tüm Teknikler", "Coğrafya", "Tarih", "Vatandaşlık", "Türkçe", "⭐ Favorilerim"].map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer border flex items-center gap-1.5 ${
                selectedSubject === subj
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-500/20"
                  : isDark
                    ? "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <LuSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Şifre, kodlama veya konu ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none transition ${
              isDark
                ? "bg-slate-900/80 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500"
            }`}
          />
        </div>
      </div>

      {/* ── CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.length === 0 ? (
          <div className={`col-span-full p-12 text-center rounded-3xl border ${isDark ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
            <LuBrain size={40} className="mx-auto mb-3 opacity-30 text-purple-400" />
            <p className="text-sm font-bold">Aradığınız kriterlere uygun hafıza tekniği bulunamadı.</p>
            <button
              onClick={() => { setSelectedSubject("Tüm Teknikler"); setSearchQuery(""); }}
              className="mt-3 text-xs font-bold text-purple-400 hover:underline cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          filteredTechniques.map(item => {
            const badgeStyle = SUBJECT_BADGES[item.subject] || SUBJECT_BADGES["Coğrafya"];
            const isFav = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => { setActiveModalItem(item); setUserAnswer(null); }}
                className={`group rounded-3xl border p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  isDark
                    ? "bg-slate-900/70 border-slate-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
                    : "bg-white border-slate-200/80 hover:border-purple-300 hover:shadow-xl"
                }`}
              >
                {/* Top Badge & Actions */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${badgeStyle.bg}`}>
                      <span>{badgeStyle.icon}</span>
                      {item.subject}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => copyMnemonic(item, e)}
                        className={`p-2 rounded-xl transition cursor-pointer ${
                          copiedId === item.id
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                        title="Kodu Kopyala"
                      >
                        {copiedId === item.id ? <LuCheck size={15} /> : <LuCopy size={15} />}
                      </button>

                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-2 rounded-xl transition cursor-pointer ${
                          isFav ? "text-amber-400 bg-amber-500/10" : isDark ? "text-slate-400 hover:text-amber-400 hover:bg-slate-800" : "text-slate-400 hover:text-amber-500 hover:bg-slate-100"
                        }`}
                        title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                      >
                        <LuStar size={15} className={isFav ? "fill-amber-400" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl shrink-0 p-2 rounded-2xl bg-slate-800/40 border border-slate-700/40">
                      {item.icon}
                    </span>
                    <div>
                      <h3 className={`text-base font-black tracking-tight leading-snug group-hover:text-purple-400 transition ${isDark ? "text-white" : "text-slate-900"}`}>
                        {item.title}
                      </h3>
                      <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 font-extrabold text-[11px] border border-purple-500/30">
                        🔑 KOD: {item.mnemonic}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {item.summary}
                  </p>
                </div>

                {/* Bottom Trigger Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Şifreleme Detaylarını Gör <LuChevronRight size={14} />
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">#{item.no}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ══ INTERACTIVE MODAL FOR FULL DETAILS ══ */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 md:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto custom-scrollbar ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer z-10"
            >
              <LuX size={18} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  {activeModalItem.subject}
                </span>
                <span className="text-xs font-bold text-slate-400">Mehmet Eğit Özel Şifreleme</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3">
                <span>{activeModalItem.icon}</span>
                {activeModalItem.title}
              </h2>
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/10 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-purple-300">Akılda Kalıcı Şifre Kodu</div>
                  <div className="text-xl font-black text-purple-400 tracking-wide mt-0.5">{activeModalItem.mnemonic}</div>
                </div>
                <button
                  onClick={(e) => copyMnemonic(activeModalItem, e)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition cursor-pointer"
                >
                  <LuCopy size={14} />
                  Kopyala
                </button>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              {/* Absurd Story / Visual Hook */}
              {activeModalItem.story && (
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                  <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-1 text-amber-400">
                    <LuLightbulb size={16} /> Mehmet Eğit'in Görsel Zihin Kancası
                  </div>
                  <p className="text-xs md:text-sm font-medium italic leading-relaxed">
                    "{activeModalItem.story}"
                  </p>
                </div>
              )}

              {/* Dynamic Blocks */}
              {activeModalItem.blocks?.map((block, idx) => {
                if (block.type === "code_breakdown") {
                  return (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <LuSparkles size={14} className="text-purple-400" />
                        {block.title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {block.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className={`p-3 rounded-xl border flex items-center gap-3 ${
                              isDark ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 font-black text-sm flex items-center justify-center shrink-0">
                              {item.letter}
                            </span>
                            <span className="text-xs font-bold leading-tight">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (block.type === "osym_warning") {
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border ${isDark ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
                      <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-1.5 text-rose-400">
                        <LuInfo size={16} />
                        {block.title}
                      </h4>
                      <p className="text-xs md:text-sm font-semibold leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  );
                }

                if (block.type === "practice_question") {
                  return (
                    <div key={idx} className={`p-5 rounded-2xl border ${isDark ? "bg-slate-800/70 border-slate-700" : "bg-slate-100 border-slate-300"}`}>
                      <div className="text-[11px] font-black uppercase text-purple-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <LuGraduationCap size={16} /> ÖSYM Tarzı Mini Pratik Soru
                      </div>
                      <p className="text-xs font-bold mb-3">{block.question}</p>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {block.options.map((opt, oIdx) => {
                          const isSelected = userAnswer === oIdx;
                          const isCorrect = oIdx === block.answerIndex;
                          let btnStyle = isDark ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700";

                          if (userAnswer !== null) {
                            if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                            else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => setUserAnswer(oIdx)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {userAnswer !== null && (
                        <div className={`p-3 rounded-xl text-xs font-medium border ${
                          userAnswer === block.answerIndex ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        }`}>
                          <strong className="block mb-0.5">{userAnswer === block.answerIndex ? "✓ Tebrikler, Doğru Cevap!" : "✕ Yanlış Cevap!"}</strong>
                          {block.explanation}
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-500/25 transition cursor-pointer"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HafizaTeknikleriEgitTab;
