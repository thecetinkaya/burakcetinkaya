// KPSS Deneme Analiz Çizelgesi - Konu Veri Seti (Mehmet Ali Ayhan)

export const KPSS_ANALIZ_SUBJECTS = [
  {
    id: "vatandaslik",
    title: "Vatandaşlık",
    fullTitle: "KPSS VATANDAŞLIK DENEME ANALİZ ÇİZELGESİ",
    color: "purple",
    icon: "⚖️",
    badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    headerBg: "from-purple-900/40 via-slate-900 to-purple-950/30",
    units: [
      {
        name: "1. HUKUKUN TEMEL KAVRAMLARI",
        topics: [
          { id: "vat_1_1", num: "1.1", name: "Hukuk, Toplum ve Devlet", tags: ["star", "caution"] },
          { id: "vat_1_2", num: "1.2", name: "Hukukun Kaynakları", tags: ["star", "caution"] },
          { id: "vat_1_3", num: "1.3", name: "Hukukun Kolları", tags: ["star"] },
          { id: "vat_1_4", num: "1.4", name: "Hukuk Kurallarının Uygulanması", tags: [] },
          { id: "vat_1_5", num: "1.5", name: "Hukukta Yaptırım", tags: [] }
        ]
      },
      {
        name: "2. ANAYASA HUKUKU",
        topics: [
          { id: "vat_2_1", num: "2.1", name: "Anayasanın Tanımı, Önemi ve Özellikleri", tags: ["star", "critical"] },
          { id: "vat_2_2", num: "2.2", name: "Anayasanın Amacı", tags: ["star"] },
          { id: "vat_2_3", num: "2.3", name: "Anayasanın İlkeleri", tags: ["star", "critical"] },
          { id: "vat_2_4", num: "2.4", name: "Devletin Temel Organları", tags: ["star"] },
          { id: "vat_2_5", num: "2.5", name: "Temel Hak ve Hürriyetler", tags: ["star", "critical"] },
          { id: "vat_2_6", num: "2.6", name: "Kişinin Hak ve Ödevleri", tags: ["star", "caution"] },
          { id: "vat_2_7", num: "2.7", name: "Ailenin Korunması ve Çocuk Hakları", tags: ["star", "caution"] },
          { id: "vat_2_8", num: "2.8", name: "Kanun Önünde Eşitlik", tags: ["star"] },
          { id: "vat_2_9", num: "2.9", name: "Anayasanın Yargısal Denetimi", tags: ["star"] },
          { id: "vat_2_10", num: "2.10", name: "Anayasa Değişiklikleri", tags: ["caution"] }
        ]
      },
      {
        name: "3. DEVLET ORGANLARI",
        topics: [
          { id: "vat_3_1", num: "3.1", name: "Yasama Organı (TBMM)", tags: ["star", "critical"] },
          { id: "vat_3_2", num: "3.2", name: "Yasama Yetkisinin Devri", tags: ["caution"] },
          { id: "vat_3_3", num: "3.3", name: "Yürütme Organı (Cumhurbaşkanı)", tags: ["star", "critical"] },
          { id: "vat_3_4", num: "3.4", name: "Bakanlar Kurulu", tags: ["caution"] },
          { id: "vat_3_5", num: "3.5", name: "Yargı Organı", tags: ["star", "critical"] },
          { id: "vat_3_6", num: "3.6", name: "Anayasa Mahkemesi", tags: ["star", "critical"] },
          { id: "vat_3_7", num: "3.7", name: "Danıştay", tags: ["caution"] },
          { id: "vat_3_8", num: "3.8", name: "Yargıtay", tags: ["caution"] },
          { id: "vat_3_9", num: "3.9", name: "Sayıştay", tags: ["caution"] },
          { id: "vat_3_10", num: "3.10", name: "Kamu Denetçiliği Kurumu (Ombudsman)", tags: ["caution"] }
        ]
      },
      {
        name: "4. TEMEL HAK VE HÜRRİYETLER",
        topics: [
          { id: "vat_4_1", num: "4.1", name: "Kişi Hak ve Hürriyetler", tags: ["star", "critical"] },
          { id: "vat_4_2", num: "4.2", name: "Sosyal ve Ekonomik Haklar", tags: ["star", "caution"] },
          { id: "vat_4_3", num: "4.3", name: "Siyasi Haklar", tags: ["caution"] },
          { id: "vat_4_4", num: "4.4", name: "Dilekçe, Bilgi Edinme ve Kamu Denetçiliği", tags: ["caution"] }
        ]
      },
      {
        name: "5. İDARE HUKUKU",
        topics: [
          { id: "vat_5_1", num: "5.1", name: "İdarenin Tanımı ve Unsurları", tags: ["caution"] },
          { id: "vat_5_2", num: "5.2", name: "İdarenin Görevleri ve Yetkileri", tags: ["caution"] },
          { id: "vat_5_3", num: "5.3", name: "İdari Teşkilatlanma", tags: ["caution"] },
          { id: "vat_5_4", num: "5.4", name: "Kamu Hizmetleri", tags: ["caution"] },
          { id: "vat_5_5", num: "5.5", name: "İdari İşlemler", tags: ["caution"] },
          { id: "vat_5_6", num: "5.6", name: "İdari Sözleşmeler", tags: ["caution"] },
          { id: "vat_5_7", num: "5.7", name: "İdari Yargı", tags: ["caution"] },
          { id: "vat_5_8", num: "5.8", name: "Memurlar Hukuku", tags: ["caution"] }
        ]
      },
      {
        name: "6. ULUSLARARASI HUKUK",
        topics: [
          { id: "vat_6_1", num: "6.1", name: "Uluslararası Hukukun Tanımı ve Kaynakları", tags: ["caution"] },
          { id: "vat_6_2", num: "6.2", name: "Milletlerarası Antlaşmalar", tags: ["caution"] },
          { id: "vat_6_3", num: "6.3", name: "İnsan Hakları ve Uluslararası Kuruluşlar", tags: ["star", "caution"] },
          { id: "vat_6_4", num: "6.4", name: "Türkiye'nin Taraf Olduğu Kuruluşlar", tags: ["caution"] }
        ]
      }
    ]
  },
  {
    id: "matematik",
    title: "Matematik",
    fullTitle: "KPSS MATEMATİK DENEME ANALİZ ÇİZELGESİ",
    color: "cyan",
    icon: "📐",
    badgeBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    headerBg: "from-cyan-900/40 via-slate-900 to-blue-950/30",
    units: [
      {
        name: "1. TEMEL KAVRAMLAR",
        topics: [
          { id: "mat_1_1", num: "1.1", name: "Sayı Basamakları – Bölük – Basamak", tags: [] },
          { id: "mat_1_2", num: "1.2", name: "Doğal Sayılar – Tam Sayılar", tags: [] },
          { id: "mat_1_3", num: "1.3", name: "Rasyonel Sayılar", tags: [] },
          { id: "mat_1_4", num: "1.4", name: "Ondalık Sayılar", tags: [] },
          { id: "mat_1_5", num: "1.5", name: "Mutlak Değer", tags: [] },
          { id: "mat_1_6", num: "1.6", name: "Sayı Doğrusu", tags: [] },
          { id: "mat_1_7", num: "1.7", name: "Eşitsizlikler", tags: [] }
        ]
      },
      {
        name: "2. BÖLME BÖLÜNEBİLME",
        topics: [
          { id: "mat_2_1", num: "2.1", name: "Bölme Kuralları", tags: [] },
          { id: "mat_2_2", num: "2.2", name: "Bölünebilme Kuralları", tags: [] },
          { id: "mat_2_3", num: "2.3", name: "Asal Sayılar", tags: [] },
          { id: "mat_2_4", num: "2.4", name: "Asal Çarpanlarına Ayırma", tags: [] },
          { id: "mat_2_5", num: "2.5", name: "EBOB – EKOK", tags: [] },
          { id: "mat_2_6", num: "2.6", name: "Rasyonel Sayılarda Sadeleştirme", tags: [] }
        ]
      },
      {
        name: "3. ORAN – ORANTI",
        topics: [
          { id: "mat_3_1", num: "3.1", name: "Oran", tags: [] },
          { id: "mat_3_2", num: "3.2", name: "Orantı", tags: [] },
          { id: "mat_3_3", num: "3.3", name: "Doğru Orantı", tags: [] },
          { id: "mat_3_4", num: "3.4", name: "Ters Orantı", tags: [] },
          { id: "mat_3_5", num: "3.5", name: "Oran – Orantı Problemleri", tags: [] }
        ]
      },
      {
        name: "4. SAYILAR",
        topics: [
          { id: "mat_4_1", num: "4.1", name: "Üslü Sayılar", tags: [] },
          { id: "mat_4_2", num: "4.2", name: "Köklü Sayılar", tags: [] },
          { id: "mat_4_3", num: "4.3", name: "Üslü – Köklü İfadeler", tags: [] },
          { id: "mat_4_4", num: "4.4", name: "İşlem Önceliği", tags: [] },
          { id: "mat_4_5", num: "4.5", name: "Sayı Basamakları Problemleri", tags: [] }
        ]
      },
      {
        name: "5. DENKLEMLER VE EŞİTSİZLİKLER",
        topics: [
          { id: "mat_5_1", num: "5.1", name: "Birinci Dereceden Bir Bilinmeyenli Denklemler", tags: [] },
          { id: "mat_5_2", num: "5.2", name: "İkinci Dereceden Bir Bilinmeyenli Denklemler", tags: [] },
          { id: "mat_5_3", num: "5.3", name: "Mutlak Değerli Denklemler", tags: [] },
          { id: "mat_5_4", num: "5.4", name: "Birinci Dereceden Bir Bilinmeyenli Eşitsizlikler", tags: [] },
          { id: "mat_5_5", num: "5.5", name: "İkinci Dereceden Eşitsizlikler", tags: [] },
          { id: "mat_5_6", num: "5.6", name: "Mutlak Değerli Eşitsizlikler", tags: [] },
          { id: "mat_5_7", num: "5.7", name: "Denklem – Eşitsizlik Problemleri", tags: [] }
        ]
      },
      {
        name: "6. PROBLEMLER",
        topics: [
          { id: "mat_6_1", num: "6.1", name: "Yaş Problemleri", tags: [] },
          { id: "mat_6_2", num: "6.2", name: "İşçi – Havuz Problemleri", tags: [] },
          { id: "mat_6_3", num: "6.3", name: "Hareket Problemleri", tags: [] },
          { id: "mat_6_4", num: "6.4", name: "Karışım Problemleri", tags: [] },
          { id: "mat_6_5", num: "6.5", name: "Yüzde Problemleri", tags: [] },
          { id: "mat_6_6", num: "6.6", name: "Kâr – Zarar Problemleri", tags: [] },
          { id: "mat_6_7", num: "6.7", name: "Faiz Problemleri", tags: [] },
          { id: "mat_6_8", num: "6.8", name: "Oran – Orantı Problemleri", tags: [] },
          { id: "mat_6_9", num: "6.9", name: "Sayı Problemleri", tags: [] },
          { id: "mat_6_10", num: "6.10", name: "Denklem Kurma Problemleri", tags: [] },
          { id: "mat_6_11", num: "6.11", name: "Tablo – Grafik Problemleri", tags: [] },
          { id: "mat_6_12", num: "6.12", name: "Kesir Problemleri", tags: [] },
          { id: "mat_6_13", num: "6.13", name: "Saat Problemleri", tags: [] },
          { id: "mat_6_14", num: "6.14", name: "Kümelerle İlgili Problemler", tags: [] },
          { id: "mat_6_15", num: "6.15", name: "Mantık Problemleri", tags: [] }
        ]
      },
      {
        name: "7. GEOMETRİ",
        topics: [
          { id: "mat_7_1", num: "7.1", name: "Üçgenler", tags: [] },
          { id: "mat_7_2", num: "7.2", name: "Dörtgenler", tags: [] },
          { id: "mat_7_3", num: "7.3", name: "Çokgenler", tags: [] },
          { id: "mat_7_4", num: "7.4", name: "Çember ve Daire", tags: [] },
          { id: "mat_7_5", num: "7.5", name: "Analitik Geometri", tags: [] },
          { id: "mat_7_6", num: "7.6", name: "Katı Cisimler", tags: [] },
          { id: "mat_7_7", num: "7.7", name: "Alan Hesaplamaları", tags: [] },
          { id: "mat_7_8", num: "7.8", name: "Hacim Hesaplamaları", tags: [] },
          { id: "mat_7_9", num: "7.9", name: "Geometri Problemleri", tags: [] }
        ]
      },
      {
        name: "8. VERİ – SAYMA – OLASILIK",
        topics: [
          { id: "mat_8_1", num: "8.1", name: "Permütasyon", tags: [] },
          { id: "mat_8_2", num: "8.2", name: "Kombinasyon", tags: [] },
          { id: "mat_8_3", num: "8.3", name: "Olasılık", tags: [] },
          { id: "mat_8_4", num: "8.4", name: "Veri Analizi", tags: [] },
          { id: "mat_8_5", num: "8.5", name: "Tablo – Grafik Yorumu", tags: [] }
        ]
      },
      {
        name: "9. MANTIK",
        topics: [
          { id: "mat_9_1", num: "9.1", name: "Önermeler", tags: [] },
          { id: "mat_9_2", num: "9.2", name: "İse (⇒), Ancak ve Ancak (⇔)", tags: [] },
          { id: "mat_9_3", num: "9.3", name: "Niceleyiciler (∀, ∃)", tags: [] },
          { id: "mat_9_4", num: "9.4", name: "Önermelerin Olumsuzu", tags: [] },
          { id: "mat_9_5", num: "9.5", name: "Soruları Çevirme", tags: [] },
          { id: "mat_9_6", num: "9.6", name: "Mantık Problemleri", tags: [] }
        ]
      }
    ]
  },
  {
    id: "tarih",
    title: "Tarih",
    fullTitle: "KPSS TARİH DENEME ANALİZ ÇİZELGESİ",
    color: "amber",
    icon: "📜",
    badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    headerBg: "from-amber-900/40 via-slate-900 to-orange-950/30",
    units: [
      {
        name: "1. İSLAMİYET ÖNCESİ TÜRK TARİHİ",
        topics: [
          { id: "tar_1", num: "1", name: "İlk Türk Devletleri", tags: [] },
          { id: "tar_2", num: "2", name: "Orta Asya Türk Tarihi", tags: [] },
          { id: "tar_3", num: "3", name: "Türklerin İslamiyet'i Kabulü", tags: [] },
          { id: "tar_4", num: "4", name: "Uygarlığın Doğuşu ve İlk Uygarlıklar", tags: [] },
          { id: "tar_5", num: "5", name: "Mısır Uygarlığı", tags: [] },
          { id: "tar_6", num: "6", name: "Mezopotamya Uygarlıkları", tags: [] },
          { id: "tar_7", num: "7", name: "Hint Uygarlığı", tags: [] },
          { id: "tar_8", num: "8", name: "Çin Uygarlığı", tags: [] },
          { id: "tar_9", num: "9", name: "Yunan Uygarlığı", tags: [] },
          { id: "tar_10", num: "10", name: "Roma Uygarlığı", tags: [] }
        ]
      },
      {
        name: "2. İLK TÜRK-İSLAM DEVLETLERİ",
        topics: [
          { id: "tar_11", num: "11", name: "Karahanlılar", tags: [] },
          { id: "tar_12", num: "12", name: "Gazneliler", tags: [] },
          { id: "tar_13", num: "13", name: "Büyük Selçuklu Devleti", tags: [] },
          { id: "tar_14", num: "14", name: "Harzemşahlar", tags: [] },
          { id: "tar_15", num: "15", name: "Anadolu Selçuklu Devleti", tags: [] },
          { id: "tar_16", num: "16", name: "Anadolu'da Kurulan Beylikler", tags: [] }
        ]
      },
      {
        name: "3. TÜRKİYE SELÇUKLU DEVLETİ",
        topics: [
          { id: "tar_17", num: "17", name: "Türkiye Selçuklu Devleti'nin Kuruluşu", tags: [] },
          { id: "tar_18", num: "18", name: "Türkiye Selçuklu'da Siyasi Gelişmeler", tags: [] },
          { id: "tar_19", num: "19", name: "Türkiye Selçuklu Devleti'nde Ekonomik Gelişmeler", tags: [] },
          { id: "tar_20", num: "20", name: "Türkiye Selçuklu Devleti'nde Kültürel ve Medeni Gelişmeler", tags: [] },
          { id: "tar_21", num: "21", name: "Türkiye Selçuklu Devleti'nin Yıkılışı", tags: [] }
        ]
      },
      {
        name: "4. OSMANLI DEVLETİ",
        topics: [
          { id: "tar_22", num: "22", name: "Osmanlı Devleti'nin Kuruluşu", tags: [] },
          { id: "tar_23", num: "23", name: "Osmanlı Devleti'nde Siyasi Gelişmeler", tags: [] },
          { id: "tar_24", num: "24", name: "Osmanlı Devleti'nde Kurumlar ve Teşkilat", tags: [] },
          { id: "tar_25", num: "25", name: "Osmanlı Devleti'nde Ekonomik Gelişmeler", tags: [] },
          { id: "tar_26", num: "26", name: "Osmanlı Devleti'nde Kültür ve Medeniyet (Kuruluş, Yükselme, Duraklama, Gerileme, Dağılma)", tags: [] },
          { id: "tar_27", num: "27", name: "Osmanlı Devleti'nde Islahat Hareketleri", tags: [] },
          { id: "tar_28", num: "28", name: "Osmanlı Devleti'nde Azınlık İsyanları", tags: [] },
          { id: "tar_29", num: "29", name: "Osmanlı Devleti'nin Yıkılış Süreci", tags: [] }
        ]
      },
      {
        name: "5. TÜRKİYE TARİHİ (20. YÜZYIL)",
        topics: [
          { id: "tar_30", num: "30", name: "20. Yüzyıl Başlarında Osmanlı Devleti", tags: [] },
          { id: "tar_31", num: "31", name: "I. Dünya Savaşı ve Osmanlı Devleti", tags: [] },
          { id: "tar_32", num: "32", name: "Mondros Ateşkes Antlaşması ve İşgaller", tags: [] },
          { id: "tar_33", num: "33", name: "Milli Mücadele Hazırlık Dönemi", tags: [] },
          { id: "tar_34", num: "34", name: "Milli Mücadele Dönemi", tags: [] },
          { id: "tar_35", num: "35", name: "Lozan Barış Antlaşması", tags: [] },
          { id: "tar_36", num: "36", name: "Türkiye Cumhuriyeti'nin Kuruluşu", tags: [] }
        ]
      },
      {
        name: "6. ATATÜRK İLKELERİ VE İNKILAPLARI",
        topics: [
          { id: "tar_37", num: "37", name: "Atatürk İlkeleri", tags: [] },
          { id: "tar_38", num: "38", name: "Siyasi Alandaki İnkılaplar", tags: [] },
          { id: "tar_39", num: "39", name: "Hukuk Alanındaki İnkılaplar", tags: [] },
          { id: "tar_40", num: "40", name: "Eğitim ve Kültür Alanındaki İnkılaplar", tags: [] },
          { id: "tar_41", num: "41", name: "Ekonomi Alanındaki İnkılaplar", tags: [] },
          { id: "tar_42", num: "42", name: "Toplumsal Alandaki İnkılaplar", tags: [] },
          { id: "tar_43", num: "43", name: "Atatürk Dönemi Türk Dış Politikası", tags: [] }
        ]
      },
      {
        name: "7. ÇAĞDAŞ TÜRK VE DÜNYA TARİHİ",
        topics: [
          { id: "tar_44", num: "44", name: "İki Savaş Arası Dönem (1918-1939)", tags: [] },
          { id: "tar_45", num: "45", name: "II. Dünya Savaşı (1939-1945)", tags: [] },
          { id: "tar_46", num: "46", name: "Soğuk Savaş Dönemi (1945-1990)", tags: [] },
          { id: "tar_47", num: "47", name: "Küreselleşen Dünya (1990 ve Sonrası)", tags: [] },
          { id: "tar_48", num: "48", name: "Türkiye'nin Dış Politikası (1919-2025 Arası)", tags: [] },
          { id: "tar_49", num: "49", name: "Avrupa Birliği Süreci", tags: [] },
          { id: "tar_50", num: "50", name: "Türk Cumhuriyetleri ve Türk Dünyası", tags: [] }
        ]
      }
    ]
  },
  {
    id: "cografya",
    title: "Coğrafya",
    fullTitle: "KPSS COĞRAFYA DENEME ANALİZ ÇİZELGESİ",
    color: "emerald",
    icon: "🗺️",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    headerBg: "from-emerald-900/40 via-slate-900 to-teal-950/30",
    units: [
      {
        name: "1. DOĞAL SİSTEMLER",
        topics: [
          { id: "cog_1_1", num: "1.1", name: "Coğrafyanın Konusu ve Bölümleri", tags: [] },
          { id: "cog_1_2", num: "1.2", name: "Harita Bilgisi", tags: [] },
          { id: "cog_1_3", num: "1.3", name: "Matematik Konum", tags: [] },
          { id: "cog_1_4", num: "1.4", name: "Dünya'nın Şekli ve Hareketleri", tags: [] },
          { id: "cog_1_5", num: "1.5", name: "Mekânsal Bilgi Teknolojileri", tags: [] },
          { id: "cog_1_6", num: "1.6", name: "Atmosfer ve Hava Olayları", tags: [] },
          { id: "cog_1_7", num: "1.7", name: "İklim Bilgisi", tags: [] },
          { id: "cog_1_8", num: "1.8", name: "İç Kuvvetler (Orojenez)", tags: [] },
          { id: "cog_1_9", num: "1.9", name: "Dış Kuvvetler", tags: [] },
          { id: "cog_1_10", num: "1.10", name: "Toprak Bilgisi", tags: [] },
          { id: "cog_1_11", num: "1.11", name: "Bitki Örtüsü", tags: [] },
          { id: "cog_1_12", num: "1.12", name: "Su (Hidrosfer)", tags: [] },
          { id: "cog_1_13", num: "1.13", name: "Doğal Afetler", tags: [] }
        ]
      },
      {
        name: "2. BEŞERİ SİSTEMLER",
        topics: [
          { id: "cog_2_1", num: "2.1", name: "Nüfus Bilgisi", tags: [] },
          { id: "cog_2_2", num: "2.2", name: "Yerleşme Coğrafyası", tags: [] },
          { id: "cog_2_3", num: "2.3", name: "Göçler", tags: [] },
          { id: "cog_2_4", num: "2.4", name: "Ekonomik Faaliyetler", tags: [] },
          { id: "cog_2_5", num: "2.5", name: "Ulaşım", tags: [] },
          { id: "cog_2_6", num: "2.6", name: "Haberleşme", tags: [] },
          { id: "cog_2_7", num: "2.7", name: "Ticaret", tags: [] },
          { id: "cog_2_8", num: "2.8", name: "Turizm", tags: [] },
          { id: "cog_2_9", num: "2.9", name: "Doğal, Beşeri ve Ekonomik Çevre", tags: [] },
          { id: "cog_2_10", num: "2.10", name: "Bölge Kavramı ve Bölgeler", tags: [] }
        ]
      },
      {
        name: "3. TÜRKİYE'NİN FİZİKİ COĞRAFYASI",
        topics: [
          { id: "cog_3_1", num: "3.1", name: "Türkiye'nin Jeolojik Özellikleri", tags: [] },
          { id: "cog_3_2", num: "3.2", name: "Türkiye'nin Yer Şekilleri", tags: [] },
          { id: "cog_3_3", num: "3.3", name: "Türkiye'nin İklimi", tags: [] },
          { id: "cog_3_4", num: "3.4", name: "Türkiye'nin Akarsuları", tags: [] },
          { id: "cog_3_5", num: "3.5", name: "Türkiye'nin Gölleri", tags: [] },
          { id: "cog_3_6", num: "3.6", name: "Türkiye'nin Toprakları", tags: [] },
          { id: "cog_3_7", num: "3.7", name: "Türkiye'nin Bitki Örtüsü", tags: [] }
        ]
      },
      {
        name: "4. TÜRKİYE'NİN BEŞERİ VE EKONOMİK COĞRAFYASI",
        topics: [
          { id: "cog_4_1", num: "4.1", name: "Türkiye'de Nüfus", tags: [] },
          { id: "cog_4_2", num: "4.2", name: "Türkiye'de Yerleşme", tags: [] },
          { id: "cog_4_3", num: "4.3", name: "Türkiye'de Tarım", tags: [] },
          { id: "cog_4_4", num: "4.4", name: "Türkiye'de Hayvancılık", tags: [] },
          { id: "cog_4_5", num: "4.5", name: "Türkiye'de Ormancılık ve Balıkçılık", tags: [] },
          { id: "cog_4_6", num: "4.6", name: "Türkiye'de Madencilik", tags: [] },
          { id: "cog_4_7", num: "4.7", name: "Türkiye'de Sanayi", tags: [] },
          { id: "cog_4_8", num: "4.8", name: "Türkiye'de Ulaşım", tags: [] },
          { id: "cog_4_9", num: "4.9", name: "Türkiye'de Ticaret", tags: [] },
          { id: "cog_4_10", num: "4.10", name: "Türkiye'de Turizm", tags: [] },
          { id: "cog_4_11", num: "4.11", name: "Türkiye'de Enerji", tags: [] }
        ]
      },
      {
        name: "5. TÜRKİYE'NİN BÖLGELERİ",
        topics: [
          { id: "cog_5_1", num: "5.1", name: "Marmara Bölgesi", tags: [] },
          { id: "cog_5_2", num: "5.2", name: "Ege Bölgesi", tags: [] },
          { id: "cog_5_3", num: "5.3", name: "Akdeniz Bölgesi", tags: [] },
          { id: "cog_5_4", num: "5.4", name: "İç Anadolu Bölgesi", tags: [] },
          { id: "cog_5_5", num: "5.5", name: "Karadeniz Bölgesi", tags: [] },
          { id: "cog_5_6", num: "5.6", name: "Doğu Anadolu Bölgesi", tags: [] },
          { id: "cog_5_7", num: "5.7", name: "Güneydoğu Anadolu Bölgesi", tags: [] }
        ]
      }
    ]
  },
  {
    id: "turkce",
    title: "Türkçe",
    fullTitle: "KPSS TÜRKÇE DENEME ANALİZ ÇİZELGESİ",
    color: "rose",
    icon: "📖",
    badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    headerBg: "from-rose-900/40 via-slate-900 to-red-950/30",
    units: [
      {
        name: "1. SÖZCÜKTE ANLAM",
        topics: [
          { id: "tur_1_1", num: "1.1", name: "Sözcükte Anlam (Temel Kavramlar)", tags: ["star"] },
          { id: "tur_1_2", num: "1.2", name: "Eş Anlamlı (Anlamdaş) Sözcükler", tags: ["star"] },
          { id: "tur_1_3", num: "1.3", name: "Zıt Anlamlı (Karşıt) Sözcükler", tags: ["star"] },
          { id: "tur_1_4", num: "1.4", name: "Eş Sesli (Sesteş) Sözcükler", tags: ["star", "critical"] },
          { id: "tur_1_5", num: "1.5", name: "Çok Anlamlı (Mecaz) Sözcükler", tags: ["star"] },
          { id: "tur_1_6", num: "1.6", name: "Somut - Soyut Anlam", tags: ["star", "caution"] },
          { id: "tur_1_7", num: "1.7", name: "Terim Anlamlı Sözcükler", tags: ["caution"] },
          { id: "tur_1_8", num: "1.8", name: "Sözcük Yerine Kullanılan Sözcükler", tags: ["caution"] },
          { id: "tur_1_9", num: "1.9", name: "Atasözü ve Deyim Anlamı", tags: ["star", "critical"] }
        ]
      },
      {
        name: "2. CÜMLEDE ANLAM",
        topics: [
          { id: "tur_2_1", num: "2.1", name: "Cümlenin Anlam Özellikleri", tags: ["star"] },
          { id: "tur_2_2", num: "2.2", name: "Cümle Türleri", tags: ["star"] },
          { id: "tur_2_3", num: "2.3", name: "Cümlede Anlam İlişkileri", tags: ["star", "critical"] },
          { id: "tur_2_4", num: "2.4", name: "Anlamca Çelişen Cümleler", tags: ["caution"] },
          { id: "tur_2_5", num: "2.5", name: "Anlamca Doğru - Yanlış Cümleler", tags: ["caution"] },
          { id: "tur_2_6", num: "2.6", name: "Cümle Tamamlama", tags: ["star"] },
          { id: "tur_2_7", num: "2.7", name: "Cümleye Uygun Düşen Sözcük", tags: ["star"] },
          { id: "tur_2_8", num: "2.8", name: "Cümlede Vurgu", tags: ["caution"] }
        ]
      },
      {
        name: "3. PARAGRAF",
        topics: [
          { id: "tur_3_1", num: "3.1", name: "Paragrafın Anlam Özellikleri", tags: ["star"] },
          { id: "tur_3_2", num: "3.2", name: "Ana Düşünce / Ana Fikir", tags: ["star3", "critical"] },
          { id: "tur_3_3", num: "3.3", name: "Yardımcı Düşünceler", tags: ["star2", "critical"] },
          { id: "tur_3_4", num: "3.4", name: "Paragrafta Konu", tags: ["star"] },
          { id: "tur_3_5", num: "3.5", name: "Paragrafta Başlık", tags: ["star"] },
          { id: "tur_3_6", num: "3.6", name: "Paragrafın Yapı Unsurları", tags: ["star2"] },
          { id: "tur_3_7", num: "3.7", name: "Paragrafta Anlatım Biçimleri", tags: ["caution"] },
          { id: "tur_3_8", num: "3.8", name: "Paragrafta Düşünceyi Geliştirme Yolları", tags: ["star"] },
          { id: "tur_3_9", num: "3.9", name: "Paragrafta Anlam İlişkileri", tags: ["star2", "critical"] },
          { id: "tur_3_10", num: "3.10", name: "Paragraf Tamamlama", tags: ["star2", "critical"] },
          { id: "tur_3_11", num: "3.11", name: "Paragrafta Yazarın Tutumu", tags: ["star2"] },
          { id: "tur_3_12", num: "3.12", name: "Paragrafta Soru Kökü Analizi", tags: ["star3", "critical"] }
        ]
      },
      {
        name: "4. DİL BİLGİSİ",
        topics: [
          { id: "tur_4_1", num: "4.1", name: "Ses Bilgisi", tags: ["star"] },
          { id: "tur_4_2", num: "4.2", name: "Şekil Bilgisi (Ekler)", tags: ["star"] },
          { id: "tur_4_3", num: "4.3", name: "Sözcük Türleri", tags: ["star"] },
          { id: "tur_4_4", num: "4.4", name: "Sözcükte Yapı", tags: ["caution"] },
          { id: "tur_4_5", num: "4.5", name: "İsim (Ad) Bilgisi", tags: ["star"] },
          { id: "tur_4_6", num: "4.6", name: "Sıfat (Ön Ad) Bilgisi", tags: [] },
          { id: "tur_4_7", num: "4.7", name: "Zamir (Adıl) Bilgisi", tags: ["star"] },
          { id: "tur_4_8", num: "4.8", name: "Zarf (Belirteç) Bilgisi", tags: ["caution"] },
          { id: "tur_4_9", num: "4.9", name: "Edat (İlgeç) - Bağlaç - Ünlem", tags: ["caution"] },
          { id: "tur_4_10", num: "4.10", name: "Fiilimsiler", tags: ["star"] },
          { id: "tur_4_11", num: "4.11", name: "Fiil (Eylem) Bilgisi", tags: ["star"] },
          { id: "tur_4_12", num: "4.12", name: "Cümle Bilgisi", tags: ["star2", "critical"] },
          { id: "tur_4_13", num: "4.13", name: "Noktalama İşaretleri", tags: ["star", "caution"] }
        ]
      },
      {
        name: "5. ANLATIM BOZUKLUĞU",
        topics: [
          { id: "tur_5_1", num: "5.1", name: "Anlatım Bozukluklarının Nedenleri", tags: ["star"] },
          { id: "tur_5_2", num: "5.2", name: "Anlatım Bozuklukları", tags: ["star2", "critical"] },
          { id: "tur_5_3", num: "5.3", name: "Anlatım Bozukluğu Soruları", tags: ["star2", "critical"] }
        ]
      }
    ]
  }
];
