import React, { useState } from "react";
import {
  LuBookOpen, LuChevronRight, LuStar, LuGlobe,
  LuBookmark, LuSparkles, LuTarget, LuLightbulb,
  LuLandmark, LuUsers, LuScale, LuCircleCheck,
  LuTrophy, LuCalendar, LuFlag, LuBuilding,
  LuShield, LuGraduationCap, LuZap
} from "react-icons/lu";

// ══════════════════════════════════════════════════════════════════
// KPSS 2026 GÜNCEL BİLGİLER VERİ TABANI
// Tüm bilgiler 2025-2026 itibarıyla resmi kaynaklardan derlenmiştir.
// ══════════════════════════════════════════════════════════════════

const GUNCEL_BILGILER = [
  {
    id: "cumhurbaskanligi",
    no: 1,
    icon: "🏛️",
    color: "blue",
    category: "Devlet Yapısı",
    title: "CUMHURBAŞKANLIĞI HÜKÜMET SİSTEMİ",
    badge: "Kesin Çıkar",
    summary: "16 Nisan 2017 referandumu ile kabul edilen, 9 Temmuz 2018'de yürürlüğe giren Cumhurbaşkanlığı Hükümet Sistemi.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Cumhurbaşkanı", def: "Recep Tayyip Erdoğan — Cumhurbaşkanlığı Hükümet Sistemi'nin ilk cumhurbaşkanı (2018). 2023'te yeniden seçildi. Görev süresi 5 yıl, en fazla 2 dönem." },
          { term: "Cumhurbaşkanı Yardımcısı", def: "Cevdet Yılmaz — Cumhurbaşkanı tarafından atanır, seçimle gelmez. Cumhurbaşkanlığı makamının boşalması halinde 45 gün içinde seçim yapılır, bu sürede yardımcı vekâlet eder." },
          { term: "TBMM Başkanı", def: "Numan Kurtulmuş — Cumhurbaşkanlığı makamı boşalırsa ve yardımcı da görev yapamıyorsa TBMM Başkanı vekâlet eder." },
          { term: "Kabine Sistemi", def: "Başbakanlık kaldırıldı. Bakanlar Cumhurbaşkanı tarafından atanır ve görevden alınır. Bakanlık sayısı Cumhurbaşkanlığı Kararnamesi ile belirlenir." }
        ]
      },
      {
        type: "alert",
        variant: "danger",
        title: "⚠️ ÖSYM Tuzağı — Eski Sistemle Karıştırma",
        text: "ÖSYM sorularında 'Başbakan' veya 'Bakanlar Kurulu' gibi eski sistem kavramları karıştırma amaçlı verilebilir. 2018 sonrası Başbakanlık YOKTUR. Bakanlar Kurulu yerine Cumhurbaşkanlığı Kabinesi vardır."
      }
    ]
  },
  {
    id: "tbmm",
    no: 2,
    icon: "🏛️",
    color: "purple",
    category: "Yasama",
    title: "TBMM — 28. DÖNEM (2023-2028)",
    badge: "Güncel Meclis",
    summary: "14 Mayıs 2023 seçimleriyle oluşan 28. Dönem TBMM bilgileri.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Milletvekili Sayısı", def: "600 milletvekili (2017 referandumu ile 550'den 600'e çıkarıldı)." },
          { term: "Seçim Barajı", def: "%7 (2022 yılında %10'dan %7'ye düşürüldü)." },
          { term: "Seçim Sistemi", def: "D'Hondt sistemi ile nispi temsil. Dar bölge değil, il bazlı seçim." },
          { term: "Yasama Dönemi", def: "5 yıl (2017 referandumu ile 4 yıldan 5 yıla çıkarıldı)." },
          { term: "Meclis Başkanı", def: "Numan Kurtulmuş (AK Parti)." }
        ]
      },
      {
        type: "cards",
        items: [
          { name: "TBMM'deki Partiler (2023 Seçimi)", emoji: "🗳️", color: "blue", points: [
            "AK Parti — 268 milletvekili",
            "CHP — 169 milletvekili",
            "MHP — 50 milletvekili",
            "İYİ Parti — 44 milletvekili",
            "DEM Parti (HDP → Yeşil Sol → DEM) — 57 milletvekili",
            "Diğer partiler ve bağımsızlar — 12 milletvekili"
          ]}
        ]
      }
    ]
  },
  {
    id: "anayasa",
    no: 3,
    icon: "📜",
    color: "amber",
    category: "Anayasa",
    title: "ANAYASA DEĞİŞİKLİKLERİ & TEMEL BİLGİLER",
    badge: "En Çok Sorulan",
    summary: "1982 Anayasası'nda yapılan son değişiklikler ve temel anayasal ilkeler.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Yürürlükteki Anayasa", def: "1982 Anayasası — Danışma Meclisi tarafından hazırlandı, halk oylamasıyla kabul edildi. En çok değiştirilen anayasamızdır." },
          { term: "Son Büyük Değişiklik", def: "2017 Anayasa Değişikliği (6771 sayılı kanun) — Cumhurbaşkanlığı Hükümet Sistemi'ne geçiş. 16 Nisan 2017 referandumu ile kabul." },
          { term: "Değiştirilemez Maddeler", def: "İlk 3 madde değiştirilemez, değiştirilmesi teklif dahi edilemez: (1) Devletin şekli: Cumhuriyet, (2) Cumhuriyetin nitelikleri, (3) Devletin bütünlüğü, resmi dil, bayrak, millî marş, başkent." },
          { term: "Anayasa Değişikliği", def: "TBMM üye tam sayısının 1/3'ü (200 mv) teklif eder. 3/5 (360 mv) ile kabul edilirse Cumhurbaşkanı referanduma sunabilir. 2/3 (400 mv) ile kabul edilirse doğrudan yayımlanır veya referanduma sunulabilir." }
        ]
      }
    ]
  },
  {
    id: "yargı",
    no: 4,
    icon: "⚖️",
    color: "rose",
    category: "Yargı",
    title: "YARGI ORGANLARI & GÜNCEL YAPI",
    badge: "Sınav Favorisi",
    summary: "Türkiye'deki yüksek yargı organları, görevleri ve güncel başkanları.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "Anayasa Mahkemesi (AYM)", emoji: "⚖️", color: "rose", points: [
            "Başkan: Kadir Özkaya",
            "15 üye — Cumhurbaşkanı 12, TBMM 3 üye seçer",
            "Görev: Kanunların, CBK'ların anayasaya uygunluk denetimi",
            "Bireysel başvuru hakkı (2012'den beri)",
            "Yüce Divan sıfatıyla yargılama yapabilir"
          ]},
          { name: "Yargıtay", emoji: "🏛️", color: "blue", points: [
            "Adli yargı son inceleme mercii",
            "Hukuk ve ceza davaları temyiz mercii"
          ]},
          { name: "Danıştay", emoji: "📋", color: "purple", points: [
            "İdari yargı son inceleme mercii",
            "İdari davaları temyiz mercii",
            "Cumhurbaşkanlığına danışmanlık görevi"
          ]},
          { name: "Uyuşmazlık Mahkemesi", emoji: "🔗", color: "amber", points: [
            "Adli ve idari yargı arasındaki görev uyuşmazlıklarını çözer",
            "Başkanı Anayasa Mahkemesi tarafından seçilir"
          ]},
          { name: "Sayıştay", emoji: "🔍", color: "emerald", points: [
            "Kamu harcamalarını denetler",
            "TBMM adına denetim yapar",
            "Yargı yetkisi VARDIR (kesin hüküm)"
          ]}
        ]
      }
    ]
  },
  {
    id: "uluslararası",
    no: 5,
    icon: "🌍",
    color: "sky",
    category: "Uluslararası",
    title: "TÜRKİYE'NİN ÜYE OLDUĞU ULUSLARARASI KURULUŞLAR",
    badge: "Coğrafya & Vatandaşlık Ortak",
    summary: "Türkiye'nin üye olduğu temel uluslararası kuruluşlar ve güncel bilgileri.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "NATO", emoji: "🛡️", color: "blue", points: [
            "Türkiye 1952'den beri üye (Kore Savaşı sonrası)",
            "32 üye ülke (İsveç 2024'te 32. üye olarak katıldı)",
            "Merkez: Brüksel, Belçika",
            "Genel Sekreter: Mark Rutte (2024-)"
          ]},
          { name: "Birleşmiş Milletler (BM)", emoji: "🇺🇳", color: "sky", points: [
            "Türkiye kurucu üye (1945)",
            "193 üye devlet",
            "Genel Sekreter: António Guterres",
            "BM Güvenlik Konseyi daimi üyeleri: ABD, Rusya, Çin, İngiltere, Fransa (P5)",
            "Merkez: New York, ABD"
          ]},
          { name: "G20", emoji: "🌐", color: "amber", points: [
            "Türkiye üye — Dünyanın en büyük 20 ekonomisi",
            "2015'te Antalya'da G20 Zirvesi'ne ev sahipliği yapıldı",
            "2025 Dönem Başkanı: Güney Afrika"
          ]},
          { name: "Türk Devletleri Teşkilatı (TDT)", emoji: "🤝", color: "emerald", points: [
            "Eski adı: Türk Konseyi (2009)",
            "2021'de İstanbul'da Türk Devletleri Teşkilatı olarak yeniden yapılandırıldı",
            "Üyeler: Türkiye, Azerbaycan, Kazakistan, Kırgızistan, Özbekistan",
            "Gözlemci: Macaristan, Türkmenistan, KKTC"
          ]},
          { name: "İslam İşbirliği Teşkilatı (İİT)", emoji: "🕌", color: "teal", points: [
            "57 üye ülke — En büyük İslam ülkeleri teşkilatı",
            "Merkez: Cidde, Suudi Arabistan",
            "Türkiye kurucu üye (1969)"
          ]}
        ]
      }
    ]
  },
  {
    id: "ekonomi",
    no: 6,
    icon: "💰",
    color: "emerald",
    category: "Ekonomi",
    title: "EKONOMİK GÜNCEL VERİLER — 2025/2026",
    badge: "Sayısal Güncel",
    summary: "ÖSYM'nin sorma potansiyeli yüksek temel ekonomik göstergeler ve kurumlar.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Merkez Bankası (TCMB)", def: "Türkiye Cumhuriyet Merkez Bankası — Başkan: Fatih Karahan. Para politikasını belirler, fiyat istikrarını sağlar. Bağımsız kuruluştur." },
          { term: "Hazine ve Maliye Bakanlığı", def: "Bakan: Mehmet Şimşek. Maliye politikasını yürütür. Bütçeyi hazırlar." },
          { term: "TÜİK", def: "Türkiye İstatistik Kurumu — Resmi istatistik verileri (enflasyon, büyüme, işsizlik) yayınlar." },
          { term: "BDDK", def: "Bankacılık Düzenleme ve Denetleme Kurumu — Bankacılık sektörünü düzenler ve denetler." },
          { term: "SPK", def: "Sermaye Piyasası Kurulu — Sermaye piyasasını düzenler, yatırımcıları korur." },
          { term: "Asgari Ücret 2025", def: "Net 22.104 TL / Brüt 28.008,75 TL (Asgari Ücret Tespit Komisyonu tarafından belirlenir)." }
        ]
      },
      {
        type: "alert",
        variant: "warning",
        title: "⚠️ ÖSYM İpucu — Ekonomi Soruları",
        text: "ÖSYM genellikle kurumların görevlerini sorar, rakamları değil. 'Merkez Bankası'nın temel görevi nedir?' gibi. Para politikası = TCMB, Maliye politikası = Hazine Bakanlığı ayrımını net bil."
      }
    ]
  },
  {
    id: "coğrafya",
    no: 7,
    icon: "🗺️",
    color: "teal",
    category: "Coğrafya",
    title: "TÜRKİYE COĞRAFYASI — GÜNCEL BİLGİLER",
    badge: "Coğrafya Olmazsa Olmaz",
    summary: "Türkiye'nin güncel coğrafi verileri, nüfus bilgileri ve idari yapısı.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Nüfus (2024 TÜİK)", def: "85.372.377 kişi. Nüfus artış hızı düşme eğiliminde. En kalabalık il: İstanbul (~16 milyon)." },
          { term: "İl Sayısı", def: "81 il. Son kurulan il: Düzce (1999). 7 coğrafi bölge (resmi olmayan, coğrafi sınıflandırma)." },
          { term: "Yüzölçümü", def: "783.562 km² (Avrupa + Asya). Trakya: ~24.000 km², Anadolu: ~760.000 km². Asya kıtasında en büyük payı vardır." },
          { term: "Komşu Ülkeler", def: "8 komşu: Yunanistan, Bulgaristan (Avrupa); Gürcistan, Ermenistan, Nahçıvan (Azerbaycan), İran, Irak, Suriye (Asya)." },
          { term: "Denizler", def: "Karadeniz (kuzey), Marmara (iç deniz), Ege (batı), Akdeniz (güney). Marmara en küçük denizimizdir." },
          { term: "En Yüksek Dağ", def: "Ağrı Dağı — 5.137 m (Türkiye'nin ve Büyük Kafkasya dışında bölgenin en yüksek noktası)." },
          { term: "En Uzun Nehir", def: "Kızılırmak — 1.355 km (tamamen Türkiye sınırları içinde akan en uzun akarsu)." }
        ]
      }
    ]
  },
  {
    id: "egitim",
    no: 8,
    icon: "🎓",
    color: "orange",
    category: "Eğitim",
    title: "TÜRKİYE EĞİTİM SİSTEMİ — GÜNCEL YAPI",
    badge: "Eğitim Bilimleri",
    summary: "4+4+4 eğitim sistemi, MEB yapısı ve güncel eğitim verileri.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Eğitim Sistemi", def: "4+4+4 sistemi (2012): 4 yıl ilkokul + 4 yıl ortaokul + 4 yıl lise = 12 yıl zorunlu eğitim." },
          { term: "Milli Eğitim Bakanlığı", def: "Bakan: Yusuf Tekin. Eğitim politikalarını belirler ve uygular." },
          { term: "YÖK", def: "Yükseköğretim Kurulu — Başkan: Prof. Dr. Erol Özvar. Üniversiteleri koordine eder, akademik standartları belirler. 1981'de kurulmuştur." },
          { term: "ÖSYM", def: "Ölçme, Seçme ve Yerleştirme Merkezi — Başkan: Prof. Dr. Bayram Ali Ersoy. KPSS, YKS, ALES, YDS gibi sınavları düzenler." },
          { term: "Üniversite Sayısı", def: "Türkiye'de 208 üniversite bulunmaktadır (129 devlet + 79 vakıf)." }
        ]
      },
      {
        type: "alert",
        variant: "warning",
        title: "⚠️ ÖSYM Notu — Eğitim Bilimleri Soruları",
        text: "Eğitim Bilimleri sorularında '4+4+4 sistemi hangi yıl başladı?' (2012), 'Zorunlu eğitim kaç yıl?' (12 yıl), 'YÖK ne zaman kuruldu?' (1981) gibi tarihsel sorular sıkça çıkar."
      }
    ]
  },
  {
    id: "dıspolitika",
    no: 9,
    icon: "🌐",
    color: "indigo",
    category: "Dış Politika",
    title: "GÜNCEL DIŞ POLİTİKA GELİŞMELERİ",
    badge: "Sıcak Gündem",
    summary: "2024-2026 itibarıyla önemli uluslararası gelişmeler ve Türkiye'nin pozisyonu.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "AB-Türkiye İlişkileri", emoji: "🇪🇺", color: "blue", points: [
            "Türkiye 1999'dan beri AB aday ülke",
            "Müzakere sürecinde 16 fasıl açıldı, 1 fasıl geçici olarak kapatıldı",
            "Gümrük Birliği 1996'dan beri yürürlükte",
            "Tam üyelik süreci fiilen askıya alınmış durumda"
          ]},
          { name: "İsveç'in NATO Üyeliği", emoji: "🇸🇪", color: "sky", points: [
            "Mart 2024'te NATO'nun 32. üyesi oldu",
            "Türkiye onayı ile gerçekleşti",
            "Finlandiya 2023'te 31. üye olmuştu"
          ]},
          { name: "Filistin-İsrail Meselesi", emoji: "🕊️", color: "amber", points: [
            "7 Ekim 2023'te Hamas-İsrail çatışması başladı",
            "Türkiye insani yardım ve diplomatik girişimlerde aktif",
            "BM Genel Kurulu'nda Filistin'in tanınması için oy kullanıldı",
            "Güney Afrika'nın UCM başvurusu — soykırım davası"
          ]},
          { name: "Türk Devletleri Teşkilatı Genişlemesi", emoji: "🤝", color: "emerald", points: [
            "KKTC gözlemci üye olarak kabul edildi (2022)",
            "Türkmenistan gözlemci üye",
            "Macaristan gözlemci üye",
            "TDT giderek güçlenen bir bölgesel örgüt"
          ]}
        ]
      }
    ]
  },
  {
    id: "teknoloji",
    no: 10,
    icon: "🚀",
    color: "red",
    category: "Bilim & Teknoloji",
    title: "TÜRKİYE'NİN BİLİM VE TEKNOLOJİ BAŞARILARI",
    badge: "Yeni Nesil Sorular",
    summary: "Türkiye'nin uzay, savunma ve teknoloji alanlarındaki güncel başarıları.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "TÜRKSAT Uyduları", emoji: "🛰️", color: "blue", points: [
            "TÜRKSAT 5A — 2021'de fırlatıldı (haberleşme uydusu)",
            "TÜRKSAT 5B — 2021'de fırlatıldı (geniş bant)",
            "TÜRKSAT 6A — 2024'te fırlatıldı (ilk yerli ve milli haberleşme uydusu)"
          ]},
          { name: "Uzay Programı", emoji: "🧑‍🚀", color: "purple", points: [
            "Alper Gezeravcı — Türkiye'nin ilk astronotu",
            "Ocak 2024'te Axiom Mission-3 ile ISS'e gitti",
            "Milli Uzay Programı — 2023'te açıklandı"
          ]},
          { name: "Savunma Sanayi", emoji: "🛡️", color: "emerald", points: [
            "BAYRAKTAR TB2/TB3 — Dünya çapında ihracat",
            "KAAN (TF-X) — Milli muharip uçak, ilk uçuşunu Şubat 2024'te gerçekleştirdi",
            "TOGG — Türkiye'nin Otomobili, 2023'te seri üretime geçti",
            "TCG Anadolu — Dünyanın ilk SİHA gemisi (2023)"
          ]},
          { name: "TÜBİTAK", emoji: "🔬", color: "teal", points: [
            "Türkiye Bilimsel ve Teknolojik Araştırma Kurumu",
            "1963'te kuruldu",
            "Bilim, teknoloji ve yenilik politikalarını destekler"
          ]}
        ]
      }
    ]
  },
  {
    id: "insan_haklari",
    no: 11,
    icon: "🤝",
    color: "violet",
    category: "İnsan Hakları",
    title: "İNSAN HAKLARI & TEMEL BELGELER",
    badge: "Vatandaşlık Temeli",
    summary: "Uluslararası insan hakları belgeleri ve Türkiye'nin taraf olduğu sözleşmeler.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "İnsan Hakları Evrensel Beyannamesi", def: "10 Aralık 1948 — BM Genel Kurulu tarafından kabul edildi. Bağlayıcı değildir, bildirgedir. 10 Aralık = Dünya İnsan Hakları Günü." },
          { term: "Avrupa İnsan Hakları Sözleşmesi (AİHS)", def: "1950'de imzalandı, 1953'te yürürlüğe girdi. Türkiye 1954'te taraf oldu. Bağlayıcıdır." },
          { term: "Avrupa İnsan Hakları Mahkemesi (AİHM)", def: "Strasbourg, Fransa. Bireysel başvuru hakkı mevcuttur. Kararları bağlayıcıdır. Türkiye 1987'den beri bireysel başvuru hakkını tanımaktadır." },
          { term: "Kamu Denetçiliği (Ombudsmanlık)", def: "2012'de kuruldu. Kamu Başdenetçisi: Şeref Malkoç. İdarenin işlem ve eylemlerini denetler. TBMM'ye bağlıdır." },
          { term: "Türkiye İnsan Hakları ve Eşitlik Kurumu (TİHEK)", def: "2016'da kuruldu. Ayrımcılık yasağı, eşitlik ilkesi ve insan haklarının korunması." }
        ]
      }
    ]
  },
  {
    id: "cevre",
    no: 12,
    icon: "🌱",
    color: "green",
    category: "Çevre",
    title: "ÇEVRE VE İKLİM POLİTİKALARI",
    badge: "Yeni Trend Konu",
    summary: "Paris İklim Anlaşması, Yeşil Mutabakat ve Türkiye'nin çevre politikaları.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "Paris İklim Anlaşması", def: "2015'te imzalandı. Türkiye Ekim 2021'de TBMM'de onayladı. Küresel sıcaklık artışını 1,5°C ile sınırlamayı hedefler." },
          { term: "2053 Net Sıfır Hedefi", def: "Türkiye 2053 yılında karbon nötr (net sıfır emisyon) olmayı hedefliyor." },
          { term: "Avrupa Yeşil Mutabakat", def: "AB'nin 2050 iklim nötr hedefi. Türkiye Sınırda Karbon Düzenleme Mekanizması'ndan (SKDM) etkilenecek." },
          { term: "Sıfır Atık Projesi", def: "2017'de Emine Erdoğan tarafından başlatıldı. Atık yönetimi ve geri dönüşüm bilincini artırmayı hedefler." }
        ]
      },
      {
        type: "alert",
        variant: "warning",
        title: "⚠️ ÖSYM Notu — Çevre Soruları Artıyor",
        text: "Son yıllarda KPSS'de çevre ve sürdürülebilirlik konuları artan bir sıklıkla soruluyor. Paris Anlaşması, Kyoto Protokolü (1997) ve Türkiye'nin bu anlaşmalardaki konumunu bil."
      }
    ]
  },
  {
    id: "spor",
    no: 13,
    icon: "⚽",
    color: "orange",
    category: "Spor & Kültür",
    title: "SPOR VE KÜLTÜR GÜNDEMİ",
    badge: "Genel Kültür",
    summary: "Türkiye'nin önemli spor başarıları ve kültürel gündem maddeleri.",
    blocks: [
      {
        type: "cards",
        items: [
          { name: "UEFA EURO 2024", emoji: "⚽", color: "blue", points: [
            "Almanya'da düzenlendi (14 Haziran - 14 Temmuz 2024)",
            "Türkiye çeyrek finale yükseldi",
            "Şampiyon: İspanya"
          ]},
          { name: "2024 Paris Olimpiyatları", emoji: "🥇", color: "amber", points: [
            "Temmuz-Ağustos 2024, Paris/Fransa",
            "Türkiye'den önemli başarılar: Yusuf Dikeç (atıcılık, gümüş madalya — viral oldu)",
            "Mete Gazoz (okçuluk) — Tokyo 2020 altın madalyacısı"
          ]},
          { name: "UNESCO Dünya Mirası — Türkiye", emoji: "🏛️", color: "emerald", points: [
            "Türkiye'de 21 UNESCO Dünya Mirası Alanı",
            "Son eklenen: Gordion (2023)",
            "Somut olmayan kültürel miras öğeleri de listeye alınmıştır"
          ]}
        ]
      }
    ]
  },
  {
    id: "deprem",
    no: 14,
    icon: "🏚️",
    color: "red",
    category: "Afet Yönetimi",
    title: "AFET YÖNETİMİ & DEPREM",
    badge: "Sosyal Gündem",
    summary: "6 Şubat 2023 depremleri ve Türkiye'nin afet yönetim sistemi.",
    blocks: [
      {
        type: "definition",
        items: [
          { term: "6 Şubat 2023 Depremleri", def: "Kahramanmaraş merkezli 7.7 ve 7.6 büyüklüğünde iki deprem. 11 il etkilendi. 50.000'den fazla can kaybı. Cumhuriyet tarihinin en büyük doğal afeti." },
          { term: "AFAD", def: "Afet ve Acil Durum Yönetimi Başkanlığı — İçişleri Bakanlığı'na bağlı. Afet öncesi hazırlık, müdahale ve iyileştirme süreçlerini koordine eder." },
          { term: "DASK", def: "Doğal Afet Sigortaları Kurumu — Zorunlu Deprem Sigortası (2000'den beri zorunlu). Konut sahiplerine deprem hasarı tazminatı sağlar." },
          { term: "Kandilli Rasathanesi", def: "Boğaziçi Üniversitesi'ne bağlı. Deprem izleme ve erken uyarı sistemi." }
        ]
      }
    ]
  }
];

// ── Color Utilities ──────────────────────────────────────────────
const colorMap = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/5", dot: "bg-emerald-400", accent: "text-emerald-300", lightBg: "bg-emerald-50", lightBorder: "border-emerald-200", lightText: "text-emerald-700" },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400",    glow: "shadow-blue-500/5",    dot: "bg-blue-400",    accent: "text-blue-300",    lightBg: "bg-blue-50",    lightBorder: "border-blue-200",    lightText: "text-blue-700" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   glow: "shadow-amber-500/5",   dot: "bg-amber-400",   accent: "text-amber-300",   lightBg: "bg-amber-50",   lightBorder: "border-amber-200",   lightText: "text-amber-700" },
  purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/20",  text: "text-purple-400",  glow: "shadow-purple-500/5",  dot: "bg-purple-400",  accent: "text-purple-300",  lightBg: "bg-purple-50",  lightBorder: "border-purple-200",  lightText: "text-purple-700" },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400",    glow: "shadow-rose-500/5",    dot: "bg-rose-400",    accent: "text-rose-300",    lightBg: "bg-rose-50",    lightBorder: "border-rose-200",    lightText: "text-rose-700" },
  sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-400",     glow: "shadow-sky-500/5",     dot: "bg-sky-400",     accent: "text-sky-300",     lightBg: "bg-sky-50",     lightBorder: "border-sky-200",     lightText: "text-sky-700" },
  teal:    { bg: "bg-teal-500/10",    border: "border-teal-500/20",    text: "text-teal-400",    glow: "shadow-teal-500/5",    dot: "bg-teal-400",    accent: "text-teal-300",    lightBg: "bg-teal-50",    lightBorder: "border-teal-200",    lightText: "text-teal-700" },
  red:     { bg: "bg-red-500/10",     border: "border-red-500/20",     text: "text-red-400",     glow: "shadow-red-500/5",     dot: "bg-red-400",     accent: "text-red-300",     lightBg: "bg-red-50",     lightBorder: "border-red-200",     lightText: "text-red-700" },
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  glow: "shadow-indigo-500/5",  dot: "bg-indigo-400",  accent: "text-indigo-300",  lightBg: "bg-indigo-50",  lightBorder: "border-indigo-200",  lightText: "text-indigo-700" },
  orange:  { bg: "bg-orange-500/10",  border: "border-orange-500/20",  text: "text-orange-400",  glow: "shadow-orange-500/5",  dot: "bg-orange-400",  accent: "text-orange-300",  lightBg: "bg-orange-50",  lightBorder: "border-orange-200",  lightText: "text-orange-700" },
  violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-400",  glow: "shadow-violet-500/5",  dot: "bg-violet-400",  accent: "text-violet-300",  lightBg: "bg-violet-50",  lightBorder: "border-violet-200",  lightText: "text-violet-700" },
  green:   { bg: "bg-green-500/10",   border: "border-green-500/20",   text: "text-green-400",   glow: "shadow-green-500/5",   dot: "bg-green-400",   accent: "text-green-300",   lightBg: "bg-green-50",   lightBorder: "border-green-200",   lightText: "text-green-700" },
};

const getC = (name) => colorMap[name] || colorMap.emerald;

// ── Category filter options ──────────────────────────────────────
const CATEGORIES = [...new Set(GUNCEL_BILGILER.map(b => b.category))];

// ── Block Renderers ──────────────────────────────────────────────
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

// ── Block Dispatcher ─────────────────────────────────────────────
const RenderBlock = ({ block, isDark }) => {
  switch (block.type) {
    case "alert":      return <RenderAlert block={block} isDark={isDark} />;
    case "definition": return <RenderDefinition block={block} isDark={isDark} />;
    case "cards":      return <RenderCards block={block} isDark={isDark} />;
    default:           return null;
  }
};

// ── Main Component ───────────────────────────────────────────────
const KpssGuncelBilgilerTab = ({ theme }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const isDark = theme === "dark";

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  const filteredItems = activeCategory === "Tümü" 
    ? GUNCEL_BILGILER 
    : GUNCEL_BILGILER.filter(b => b.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── HEADER BANNER ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/20 border-slate-800"
          : "bg-gradient-to-br from-cyan-50 via-white to-emerald-50 border-cyan-200"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "30px 30px"
        }} />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${isDark ? "bg-cyan-500/10 border border-cyan-500/20 shadow-cyan-500/5" : "bg-cyan-100 border border-cyan-200 shadow-cyan-200/50"}`}>
                📰
              </span>
              <div>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  KPSS Güncel Bilgiler 2026
                </h2>
                <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Doğrulanmış & Kanıtlanmış Bilgiler — ÖSYM Formatında
                </p>
              </div>
            </div>
            <p className={`text-[13px] leading-relaxed max-w-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Resmi kaynaklardan derlenmiş, 2025-2026 itibarıyla güncel ve doğruluğu teyit edilmiş bilgiler. 
              ÖSYM'nin soru formatına uygun, sınav odaklı hazırlanmıştır.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
              isDark ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-cyan-100 text-cyan-700 border border-cyan-200"
            }`}>
              <LuGlobe size={14} />
              {GUNCEL_BILGILER.length} Konu
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${
              isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
            }`}>
              <LuCircleCheck size={14} />
              Doğrulanmış
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className={`rounded-2xl border p-5 ${
        isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className={`text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
          isDark ? "text-slate-500" : "text-slate-400"
        }`}>
          <LuBookmark size={10} className="text-cyan-400" />
          KATEGORİLER
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("Tümü")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
              activeCategory === "Tümü"
                ? isDark ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-cyan-50 text-cyan-700 border-cyan-200"
                : isDark ? "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-800" : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            🔖 Tümü ({GUNCEL_BILGILER.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = GUNCEL_BILGILER.filter(b => b.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? isDark ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-cyan-50 text-cyan-700 border-cyan-200"
                    : isDark ? "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-800" : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT CHAPTERS ── */}
      <div className="space-y-4">
        {filteredItems.map((note) => {
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
                <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  {note.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                      {note.category}
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
                  <div className={`mt-4 p-3 rounded-lg ${c.bg} border ${c.border}`}>
                    <p className={`text-xs font-semibold leading-relaxed ${c.accent}`}>
                      📌 {note.summary}
                    </p>
                  </div>

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
          📌 Bu bilgiler 2025-2026 itibarıyla resmi kaynaklar (T.C. Cumhurbaşkanlığı, TBMM, TÜİK, Resmi Gazete, 
          ilgili bakanlıklar ve uluslararası kuruluş web siteleri) baz alınarak derlenmiştir. 
          Sınav tarihine yakın güncellemeleri kontrol ediniz.
        </p>
      </div>
    </div>
  );
};

export default KpssGuncelBilgilerTab;
