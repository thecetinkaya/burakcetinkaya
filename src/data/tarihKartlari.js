// =====================================================================
// KPSS 2026 TARİH KARTLARI
// Kaynak: Ahmet Uğur Karakuza – Yediiklim Yayıncılık
// Atölye Serisi & Genel Tekrar Kampı video ders notlarından derlenmiştir.
// ⭐ = Hocanın "Bunlar sınavda çıkabilir!" dediği konular
// =====================================================================

const tarihKartlari = [
  // ─────────────────────────────────────────────
  // 1. İSLAMİYET ÖNCESİ TÜRK TARİHİ
  // ─────────────────────────────────────────────
  {
    id: 1,
    kategori: "İlk Türk Devletleri",
    baslik: "Orta Asya Kültürleri",
    icerik: "• Anav Kültürü → En eski Orta Asya kültürü (Türklere ait olup olmadığı tartışmalı)\n• Afanesyevo → Türklere ait en eski kültür\n• Andronovo → En geniş yayılım alanına sahip\n• Karasuk → Demiri ilk kullanan kültür\n• Tagar → En gelişmiş kültür",
    ipucu: "Sıralama: A-A-A-K-T (Anav, Afanesyevo, Andronovo, Karasuk, Tagar)",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "1-2"
  },
  {
    id: 2,
    kategori: "İlk Türk Devletleri",
    baslik: "\"Türk\" Adının Anlamları",
    icerik: "• Kaşgarlı Mahmud → 'Olgunluk çağı'\n• Ziya Gökalp → 'Türeli/Kanun sahibi'\n• Çin Kaynakları → 'Miğfer'\n• Bizans Kaynakları → 'Güçlü, Kuvvetli'\n• A. Wambery → 'Türemek'",
    ipucu: "ÖSYM'nin sevdiği detay! Kimin hangi anlamı verdiğini karıştırmayın.",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1"
  },
  {
    id: 3,
    kategori: "İlk Türk Devletleri",
    baslik: "Asya Hun Devleti (MÖ 220 – MS 216)",
    icerik: "• Bilinen ilk Türk devleti\n• Kurucusu: Teoman\n• En parlak dönem: Mete Han\n• Mete Han'ın getirdiği yenilikler:\n  → Onlu (Desimal) ordu sistemi\n  → Turan taktiği (Hilal/Kurt kapanı)\n  → Siyasi birliği sağlama\n• Mete Han Dönemi = Türk Kara Kuvvetleri kuruluş günü kabul edilir",
    ipucu: "Mete Han'ın onlu sistemi dünya askeri tarihinde bir ilk olarak sorulabilir!",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "1-2"
  },
  {
    id: 4,
    kategori: "İlk Türk Devletleri",
    baslik: "Göktürkler (552 – 745)",
    icerik: "• \"Türk\" adını devlet adı olarak kullanan İLK Türk devleti\n• Kurucusu: Bumin Kağan\n• Doğu-Batı olarak ikiye ayrıldı\n• Orhun Yazıtları (Bilge Kağan, Kül Tigin, Tonyukuk)\n  → Türk tarihinin ve Türk edebiyatının ilk yazılı kaynağı\n  → Yontulgan: Yollug Tigin",
    ipucu: "Orhun Yazıtları detayları çok sorulur: Kim yazdı, kime ait, nerede bulundu?",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 5,
    kategori: "İlk Türk Devletleri",
    baslik: "Uygurlar (744 – 840)",
    icerik: "• Yerleşik hayata geçen İLK Türk devleti\n• Matbaayı ve kâğıdı kullanan İLK Türk devleti\n• Maniheizm dinini benimsediler → Et yemek ve savaşçılık azaldı\n• Tarım ve ticarete yöneldiler\n• Sarayları ve tapınakları olan mimari eserler bıraktılar\n• Çin uygarlığından etkilendiler",
    ipucu: "Yerleşik hayat + Mani dini = Uygur. Bu formül sınavda kesin var!",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "1-2"
  },
  {
    id: 6,
    kategori: "İlk Türk Devletleri",
    baslik: "İlk Türk Devlet Teşkilatı",
    icerik: "• Kağan (Hakan) → Devlet başkanı\n• Hatun → Kağan'ın eşi, meclise katılır\n• Kurultay (Toy) → Danışma meclisi\n• Kut Anlayışı → İktidar hakkının Tanrı'dan geldiği inanç\n• Veraset Sistemi: 'Ülke hanedanın ortak malıdır'\n  → Bu anlayış sürekli taht kavgalarına neden olmuştur\n• İkili Teşkilat → Doğu (asıl hakan) + Batı (yabgu)",
    ipucu: "Kut anlayışı ve veraset sistemi = Türk devletlerinin yıkılış nedeni olarak sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 7,
    kategori: "İlk Türk Devletleri",
    baslik: "İskitler (Sakalar)",
    icerik: "• Bilinen ilk Türk topluluğu (Devlet değil, topluluk!)\n• 'Bozkırın Kuyumcuları' olarak bilinirler → Altın işçiliği\n• Alp Er Tunga → İskit kahramanı\n• Tomris Hatun → Pers kralı Kiros'u yenen İskit kraliçesi\n• Hayvan üslubu (Animal style) sanatı ile ünlüler",
    ipucu: "İskit = Altın işçiliği = Bozkırın Kuyumcuları. Bu üçlü eşleşme sorulur!",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "1"
  },

  // ─────────────────────────────────────────────
  // 2. TÜRK-İSLAM DEVLETLERİ
  // ─────────────────────────────────────────────
  {
    id: 8,
    kategori: "Türk-İslam Devletleri",
    baslik: "Karahanlılar (840 – 1212)",
    icerik: "• İslamiyeti kabul eden İLK Türk devleti\n• Türkçeyi resmi dil olarak kullandılar\n• Önemli Eserler:\n  → Kutadgu Bilig – Yusuf Has Hacip (Siyasetname)\n  → Divan-ı Lügat'it Türk – Kaşgarlı Mahmud (İlk Türkçe sözlük)\n  → Atabetü'l Hakayık – Edip Ahmet Yükneki (Ahlak kitabı)\n  → Divan-ı Hikmet – Ahmet Yesevi (Tasavvuf)",
    ipucu: "4 büyük eser ve yazarlarını karıştırmadan bilin! Her yıl sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 9,
    kategori: "Türk-İslam Devletleri",
    baslik: "Büyük Selçuklu Devleti (1040 – 1157)",
    icerik: "• Kurucu: Tuğrul Bey\n• En parlak dönem: Melikşah (Vezir: Nizamülmülk)\n• Dandanakan Savaşı (1040) → Gaznelileri yenip bağımsız oldular\n• Malazgirt Savaşı (1071) → Anadolu'nun kapıları Türklere açıldı\n• Nizamiye Medreseleri → Dünyada ilk planlı üniversite sistemi\n• Atabeylik Sistemi → Şehzadeleri eğiten devlet adamları",
    ipucu: "Dandanakan = Kuruluş, Malazgirt = Anadolu'nun kapısı. Bu iki savaş çok kritik!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 10,
    kategori: "Türk-İslam Devletleri",
    baslik: "Gazneliler (963 – 1187)",
    icerik: "• Kurucusu: Alp Tegin\n• En parlak dönem: Gazneli Mahmud\n• Hindistan'a 17 sefer düzenledi (İslamiyet'i yaymak)\n• Çok uluslu yapıya sahip İLK Türk-İslam devleti\n• Sultan unvanını kullanan ilk Türk hükümdarı: Gazneli Mahmud\n• Firdevsi'nin Şehname'si Gazneli Mahmud'a sunulmuştur",
    ipucu: "Sultan unvanını İLK kullanan = Gazneli Mahmud. Bu sık sık sorulur!",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "1"
  },
  {
    id: 11,
    kategori: "Türk-İslam Devletleri",
    baslik: "Anadolu Selçuklu Devleti",
    icerik: "• Kurucusu: Süleyman Şah (Kutalmışoğlu)\n• Başkent: İznik → sonra Konya\n• Miryokefalon Savaşı (1176) → Anadolu kesin Türk yurdu\n• Kösedağ Savaşı (1243) → Moğol hakimiyetine girdi\n• Kervansaraylar inşa ettiler (Ticaret)\n• Denizcilik faaliyetleri: Sinop, Antalya, Alanya fethi\n• Ahilik teşkilatı → Esnaf örgütü",
    ipucu: "Miryokefalon = Anadolu kesin Türk yurdu. Malazgirt ile karıştırılmamalı!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },

  // ─────────────────────────────────────────────
  // 3. OSMANLI SİYASİ TARİHİ
  // ─────────────────────────────────────────────
  {
    id: 12,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "Osmanlı Kuruluş Dönemi (1299-1453)",
    icerik: "• Kurucusu: Osman Bey\n• İlk Osmanlı parası: Osman Bey bastırdı\n• İlk düzenli ordu (Yeniçeri): Orhan Bey → Devşirme sistemi\n• İlk Osmanlı veziri: Alaeddin Paşa (Orhan Bey dönemi)\n• İlk divan: Orhan Bey dönemi\n• İlk medrese: İznik (Orhan Bey)\n• Rumeli'ye ilk geçiş: Çimpe Kalesi (1353)\n• Edirne'nin fethi: I. Murad",
    ipucu: "Orhan Bey dönemi 'ilk'leri çok sorulur! Ordu, medrese, para, divan...",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 13,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "İstanbul'un Fethi (1453)",
    icerik: "• Fatih Sultan Mehmet (II. Mehmet)\n• 53 günlük kuşatma\n• Şahi topları döktürüldü (Macar Urban Usta)\n• Gemiler karadan yürütüldü (Haliç'e)\n• Sonuçları:\n  → Orta Çağ sona erdi, Yeni Çağ başladı\n  → İpek Yolu Osmanlı kontrolüne girdi\n  → Bizans İmparatorluğu yıkıldı\n  → İstanbul başkent yapıldı\n  → Fetih, Osmanlı'yı imparatorluğa dönüştürdü",
    ipucu: "İstanbul'un fethi = Çağ değişimi. Sonuçları tek tek bilinmeli!",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "1-2"
  },
  {
    id: 14,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "Osmanlı Yükselme Dönemi Padişahları",
    icerik: "• Fatih Sultan Mehmet (1451-1481)\n  → Kanunname-i Ali Osman (kardeş katli)\n  → Sahn-ı Seman medreseleri\n• II. Bayezid (1481-1512) → Cem Sultan olayı\n• Yavuz Sultan Selim (1512-1520)\n  → Mısır Seferi, Halifeliğin Osmanlı'ya geçişi\n  → Ridaniye ve Mercidabık savaşları\n• Kanuni Sultan Süleyman (1520-1566)\n  → En uzun padişahlık, Mohaç, Viyana kuşatması\n  → Kapitülasyonların verilmesi (Fransa'ya)",
    ipucu: "Yavuz = Doğu seferleri ve halifelik. Kanuni = Batı seferleri ve hukuk. Karıştırmayın!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 15,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "Osmanlı Gerileme ve Islahat Dönemi",
    icerik: "• Karlofça Antlaşması (1699) → İlk büyük toprak kaybı\n• Lale Devri (1718-1730) → İlk matbaa (İbrahim Müteferrika)\n• III. Selim → Nizam-ı Cedid (Yeni düzen ordusu)\n• II. Mahmud → Yeniçeri Ocağı kaldırıldı (Vaka-i Hayriye, 1826)\n  → Asakir-i Mansure-i Muhammediye kuruldu\n  → İlk nüfus sayımı, ilk posta teşkilatı, ilk resmi gazete (Takvim-i Vekayi)\n• Tanzimat Fermanı (1839) → Kanun önünde eşitlik",
    ipucu: "II. Mahmud 'ilk'leri: Nüfus sayımı, posta, resmi gazete. Çok sorulur!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "3-4"
  },
  {
    id: 16,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "Tanzimat ve Islahat Fermanları",
    icerik: "• Tanzimat Fermanı (1839 – Gülhane Hatt-ı Hümayunu)\n  → Padişahın yetkilerini kısıtlayan ilk belge\n  → Hukuk, eğitim, askeri alanlarda reform\n  → Can, mal, namus güvencesi\n• Islahat Fermanı (1856)\n  → Azınlıklara geniş haklar verildi\n  → Gayrimüslimlere devlet memuru olma hakkı\n  → Amacı: Avrupalı devletlerin iç işlerimize müdahalesini önlemek\n• I. Meşrutiyet (1876) → İlk anayasa: Kanun-i Esasi\n• II. Meşrutiyet (1908) → İttihat ve Terakki etkisi",
    ipucu: "Tanzimat = Herkese eşitlik. Islahat = Azınlıklara özel haklar. Farkı bilin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 17,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "Osmanlı'da Fikir Akımları",
    icerik: "• Osmanlıcılık → Tüm Osmanlı vatandaşlarını birleştirmek\n  → Genç Osmanlılar (Namık Kemal, Ziya Paşa)\n• İslamcılık (Ümmetçilik) → İslam birliği\n  → II. Abdülhamid'in politikası\n• Türkçülük → Türk milliyetçiliği\n  → Ziya Gökalp, Mehmet Emin Yurdakul\n• Batıcılık → Batılı kurumların benimsenmesi\n  → Abdullah Cevdet\n• Adem-i Merkeziyetçilik → Yerel yönetimlere güç\n  → Prens Sabahattin",
    ipucu: "Her fikir akımını bir isimle eşleştirin! Sınavda fikir akımı-temsilci eşleşmesi sorulur!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "1-2"
  },

  // ─────────────────────────────────────────────
  // 4. OSMANLI KÜLTÜR VE UYGARLIĞI
  // ─────────────────────────────────────────────
  {
    id: 18,
    kategori: "Osmanlı Kültür ve Uygarlığı",
    baslik: "Osmanlı Devlet Yönetimi",
    icerik: "• Padişah → Mutlak otorite (Meşrutiyete kadar)\n• Divan-ı Hümayun → Bakanlar kurulu\n  → Fatih'ten sonra sadrazam başkanlığında toplandı\n• Sadrazam → Başbakan\n• Şeyhülislam → Dini konularda en yetkili\n• Kazasker → Adalet işleri\n• Defterdar → Maliye işleri\n• Nişancı → Tuğra çeken, toprak işleri",
    ipucu: "Divan üyeleri ve görevleri sıkça sorulur! Kazasker-Defterdar-Nişancı üçlüsü özellikle!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 19,
    kategori: "Osmanlı Kültür ve Uygarlığı",
    baslik: "Osmanlı Toprak Sistemi",
    icerik: "• Miri Arazi → Devlete ait topraklar\n  → Tımar: Sipahilere verilen toprak (karşılığında asker besler)\n  → Zeamet: Orta düzey askeri yöneticilere\n  → Has: Padişah, vezir gibi üst düzey yöneticilere\n• Mülk Arazi → Kişiye ait toprak\n• Vakıf Arazi → Hayır kurumlarına bırakılan toprak\n\nTımar Sistemi → Hem asker yetiştirir hem tarımı destekler. İki işlev bir arada!",
    ipucu: "Tımar, Zeamet, Has ayrımı ve gelir miktarları sınavda detaylı sorulur!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 20,
    kategori: "Osmanlı Kültür ve Uygarlığı",
    baslik: "Osmanlı Ordu Teşkilatı",
    icerik: "• Kapıkulu Askerleri (Merkezde)\n  → Yeniçeriler (Piyade – Devşirme sistemi)\n  → Cebeciler, Topçular, Humbaracılar\n• Eyalet Askerleri (Taşrada)\n  → Tımarlı Sipahiler (Atlı – Tımar karşılığı)\n  → Akıncılar (Sınır boylarında)\n• Donanma → Kaptan-ı Derya komutasında\n  → Barbaros Hayreddin Paşa (Preveze 1538)\n  → Lepanto/İnebahtı (1571) → Osmanlı donanma kaybı",
    ipucu: "Kapıkulu = maaşlı merkez ordusu, Tımarlı = toprak karşılığı eyalet ordusu. Farkı bilin!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 21,
    kategori: "Osmanlı Kültür ve Uygarlığı",
    baslik: "Osmanlı Hukuk Sistemi",
    icerik: "• Şer'i Hukuk → İslam dinine dayalı (Şeyhülislam)\n• Örfi Hukuk → Padişahın koyduğu kurallar\n  → Kanunname-i Ali Osman (Fatih)\n• Kapitülasyonlar → Yabancı tüccarlara verilen ayrıcalıklar\n  → İlk kez Kanuni döneminde Fransa'ya verildi\n  → 1923 Lozan'da kaldırıldı\n• Kadı → Yargıç; hem şer'i hem örfi hukuku uygular",
    ipucu: "Şer'i hukuk + Örfi hukuk = Osmanlı'nın çift başlı hukuk sistemi. Bu ayrım kritik!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },

  // ─────────────────────────────────────────────
  // 5. KURTULUŞ SAVAŞI VE İNKILAP TARİHİ
  // ─────────────────────────────────────────────
  {
    id: 22,
    kategori: "İnkılap Tarihi",
    baslik: "Mondros Ateşkes Antlaşması (30 Ekim 1918)",
    icerik: "• I. Dünya Savaşı sonunda imzalandı\n• 25 madde içerir\n• En kritik madde: 7. Madde\n  → 'İtilaf Devletleri güvenliklerini tehdit edecek bir durum olursa herhangi bir stratejik noktayı işgal edebilir'\n  → Bu madde işgallerin hukuki dayanağı oldu\n• Ordunun terhis edilmesi (silahlar teslim)\n• Osmanlı Devleti fiilen sona erdi",
    ipucu: "7. Madde = İşgallerin kapısını açan madde. Bu mutlaka bilinmeli!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 23,
    kategori: "İnkılap Tarihi",
    baslik: "Kurtuluş Savaşı Hazırlık Dönemi – Kongreler",
    icerik: "• Havza Genelgesi (28 Mayıs 1919) → Mitingler yapılsın\n• Amasya Genelgesi (22 Haziran 1919)\n  → 'Milletin istiklâlini yine milletin azim ve kararı kurtaracaktır'\n  → Kurtuluş Savaşı'nın gerekçesi ve yöntemi belirlendi\n• Erzurum Kongresi (23 Temmuz 1919) → Bölgesel, ama ulusal kararlar alındı\n  → Milli sınırlar içinde vatan bir bütündür\n• Sivas Kongresi (4 Eylül 1919) → Ulusal kongre\n  → Tüm cemiyetler birleştirildi → Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti",
    ipucu: "Amasya = Neden? Erzurum = Ne yapılmalı? Sivas = Nasıl birleşilir? Mantığıyla öğrenin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "3-4"
  },
  {
    id: 24,
    kategori: "İnkılap Tarihi",
    baslik: "TBMM'nin Açılması (23 Nisan 1920)",
    icerik: "• Ankara'da açıldı (En güvenli yer)\n• Güçler birliği ilkesi benimsendi (Yasama + Yürütme TBMM'de)\n• 'Egemenlik kayıtsız şartsız milletindir' ilkesi\n• TBMM'ye karşı isyanlar çıktı → Hıyanet-i Vataniye Kanunu ile bastırıldı\n• İstiklal Mahkemeleri kuruldu\n• TBMM Hükümeti = Yeni Türk devletinin temeli",
    ipucu: "TBMM'nin açılmasının 'güçler birliği' ilkesi ile kurulduğu çok sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 25,
    kategori: "İnkılap Tarihi",
    baslik: "Kurtuluş Savaşı Cepheleri",
    icerik: "• DOĞU CEPHESİ → Ermenilere karşı\n  → Kazım Karabekir Paşa, Gümrü Antlaşması (1920)\n  → İlk siyasi ve askeri başarı\n• GÜNEY CEPHESİ → Fransızlara karşı\n  → Kuvayı Milliye (düzensiz), Antep, Maraş, Urfa\n• BATI CEPHESİ → Yunanlara karşı\n  → I. İnönü → Düzenli ordu ilk zaferi\n  → II. İnönü → Savunma zaferi\n  → Sakarya → Dönüm noktası (Atatürk'e Gazilik ve Mareşallik)\n  → Büyük Taarruz (26 Ağustos 1922) → Kesin zafer",
    ipucu: "Sakarya = Savunmadan taarruza geçiş! Büyük Taarruz = Kesin sonuç! Bu iki savaş mutlaka sorulur!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "3-4"
  },
  {
    id: 26,
    kategori: "İnkılap Tarihi",
    baslik: "Mudanya Ateşkes Antlaşması (11 Ekim 1922)",
    icerik: "• Büyük Taarruz'dan sonra imzalandı\n• İsmet İnönü başkanlığında Türk heyeti\n• Doğu Trakya savaşsız alındı\n• İstanbul'un TBMM'ye devri kabul edildi\n• Savaş dönemi sona erdi, barış dönemi başladı\n• Yunanistan ve İtilaf devletleri masaya oturdu",
    ipucu: "Mudanya = Savaşsız toprak kazanımı (Doğu Trakya). Bu detay sık sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1"
  },
  {
    id: 27,
    kategori: "İnkılap Tarihi",
    baslik: "Lozan Barış Antlaşması (24 Temmuz 1923)",
    icerik: "• İsmet İnönü başkanlığında Türk heyeti\n• Yeni Türk devletinin uluslararası tanınması\n• Kabul edilen sınırlar: Güney (Suriye), Batı (Yunanistan)\n• Boğazlar → Uluslararası komisyon (1936 Montrö'ye kadar)\n• Kapitülasyonlar tamamen kaldırıldı\n• Azınlıklar → Dini azınlık kabul edildi (Rum, Ermeni, Yahudi)\n• Çözülemeyen: Musul (1926 İngiltere'ye bırakıldı), Hatay (1939'da Türkiye'ye katıldı)",
    ipucu: "Lozan'da çözülemeyen konular: Musul ve Hatay. Bunlar kesinlikle sorulabilir!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },

  // ─────────────────────────────────────────────
  // 6. ATATÜRK İLKE VE İNKILAPLARI
  // ─────────────────────────────────────────────
  {
    id: 28,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Siyasi Alanda İnkılaplar",
    icerik: "• Saltanatın kaldırılması (1 Kasım 1922)\n• Cumhuriyetin ilanı (29 Ekim 1923)\n• Halifeliğin kaldırılması (3 Mart 1924)\n• Çok partili hayat denemeleri:\n  → Terakkiperver Cumhuriyet Fırkası (1924) – Kazım Karabekir\n  → Serbest Cumhuriyet Fırkası (1930) – Fethi Okyar\n  → Her ikisi de kapatıldı\n• Kadınlara seçme-seçilme hakkı:\n  → Belediye: 1930, Muhtarlık: 1933, Milletvekili: 1934",
    ipucu: "Kadınlara hakların verildiği tarihler çok sorulur! 1930-1933-1934 sırasını bilin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "3-4"
  },
  {
    id: 29,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Hukuk Alanında İnkılaplar",
    icerik: "• 1921 Anayasası (Teşkilat-ı Esasiye) → Olağanüstü dönem anayasası\n  → En kısa anayasa, egemenlik milletindir\n• 1924 Anayasası → Cumhuriyet dönemi ilk anayasası\n  → Devletin dini İslam'dır (1928'de çıkarıldı)\n  → 1937'de laiklik ilkesi eklendi\n• Medeni Kanun (1926) → İsviçre'den alındı\n  → Kadın-erkek eşitliği, tek eşlilik, miras hakkı\n• Borçlar Kanunu → İsviçre, Ceza Kanunu → İtalya",
    ipucu: "Hangi kanun hangi ülkeden? Medeni=İsviçre, Ceza=İtalya. Bu eşleşme klasik soru!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 30,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Eğitim ve Kültür Alanında İnkılaplar",
    icerik: "• Tevhid-i Tedrisat Kanunu (3 Mart 1924)\n  → Tüm eğitim kurumları MEB'e bağlandı\n  → Medreseler kapatıldı\n• Harf İnkılabı (1 Kasım 1928) → Latin harflerine geçiş\n• Millet Mektepleri (1929) → Yetişkinlere okuma-yazma\n• Türk Tarih Kurumu (1931) → Türk tarihini araştırma\n• Türk Dil Kurumu (1932) → Türkçeyi sadeleştirme\n• Üniversite Reformu (1933) → Darülfünun kapatılıp İstanbul Üniversitesi kuruldu",
    ipucu: "TTK = 1931, TDK = 1932 tarihlerini karıştırmayın! 3 Mart 1924 Devrim Kanunları paket olarak bilinmeli!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 31,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Ekonomik Alanda İnkılaplar",
    icerik: "• İzmir İktisat Kongresi (17 Şubat 1923)\n  → Misak-ı İktisadi (Ekonomik bağımsızlık yemini)\n  → 'Tam bağımsızlık ekonomik bağımsızlıkla mümkündür'\n• Aşar (Öşür) vergisinin kaldırılması (1925) → Köylüyü rahatlattı\n• Devlet bankaları kuruldu: İş Bankası (1924), Etibank, Sümerbank\n• I. Beş Yıllık Kalkınma Planı (1934-1938) → Devletçilik ilkesi\n• Kabotaj Kanunu (1 Temmuz 1926) → Türk karasularında taşımacılık hakkı Türklere",
    ipucu: "İzmir İktisat Kongresi'nin tarihi ve Misak-ı İktisadi kavramı sık sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 32,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Toplumsal Alanda İnkılaplar",
    icerik: "• Şapka Kanunu (25 Kasım 1925)\n• Tekke, zaviye ve türbelerin kapatılması (30 Kasım 1925)\n• Uluslararası saat, takvim ve ölçü birimleri (1925-1931)\n  → Miladi takvim: 1926\n  → Uluslararası rakamlar: 1928\n  → Ağırlık-uzunluk ölçüleri: 1931\n• Soyadı Kanunu (21 Haziran 1934)\n  → Atatürk soyadı TBMM tarafından verildi\n• Laikliğin anayasaya girmesi (1937)",
    ipucu: "1925 = Şapka + Tekke-Zaviye. 1934 = Soyadı. Yılları tarih şeridi ile öğrenin!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 33,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Atatürk İlkeleri",
    icerik: "• Cumhuriyetçilik → Egemenlik milletindir, yönetim şekli\n• Milliyetçilik → Milli birlik ve beraberlik, ırk ayrımı yapmaz\n• Halkçılık → Sınıf ayrımı yok, halkın refahı\n• Devletçilik → Devletin ekonomiye müdahalesi\n• Laiklik → Din-devlet işlerinin ayrılması\n• İnkılapçılık → Sürekli yenilik ve çağdaşlaşma\n\nBütünleyici İlkeler: Milli Egemenlik, Milli Bağımsızlık, Milli Birlik ve Beraberlik, Yurtta Barış Dünyada Barış, Akılcılık-Bilimsellik, İnsan ve İnsanlık Sevgisi",
    ipucu: "Temel ilkeler + Bütünleyici ilkeler ayrı ayrı bilinmeli! Hangisi temel, hangisi bütünleyici sorulur!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "3-4"
  },
  {
    id: 34,
    kategori: "Atatürk İlke ve İnkılapları",
    baslik: "Atatürk Dönemi Dış Politika (1923-1938)",
    icerik: "• Musul Meselesi (1926) → Ankara Antlaşması ile İngiltere'ye bırakıldı\n• Nüfus Mübadelesi (1923-1930) → Türk-Yunan nüfus değişimi\n• Montrö Boğazlar Sözleşmesi (1936)\n  → Boğazlar tamamen Türk egemenliğine girdi\n  → Boğazlar Komisyonu kaldırıldı\n• Balkan Antantı (1934) → Türkiye, Yunanistan, Romanya, Yugoslavya\n• Sadabat Paktı (1937) → Türkiye, İran, Irak, Afganistan\n• Hatay'ın Türkiye'ye katılması (1939)",
    ipucu: "Montrö 1936 = Boğazlarda tam egemenlik. Balkan Antantı üye ülkeleri sorulur!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },

  // ─────────────────────────────────────────────
  // 7. ÇAĞDAŞ TÜRK VE DÜNYA TARİHİ
  // ─────────────────────────────────────────────
  {
    id: 35,
    kategori: "Çağdaş Türk ve Dünya Tarihi",
    baslik: "I. Dünya Savaşı (1914-1918)",
    icerik: "• Sebep: Sömürgecilik rekabeti, milliyetçilik, bloklaşma\n• Kıvılcım: Avusturya veliahdı Franz Ferdinand suikasti\n• İttifak: Almanya, Avusturya-Macaristan, Osmanlı, Bulgaristan\n• İtilaf: İngiltere, Fransa, Rusya (sonra ABD, İtalya)\n• Osmanlı Cepheleri: Kafkas, Kanal, Çanakkale, Irak, Hicaz-Yemen, Suriye-Filistin\n• Çanakkale Savaşı (1915) → Mustafa Kemal'in tanınması\n• Sonuç: İttifak yenildi, Osmanlı parçalandı, Wilson İlkeleri",
    ipucu: "Osmanlı'nın savaştığı cepheleri ve sonuçlarını iyi bilin! Çanakkale detayları özellikle!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 36,
    kategori: "Çağdaş Türk ve Dünya Tarihi",
    baslik: "II. Dünya Savaşı ve Soğuk Savaş",
    icerik: "• II. Dünya Savaşı (1939-1945)\n  → Türkiye savaşa girmedi (tarafsızlık politikası)\n  → Son anda Almanya'ya savaş ilan etti (BM kuruculuğu için)\n• Soğuk Savaş (1947-1991)\n  → ABD (NATO) vs SSCB (Varşova Paktı)\n  → Truman Doktrini ve Marshall Planı → Türkiye Batı bloğuna dahil oldu\n  → Türkiye NATO'ya girdi (1952)\n  → Kore Savaşı'na katılım (1950-1953)\n• Berlin Duvarı'nın yıkılması (1989)\n• SSCB'nin dağılması (1991)",
    ipucu: "Türkiye'nin NATO'ya giriş yılı (1952) ve Kore Savaşı ilişkisi sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 37,
    kategori: "Çağdaş Türk ve Dünya Tarihi",
    baslik: "Kıbrıs Meselesi",
    icerik: "• 1960 → Kıbrıs Cumhuriyeti kuruldu (Garanti Antlaşması: Türkiye, Yunanistan, İngiltere)\n• 1963-64 → Rum saldırıları, Türklere soykırım girişimi\n• 1974 → Kıbrıs Barış Harekâtı\n  → I. Harekât (20 Temmuz) → Cenevre Görüşmeleri\n  → II. Harekât (14 Ağustos) → Ada'nın %37'si kontrol altına alındı\n• 1983 → KKTC'nin kurulması (Rauf Denktaş)\n• Annan Planı (2004) → Türk tarafı kabul, Rum tarafı reddetti",
    ipucu: "1974 Harekâtı ve 1983 KKTC kuruluşu genellikle birlikte sorulur!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1"
  },

  // ─────────────────────────────────────────────
  // EK: HOCANIN ÖZEL VURGULARI – SINAVDA ÇIKABİLİR!
  // ─────────────────────────────────────────────
  {
    id: 38,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "Türk Tarihinde İLK'ler (Mega Kart)",
    icerik: "• İlk Türk devleti: Asya Hun (Büyük Hun)\n• 'Türk' adını kullanan ilk devlet: Göktürkler\n• Yerleşik hayata geçen ilk Türk devleti: Uygurlar\n• İslamı kabul eden ilk Türk devleti: Karahanlılar\n• Sultan unvanı kullanan ilk Türk: Gazneli Mahmud\n• İlk Türk-İslam eserleri: Kutadgu Bilig, Divan-ı Lügat'it Türk\n• İlk Osmanlı parası: Osman Bey\n• İlk düzenli Osmanlı ordusu: Orhan Bey (Yeniçeri)\n• İlk Osmanlı medresesi: İznik (Orhan Bey)\n• İlk anayasa: Kanun-i Esasi (1876)\n• İlk matbaa: Lale Devri (İbrahim Müteferrika)\n• İlk nüfus sayımı: II. Mahmud",
    ipucu: "'İLK' soruları KPSS'nin en sevdiği soru tipidir! Bu listeyi ezbere bilin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "5+"
  },
  {
    id: 39,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "Kritik Antlaşmalar Tablosu",
    icerik: "• Kadesh (MÖ 1280) → Tarihte bilinen ilk antlaşma\n• Gümrü (1920) → TBMM'nin ilk siyasi başarısı\n• Moskova (1921) → Sovyet Rusya ile (Doğu sınırı)\n• Kars (1921) → Kafkas cumhuriyetleriyle\n• Ankara (1921) → Fransa ile (Güney sınırı, Hatay hariç)\n• Mudanya (1922) → Savaşsız Doğu Trakya\n• Lozan (1923) → Uluslararası tanınma\n• Montrö (1936) → Boğazlar tam egemenlik\n• Ankara (1926) → Musul kaybı",
    ipucu: "Antlaşmaları kronolojik sırayla ve hangi konuyu çözdüğünü bilin! Tablo şeklinde çalışın!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "3-4"
  },
  {
    id: 40,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "3 Mart 1924 Devrim Kanunları Paketi",
    icerik: "Aynı gün kabul edilen kanunlar:\n• Halifeliğin kaldırılması\n• Tevhid-i Tedrisat Kanunu (Eğitim birliği)\n• Şer'iye ve Evkaf Vekâleti'nin kaldırılması\n• Erkân-ı Harbiye Vekâleti'nin kaldırılması\n  (Ordunun siyasetten ayrılması)\n\nBu 4 kanun birlikte bilinmelidir!\nOrtak amaç: Laikleşme ve çağdaşlaşma",
    ipucu: "3 Mart 1924 = 4 kanun = 1 paket! ÖSYM bu paketi çok seviyor!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 41,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "Osmanlı Duraklama Nedenleri",
    icerik: "• İç Nedenler:\n  → Padişahların yetersizleşmesi\n  → Tımar sisteminin bozulması → Celali isyanları\n  → Yeniçerilerin bozulması (Ocak devlet içindir, devlet ocak için değildir!)\n  → Rüşvet ve adam kayırma\n  → Medreselerin bozulması\n• Dış Nedenler:\n  → Avrupa'nın Rönesans ve Reform ile güçlenmesi\n  → Coğrafi keşifler → Ticaret yollarının değişmesi\n  → Doğal sınırlara ulaşılması",
    ipucu: "İç ve dış nedenleri ayrı ayrı sıralayabilmelisiniz! Tımar sistemi bozulması = domino etkisi!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "2-3"
  },
  {
    id: 42,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "Sevr ve Lozan Karşılaştırması",
    icerik: "• SEVR (1920) → Hiçbir zaman uygulanmadı\n  → Osmanlı Devleti'ne dayatıldı\n  → Doğu'da Ermeni ve Kürt devleti öngörüldü\n  → Boğazlar uluslararası komisyona\n  → Kapitülasyonlar devam\n  → Ordu 50.700 kişiye indirildi\n\n• LOZAN (1923) → Yeni Türk devleti tanındı\n  → Tam bağımsızlık ve egemenlik\n  → Kapitülasyonlar kaldırıldı\n  → Azınlıklar sorunu çözüldü\n  → Boğazlar: Geçici komisyon (1936 Montrö ile tamamen çözüldü)",
    ipucu: "Sevr vs Lozan karşılaştırması = Klasik KPSS sorusu! Madde madde bilin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 43,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "Misak-ı Milli (28 Ocak 1920)",
    icerik: "• Son Osmanlı Mebusan Meclisi'nde kabul edildi\n• Temel İlkeleri:\n  → Mondros'ta belirlenen sınırlar içinde Türk yurdu bölünemez\n  → Batı Trakya, Kars, Ardahan, Batum için plebisit\n  → Azınlık hakları komşu ülkelerdeki Müslümanlara tanınan haklarla orantılı\n  → Kapitülasyonlar kabul edilemez\n  → Boğazlar açık, ama güvenlik sağlanmalı\n• Misak-ı Milli'nin ilanı → İstanbul'un işgaline neden oldu (16 Mart 1920)\n• Kurtuluş Savaşı'nın temel hedefini belirledi",
    ipucu: "Misak-ı Milli = Kurtuluş Savaşı'nın siyasi manifestosu. Maddeleri ezbere bilin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 44,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "Kurtuluş Savaşı'nda İlk'ler ve Önemli Detaylar",
    icerik: "• İlk silahlı direniş: Güney Cephesi (Hatay Dörtyol)\n• İlk kuvayı milliye hareketi: Güney Cephesi\n• İlk işgal edilen yer: Musul (İngiltere)\n• Son kurtulan şehir: İstanbul (6 Ekim 1923)\n• İlk uluslararası zafer: Doğu Cephesi (Gümrü)\n• Düzenli ordunun ilk zaferi: I. İnönü\n• Sakarya'nın önemi: Savunmadan taarruza geçiş\n• TBMM'ye karşı en büyük isyan: Çerkez Ethem İsyanı",
    ipucu: "Bu 'İLK'ler listesi sınavda çok yüksek olasılıkla çıkar! Ezbere bilin!",
    sinavdaCikabilir: true,
    zorluk: "zor",
    soruSayisi: "2-3"
  },
  {
    id: 45,
    kategori: "İlk Türk Devletleri",
    baslik: "Türk-Çin İlişkileri ve İpek Yolu",
    icerik: "• İpek Yolu: Çin'den Roma'ya uzanan ticaret yolu\n• Türkler ve Çin arasında sürekli mücadelenin nedeni: İpek Yolu kontrolü\n• Çin Seddi: Türk akınlarına karşı yapıldı\n• Çin'in Türklere karşı kullandığı politikalar:\n  → Prenses gönderme (hediye/casusluk)\n  → Türk boylarını birbirine düşürme\n  → Ekonomik baskı uygulama\n• Çin kaynaklarında Türklerden 'Tukyu/T'u-küe' olarak bahsedilir",
    ipucu: "İpek Yolu kontrolü = Türk-Çin mücadelesinin ana nedeni. Bu bağlantı sorulur!",
    sinavdaCikabilir: false,
    zorluk: "orta",
    soruSayisi: "1"
  },
  {
    id: 46,
    kategori: "Türk-İslam Devletleri",
    baslik: "Anadolu Beylikleri",
    icerik: "• Kösedağ Savaşı (1243) sonrası Anadolu'da kurulan beylikler:\n• Osmanoğulları → Osmanlı Devleti'nin temeli (Söğüt-Domaniç)\n• Karamanoğulları → En güçlü beylik, Osmanlı'ya en çok direnen\n  → Türkçeyi resmi dil ilan eden ilk beylik (Mehmet Bey)\n• Germiyanoğulları → Kütahya yöresi\n• Aydınoğulları → Denizcilik ile tanınır\n• Menteşeoğulları → Muğla yöresi\n• Saruhanoğulları → Manisa yöresi\n• Candaroğulları → Kastamonu yöresi",
    ipucu: "Karamanoğulları = Türkçeyi resmi dil ilan etme. Bu detay her zaman sorulabilir!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1"
  },
  {
    id: 47,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "I. Murad ve Yenilikler",
    icerik: "• 'Sultan' unvanını kullanan ilk Osmanlı padişahı\n• Devşirme sistemi ve Yeniçeri Ocağı'nı geliştirdi\n• Rumeli Beylerbeyliği'ni kurdu\n• Tımar sistemini kurdu\n• I. Kosova Savaşı (1389) → Zafer ama savaş alanında şehit oldu\n• Veraset yasasını değiştirdi: 'Tahta kim geçerse o padişahtır'\n• Edirne'yi başkent yaptı",
    ipucu: "I. Murad'ın kurumsallaşma adımları: Tımar, Devşirme, Rumeli Beylerbeyliği üçlüsü!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 48,
    kategori: "Osmanlı Siyasi Tarihi",
    baslik: "Yavuz Sultan Selim Dönemi",
    icerik: "• Sadece DOĞU seferlerine çıktı (Batı'ya hiç sefer yapmadı)\n• Çaldıran Savaşı (1514) → Safeviler'i yendi\n• Mercidabık (1516) ve Ridaniye (1517) → Memlükler yıkıldı\n• Halifelik Osmanlı'ya geçti (Kutsal emanetler İstanbul'a)\n• Mısır fethedildi → Baharat Yolu Osmanlı kontrolüne\n• 'Yavuz' lakabı = Sert, kararlı\n• Saltanatı sadece 8 yıl ama çok etkili",
    ipucu: "Yavuz = Doğu = Halifelik = Memlükler. Bu dörtlü eşleşmeyi bilin!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 49,
    kategori: "İnkılap Tarihi",
    baslik: "Mustafa Kemal'in Hayatı ve Askeri Kariyeri",
    icerik: "• Doğum: 1881, Selanik\n• Eğitim: Selanik Askeri Rüştiyesi → Manastır İdadisi → Harp Okulu → Harp Akademisi\n• Harp Akademisi'nde 'Kemal' adını aldı (Matematik öğretmeni)\n• İlk görev yeri: Şam (5. Ordu)\n• Trablusgarp Savaşı (1911-12) → İlk askeri deneyim\n• Çanakkale (1915) → 'Ben size taarruzu değil, ölmeyi emrediyorum!'\n• Anafartalar Grup Komutanı\n• 19 Mayıs 1919 → Samsun'a çıkış = Kurtuluş Savaşı başlangıcı",
    ipucu: "Atatürk'ün askeri kariyeri kronolojik sorulur! Şam-Trablusgarp-Çanakkale-Samsun sırası!",
    sinavdaCikabilir: true,
    zorluk: "orta",
    soruSayisi: "1-2"
  },
  {
    id: 50,
    kategori: "Sınavda Çıkabilir! ⭐",
    baslik: "KPSS Tarih Soru Dağılımı",
    icerik: "KPSS'de Tarih'ten toplam 27 soru gelir:\n\n• Osmanlı (Siyasi + Kültür): 8-10 soru\n• İnkılap Tarihi: 8-9 soru\n• Atatürk İlke ve İnkılapları: 4-6 soru\n• İlk Türk Devletleri + İslam: 3-4 soru\n• Çağdaş Türk ve Dünya Tarihi: 2-3 soru\n\nEn çok soru gelen konular:\n→ Osmanlı Kültür ve Uygarlık (her yıl 3-4 soru)\n→ Kurtuluş Savaşı cepheleri (her yıl 2-3 soru)\n→ Atatürk İlkeleri (her yıl 2-3 soru)",
    ipucu: "Osmanlı + İnkılap = 20 sorunun 16-19'u. Bu iki alana ağırlık verin!",
    sinavdaCikabilir: true,
    zorluk: "kolay",
    soruSayisi: "-"
  }
];

// Kategori renkleri ve ikonları
export const kategoriMeta = {
  "İlk Türk Devletleri": {
    renk: "#f59e0b",    // Amber
    renkAcik: "#fef3c7",
    ikon: "🏛️",
    soruSayisi: "3-4"
  },
  "Türk-İslam Devletleri": {
    renk: "#8b5cf6",    // Violet
    renkAcik: "#ede9fe",
    ikon: "🕌",
    soruSayisi: "2-3"
  },
  "Osmanlı Siyasi Tarihi": {
    renk: "#ef4444",    // Red
    renkAcik: "#fee2e2",
    ikon: "⚔️",
    soruSayisi: "4-5"
  },
  "Osmanlı Kültür ve Uygarlığı": {
    renk: "#ec4899",    // Pink
    renkAcik: "#fce7f3",
    ikon: "🏰",
    soruSayisi: "3-4"
  },
  "İnkılap Tarihi": {
    renk: "#3b82f6",    // Blue
    renkAcik: "#dbeafe",
    ikon: "🇹🇷",
    soruSayisi: "8-9"
  },
  "Atatürk İlke ve İnkılapları": {
    renk: "#10b981",    // Emerald
    renkAcik: "#d1fae5",
    ikon: "⭐",
    soruSayisi: "4-6"
  },
  "Çağdaş Türk ve Dünya Tarihi": {
    renk: "#06b6d4",    // Cyan
    renkAcik: "#cffafe",
    ikon: "🌍",
    soruSayisi: "2-3"
  },
  "Sınavda Çıkabilir! ⭐": {
    renk: "#f97316",    // Orange
    renkAcik: "#ffedd5",
    ikon: "🔥",
    soruSayisi: "Yoğun"
  }
};

export default tarihKartlari;
