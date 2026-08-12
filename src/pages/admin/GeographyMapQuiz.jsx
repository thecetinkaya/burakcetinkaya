import React, { useState, useEffect, useRef } from "react";
import { 
  FaPlay, FaTrophy, FaHourglassHalf, FaBullseye, FaMapMarkedAlt, 
  FaWater, FaLeaf, FaHeart, FaCheck, FaTimes, 
  FaRoute, FaQuestionCircle, FaCompass, FaSnowflake, FaLandmark, FaLayerGroup, FaChevronRight, FaChevronLeft, FaUndo, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { GiVolcano, GiMountains, GiMountaintop, GiWaterDrop, GiDam, GiHills } from "react-icons/gi";
import { MapContainer, Marker, useMap, GeoJSON, Tooltip, Polyline } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import turkeyGeoJson from "../../data/tr-cities.json";
import vanLakeGeoJson from "../../data/van.json";
import tuzLakeGeoJson from "../../data/tuz.json";
import 'leaflet/dist/leaflet.css';

// ─── GEOGRAPHIC DATA (ACCURATE LAT/LNG) ──────────────────────────────────────
const QUIZ_ITEMS = {
  kirikDaglar: [
    { id: "kaz", name: "Kaz Dağı", lat: 39.712, lng: 26.837, desc: "Çanakkale-Balıkesir sınırında Biga Yarımadası'ndaki önemli horst dağı (1774 m)." },
    { id: "madra", name: "Madra Dağı", lat: 39.383, lng: 27.241, desc: "Edremit Körfezi'nin güney gerisinde, Balıkesir-İzmir sınırında yükselen kırık dağ." },
    { id: "yunt", name: "Yunt Dağı", lat: 38.869, lng: 27.702, desc: "Bakırçay ile Gediz grabenleri arasında, Manisa batısında uzanan kırıklı dağ." },
    { id: "bozdaglar", name: "Bozdağlar", lat: 38.351, lng: 28.082, desc: "Gediz ve Küçük Menderes vadileri arasında, İzmir doğusunda yükselen kırık dağ." },
    { id: "aydin", name: "Aydın Dağları", lat: 38.016, lng: 27.913, desc: "Küçük Menderes ile Büyük Menderes grabenleri arasında uzanan horst dağ." },
    { id: "mentese", name: "Menteşe Dağları", lat: 37.240, lng: 28.326, desc: "Muğla yöresinde kıyıya paralel uzanan kırıklı dağlık kütle." },
    { id: "amanos", name: "Amanos (Nur) Dağları", lat: 36.852, lng: 36.310, desc: "Hatay'da İskenderun Körfezi'nin doğusunda uzanan horst yapılı dağlar." }
  ],
  volkanikDaglar: [
    { id: "agri", name: "Ağrı Dağı", lat: 39.702, lng: 44.299, desc: "Türkiye'nin en yüksek noktası (5137 m). Iğdır-Ağrı sınırında sönmüş stratovolkan." },
    { id: "erciyes", name: "Erciyes Dağı", lat: 38.531, lng: 35.447, desc: "Kayseri'nin güneybatısında, İç Anadolu'nun en yüksek volkanı (3916 m)." },
    { id: "nemrut", name: "Nemrut Dağı (Volkan)", lat: 38.618, lng: 42.238, desc: "Bitlis'te, devasa kalderası ve krater gölü olan sönmüş volkan." },
    { id: "suphan", name: "Süphan Dağı", lat: 38.931, lng: 42.825, desc: "Van Gölü'nün kuzeyinde yer alan Türkiye'nin 3. yüksek zirvesi." },
    { id: "tendurek", name: "Tendürek Dağı", lat: 39.362, lng: 43.864, desc: "Ağrı ile Van illeri arasında yer alan kalkan şekilli volkanik dağ." },
    { id: "karadag", name: "Karadağ", lat: 37.404, lng: 33.153, desc: "Karaman'ın kuzeyinde yer alan volkanik koni." },
    { id: "karacadag", name: "Karacadag", lat: 37.755, lng: 39.827, desc: "Diyarbakır-Şanlıurfa sınırında kalkan tipi bazaltik volkanik dağ." },
    { id: "kula", name: "Kula Tepeleri", lat: 38.544, lng: 28.647, desc: "Manisa'da, Türkiye'nin en genç volkanik arazisi (Jeopark)." }
  ],
  kivrimDaglar: [
    { id: "kackar", name: "Kaçkar Dağı", lat: 40.835, lng: 41.161, desc: "Doğu Karadeniz dağlarının en yüksek zirvesi (3937 m)." },
    { id: "palandoken", name: "Palandöken Dağı", lat: 39.816, lng: 41.282, desc: "Erzurum'da yer alan, kış turizmi ile ünlü kıvrım dağı." },
    { id: "yildiz", name: "Yıldız Dağları", lat: 41.792, lng: 27.464, desc: "Trakya'da (Kırklareli) yer alan masif çekirdekli kıvrım dağları." },
    { id: "aladaglar", name: "Aladağlar", lat: 37.822, lng: 35.151, desc: "Orta Toroslar'da Niğde-Kayseri-Adana sınırındaki en yüksek kıvrım grubu." },
    { id: "bolkar", name: "Bolkar Dağları", lat: 37.382, lng: 34.593, desc: "Orta Toroslar'da buzul gölleri barındıran kıvrım dağ sırası." },
    { id: "ilgaz", name: "Ilgaz Dağları", lat: 41.077, lng: 33.738, desc: "Kastamonu-Çankırı sınırında, Batı Karadeniz'in önemli dağ sırası." },
    { id: "kure", name: "Küre Dağları", lat: 41.670, lng: 33.450, desc: "Kastamonu-Sinop arası kıyıya paralel uzanan karstik dağlar." },
    { id: "canik", name: "Canik Dağları", lat: 40.916, lng: 36.568, desc: "Samsun'da yükseltisi az olan Orta Karadeniz kıvrım dağları." },
    { id: "dogukaradeniz", name: "Doğu Karadeniz Dağları", lat: 40.710, lng: 40.547, desc: "Rize-Trabzon kıyısı gerisinde denize dik ve yağışlı dağlar." },
    { id: "giresun", name: "Giresun Dağları", lat: 40.536, lng: 38.583, desc: "Giresun güneyinde uzanan Karadeniz kıvrım sistemi dağı." }
  ],
  akarsular: [
    { id: "kizilirmak", name: "Kızılırmak", lat: 41.745, lng: 35.961, desc: "Sivas'tan doğup Bafra ovasını oluşturarak denize dökülen en uzun nehir." },
    { id: "yesilirmak", name: "Yeşilırmak", lat: 41.385, lng: 36.657, desc: "Çarşamba Ovası'nı oluşturarak Karadeniz'e dökülen nehir." },
    { id: "firat", name: "Fırat Nehri", lat: 38.798, lng: 38.752, desc: "Türkiye'nin su potansiyeli en yüksek nehri (Keban/Karakaya/Atatürk barajları)." },
    { id: "dicle", name: "Dicle Nehri", lat: 37.915, lng: 40.231, desc: "Güneydoğu Toroslar'dan doğup Irak'a geçen bereketli nehir." },
    { id: "sakarya", name: "Sakarya Nehri", lat: 41.121, lng: 30.648, desc: "İç Anadolu'dan doğup Karasu'dan Karadeniz'e dökülen uzun nehir." },
    { id: "seyhan", name: "Seyhan Nehri", lat: 36.721, lng: 34.898, desc: "Çukurova'yı besleyen iki büyük nehirden biri." },
    { id: "ceyhan", name: "Ceyhan Nehri", lat: 36.577, lng: 35.568, desc: "Çukurova'nın doğusundan Akdeniz'e dökülen akarsu." },
    { id: "gediz_nehri", name: "Gediz Nehri", lat: 38.577, lng: 26.903, desc: "Ege'ye dökülen, İzmir Çamaltı Tuzlası'na yakın deltası olan nehir." },
    { id: "b_menderes_nehri", name: "Büyük Menderes", lat: 37.545, lng: 27.189, desc: "Ege'de menderesler (kıvrımlar) çizerek Balat yakınlarında denize dökülen nehir." },
    { id: "k_menderes_nehri", name: "Küçük Menderes", lat: 37.954, lng: 27.272, desc: "Tarihi Efes antik kentinin limanını dolduran nehir." },
    { id: "meric", name: "Meriç Nehri", lat: 40.730, lng: 26.046, desc: "Bulgaristan'dan doğup Türkiye-Yunanistan sınırını çizen nehir." }
  ],
  ovalar: [
    { id: "cukurova", name: "Çukurova", lat: 36.883, lng: 35.405, desc: "Seyhan ve Ceyhan nehirlerinin oluşturduğu en büyük delta ovamız." },
    { id: "konya", name: "Konya Ovası", lat: 37.766, lng: 32.748, desc: "İç Anadolu'da yer alan en büyük tektonik/karstik iç ova." },
    { id: "bafra", name: "Bafra Ovası", lat: 41.611, lng: 35.961, desc: "Kızılırmak'ın oluşturduğu Karadeniz delta ovası." },
    { id: "carsamba", name: "Çarşamba Ovası", lat: 41.240, lng: 36.711, desc: "Yeşilırmak'ın taşıdığı alüvyonlarla oluşan delta." },
    { id: "igdir", name: "Iğdır Ovası", lat: 39.954, lng: 44.053, desc: "Doğu Anadolu'da alçakta yer alan mikroklimalı ova (Pamuk yetişir)." },
    { id: "harran", name: "Harran Ovası", lat: 36.877, lng: 39.030, desc: "Şanlıurfa'da GAP sulamasıyla çok verimli hale gelen ova." },
    { id: "gediz_ova", name: "Gediz Ovası", lat: 38.566, lng: 27.877, desc: "Gediz grabeni üzerindeki verimli çöküntü ovası." },
    { id: "menderes_ova", name: "B. Menderes Ovası", lat: 37.842, lng: 27.973, desc: "Büyük Menderes tektonik çöküntüsünde yer alan incir deposu ova." },
    { id: "erzincan", name: "Erzincan Ovası", lat: 39.733, lng: 39.516, desc: "Kuzey Anadolu Fay Hattı üzerindeki önemli çöküntü ovası." },
    { id: "mus", name: "Muş Ovası", lat: 38.805, lng: 41.528, desc: "Murat Nehri kıyısında yer alan, kışların sert geçtiği doğu ovası." }
  ],
  platolar: [
    { id: "catalca_kocaeli", name: "Çatalca-Kocaeli Platosu", lat: 41.150, lng: 29.400, desc: "Marmara'da aşınım platosu. Sanayi, nüfus ve ulaşımın en geliştiği plato." },
    { id: "persembe", name: "Perşembe Platosu", lat: 40.750, lng: 37.350, desc: "Ordu Aybastı'da yer alan menderesleriyle ünlü Karadeniz aşınım platosu." },
    { id: "haymana", name: "Haymana Platosu", lat: 39.430, lng: 32.500, desc: "Ankara güneyinde yatay duruşlu (tabaka düzlüğü) büyük tahıl platosu." },
    { id: "cihanbeyli", name: "Cihanbeyli Platosu", lat: 38.650, lng: 32.900, desc: "Konya kuzeyinde yer alan Türkiye'nin en büyük tahıl ambarı platolarından biri." },
    { id: "obruk", name: "Obruk Platosu", lat: 38.100, lng: 33.500, desc: "Tuz Gölü güneyinde kararsız karstik obrukların yoğun olduğu plato." },
    { id: "bozok", name: "Bozok Platosu", lat: 39.800, lng: 35.300, desc: "Yozgat çevresinde yer alan İç Anadolu'nun geniş tabaka düzlüğü platosu." },
    { id: "uzunyayla", name: "Uzunyayla Platosu", lat: 39.200, lng: 36.600, desc: "Sivas-Kayseri sınırında yüksek tabaka düzlüğü platosu (Büyükbaş hayvancılık)." },
    { id: "yazilikaya", name: "Yazılıkaya (Bayat) Platosu", lat: 39.050, lng: 30.700, desc: "Eskişehir-Afyon arasında Ege ile İç Anadolu sınırında yer alan plato." },
    { id: "teke", name: "Teke Platosu", lat: 36.700, lng: 29.800, desc: "Antalya-Muğla arasında kalkerli karstik yapılı, nüfusu seyrek plato (Kıl keçisi)." },
    { id: "taseli", name: "Taşeli Platosu", lat: 36.400, lng: 32.800, desc: "Mersin-Karaman arasında yüksek karstik plato, ulaşımı zor ve nüfusu seyrek." },
    { id: "erzurum_kars", name: "Erzurum-Kars Platosu", lat: 40.500, lng: 42.500, desc: "Türkiye'nin en yüksek volkanik lav platosu (Çernozyom topraklar, yaz yağışları)." },
    { id: "ardahan", name: "Ardahan Platosu", lat: 41.100, lng: 42.700, desc: "Doğu Anadolu'da yer alan volkanik oluşumlu lav platosu." },
    { id: "gaziantep", name: "Gaziantep Platosu", lat: 37.060, lng: 37.380, desc: "Güneydoğu Anadolu'da antepfıstığı ve zeytin tarımının yapıldığı plato." },
    { id: "sanliurfa", name: "Şanlıurfa Platosu", lat: 37.160, lng: 38.790, desc: "GAP ile sulanan düz yapılı Güneydoğu platolarından biri." },
    { id: "adiyaman", name: "Adıyaman Platosu", lat: 37.760, lng: 38.270, desc: "Fırat Nehri çevresinde yer alan tabaka düzlüğü platosu." }
  ],
  goller_heyelan: [
    { id: "tortum", name: "Tortum Gölü", lat: 40.640, lng: 41.650, desc: "Erzurum'da Tortum Çayı önünün heyelanla kapanmasıyla oluşan heyelan set gölü." },
    { id: "sera", name: "Sera Gölü", lat: 40.970, lng: 39.630, desc: "Trabzon Akçaabat'ta vadi heyelanı sonucu oluşan heyelan set gölü." },
    { id: "abant", name: "Abant Gölü", lat: 40.600, lng: 31.280, desc: "Bolu'da dağ kayması sonucu vadinin tıkanmasıyla oluşan turistik heyelan set gölü." },
    { id: "yedigoller", name: "Yedigöller", lat: 40.940, lng: 31.750, desc: "Bolu kuzeyinde heyelan setlerinin oluşturduğu seri göller." },
    { id: "zinav", name: "Zinav Gölü", lat: 40.450, lng: 37.280, desc: "Tokat Reşadiye'de yer alan tatlı su heyelan set gölü." },
    { id: "boraboy", name: "Boraboy Gölü", lat: 40.820, lng: 36.150, desc: "Amasya Taşova'da heyelan kütlesinin deriyi kapatmasıyla oluşan krater görünümlü set gölü." },
    { id: "suluklu", name: "Sülüklü Göl", lat: 40.520, lng: 30.880, desc: "Bolu Mudurnu'da heyelan sonucu oluşan koruma altındaki göl." }
  ],
  goller_kiyi: [
    { id: "bcekmece", name: "Büyükçekmece Gölü", lat: 41.050, lng: 28.570, desc: "İstanbul Marmara kıyısında koy önünün kapatılmasıyla oluşan kıyı set (lagün) gölü." },
    { id: "kcekmece", name: "Küçükçekmece Gölü", lat: 41.000, lng: 28.770, desc: "İstanbul Marmara kıyısında deniz kulağı (lagün) tipi kıyı set gölü." },
    { id: "terkos", name: "Terkos (Durusu) Gölü", lat: 41.320, lng: 28.620, desc: "İstanbul Karadeniz kıyısında içme suyu kaynağı olan kıyı set gölü." },
    { id: "akyatan", name: "Akyatan Lagünü", lat: 36.620, lng: 35.250, desc: "Adana Karataş'ta Çukurova delta kıyısında yer alan ramsar kıyı set gölü." },
    { id: "dalyan_paradeniz", name: "Dalyan / Paradeniz Lagünü", lat: 36.290, lng: 33.970, desc: "Mersin Silifke Göksu deltasında yer alan kıyı set (lagün) gölü." }
  ],
  goller_yapay: [
    { id: "ataturk_baraj", name: "Atatürk Baraj Gölü", lat: 37.480, lng: 38.310, desc: "Fırat Nehri üzerinde Türkiye'nin en büyük yapay baraj gölü." },
    { id: "keban_baraj", name: "Keban Baraj Gölü", lat: 38.800, lng: 38.900, desc: "Elazığ'da Fırat Nehri üzerinde Türkiye'nin 2. büyük baraj gölü." },
    { id: "karakaya_baraj", name: "Karakaya Baraj Gölü", lat: 38.480, lng: 38.350, desc: "Fırat Nehri üzerinde kurulan dev yapay baraj gölü." },
    { id: "hirfanli_baraj", name: "Hirfanlı Baraj Gölü", lat: 39.260, lng: 33.520, desc: "Kırşehir'de Kızılırmak üzerinde oluşturulan İç Anadolu'nun büyük baraj gölü." },
    { id: "altinkaya_baraj", name: "Altınkaya Baraj Gölü", lat: 41.350, lng: 35.800, desc: "Samsun'da Kızılırmak üzerinde hidroelektrik üretimi yapan baraj gölü." },
    { id: "deriner_baraj", name: "Deriner Baraj Gölü", lat: 41.150, lng: 41.830, desc: "Artvin Çoruh Nehri üzerinde derin vadide yer alan yüksek baraj gölü." },
    { id: "ilisu_baraj", name: "Ilısu (Veysel Eroğlu) Barajı", lat: 37.530, lng: 41.840, desc: "Mardin/Batman sınırında Dicle Nehri üzerinde kurulan dev baraj gölü." }
  ],
  goller_aluvyon: [
    { id: "bafa", name: "Bafa (Çamiçi) Gölü", lat: 37.500, lng: 27.420, desc: "Büyük Menderes'in taşıdığı alüvyonların Ege deniz körfezini kapatmasıyla oluşan göl." },
    { id: "koycegiz", name: "Köyceğiz Gölü", lat: 36.930, lng: 28.630, desc: "Muğla'da alüvyon seti sonucu denizle bağlantısı kesilen lagünleşmiş göl." },
    { id: "mogan", name: "Mogan Gölü", lat: 39.770, lng: 32.790, desc: "Ankara Gölbaşı'nda derelerin getirdiği alüvyon setiyle oluşan göl." },
    { id: "eymir", name: "Eymir Gölü", lat: 39.820, lng: 32.830, desc: "Ankara'da Mogan Gölünün devamı niteliğindeki alüvyon set gölü." },
    { id: "marmara_gol", name: "Marmara Gölü", lat: 38.610, lng: 28.010, desc: "Manisa Salihli'de Gediz vadisi alüvyon seti gölü." }
  ],
  goller_volkanikset: [
    { id: "van_golu", name: "Van Gölü", lat: 38.630, lng: 42.900, desc: "Nemrut volkanından çıkan lavların setiyle oluşan Türkiye'nin en büyük gölü (Sodalı su)." },
    { id: "ercek", name: "Erçek Gölü", lat: 38.660, lng: 43.580, desc: "Van doğusunda yer alan kuş cenneti volkanik set gölü." },
    { id: "nazik", name: "Nazik Gölü", lat: 38.840, lng: 42.320, desc: "Bitlis Ahlat'ta volkanik lav setleşmesiyle oluşan tatlı su gölü." },
    { id: "hacli", name: "Haçlı (Bulanık) Gölü", lat: 39.020, lng: 42.310, desc: "Muş Bulanık'ta yer alan volkanik lav seti gölü." },
    { id: "balik_golu", name: "Balık Gölü", lat: 39.770, lng: 43.560, desc: "Ağrı Taşlıçay'da yüksek irtifada yer alan volkanik set gölü." },
    { id: "cildir", name: "Çıldır Gölü", lat: 41.050, lng: 43.250, desc: "Ardahan-Kars sınırında kışın donan volkanik lav seti gölü (Eski atlı kızaklar)." }
  ],
  goller_buzul: [
    { id: "kilimli", name: "Kilimli Göl", lat: 40.070, lng: 29.220, desc: "Bursa Uludağ zirvesinde yer alan buzul (sirk) gölü." },
    { id: "aynali", name: "Aynalı Göl", lat: 40.080, lng: 29.230, desc: "Bursa Uludağ'da buzul aşındırması sonucu oluşan sirk gölü." },
    { id: "karagol_kackar", name: "Karagöl (Kaçkar)", lat: 40.850, lng: 41.180, desc: "Rize Kaçkar Dağları yüksek zirvelerindeki sirk gölü." },
    { id: "buzul_cilo", name: "Buzul Gölü (Cilo)", lat: 37.520, lng: 44.050, desc: "Hakkari Cilo (Reşko) dağlarında yer alan buzul çanağı gölü." },
    { id: "karagol_bolkar", name: "Karagöl (Bolkar)", lat: 37.400, lng: 34.620, desc: "Niğde Bolkar Dağları zirvesindeki karstik-buzul sirk gölü." }
  ],
  goller_karstik: [
    { id: "salda", name: "Salda Gölü", lat: 37.550, lng: 29.680, desc: "Burdur'da Türkiye'nin en derin ve duru karstik (magnezyumlu) gölü (Türkiye'nin Maldivleri)." },
    { id: "avlan", name: "Avlan Gölü", lat: 36.560, lng: 29.930, desc: "Antalya Elmalı polyesinde yer alan karstik erime gölü." },
    { id: "elmali", name: "Elmalı (Karataş) Gölü", lat: 36.600, lng: 29.850, desc: "Antalya'da polye çanağında oluşmuş karstik göl." },
    { id: "sugla", name: "Suğla (Sufla) Gölü", lat: 37.330, lng: 32.030, desc: "Konya Seydişehir'de kalkerli arazi erimesiyle oluşan karstik göl." },
    { id: "yarisli", name: "Yarışlı Gölü", lat: 37.560, lng: 29.960, desc: "Burdur'da acı sulu karstik çanak gölü." },
    { id: "kestel", name: "Kestel Gölü", lat: 37.450, lng: 30.400, desc: "Burdur Kestel polyesi üzerinde yer alan karstik göl." }
  ],
  goller_volkanik: [
    { id: "meke", name: "Meke Gölü", lat: 37.685, lng: 33.637, desc: "Konya Karapınar'da gaz patlaması sonucu oluşan nazar boncuğu görünümlü maar gölü." },
    { id: "nemrut_kaldera", name: "Nemrut Kalderası", lat: 38.625, lng: 42.235, desc: "Bitlis Nemrut volkanının patlama kalderasında yer alan dev krater gölü." },
    { id: "golcuk_isparta", name: "Gölcük Krater Gölü", lat: 37.730, lng: 30.490, desc: "Isparta'da sönmüş volkan ağzında yer alan krater gölü." },
    { id: "acigol_nevsehir", name: "Acıgöl", lat: 38.560, lng: 34.520, desc: "Nevşehir-Konya arasında yer alan volkanik patlama çukuru (maar) gölü." }
  ],
  goller_tektonik: [
    { id: "tuz_golu", name: "Tuz Gölü", lat: 38.750, lng: 33.350, desc: "İç Anadolu fay çöküntüsünde yer alan Türkiye'nin 2. büyük ve en sığ tuzlu tektonik gölü." },
    { id: "beysehir", name: "Beyşehir Gölü", lat: 37.750, lng: 31.500, desc: "Konya-Isparta sınırında Türkiye'nin en büyük tatlı su tektonik gölü." },
    { id: "egirdir", name: "Eğirdir Gölü", lat: 38.050, lng: 30.850, desc: "Isparta'da yer alan tatlı sulu tektonik göl (Kovada kanal bağlantılı)." },
    { id: "iznik", name: "İznik Gölü", lat: 40.430, lng: 29.520, desc: "Bursa'da Güney Marmara fay hattında yer alan tatlı su tektonik gölü." },
    { id: "ulubat", name: "Ulubat Gölü", lat: 40.170, lng: 28.600, desc: "Bursa'da Ramsar alanı olan sığ tektonik göl." },
    { id: "sapanca", name: "Sapanca Gölü", lat: 40.700, lng: 30.260, desc: "Sakarya'da Kuzey Anadolu Fay Hattı üzerindeki tektonik göl." },
    { id: "manyas", name: "Manyas (Kuş) Gölü", lat: 40.180, lng: 27.960, desc: "Balıkesir Bandırma'da Kuş Cenneti olan tektonik göl." },
    { id: "burdur_gol", name: "Burdur Gölü", lat: 37.750, lng: 30.180, desc: "Göller Yöresi'nde tuzlu-alkali tektonik göl." },
    { id: "hazar", name: "Hazar Gölü", lat: 38.480, lng: 39.400, desc: "Elazığ'da Doğu Anadolu Fay Hattı üzerindeki tektonik rift gölü (Batık Şehir)." },
    { id: "aksehir", name: "Akşehir Gölü", lat: 38.600, lng: 31.420, desc: "Konya Akşehir'de fay çöküntüsünde oluşan tektonik göl." }
  ]
};

// ─── 20 INTERACTIVE ÖSYM ROUTE & MAP QUESTIONS ──────────────────────────────
const OSYM_QUESTIONS = [
  {
    id: 1,
    title: "Ege Körfezleri Sıralama Rotası",
    scenario: "Çanakkale Bozcaada'dan denize açılan bir gezi teknesi, Ege kıyı hattı boyunca güneye doğru seyrederek Muğla Akyaka'ya (Gökova Körfezi) ulaşmıştır. Bu tekne rota boyunca kuzeyden güneye sırasıyla aşağıdaki körfezlerin hangilerinden geçmiştir?",
    route: [
      [39.83, 26.06], // Bozcaada
      [39.50, 26.70], // Edremit
      [38.90, 26.90], // Çandarlı
      [38.45, 26.75], // İzmir
      [37.85, 27.20], // Kuşadası
      [37.25, 27.50], // Güllük
      [37.05, 28.32]  // Akyaka
    ],
    waypoints: [
      { lat: 39.83, lng: 26.06, label: "Başlangıç: Bozcaada" },
      { lat: 39.50, lng: 26.70, label: "Edremit Körfezi" },
      { lat: 38.90, lng: 26.90, label: "Çandarlı Körfezi" },
      { lat: 38.45, lng: 26.75, label: "İzmir Körfezi" },
      { lat: 37.85, lng: 27.20, label: "Kuşadası Körfezi" },
      { lat: 37.25, lng: 27.50, label: "Güllük Körfezi" },
      { lat: 37.05, lng: 28.32, label: "Varış: Akyaka (Gökova)" }
    ],
    options: [
      { id: "a", text: "Edremit -> Çandarlı -> İzmir -> Kuşadası -> Güllük -> Gökova" },
      { id: "b", text: "Saros -> Edremit -> Kuşadası -> İzmir -> Bandırma -> Gökova" },
      { id: "c", text: "Bandırma -> Çandarlı -> Güllük -> Gemlik -> Fethiye -> Gökova" },
      { id: "d", text: "Edremit -> İzmir -> Saros -> Kuşadası -> Antalya -> Gökova" }
    ],
    correctAnswer: "a",
    explanation: "Ege kıyılarımızda kuzeyden güneye körfezlerin sıralaması: Edremit -> Çandarlı -> İzmir -> Kuşadası -> Güllük (Mendelyat) -> Gökova Körfezi'dir. ÖSYM akılda tutma kodlaması: Edremit - Çandarlı - İzmir - Kuşadası - Güllük - Gökova (E-Ç-İ-K-G-G)."
  },
  {
    id: 2,
    title: "Ege Akarsuları & Deltalar Rotası",
    scenario: "İzmir Limanı'ndan kalkan bir gözlem gemisi, Ege kıyılarını takip ederek kuzeye Çanakkale Boğazı'na doğru ilerliyor. Bu gemi sırasıyla denize dökülen hangi akarsuların delta ağızlarının önünden geçer?",
    route: [
      [38.42, 27.14], // İzmir
      [38.57, 26.90], // Gediz
      [38.92, 26.92], // Bakırçay
      [40.15, 26.40]  // Çanakkale
    ],
    waypoints: [
      { lat: 38.42, lng: 27.14, label: "Başlangıç: İzmir Limanı" },
      { lat: 38.57, lng: 26.90, label: "Gediz Deltası (Menemen)" },
      { lat: 38.92, lng: 26.92, label: "Bakırçay Deltası (Dikili)" },
      { lat: 40.15, lng: 26.40, label: "Varış: Çanakkale" }
    ],
    options: [
      { id: "a", text: "Gediz Nehri ve Bakırçay Nehri" },
      { id: "b", text: "Büyük Menderes ve Küçük Menderes" },
      { id: "c", text: "Sakarya Nehri ve Yeşilırmak" },
      { id: "d", text: "Dalaman Çayı ve Asi Nehri" }
    ],
    correctAnswer: "a",
    explanation: "İzmir'den kuzeye Çanakkale'ye giderken ilk olarak Menemen Ovası'nı oluşturan Gediz Nehri ağzından, ardından Dikili güneyindeki Bakırçay Nehri ağzından geçilir."
  },
  {
    id: 3,
    title: "İç Anadolu Platoları Rotası",
    scenario: "Ankara Haymana'dan yola çıkan bir arazi aracı, güneydoğu yönünde düz bir hatta ilerleyerek Konya ve Şanlıurfa üzerinden Güneydoğu Anadolu'ya ulaşıyor. Bu araç sırasıyla hangi platolardan geçer?",
    route: [
      [39.43, 32.50], // Haymana
      [38.65, 32.90], // Cihanbeyli
      [38.10, 33.50], // Obruk
      [37.06, 37.38], // Gaziantep
      [37.16, 38.79]  // Şanlıurfa
    ],
    waypoints: [
      { lat: 39.43, lng: 32.50, label: "Başlangıç: Haymana Platosu" },
      { lat: 38.65, lng: 32.90, label: "Cihanbeyli Platosu" },
      { lat: 38.10, lng: 33.50, label: "Obruk Platosu" },
      { lat: 37.06, lng: 37.38, label: "Gaziantep Platosu" },
      { lat: 37.16, lng: 38.79, label: "Varış: Şanlıurfa Platosu" }
    ],
    options: [
      { id: "a", text: "Haymana -> Cihanbeyli -> Obruk -> Gaziantep -> Şanlıurfa" },
      { id: "b", text: "Çatalca -> Bozok -> Teke -> Erzurum-Kars" },
      { id: "c", text: "Perşembe -> Taşeli -> Uzunyayla -> Yazılıkaya" },
      { id: "d", text: "Ardahan -> Cihanbeyli -> Kocaeli -> Taşeli" }
    ],
    correctAnswer: "a",
    explanation: "Ankara'dan güneydoğuya inerken önce Haymana Platosu, ardından Konya kuzeyindeki Cihanbeyli Platosu ve Obruk Platosu, devamında Gaziantep ve Şanlıurfa Platoları geçilir."
  },
  {
    id: 4,
    title: "Ege Kırık Dağları (Horst) Güzergahı",
    scenario: "İzmir'den Manisa ve Aydın yönüne seyahat eden bir coğrafyacı, Küçük Menderes ile Büyük Menderes grabenleri arasında yükselen kıvrılma değil kırılma (horst) sonucu oluşmuş dağ kütlesini inceliyor. Bu dağ hangisidir?",
    route: [
      [38.42, 27.14],
      [38.01, 27.91],
      [37.84, 27.84]
    ],
    waypoints: [
      { lat: 38.42, lng: 27.14, label: "İzmir" },
      { lat: 38.01, lng: 27.91, label: "Aydın Dağları (Horst)" },
      { lat: 37.84, lng: 27.84, label: "Aydın" }
    ],
    options: [
      { id: "a", text: "Aydın Dağları" },
      { id: "b", text: "Kaçkar Dağları" },
      { id: "c", text: "Küre Dağları" },
      { id: "d", text: "Erciyes Dağı" }
    ],
    correctAnswer: "a",
    explanation: "Ege Bölgesi'ndeki kırık dağlar (Horstlar): Kaz, Madra, Yunt, Bozdağlar, Aydın Dağları ve Menteşe Dağları'dır. Küçük ve Büyük Menderes vadileri arasında Aydın Dağları yükselir."
  },
  {
    id: 5,
    title: "Göller Yöresi Karstik Göller Rotası",
    scenario: "Antalya'dan hareket eden bir tur otobüsü, Burdur ve Isparta illerinin bulunduğu Göller Yöresi'ne giriyor. Yolculuk esnasında Türkiye'nin en derin ve en temiz karstik gölü olan Salda Gölü'ne ulaşılıyor. Bu yöredeki göllerin temel oluşum nedeni nedir?",
    route: [
      [36.88, 30.70],
      [36.56, 29.93],
      [37.55, 29.68],
      [37.72, 30.28]
    ],
    waypoints: [
      { lat: 36.88, lng: 30.70, label: "Antalya" },
      { lat: 36.56, lng: 29.93, label: "Avlan Gölü" },
      { lat: 37.55, lng: 29.68, label: "Salda Gölü" },
      { lat: 37.72, lng: 30.28, label: "Burdur" }
    ],
    options: [
      { id: "a", text: "Karstik çözünme (Kalker / Kireçtaşı erimesi)" },
      { id: "b", text: "Volkanik patlama ve lav tıkaması" },
      { id: "c", text: "Buzul aşındırması ve sirk dolumu" },
      { id: "d", text: "Akarsu alüvyon seti" }
    ],
    correctAnswer: "a",
    explanation: "Göller Yöresi'nde yer alan Salda, Avlan, Kestel, Suğla ve Yarışlı gölleri kalkerli (kireçtaşlı) arazilerin erimesiyle oluşan Karstik Göller'dir."
  },
  {
    id: 6,
    title: "Karadeniz Delta Ovaları Rotası",
    scenario: "Sinop Limanı'ndan hareket eden bir kuru yük gemisi, denizden doğuya doğru ilerleyerek Samsun kıyılarından geçiyor. Gemi sırasıyla Kızılırmak ve Yeşilırmak'ın oluşturduğu hangi büyük delta ovalarının önünden geçer?",
    route: [
      [42.02, 35.15],
      [41.61, 35.96],
      [41.24, 36.71],
      [41.00, 39.72]
    ],
    waypoints: [
      { lat: 42.02, lng: 35.15, label: "Sinop Limanı" },
      { lat: 41.61, lng: 35.96, label: "Bafra Ovası (Kızılırmak)" },
      { lat: 41.24, lng: 36.71, label: "Çarşamba Ovası (Yeşilırmak)" },
      { lat: 41.00, lng: 39.72, label: "Trabzon" }
    ],
    options: [
      { id: "a", text: "Bafra Ovası ve Çarşamba Ovası" },
      { id: "b", text: "Çukurova ve Silifke Ovası" },
      { id: "c", text: "Menemen Ovası ve Dikili Ovası" },
      { id: "d", text: "Harran Ovası ve Amik Ovası" }
    ],
    correctAnswer: "a",
    explanation: "Kızılırmak nehri Samsun'da Bafra Delta Ovası'nı, Yeşilırmak nehri ise Çarşamba Delta Ovası'nı oluşturur."
  },
  {
    id: 7,
    title: "Doğu Anadolu Volkanik Dağlar Çizgisi",
    scenario: "Bitlis Nemrut Dağı'ndan başlayıp Ağrı Dağı'na doğru fay hattı boyunca uzanan doğrultuda sıralanan sönmüş volkanlarımızın güneybatıdan kuzeydoğuya doğru sırası nasıldır?",
    route: [
      [38.61, 42.23],
      [38.93, 42.82],
      [39.36, 43.86],
      [39.70, 44.29]
    ],
    waypoints: [
      { lat: 38.61, lng: 42.23, label: "1. Nemrut Dağı" },
      { lat: 38.93, lng: 42.82, label: "2. Süphan Dağı" },
      { lat: 39.36, lng: 43.86, label: "3. Tendürek Dağı" },
      { lat: 39.70, lng: 44.29, label: "4. Ağrı Dağı" }
    ],
    options: [
      { id: "a", text: "Nemrut -> Süphan -> Tendürek -> Ağrı" },
      { id: "b", text: "Erciyes -> Melendiz -> Hasan -> Karadağ" },
      { id: "c", text: "Kula -> Spil -> Madra -> Kaz" },
      { id: "d", text: "Ilgaz -> Köroğlu -> Küre -> Kaçkar" }
    ],
    correctAnswer: "a",
    explanation: "Doğu Anadolu'daki sönmüş volkanlar bir fay hattı boyunca sıralanmıştır: Nemrut -> Süphan -> Tendürek -> Ağrı (Akılda kalıcı kodlama: NeST-A)."
  },
  {
    id: 8,
    title: "Güney Marmara Fay Hattı Tektonik Gölleri",
    scenario: "Çanakkale Gelibolu'dan yola çıkıp Bursa ve Sakarya üzerinden doğuya ilerleyen bir hat üzerinde Güney Marmara tektonik çöküntü alanlarında yer alan göller sıralanmıştır. Aşağıdaki göllerden hangisi bu hat üzerindeki tektonik göllerden biri DEĞİLDİR?",
    route: [
      [40.18, 27.96],
      [40.17, 28.60],
      [40.43, 29.52],
      [40.70, 30.26]
    ],
    waypoints: [
      { lat: 40.18, lng: 27.96, label: "Manyas (Kuş) Gölü" },
      { lat: 40.17, lng: 28.60, label: "Ulubat Gölü" },
      { lat: 40.43, lng: 29.52, label: "İznik Gölü" },
      { lat: 40.70, lng: 30.26, label: "Sapanca Gölü" }
    ],
    options: [
      { id: "a", text: "Abant Gölü (Heyelan Set Gölü)" },
      { id: "b", text: "Manyas (Kuş) Gölü" },
      { id: "c", text: "Ulubat Gölü" },
      { id: "d", text: "İznik Gölü" }
    ],
    correctAnswer: "a",
    explanation: "Manyas, Ulubat, İznik ve Sapanca gölleri Güney Marmara fay hattı üzerindeki Tektonik Göllerdir. Abant Gölü ise Bolu'da yer alan bir Heyelan Set Gölüdür."
  },
  {
    id: 9,
    title: "Karadeniz Heyelan Set Gölleri",
    scenario: "Trabzon'daki Sera Gölü'nü ziyaret eden bir doğa grubu, Batı Karadeniz'e Bolu'ya geçerek heyelan sonucu akarsu önünün kapanmasıyla oluşan diğer ünlü gölleri görmek istiyor. Bolu'da yer alan bu heyelan set gölleri hangileridir?",
    route: [
      [40.97, 39.63],
      [40.64, 41.65],
      [40.94, 31.75],
      [40.60, 31.28]
    ],
    waypoints: [
      { lat: 40.97, lng: 39.63, label: "Sera Gölü (Trabzon)" },
      { lat: 40.64, lng: 41.65, label: "Tortum Gölü (Erzurum)" },
      { lat: 40.94, lng: 31.75, label: "Yedigöller (Bolu)" },
      { lat: 40.60, lng: 31.28, label: "Abant Gölü (Bolu)" }
    ],
    options: [
      { id: "a", text: "Abant ve Yedigöller" },
      { id: "b", text: "Tuz Gölü ve Beyşehir" },
      { id: "c", text: "Büyükçekmece ve Küçükçekmece" },
      { id: "d", text: "Salda ve Avlan" }
    ],
    correctAnswer: "a",
    explanation: "Karadeniz Bölgesi'nde heyelanların yoğun görülmesi sonucu Abant, Yedigöller, Sera, Tortum, Zinav ve Boraboy heyelan set gölleri oluşmuştur."
  },
  {
    id: 10,
    title: "İstanbul Lagün (Kıyı Set) Gölleri",
    scenario: "Tekirdağ'dan İstanbul'a doğru Marmara kıyısı boyunca ilerleyen bir araç, deniz kulağı (lagün) olarak da bilinen ve dalgaların biriktirdiği kıyı kordonunun koy önünü kapatmasıyla oluşan iki büyük kıyı set gölünün yanından geçer. Bu göller hangileridir?",
    route: [
      [40.97, 27.51],
      [41.05, 28.57],
      [41.00, 28.77],
      [41.01, 28.97]
    ],
    waypoints: [
      { lat: 40.97, lng: 27.51, label: "Tekirdağ" },
      { lat: 41.05, lng: 28.57, label: "Büyükçekmece Gölü" },
      { lat: 41.00, lng: 28.77, label: "Küçükçekmece Gölü" },
      { lat: 41.01, lng: 28.97, label: "İstanbul" }
    ],
    options: [
      { id: "a", text: "Büyükçekmece ve Küçükçekmece Gölleri" },
      { id: "b", text: "İznik ve Sapanca Gölleri" },
      { id: "c", text: "Eğirdir ve Kovada Gölleri" },
      { id: "d", text: "Van ve Erçek Gölleri" }
    ],
    correctAnswer: "a",
    explanation: "Marmara kıyısındaki Büyükçekmece ve Küçükçekmece ile Karadeniz kıyısındaki Terkos (Durusu) en meşhur Kıyı Set Gölleri (Lagün)'dir."
  },
  {
    id: 11,
    title: "Karstik Platolar Nüfus Yapısı",
    scenario: "Türkiye'de sanayi ve nüfus yoğunluğunun en yüksek olduğu aşınım platosu Çatalca-Kocaeli iken; engebeli karstik yapısı nedeniyle nüfusun en seyrek olduğu Akdeniz platolarımız hangileridir?",
    route: [
      [41.15, 29.40],
      [36.70, 29.80],
      [36.40, 32.80]
    ],
    waypoints: [
      { lat: 41.15, lng: 29.40, label: "Çatalca-Kocaeli Platosu" },
      { lat: 36.70, lng: 29.80, label: "Teke Platosu" },
      { lat: 36.40, lng: 32.80, label: "Taşeli Platosu" }
    ],
    options: [
      { id: "a", text: "Teke ve Taşeli Platoları" },
      { id: "b", text: "Gaziantep ve Şanlıurfa Platoları" },
      { id: "c", text: "Haymana ve Cihanbeyli Platoları" },
      { id: "d", text: "Yazılıkaya ve Bozok Platoları" }
    ],
    correctAnswer: "a",
    explanation: "Teke ve Taşeli Platoları karstik (kalkerli) yapısı, engebeli arazi şartları ve su tutmayan toprak nedeniyle nüfusun en seyrek olduğu platolarımızdır."
  },
  {
    id: 12,
    title: "GAP Bölgesi ve Büyük Akarsular",
    scenario: "Güneydoğu Anadolu gezisinde olan bir turist kafilesi, Türkiye'nin su potansiyeli en yüksek nehri üzerinde kurulan Atatürk Baraj Gölü'nü ve ardından Doğu'ya devam ederek Ilısu Barajı'nın bulunduğu nehri ziyaret ediyor. Bu iki nehir sırasıyla hangileridir?",
    route: [
      [37.06, 37.38],
      [37.48, 38.31],
      [37.53, 41.84]
    ],
    waypoints: [
      { lat: 37.06, lng: 37.38, label: "Gaziantep" },
      { lat: 37.48, lng: 38.31, label: "Fırat Nehri (Atatürk Barajı)" },
      { lat: 37.53, lng: 41.84, label: "Dicle Nehri (Ilısu Barajı)" }
    ],
    options: [
      { id: "a", text: "Fırat Nehri ve Dicle Nehri" },
      { id: "b", text: "Kızılırmak ve Yeşilırmak" },
      { id: "c", text: "Sakarya ve Susurluk" },
      { id: "d", text: "Gediz ve Bakırçay" }
    ],
    correctAnswer: "a",
    explanation: "Güneydoğu Anadolu'yu besleyen iki büyük nehrimiz Fırat (Keban, Karakaya, Atatürk barajları) ve Dicle (Ilısu barajı)'dir."
  },
  {
    id: 13,
    title: "Volkanik Set Gölleri Havzası",
    scenario: "Van Gölü ve çevresindeki gölleri inceleyen bir coğrafya araştırmacısı, volkanik patlamalar sonucu çıkan lavların akarsu vadilerinin önünü kapatmasıyla oluşan gölleri inceliyor. Aşağıdaki göllerden hangileri Volkanik Set Gölü örneğidir?",
    route: [
      [38.63, 42.90],
      [38.66, 43.58],
      [38.84, 42.32],
      [39.02, 42.31]
    ],
    waypoints: [
      { lat: 38.63, lng: 42.90, label: "Van Gölü" },
      { lat: 38.66, lng: 43.58, label: "Erçek Gölü" },
      { lat: 38.84, lng: 42.32, label: "Nazik Gölü" },
      { lat: 39.02, lng: 42.31, label: "Haçlı Gölü" }
    ],
    options: [
      { id: "a", text: "Van Gölü ve Erçek Gölü" },
      { id: "b", text: "Beyşehir ve Eğirdir Gölleri" },
      { id: "c", text: "Manyas ve Ulubat Gölleri" },
      { id: "d", text: "Salda ve Suğla Gölleri" }
    ],
    correctAnswer: "a",
    explanation: "Nemrut ve Tendürek volkanik lavlarının setiyle Van Gölü, Erçek, Nazik, Haçlı, Balık ve Çıldır gölleri yani Volkanik Set Gölleri oluşmuştur."
  },
  {
    id: 14,
    title: "Alüvyon Set Gölleri Karakteri",
    scenario: "Ankara yakınlarında yer alan Mogan ve Eymir gölleri ile Ege Bölgesi'nde yer alan Bafa (Çamiçi) ve Köyceğiz göllerinin ortak jeolojik oluşum özelliği nedir?",
    route: [
      [39.77, 32.79],
      [38.61, 28.01],
      [37.50, 27.42],
      [36.93, 28.63]
    ],
    waypoints: [
      { lat: 39.77, lng: 32.79, label: "Mogan & Eymir (Ankara)" },
      { lat: 38.61, lng: 28.01, label: "Marmara Gölü (Manisa)" },
      { lat: 37.50, lng: 27.42, label: "Bafa Gölü (Aydın/Muğla)" },
      { lat: 36.93, lng: 28.63, label: "Köyceğiz Gölü (Muğla)" }
    ],
    options: [
      { id: "a", text: "Akarsuların taşıdığı alüvyonların vadi önünü kapatması (Alüvyon Set Gölü)" },
      { id: "b", text: "Volkanik krater dolumu" },
      { id: "c", text: "Fay hattı çöküntüsü" },
      { id: "d", text: "Kireçtaşı erimesi" }
    ],
    correctAnswer: "a",
    explanation: "Mogan, Eymir, Bafa, Köyceğiz ve Marmara Gölleri akarsuların taşıdığı malzemelerin vadileri tıkamasıyla oluşan Alüvyon Set Gölleri'dir."
  },
  {
    id: 15,
    title: "Buzul (Sirk) Gölleri Yüksek Zirveler",
    scenario: "Uludağ (Bursa), Kaçkar Dağları (Rize) ve Cilo Dağları (Hakkari) gibi yüksek dağlık kütlelerin zirveye yakın kısımlarında yer alan küçük çanak göllerinin (Kilimli Göl, Karagöl, Buzul Gölü) oluşumundaki temel dış kuvvet nedir?",
    route: [
      [40.07, 29.22],
      [37.40, 34.62],
      [40.85, 41.18],
      [37.52, 44.05]
    ],
    waypoints: [
      { lat: 40.07, lng: 29.22, label: "Uludağ (Kilimli Göl)" },
      { lat: 37.40, lng: 34.62, label: "Bolkar (Karagöl)" },
      { lat: 40.85, lng: 41.18, label: "Kaçkar (Karagöl)" },
      { lat: 37.52, lng: 44.05, label: "Cilo (Buzul Gölü)" }
    ],
    options: [
      { id: "a", text: "Buzul Aşındırması (Sirk Çanakları)" },
      { id: "b", text: "Rüzgar Biriktirmesi" },
      { id: "c", text: "Dalga Aşındırması" },
      { id: "d", text: "Yeraltı Suları Erimesi" }
    ],
    correctAnswer: "a",
    explanation: "2200-2500 m üzerindeki dağlarımızda eski dönem buzullarının oyduğu sirk çanaklarının dolmasıyla Buzul (Sirk) Gölleri oluşmuştur."
  },
  {
    id: 16,
    title: "Volkanik Patlama Çukuru (Maar Gölleri)",
    scenario: "Konya Karapınar yakınlarında bulunan ve gaz patlama çukuru olarak bilinen, görüntüsü nedeniyle 'Dünyanın Nazar Boncuğu' unvanını alan maar gölümüz hangisidir?",
    route: [
      [37.685, 33.637],
      [38.56, 34.52]
    ],
    waypoints: [
      { lat: 37.685, lng: 33.637, label: "Meke Gölü (Maar)" },
      { lat: 38.56, lng: 34.52, label: "Acıgöl (Nevşehir)" }
    ],
    options: [
      { id: "a", text: "Meke Gölü (Maar Gölü)" },
      { id: "b", text: "Çıldır Gölü" },
      { id: "c", text: "Uluabat Gölü" },
      { id: "d", text: "Sapanca Gölü" }
    ],
    correctAnswer: "a",
    explanation: "Volkanik gaz patlaması çukurlarına Maar denir. Konya Karapınar'daki Meke Gölü en ünlü maar gölümüzdür."
  },
  {
    id: 17,
    title: "Tektonik Göller Sınıflandırması",
    scenario: "Türkiye'nin yüzölçümü bakımından en büyük tatlı su gölü olan Beyşehir Gölü ile hemen yanı başındaki Eğirdir Gölü hangi göl sınıfına girmektedir?",
    route: [
      [38.05, 30.85],
      [37.75, 31.50],
      [38.60, 31.42]
    ],
    waypoints: [
      { lat: 38.05, lng: 30.85, label: "Eğirdir Gölü" },
      { lat: 37.75, lng: 31.50, label: "Beyşehir Gölü" },
      { lat: 38.60, lng: 31.42, label: "Akşehir Gölü" }
    ],
    options: [
      { id: "a", text: "Tektonik Göller (Fay çöküntüsü)" },
      { id: "b", text: "Yapay Baraj Gölleri" },
      { id: "c", text: "Kıyı Set Gölleri" },
      { id: "d", text: "Buzul Gölleri" }
    ],
    correctAnswer: "a",
    explanation: "Beyşehir, Eğirdir, Burdur, Tuz Gölü, Akşehir, İznik, Sapanca, Manyas ve Ulubat fay çöküntülerinde oluşan Tektonik Göller'dir."
  },
  {
    id: 18,
    title: "Akdeniz Körfezleri Sıralaması",
    scenario: "Muğla Fethiye'den deniz yoluyla hareket eden bir şilep, Akdeniz kıyısı boyunca doğuya doğru seyrederek İskenderun'a ulaşıyor. Bu şilep batıdan doğuya doğru hangi büyük körfezlerden sırasıyla geçer?",
    route: [
      [36.62, 29.11],
      [36.50, 30.80],
      [36.70, 34.70],
      [36.60, 36.00]
    ],
    waypoints: [
      { lat: 36.62, lng: 29.11, label: "Fethiye Körfezi" },
      { lat: 36.50, lng: 30.80, label: "Antalya Körfezi" },
      { lat: 36.70, lng: 34.70, label: "Mersin Körfezi" },
      { lat: 36.60, lng: 36.00, label: "İskenderun Körfezi" }
    ],
    options: [
      { id: "a", text: "Fethiye -> Antalya -> Mersin -> İskenderun" },
      { id: "b", text: "İzmir -> Saros -> Edremit -> Çandarlı" },
      { id: "c", text: "Bandırma -> Gemlik -> İzmit -> Sinop" },
      { id: "d", text: "Kuşadası -> Güllük -> Gökova -> Saros" }
    ],
    correctAnswer: "a",
    explanation: "Akdeniz kıyılarında batıdan doğuya körfezlerimizin sırası: Fethiye -> Antalya -> Mersin -> İskenderun Körfezi'dir."
  },
  {
    id: 19,
    title: "Meriç'ten Aras'a Sınır Akarsuları",
    scenario: "Edirne'de Türkiye-Yunanistan sınırını çizen nehrimizden başlayıp, Erzurum ve Kars üzerinden Ermenistan sınırına doğru akan nehrimize kadar kuzey hattındaki iki sınır akarsuyumuz hangileridir?",
    route: [
      [41.67, 26.56],
      [41.12, 30.64],
      [41.74, 35.96],
      [39.95, 44.40]
    ],
    waypoints: [
      { lat: 41.67, lng: 26.56, label: "Meriç Nehri (Batı Sınırı)" },
      { lat: 41.12, lng: 30.64, label: "Sakarya Nehri" },
      { lat: 41.74, lng: 35.96, label: "Kızılırmak" },
      { lat: 39.95, lng: 44.40, label: "Aras Nehri (Doğu Sınırı)" }
    ],
    options: [
      { id: "a", text: "Meriç Nehri ve Aras Nehri" },
      { id: "b", text: "Göksu ve Dalaman" },
      { id: "c", text: "Bakırçay ve Gediz" },
      { id: "d", text: "Asi ve Ceyhan" }
    ],
    correctAnswer: "a",
    explanation: "Edirne'de batı sınırımızı Meriç Nehri, Doğu Anadolu'da Ermenistan sınırını çizen ve Hazar Denizi'ne dökülen nehir ise Aras Nehridir."
  },
  {
    id: 20,
    title: "Lav ve Karstik Platolar Ayrımı",
    scenario: "Yaz yağışlarıyla büyüyen gür çayırlar üzerinde büyükbaş hayvancılığın geliştiği, siyah renkli çernozyom topraklarıyla bilinen en yüksek lav platosu hangisidir?",
    route: [
      [40.50, 42.50],
      [41.10, 42.70]
    ],
    waypoints: [
      { lat: 40.50, lng: 42.50, label: "Erzurum-Kars Platosu" },
      { lat: 41.10, lng: 42.70, label: "Ardahan Platosu" }
    ],
    options: [
      { id: "a", text: "Erzurum-Kars Platosu" },
      { id: "b", text: "Çatalca-Kocaeli Platosu" },
      { id: "c", text: "Teke Platosu" },
      { id: "d", text: "Cihanbeyli Platosu" }
    ],
    correctAnswer: "a",
    explanation: "Erzurum-Kars Platosu volkanik lav örtüsü üzerinde yer alır; yaz yağışları, gür alpin çayırları ve Çernozyom (Kara Toprak) örtüsüyle büyükbaş meracılığın merkezidir."
  }
];

// Helper to auto-fly Leaflet map bounds or center
const MapController = ({ center, zoom, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.flyTo(center, zoom || 6, { duration: 1.2 });
    }
  }, [center, zoom, bounds, map]);
  return null;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const GeographyMapQuiz = ({ theme }) => {
  const [activeCategory, setActiveCategory] = useState("kirikDaglar");
  const [isOsymMode, setIsOsymMode] = useState(false);

  // Pin Quiz state
  const [gameState, setGameState] = useState("idle"); // idle, playing, over
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [answers, setAnswers] = useState({}); // { itemId: 'correct' | 'wrong' }
  const [timer, setTimer] = useState(0);

  // ÖSYM Interactive Questions state
  const [osymQuestionIdx, setOsymQuestionIdx] = useState(0);
  const [osymAnswers, setOsymAnswers] = useState({}); // { questionId: selectedOptionId }
  const [showOsymExplanation, setShowOsymExplanation] = useState(false);

  const timerInterval = useRef(null);

  const categories = [
    { id: "kirikDaglar", label: "Kırık Dağlar", group: "Fiziksel" },
    { id: "volkanikDaglar", label: "Volkanik Dağlar", group: "Fiziksel" },
    { id: "kivrimDaglar", label: "Kıvrım Dağlar", group: "Fiziksel" },
    { id: "akarsular", label: "Akarsular", group: "Fiziksel" },
    { id: "ovalar", label: "Ovalar", group: "Fiziksel" },
    { id: "platolar", label: "Türkiye Platoları", group: "Fiziksel" },
    
    // Göller (Categorized)
    { id: "goller_heyelan", label: "Heyelan Set Gölleri", group: "Göller" },
    { id: "goller_kiyi", label: "Kıyı Set Gölleri (Lagün)", group: "Göller" },
    { id: "goller_yapay", label: "Yapay Göller (Barajlar)", group: "Göller" },
    { id: "goller_aluvyon", label: "Alüvyon Set Gölleri", group: "Göller" },
    { id: "goller_volkanikset", label: "Volkanik Set Gölleri", group: "Göller" },
    { id: "goller_buzul", label: "Buzul (Sirk) Gölleri", group: "Göller" },
    { id: "goller_karstik", label: "Karstik Göller", group: "Göller" },
    { id: "goller_volkanik", label: "Volkanik Krater/Maar Gölleri", group: "Göller" },
    { id: "goller_tektonik", label: "Tektonik Göller", group: "Göller" }
  ];

  const createCustomIcon = (item, answerState, category) => {
    let glowColor = "rgba(59, 130, 246, 0.5)";
    let themeHex = "#3b82f6";
    let iconStr = "";
    
    if (category === "kirikDaglar") {
      themeHex = "#e37e64";
      glowColor = "rgba(227, 126, 100, 0.5)";
      iconStr = ReactDOMServer.renderToString(<GiMountaintop size={13} color={themeHex} />);
    } else if (category === "kivrimDaglar") {
      themeHex = "#9fcc6b";
      glowColor = "rgba(159, 204, 107, 0.5)";
      iconStr = ReactDOMServer.renderToString(<GiMountains size={13} color={themeHex} />);
    } else if (category === "volkanikDaglar") {
      themeHex = "#a87bba";
      glowColor = "rgba(168, 123, 186, 0.5)";
      iconStr = ReactDOMServer.renderToString(<GiVolcano size={13} color={themeHex} />);
    } else if (category === "akarsular") {
      themeHex = "#38bdf8";
      glowColor = "rgba(56, 189, 248, 0.5)";
      iconStr = ReactDOMServer.renderToString(<FaWater size={11} color={themeHex} />);
    } else if (category === "ovalar") {
      themeHex = "#e6d36e";
      glowColor = "rgba(230, 211, 110, 0.5)";
      iconStr = ReactDOMServer.renderToString(<FaLeaf size={11} color={themeHex} />);
    } else if (category === "platolar") {
      themeHex = "#f97316";
      glowColor = "rgba(249, 115, 22, 0.5)";
      iconStr = ReactDOMServer.renderToString(<GiHills size={12} color={themeHex} />);
    } else if (category && category.startsWith("goller_")) {
      themeHex = "#0284c7";
      glowColor = "rgba(2, 132, 199, 0.5)";
      iconStr = ReactDOMServer.renderToString(<GiWaterDrop size={12} color={themeHex} />);
    } else {
      iconStr = ReactDOMServer.renderToString(<FaMapMarkedAlt size={11} color={themeHex} />);
    }

    if (gameState === "playing") {
      themeHex = "#94a3b8";
      glowColor = "rgba(148, 163, 184, 0.3)";
      iconStr = ReactDOMServer.renderToString(<FaBullseye size={11} color={themeHex} />);
      if (answerState === 'correct') {
        themeHex = "#10b981";
        glowColor = "rgba(16, 185, 129, 0.5)";
        iconStr = ReactDOMServer.renderToString(<FaCheck size={11} color={themeHex} />);
      } else if (answerState === 'wrong') {
        themeHex = "#ef4444";
        glowColor = "rgba(239, 68, 68, 0.5)";
        iconStr = ReactDOMServer.renderToString(<FaTimes size={11} color={themeHex} />);
      }
    }

    const html = `
      <div class="relative flex flex-col items-center justify-center transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        <div class="absolute w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(circle, ${glowColor} 0%, transparent 60%);"></div>
        <div class="relative w-6 h-6 rounded-full border-[1.5px] shadow-md flex items-center justify-center z-10" 
             style="background: #1e293b; border-color: ${themeHex};">
          ${iconStr}
        </div>
        <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] -mt-[1px] relative z-0" style="border-top-color: ${themeHex}; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: '',
      iconSize: [24, 29],
      iconAnchor: [12, 29]
    });
  };

  const createOsymWaypointIcon = (label, isStart, isEnd) => {
    let bgColor = "#3b82f6";
    if (isStart) bgColor = "#10b981";
    if (isEnd) bgColor = "#ef4444";

    const html = `
      <div class="flex items-center gap-1.5 bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-lg border-white/20 whitespace-nowrap animate-bounce">
        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${bgColor};"></span>
        <span>${label}</span>
      </div>
    `;

    return L.divIcon({
      html,
      className: '',
      iconSize: [120, 28],
      iconAnchor: [60, 14]
    });
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const getGeoJsonStyle = () => {
    let fillColor = "#3b82f6";
    
    if (activeCategory === "kirikDaglar") fillColor = "#e37e64";
    if (activeCategory === "kivrimDaglar") fillColor = "#9fcc6b";
    if (activeCategory === "volkanikDaglar") fillColor = "#a87bba";
    if (activeCategory === "akarsular") fillColor = "#38bdf8";
    if (activeCategory === "ovalar") fillColor = "#e6d36e";
    if (activeCategory === "platolar") fillColor = "#f97316";
    if (activeCategory && activeCategory.startsWith("goller_")) fillColor = "#0284c7";

    return {
      color: fillColor,
      weight: 1,
      opacity: 1,
      fillColor: fillColor,
      fillOpacity: 1
    };
  };

  const startQuiz = () => {
    const items = QUIZ_ITEMS[activeCategory] || [];
    setQuestionQueue(shuffle(items));
    setCurrentIdx(0);
    setLives(3);
    setAnswers({});
    setGameState("playing");
    setTimer(0);
    
    clearInterval(timerInterval.current);
    timerInterval.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const endQuiz = () => {
    setGameState("idle");
    setAnswers({});
    clearInterval(timerInterval.current);
  };

  const handlePinClick = (item) => {
    if (gameState !== "playing") return;
    const targetItem = questionQueue[currentIdx];
    if (answers[item.id]) return;

    if (item.id === targetItem.id) {
      setAnswers(prev => ({ ...prev, [item.id]: 'correct' }));
      if (currentIdx + 1 >= questionQueue.length) {
        setGameState("over");
        clearInterval(timerInterval.current);
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    } else {
      setAnswers(prev => ({ ...prev, [item.id]: 'wrong' }));
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameState("over");
        clearInterval(timerInterval.current);
      } else {
        setTimeout(() => {
          setAnswers(prev => {
            if (prev[item.id] === 'wrong') {
              const newAnswers = { ...prev };
              delete newAnswers[item.id];
              return newAnswers;
            }
            return prev;
          });
        }, 800);
      }
    }
  };

  const handleOsymOptionSelect = (optionId) => {
    const currentQ = OSYM_QUESTIONS[osymQuestionIdx];
    setOsymAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId
    }));
    setShowOsymExplanation(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const correctCount = Object.values(answers).filter(v => v === 'correct').length;
  const totalCount = questionQueue.length;

  const currentOsymQ = OSYM_QUESTIONS[osymQuestionIdx];
  const osymCorrectCount = Object.keys(osymAnswers).filter(
    (qId) => osymAnswers[qId] === OSYM_QUESTIONS.find(q => q.id === Number(qId))?.correctAnswer
  ).length;

  return (
    <div className={`p-4 md:p-6 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
            <span className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <FaMapMarkedAlt size={24} />
            </span>
            Haritalarla Coğrafya
          </h2>
          <p className="text-xs md:text-sm opacity-70 mt-1">
            Türkiye fiziki ve beşeri haritaları, platolar, göller ve 20 interaktif ÖSYM rota sorusu.
          </p>
        </div>

        {/* TOP TOGGLE: Pin Map Mode vs ÖSYM Route Questions Mode */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setIsOsymMode(false);
              setGameState("idle");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              !isOsymMode
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaLayerGroup size={14} /> Harita & Dağ/Göl Modu
          </button>
          
          <button
            onClick={() => {
              setIsOsymMode(true);
              setGameState("idle");
              setShowOsymExplanation(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isOsymMode
                ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-500/30"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FaRoute size={14} /> ÖSYM Rota Soruları (20 Soru)
          </button>
        </div>

        {/* STATUS BAR FOR PIN QUIZ */}
        {!isOsymMode && gameState !== "idle" && (
          <div className={`flex items-center gap-4 px-5 py-2.5 rounded-2xl font-semibold shadow-sm text-xs ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-2 text-emerald-500">
              <FaBullseye /> {correctCount} / {totalCount}
            </div>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2 text-blue-500">
              <FaHourglassHalf /> {formatTime(timer)}
            </div>
            {gameState === "playing" && (
              <>
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-rose-500">
                  <FaHeart /> Kalan Hak: {lives}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* CATEGORY SELECTION BUTTONS (Standard Mode) */}
      {!isOsymMode && (
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-blue-500 tracking-wider mr-2">Fiziki Haritalar:</span>
            {categories.filter(c => c.group === "Fiziksel").map((cat) => (
              <button
                key={cat.id}
                disabled={gameState === "playing"}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setGameState("idle");
                  setAnswers({});
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : theme === 'dark' 
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-xs border border-gray-200"
                } ${gameState === "playing" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-sky-500 tracking-wider mr-2">Göl Haritaları:</span>
            {categories.filter(c => c.group === "Göller").map((cat) => (
              <button
                key={cat.id}
                disabled={gameState === "playing"}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setGameState("idle");
                  setAnswers({});
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id 
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/20" 
                    : theme === 'dark' 
                      ? "bg-gray-800/60 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-xs border border-gray-200"
                } ${gameState === "playing" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAP & QUESTION CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEAFLET MAP (8 cols in ÖSYM mode, 12 cols in Standard mode) */}
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-slate-100'} ${isOsymMode ? 'lg:col-span-7 h-[550px]' : 'lg:col-span-12 h-[620px]'}`}>
          
          <style>{`
            .leaflet-overlay-pane svg path:not(.lake-polygon) {
              filter: drop-shadow(3px 6px 5px rgba(0,0,0,0.35));
            }
            .lake-polygon {
              filter: none !important;
            }
            
            .game-tooltip-wrapper {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              overflow: visible !important;
              opacity: 1 !important;
              white-space: normal !important;
              width: max-content !important;
              max-width: 240px !important;
            }
            .game-tooltip-wrapper::before, .game-tooltip-wrapper::after {
              display: none !important;
            }

            .game-tooltip-content {
              background: rgba(15, 23, 42, 0.94);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.15);
              border-top: 2px solid #fbbf24;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
              border-radius: 8px;
              padding: 8px 12px;
              color: #f8fafc;
              font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
              text-align: left;
              pointer-events: none;
              animation: slideUpFade 0.2s ease-out forwards;
              width: 100%;
              box-sizing: border-box;
            }

            @keyframes slideUpFade {
              0% { transform: translateY(6px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>

          {/* ACTIVE QUESTION BANNER (In Standard Quiz Game) */}
          {!isOsymMode && gameState === "playing" && questionQueue[currentIdx] && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">Haritada Bul:</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">{questionQueue[currentIdx].name}</span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
              <div className="flex gap-2">
                <button onClick={startQuiz} className="px-3.5 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">Yeniden Başla</button>
                <button onClick={endQuiz} className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">Çık</button>
              </div>
            </div>
          )}

          <MapContainer 
            center={[39.0, 35.0]} 
            zoom={6} 
            minZoom={5}
            maxZoom={9}
            style={{ width: '100%', height: '100%', backgroundColor: '#b9d3e1' }}
            className="z-0 outline-none"
            zoomControl={false}
          >
            {/* Auto fly controller */}
            {isOsymMode ? (
              <MapController bounds={currentOsymQ.route} />
            ) : (
              <MapController center={[39.0, 35.0]} zoom={6} />
            )}

            <GeoJSON key={`turkey-${activeCategory}-${gameState}-${isOsymMode}`} data={turkeyGeoJson} style={getGeoJsonStyle()} />
            <GeoJSON key={`van-lake-${activeCategory}-${gameState}-${isOsymMode}`} data={vanLakeGeoJson} style={{ fillColor: "#b9d3e1", color: "#b9d3e1", fillOpacity: 1, weight: 1, className: "lake-polygon" }} />
            <GeoJSON key={`tuz-lake-${activeCategory}-${gameState}-${isOsymMode}`} data={tuzLakeGeoJson} style={{ fillColor: "#b9d3e1", color: "#b9d3e1", fillOpacity: 1, weight: 1, className: "lake-polygon" }} />

            {/* Standard Mode Pins */}
            {!isOsymMode && (QUIZ_ITEMS[activeCategory] || []).map((item) => (
              <Marker 
                key={item.id} 
                position={[item.lat, item.lng]}
                icon={createCustomIcon(item, answers[item.id], activeCategory)}
                eventHandlers={{
                  click: () => handlePinClick(item)
                }}
              >
                {gameState !== "playing" && (
                  <Tooltip direction="top" offset={[0, -15]} opacity={1} className="game-tooltip-wrapper">
                    <div className="game-tooltip-content flex flex-col items-start">
                      <span className="text-[13px] font-bold text-amber-400">
                        {item.name}
                      </span>
                      {item.desc && (
                        <span className="text-[11px] font-normal text-slate-200 mt-1 leading-snug">
                          {item.desc}
                        </span>
                      )}
                    </div>
                  </Tooltip>
                )}
              </Marker>
            ))}

            {/* ÖSYM Route Polyline & Waypoint Pins */}
            {isOsymMode && (
              <>
                <Polyline 
                  positions={currentOsymQ.route} 
                  pathOptions={{ 
                    color: "#f43f5e", 
                    weight: 5, 
                    opacity: 0.85,
                    dashArray: "8, 8" 
                  }} 
                />
                {currentOsymQ.waypoints.map((wp, i) => (
                  <Marker 
                    key={i}
                    position={[wp.lat, wp.lng]}
                    icon={createOsymWaypointIcon(wp.label, i === 0, i === currentOsymQ.waypoints.length - 1)}
                  />
                ))}
              </>
            )}
          </MapContainer>

          {/* START / RETRY OVERLAY (Standard Map Game) */}
          {!isOsymMode && gameState !== "playing" && (
            <div className="absolute inset-0 z-[2000] pointer-events-none flex flex-col items-center justify-center p-6 text-center">
              
              {gameState === "over" && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl mb-6 pointer-events-auto transform scale-100 transition-all border border-gray-200 dark:border-gray-700">
                  {lives > 0 ? (
                    <FaTrophy className="text-6xl text-amber-400 mx-auto mb-4" />
                  ) : (
                    <FaHeart className="text-6xl text-rose-500 mx-auto mb-4 opacity-50" />
                  )}
                  <h3 className="text-3xl font-extrabold mb-2">
                    {lives > 0 ? "Tebrikler!" : "Oyun Bitti!"}
                  </h3>
                  <p className="text-sm opacity-80 mb-6">
                    {lives > 0 
                      ? `${categories.find(c => c.id === activeCategory)?.label} haritasını tamamladın.` 
                      : "Tüm haklarınızı kaybettiniz."}
                  </p>
                  <div className="flex justify-center gap-6 text-lg font-bold">
                    <div className="text-emerald-500 flex flex-col"><span>Doğru</span> <span>{correctCount} / {totalCount}</span></div>
                    <div className="text-blue-500 flex flex-col"><span>Süre</span> <span>{formatTime(timer)}</span></div>
                  </div>
                </div>
              )}

              <button
                onClick={startQuiz}
                className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-extrabold flex items-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 cursor-pointer"
              >
                <FaPlay size={16} /> {gameState === "over" ? "Tekrar Oyna" : "Harita Oyunu Başlat"}
              </button>
              <div className="pointer-events-auto bg-black/60 px-4 py-2 rounded-full mt-4 backdrop-blur-md border border-white/10">
                <p className="text-white text-xs font-semibold">Haritadaki noktaların üzerine gelerek veya tıklayarak bilginizi sınayabilirsiniz.</p>
              </div>
            </div>
          )}

        </div>

        {/* ÖSYM QUESTION PANEL (Right side in ÖSYM mode) */}
        {isOsymMode && (
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* Question Card */}
            <div className={`p-6 rounded-3xl shadow-xl border flex-1 flex flex-col justify-between ${
              theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              
              <div>
                {/* Question Step Indicator */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-extrabold rounded-full flex items-center gap-1.5">
                    <FaQuestionCircle size={12} /> Soru {osymQuestionIdx + 1} / {OSYM_QUESTIONS.length}
                  </span>

                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <FaCheckCircle size={12} /> Doğru: {osymCorrectCount}
                  </span>
                </div>

                {/* Scenario */}
                <h3 className="text-base font-black text-rose-500 mb-1">
                  {currentOsymQ.title}
                </h3>
                <p className="text-xs md:text-sm font-medium leading-relaxed mb-6 opacity-90">
                  {currentOsymQ.scenario}
                </p>

                {/* Choices */}
                <div className="space-y-2.5 mb-6">
                  {currentOsymQ.options.map((option) => {
                    const isSelected = osymAnswers[currentOsymQ.id] === option.id;
                    const isCorrect = option.id === currentOsymQ.correctAnswer;
                    const hasAnswered = !!osymAnswers[currentOsymQ.id];

                    let btnStyle = theme === 'dark' 
                      ? 'bg-gray-900/60 border-gray-700 hover:bg-gray-700 text-gray-200' 
                      : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-gray-800';

                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-500 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-500 font-bold';
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        disabled={hasAnswered}
                        onClick={() => handleOsymOptionSelect(option.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="flex-1 leading-snug">{option.text}</span>
                        {hasAnswered && isCorrect && <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />}
                        {hasAnswered && isSelected && !isCorrect && <FaTimesCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />}
                      </button>
                    );
                  })}
                </div>

                {/* ÖSYM Solution Box */}
                {showOsymExplanation && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-medium space-y-1.5 animate-fadeIn">
                    <div className="font-extrabold flex items-center gap-2 text-amber-500 uppercase tracking-wider text-[11px]">
                      <FaCompass /> ÖSYM Harita Analizi & Çözüm:
                    </div>
                    <p className="leading-relaxed">
                      {currentOsymQ.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  disabled={osymQuestionIdx === 0}
                  onClick={() => {
                    setOsymQuestionIdx(prev => prev - 1);
                    setShowOsymExplanation(!!osymAnswers[OSYM_QUESTIONS[osymQuestionIdx - 1]?.id]);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    osymQuestionIdx === 0 
                      ? 'opacity-40 cursor-not-allowed text-gray-400' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <FaChevronLeft size={10} /> Önceki
                </button>

                <button
                  onClick={() => {
                    setOsymAnswers({});
                    setOsymQuestionIdx(0);
                    setShowOsymExplanation(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer"
                  title="Soruları Sıfırla"
                >
                  <FaUndo size={14} />
                </button>

                <button
                  disabled={osymQuestionIdx === OSYM_QUESTIONS.length - 1}
                  onClick={() => {
                    setOsymQuestionIdx(prev => prev + 1);
                    setShowOsymExplanation(!!osymAnswers[OSYM_QUESTIONS[osymQuestionIdx + 1]?.id]);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    osymQuestionIdx === OSYM_QUESTIONS.length - 1
                      ? 'opacity-40 cursor-not-allowed text-gray-400' 
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  }`}
                >
                  Sonraki <FaChevronRight size={10} />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default GeographyMapQuiz;
