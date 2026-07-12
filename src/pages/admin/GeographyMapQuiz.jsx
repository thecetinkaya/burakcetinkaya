import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaTrophy, FaHourglassHalf, FaBullseye, FaMapMarkedAlt, FaMountain, FaWater, FaLeaf, FaHeart, FaCheck, FaTimes } from "react-icons/fa";
import { GiVolcano, GiMountains, GiMountaintop } from "react-icons/gi";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON, Tooltip } from "react-leaflet";
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
    { id: "karacadag", name: "Karacadağ", lat: 37.755, lng: 39.827, desc: "Diyarbakır-Şanlıurfa sınırında kalkan tipi bazaltik volkanik dağ." },
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
  ]
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const GeographyMapQuiz = ({ theme }) => {
  const [activeCategory, setActiveCategory] = useState("kirikDaglar");
  const [gameState, setGameState] = useState("idle"); // idle, playing, over
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [answers, setAnswers] = useState({}); // { itemId: 'correct' | 'wrong' }
  const [timer, setTimer] = useState(0);
  
  const timerInterval = useRef(null);
  
  const categories = [
    { id: "kirikDaglar", label: "Kırık Dağlar" },
    { id: "volkanikDaglar", label: "Volkanik Dağlar" },
    { id: "kivrimDaglar", label: "Kıvrım Dağlar" },
    { id: "akarsular", label: "Akarsular" },
    { id: "ovalar", label: "Ovalar" },
  ];

  const createCustomIcon = (item, answerState, category) => {
    let glowColor = "rgba(59, 130, 246, 0.4)"; // blue
    let themeHex = "#3b82f6";
    let iconStr = "";
    
    // Her kategoriye özel simge ve haritayla tam uyumlu (kullanıcının istediği) tatlı renkler
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
      themeHex = "#6baed6";
      glowColor = "rgba(107, 174, 214, 0.5)";
      iconStr = ReactDOMServer.renderToString(<FaWater size={11} color={themeHex} />);
    } else if (category === "ovalar") {
      themeHex = "#e6d36e";
      glowColor = "rgba(230, 211, 110, 0.5)";
      iconStr = ReactDOMServer.renderToString(<FaLeaf size={11} color={themeHex} />);
    } else {
      iconStr = ReactDOMServer.renderToString(<FaMapMarkedAlt size={11} color={themeHex} />);
    }

    if (gameState === "playing") {
      themeHex = "#94a3b8"; // slate-400
      glowColor = "rgba(148, 163, 184, 0.3)";
      iconStr = ReactDOMServer.renderToString(<FaBullseye size={11} color={themeHex} />);
      if (answerState === 'correct') {
        themeHex = "#10b981"; // emerald-500
        glowColor = "rgba(16, 185, 129, 0.5)";
        iconStr = ReactDOMServer.renderToString(<FaCheck size={11} color={themeHex} />);
      } else if (answerState === 'wrong') {
        themeHex = "#ef4444"; // rose-500
        glowColor = "rgba(239, 68, 68, 0.5)";
        iconStr = ReactDOMServer.renderToString(<FaTimes size={11} color={themeHex} />);
      }
    }

    // Sade, küçük ve pürüzsüz map pin
    const html = `
      <div class="relative flex flex-col items-center justify-center transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        <!-- Hafif arka plan ışıması -->
        <div class="absolute w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: radial-gradient(circle, ${glowColor} 0%, transparent 60%);"></div>
        
        <!-- Zarif ana gövde -->
        <div class="relative w-6 h-6 rounded-full border-[1.5px] shadow-md flex items-center justify-center z-10" 
             style="background: #1e293b; border-color: ${themeHex};">
          ${iconStr}
        </div>
        
        <!-- Küçük ok -->
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

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const getGeoJsonStyle = () => {
    let fillColor = "#3b82f6";
    
    if (activeCategory === "kirikDaglar") { fillColor = "#e37e64"; }
    if (activeCategory === "kivrimDaglar") { fillColor = "#9fcc6b"; }
    if (activeCategory === "volkanikDaglar") { fillColor = "#a87bba"; }
    if (activeCategory === "akarsular") { fillColor = "#6baed6"; }
    if (activeCategory === "ovalar") { fillColor = "#e6d36e"; }

    return {
      color: fillColor,
      weight: 1,
      opacity: 1,
      fillColor: fillColor,
      fillOpacity: 1
    };
  };

  const startQuiz = () => {
    const items = QUIZ_ITEMS[activeCategory];
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const correctCount = Object.values(answers).filter(v => v === 'correct').length;
  const totalCount = questionQueue.length;

  return (
    <div className={`p-4 md:p-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaMapMarkedAlt className="text-blue-500" /> Coğrafya Harita Oyunu
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Mükemmel hassasiyette fiziksel Türkiye haritası. Topografik detaylarla dağları, ovaları ve nehirleri bul.
          </p>
        </div>
        
        {gameState !== "idle" && (
          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl font-semibold shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-2 text-emerald-500">
              <FaBullseye /> {correctCount} / {totalCount}
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2 text-blue-500">
              <FaHourglassHalf /> {formatTime(timer)}
            </div>
            {gameState === "playing" && (
              <>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-rose-500">
                  <FaHeart /> Kalan Hak: {lives}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            disabled={gameState === "playing"}
            onClick={() => {
              setActiveCategory(cat.id);
              setGameState("idle");
              setAnswers({});
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : theme === 'dark' 
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100"
            } ${gameState === "playing" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={`relative w-full rounded-2xl overflow-hidden shadow-xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`} style={{ height: "600px" }}>
        
        <style>{`
          .leaflet-overlay-pane svg path:not(.lake-polygon) {
            filter: drop-shadow(4px 8px 6px rgba(0,0,0,0.4));
          }
          .lake-polygon {
            filter: none !important;
          }
          
          /* Leaflet'in kendi Tooltip sargısını şeffaf yapıp yazının sığmasını sağlıyoruz */
          .game-tooltip-wrapper {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            overflow: visible !important;
            opacity: 1 !important;
            white-space: normal !important; /* METNİN TAŞMASINI KESİNLİKLE ENGELLER */
            width: max-content !important;
            max-width: 220px !important;
          }
          .game-tooltip-wrapper::before, .game-tooltip-wrapper::after {
            display: none !important;
          }

          /* Sade, şık, düzgün fontlu iç içerik */
          .game-tooltip-content {
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-top: 2px solid #fbbf24;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
            border-radius: 6px;
            padding: 8px 12px;
            color: #f8fafc;
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important; /* Adam akıllı profesyonel font */
            text-align: left;
            pointer-events: none;
            transform-origin: bottom center;
            animation: slideUpFade 0.2s ease-out forwards;
            width: 100%;
            box-sizing: border-box;
          }

          @keyframes slideUpFade {
            0% { transform: translateY(6px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        
        {gameState === "playing" && questionQueue[currentIdx] && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Bul:</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{questionQueue[currentIdx].name}</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
            <div className="flex gap-2">
              <button onClick={startQuiz} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold transition-all shadow-sm">Yeniden Başla</button>
              <button onClick={endQuiz} className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-bold transition-all shadow-sm">Çık</button>
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
          <GeoJSON key={`${activeCategory}-${gameState}`} data={turkeyGeoJson} style={getGeoJsonStyle()} />
          <GeoJSON key={`van-lake-${activeCategory}-${gameState}`} data={vanLakeGeoJson} style={{ fillColor: "#b9d3e1", color: "#b9d3e1", fillOpacity: 1, weight: 1, className: "lake-polygon" }} />
          <GeoJSON key={`tuz-lake-${activeCategory}-${gameState}`} data={tuzLakeGeoJson} style={{ fillColor: "#b9d3e1", color: "#b9d3e1", fillOpacity: 1, weight: 1, className: "lake-polygon" }} />
          
          {QUIZ_ITEMS[activeCategory].map((item) => (
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
                    <span 
                      className="text-[13px] font-bold" 
                      style={{ color: '#fbbf24' }}
                    >
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
        </MapContainer>

        {/* Start / Retry Overlay */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 z-[2000] pointer-events-none flex flex-col items-center justify-center p-6 text-center">
            
            {gameState === "over" && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl mb-6 pointer-events-auto transform scale-100 transition-all">
                {lives > 0 ? (
                  <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
                ) : (
                  <FaHeart className="text-6xl text-rose-500 mx-auto mb-4 opacity-50" />
                )}
                <h3 className="text-3xl font-bold mb-2">
                  {lives > 0 ? "Tebrikler!" : "Oyun Bitti!"}
                </h3>
                <p className="text-lg opacity-80 mb-6">
                  {lives > 0 
                    ? `${categories.find(c => c.id === activeCategory)?.label} kategorisini tamamladın.` 
                    : "Tüm haklarınızı kaybettiniz."}
                </p>
                <div className="flex justify-center gap-6 text-xl font-semibold">
                  <div className="text-emerald-500 flex flex-col"><span>Doğru</span> <span>{correctCount} / {totalCount}</span></div>
                  <div className="text-blue-500 flex flex-col"><span>Süre</span> <span>{formatTime(timer)}</span></div>
                </div>
              </div>
            )}

            <button
              onClick={startQuiz}
              className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
            >
              <FaPlay /> {gameState === "over" ? "Tekrar Oyna" : "Oyuna Başla"}
            </button>
            <div className="pointer-events-auto bg-black/50 px-4 py-2 rounded-full mt-4 backdrop-blur-md">
              <p className="text-white text-sm font-medium">Haritadaki noktaları çalışarak öğrenebilirsin.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default GeographyMapQuiz;
