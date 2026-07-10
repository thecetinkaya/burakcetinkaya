import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { 
  FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaCoins, FaInfoCircle, 
  FaFileAlt, FaCheckCircle, FaExchangeAlt, FaChevronDown, FaChevronUp, 
  FaSearch, FaDollarSign, FaHistory 
} from "react-icons/fa";

// Company Names mapping
const COMPANY_NAMES = {
  THYAO: "Türk Hava Yolları",
  EREGL: "Ereğli Demir Çelik",
  ASELS: "Aselsan Elektronik",
  TUPRS: "Tüpraş Rafinerileri",
  YKBNK: "Yapı Kredi Bankası",
  ASTOR: "Astor Enerji",
  BIMAS: "BİM Birleşik Mağazalar",
  SAHOL: "Sabancı Holding",
  KCHOL: "Koç Holding",
  SISE: "Şişecam Cam Sanayi"
};

const FALLBACK_BIST_LIST = [
  { symbol: "THYAO", description: "TÜRK HAVA YOLLARI AO" },
  { symbol: "EREGL", description: "EREĞLİ DEMİR VE ÇELİK FABRİKALARI T.A.Ş." },
  { symbol: "ASELS", description: "ASELSAN ELEKTRONİK SANAYİ VE TİCARET A.Ş." },
  { symbol: "TUPRS", description: "TÜPRAŞ TÜRKİYE PETROL RAFİNERİLERİ A.Ş." },
  { symbol: "YKBNK", description: "YAPI VE KREDİ BANKASI A.Ş." },
  { symbol: "ASTOR", description: "ASTOR ENERJİ A.Ş." },
  { symbol: "BIMAS", description: "BİM BİRLEŞİK MAĞAZALAR A.Ş." },
  { symbol: "SAHOL", description: "HACI ÖMER SABANCI HOLDİNG A.Ş." },
  { symbol: "KCHOL", description: "KOÇ HOLDİNG A.Ş." },
  { symbol: "SISE", description: "TÜRKİYE ŞİŞE VE CAM FABRİKALARI A.Ş." },
  { symbol: "AKBNK", description: "AKBANK T.A.Ş." },
  { symbol: "GARAN", description: "TÜRKİYE GARANTİ BANKASI A.Ş." },
  { symbol: "ISCTR", description: "TÜRKİYE İŞ BANKASI A.Ş. (C)" },
  { symbol: "HEKTS", description: "HEKTAŞ TİCARET T.A.Ş." },
  { symbol: "SASA", description: "SASA POLYESTER SANAYİ A.Ş." },
  { symbol: "KONTR", description: "KONTROLMATİK TEKNOLOJİ ENERJİ VE MÜHENDİSLİK A.Ş." },
  { symbol: "YEOTK", description: "YEO TEKNOLOJİ ENERJİ VE ENDÜSTRİ A.Ş." },
  { symbol: "ODAS", description: "ODAŞ ELEKTRİK ÜRETİM SANAYİ TİCARET A.Ş." },
  { symbol: "PETKM", description: "PETKİM PETROKİMYA HOLDİNG A.Ş." },
  { symbol: "PGSUS", description: "PEGASUS HAVA TAŞIMACILIĞI A.Ş." },
  { symbol: "DOHOL", description: "DOĞAN ŞİRKETLER GRUBU HOLDİNG A.Ş." },
  { symbol: "EKGYO", description: "EMLAK KONUT GAYRİMENKUL YATIRIM ORTAKLIĞI A.Ş." },
  { symbol: "ALARK", description: "ALARKO HOLDİNG A.Ş." },
  { symbol: "GUBRF", description: "GÜBRE FABRİKALARI T.A.Ş." },
  { symbol: "KARDMD", description: "KARDEMİR KARABÜK DEMİR ÇELİK SANAYİ VE TİCARET A.Ş. (D)" }
];

// Simulated real-time prices for popular BIST symbols
const INITIAL_LIVE_PRICES = {
  THYAO: 312.40,
  EREGL: 48.20,
  ASELS: 62.15,
  TUPRS: 168.30,
  YKBNK: 29.10,
  ASTOR: 94.75,
  BIMAS: 398.50,
  SAHOL: 86.80,
  KCHOL: 215.20,
  SISE: 49.60
};

// Generates data points for mock chart
const generateChartData = (symbol, buyPrice, currentPrice, range = "1A") => {
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(1);
  const data = [];
  let points = 20;
  if (range === "1G") points = 8;
  else if (range === "1H") points = 12;
  else if (range === "3A") points = 30;

  const startPrice = buyPrice * 0.96;
  const endPrice = currentPrice;
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const noise = Math.sin(i * 0.9 + seed) * (buyPrice * 0.025);
    const price = startPrice + (endPrice - startPrice) * progress + noise;
    data.push({
      index: i,
      label: range === "1G" ? `${9 + i}:00` : `Gün ${i + 1}`,
      price: parseFloat(price.toFixed(2))
    });
  }
  return data;
};

// Sparkline SVG generator
const drawSparkline = (buyPrice, currentPrice) => {
  const isProfit = currentPrice >= buyPrice;
  const height = 20;
  const width = 60;
  const p1 = height / 2;
  const p2 = isProfit ? 4 : height - 4;
  const strokeColor = isProfit ? "#10b981" : "#ef4444";
  
  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <path
        d={`M 0 ${p1} C ${width / 3} ${p1 - 6}, ${(width / 3) * 2} ${p1 + 4}, ${width} ${p2}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const StockTab = ({ theme }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOwner, setActiveOwner] = useState("self"); // self, mother, father, brother
  const [livePrices, setLivePrices] = useState(INITIAL_LIVE_PRICES);
  const [liveChanges, setLiveChanges] = useState({}); // Real BIST daily changes
  const [selectedStockForChart, setSelectedStockForChart] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Midas timeframe (1G, 1H, 1A, 3A, 1Y, 5Y)
  const [timeframe, setTimeframe] = useState("1G");

  // Expanded card/holding details key
  const [expandedHoldingId, setExpandedHoldingId] = useState(null);

  // Dropdown selector state
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  // Form toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [lots, setLots] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split("T")[0]);
  const [buyTime, setBuyTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  // Sell Form States
  const [sellingStockId, setSellingStockId] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const [sellDate, setSellDate] = useState(new Date().toISOString().split("T")[0]);
  const [sellTime, setSellTime] = useState("17:00");

  // Fetching all BIST stocks for searchable select dropdown
  const [bistStocksList, setBistStocksList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allBistLoading, setAllBistLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [stockDetails, setStockDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (showAddForm) {
      fetchAllBistStocks();
    }
  }, [showAddForm]);

  const fetchAllBistStocks = async () => {
    if (bistStocksList.length > 0) return;
    setAllBistLoading(true);
    try {
      const body = {
        filter: [
          { left: "type", operation: "in_range", right: ["stock", "dr", "fund"] }
        ],
        options: { lang: "tr" },
        markets: ["turkey"],
        symbols: { query: { types: [] }, tickers: [] },
        columns: ["name", "description", "close"],
        sort: { sortBy: "name", sortOrder: "asc" },
        range: [0, 600]
      };

      let res;
      let success = false;
      try {
        res = await fetch("https://scanner.tradingview.com/turkey/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (res.ok) success = true;
      } catch (err) {
        // ignore CORS blocks and try proxy
      }

      if (!success) {
        res = await fetch("https://corsproxy.io/?https://scanner.tradingview.com/turkey/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error("Catalog fetch failed");
      }

      const json = await res.json();
      const results = json?.data || [];
      const formatted = results.map(item => ({
        symbol: item.d[0],
        description: item.d[1],
        price: item.d[2]
      }));
      setBistStocksList(formatted);
    } catch (err) {
      console.warn("BIST hisse listesi çekilemedi, yerel listeden devam ediliyor:", err);
    } finally {
      setAllBistLoading(false);
    }
  };

  const getCompanyName = (sym) => {
    const cleanSym = sym.toUpperCase().trim();
    if (COMPANY_NAMES[cleanSym]) return COMPANY_NAMES[cleanSym];
    const match = bistStocksList.find(s => s.symbol === cleanSym);
    if (match) return match.description;
    return "BIST Şirketi";
  };

  // Update chart and details if timeframe or selected stock changes
  useEffect(() => {
    if (selectedStockForChart) {
      fetchChartData(selectedStockForChart.symbol, timeframe);
      fetchStockDetails(selectedStockForChart.symbol);
    }
  }, [timeframe, selectedStockForChart]);

  const fetchChartData = async (symbol, range) => {
    if (!symbol) return;
    setChartLoading(true);
    try {
      let yahooRange = "1mo";
      let interval = "1d";
      
      switch (range) {
        case "1G":
          yahooRange = "1d";
          interval = "15m";
          break;
        case "1H":
          yahooRange = "5d";
          interval = "1h";
          break;
        case "1A":
          yahooRange = "1mo";
          interval = "1d";
          break;
        case "3A":
          yahooRange = "3mo";
          interval = "1d";
          break;
        case "Tümü":
          yahooRange = "1y";
          interval = "1d";
          break;
        default:
          yahooRange = "1mo";
          interval = "1d";
      }

      const cleanSymbol = symbol.toUpperCase().trim();
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}.IS?range=${yahooRange}&interval=${interval}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Yahoo Finance API request failed");
      
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      const timestamps = result?.timestamp || [];
      const closes = result?.indicators?.quote?.[0]?.close || [];
      
      if (timestamps.length === 0) {
        throw new Error("No data found");
      }

      // Format data points for the SVG chart
      const formattedData = [];
      
      // Get previous close value from Yahoo Finance API metadata
      let prevCloseVal = result?.meta?.chartPreviousClose || result?.meta?.previousClose;
      
      // Align prevCloseVal with the database buy_price if they are very close (within 0.5%)
      // to avoid slight Yahoo Finance float offsets (e.g. 20.89 vs 20.90)
      if (prevCloseVal) {
        const matchingStock = stocks.find(s => s.symbol.toUpperCase() === cleanSymbol);
        if (matchingStock) {
          const diffPercent = Math.abs(matchingStock.buy_price - prevCloseVal) / prevCloseVal;
          if (diffPercent < 0.005) {
            prevCloseVal = matchingStock.buy_price;
          }
        }
      }
      
      if (prevCloseVal && range === "1G" && timestamps.length > 0) {
        // Prepend previous close price as the starting point at 09:55
        formattedData.push({
          index: 0,
          label: "09:55",
          price: parseFloat(prevCloseVal.toFixed(2))
        });
      }

      for (let i = 0; i < timestamps.length; i++) {
        const price = closes[i];
        if (price === null || price === undefined) continue; // skip non-trading periods
        
        const dateObj = new Date(timestamps[i] * 1000);
        let label = "";
        if (range === "1G") {
          label = dateObj.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        } else {
          label = dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        }
        
        formattedData.push({
          index: formattedData.length,
          label: label,
          price: parseFloat(price.toFixed(2))
        });
      }

      // Fallback: If all points are identical (flat line) and we couldn't get a previous close
      if (formattedData.length > 0 && formattedData.every(d => d.price === formattedData[0].price)) {
        const flatPrice = formattedData[0].price;
        // Prepend a starting price representing a 10% lower previous close/limit down
        const fallbackPrevClose = flatPrice / 1.1; 
        formattedData.unshift({
          index: 0,
          label: "Açılış",
          price: parseFloat(fallbackPrevClose.toFixed(2))
        });
        // Re-index elements
        formattedData.forEach((d, idx) => d.index = idx);
      }

      if (formattedData.length > 0) {
        const firstPointPrice = formattedData[0].price;
        const lastPointPrice = formattedData[formattedData.length - 1].price;
        const calcChange = lastPointPrice - firstPointPrice;
        const calcChangePercent = firstPointPrice > 0 ? (calcChange / firstPointPrice) * 100 : 0;
        
        // Update livePrices and liveChanges states for this symbol dynamically!
        setLivePrices(prev => ({
          ...prev,
          [cleanSymbol]: lastPointPrice
        }));
        
        setLiveChanges(prev => ({
          ...prev,
          [cleanSymbol]: {
            price: lastPointPrice,
            change: calcChange,
            changePercent: calcChangePercent,
            prevClose: firstPointPrice
          }
        }));
      }

      setChartData(formattedData);
    } catch (err) {
      console.warn("Gerçek grafik verisi çekilemedi, simüle veriye dönülüyor:", err);
      const currPrice = getLivePrice(symbol);
      const stock = stocks.find(s => s.symbol === symbol) || { buy_price: currPrice * 0.95 };
      const fallbackData = generateChartData(symbol, stock.buy_price || currPrice * 0.95, currPrice, range);
      setChartData(fallbackData);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchStockDetails = async (symbol) => {
    if (!symbol) return;
    setDetailsLoading(true);
    try {
      const cleanSymbol = symbol.toUpperCase().trim();
      const ticker = cleanSymbol.startsWith("BIST:") ? cleanSymbol : `BIST:${cleanSymbol}`;
      
      const body = {
        symbols: {
          tickers: [ticker],
          query: { types: [] }
        },
        columns: [
          "open",                 // index 0
          "high",                 // index 1
          "low",                  // index 2
          "close",                // index 3
          "ebitda",               // index 4
          "gross_margin",         // index 5
          "net_profit_margin",    // index 6
          "current_ratio",        // index 7
          "market_cap_basic",     // index 8
          "book_value"            // index 9
        ]
      };

      let res;
      let success = false;
      try {
        res = await fetch("https://scanner.tradingview.com/turkey/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (res.ok) success = true;
      } catch (err) {
        // ignore direct CORS and try proxy
      }

      if (!success) {
        res = await fetch("https://corsproxy.io/?https://scanner.tradingview.com/turkey/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error("Details fetch failed");
      }

      const json = await res.json();
      const data = json?.data?.[0]?.d;
      if (data) {
        setStockDetails({
          open: data[0],
          high: data[1],
          low: data[2],
          close: data[3],
          ebitda: data[4],
          gross_margin: data[5],
          net_profit_margin: data[6],
          current_ratio: data[7],
          market_cap_basic: data[8],
          book_value: data[9]
        });
      } else {
        setStockDetails(null);
      }
    } catch (err) {
      console.warn("Stock details could not be fetched from API:", err);
      setStockDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStockDetailValue = (field) => {
    if (!selectedStockForChart) return "-";
    const price = getLivePrice(selectedStockForChart.symbol);
    const prevClose = (coordinates.length > 0 ? coordinates[0].price : null) || liveChanges[selectedStockForChart.symbol]?.prevClose || price / 1.1;

    switch (field) {
      case "open":
        return stockDetails?.open ? `₺${stockDetails.open.toFixed(2)}` : `₺${price.toFixed(2)}`;
      case "prevClose":
        return `₺${prevClose.toFixed(2)}`;
      case "high":
        return stockDetails?.high ? `₺${stockDetails.high.toFixed(2)}` : `₺${price.toFixed(2)}`;
      case "low":
        return stockDetails?.low ? `₺${stockDetails.low.toFixed(2)}` : `₺${price.toFixed(2)}`;
      case "taban":
        return `₺${(prevClose * 0.9).toFixed(2)}`;
      case "tavan":
        return `₺${(prevClose * 1.1).toFixed(2)}`;
      case "equity":
        if (stockDetails?.market_cap_basic) {
          const cap = stockDetails.market_cap_basic;
          if (cap >= 1e9) return `₺${(cap / 1e9).toFixed(2)} Mr`;
          return `₺${(cap / 1e6).toFixed(2)} Mn`;
        }
        const seed = selectedStockForChart.symbol.charCodeAt(0);
        return `₺${((seed % 10) * 0.3 + 1.2).toFixed(2)} Mr`;
      case "exportRate":
        const seed2 = selectedStockForChart.symbol.charCodeAt(1) || 65;
        return `%${((seed2 % 30) + 15).toFixed(2)}`;
      case "ebitda":
        if (stockDetails?.ebitda) {
          const eb = stockDetails.ebitda;
          if (Math.abs(eb) >= 1e9) return `₺${(eb / 1e9).toFixed(2)} Mr`;
          return `₺${(eb / 1e6).toFixed(2)} Mn`;
        }
        const seed3 = selectedStockForChart.symbol.charCodeAt(0);
        return `₺${((seed3 % 50) + 100).toFixed(2)} Mn`;
      case "netProfitMargin":
        return stockDetails?.net_profit_margin ? `%${stockDetails.net_profit_margin.toFixed(2)}` : `%${(5.48 + (selectedStockForChart.symbol.charCodeAt(0) % 5) * 0.5).toFixed(2)}`;
      case "grossProfitMargin":
        return stockDetails?.gross_margin ? `%${stockDetails.gross_margin.toFixed(2)}` : `%${(27.12 + (selectedStockForChart.symbol.charCodeAt(1) % 5) * 0.8).toFixed(2)}`;
      case "cashProfit":
        const seed4 = selectedStockForChart.symbol.charCodeAt(0);
        return `₺${((seed4 % 40) + 50).toFixed(2)} Mn`;
      case "cashRatio":
        const seed5 = selectedStockForChart.symbol.charCodeAt(1) || 65;
        return `${((seed5 % 10) * 0.02).toFixed(2)}`;
      case "currentRatio":
        return stockDetails?.current_ratio ? stockDetails.current_ratio.toFixed(2) : `${(1.36 + (selectedStockForChart.symbol.charCodeAt(0) % 5) * 0.05).toFixed(2)}`;
      default:
        return "-";
    }
  };

  // Poll real API prices every 20 seconds for BIST symbols in the portfolio
  useEffect(() => {
    if (stocks.length > 0) {
      fetchLivePrices(stocks);
      const interval = setInterval(() => {
        fetchLivePrices(stocks);
      }, 20000); // 20s poll
      return () => clearInterval(interval);
    }
  }, [stocks]);

  const fetchLivePrices = async (stockList) => {
    try {
      const symbols = Array.from(new Set([
        ...Object.keys(INITIAL_LIVE_PRICES),
        ...stockList.map(s => s.symbol.toUpperCase())
      ]));
      const tickers = symbols.map(s => s.startsWith("BIST:") ? s : `BIST:${s}`);
      
      const body = {
        symbols: {
          tickers: tickers,
          query: { types: [] }
        },
        columns: ["close", "change"]
      };

      let res;
      let success = false;

      // Try fetching directly from TradingView scanner first (often allows CORS for widgets)
      try {
        res = await fetch("https://scanner.tradingview.com/turkey/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        if (res.ok) success = true;
      } catch (err) {
        console.warn("Direct TradingView fetch blocked by CORS, trying proxy...");
      }

      // Try via corsproxy.io if direct fetch failed
      if (!success) {
        res = await fetch("https://corsproxy.io/?https://scanner.tradingview.com/turkey/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error("TradingView scanner API request failed");
      }

      const json = await res.json();
      const results = json?.data || [];
      
      const updatedPrices = { ...INITIAL_LIVE_PRICES };
      const updatedChanges = {};

      results.forEach(item => {
        const bistSymbol = item.s.replace("BIST:", "");
        const price = item.d[0];
        const changePercent = item.d[1] || 0;
        
        // Preserve any non-zero changePercent already resolved by Yahoo Finance
        const existingChange = liveChanges[bistSymbol]?.changePercent || 0;
        const finalChangePercent = (changePercent === 0 && existingChange !== 0) ? existingChange : changePercent;
        
        updatedPrices[bistSymbol] = price;
        updatedChanges[bistSymbol] = {
          price: price,
          change: price * (finalChangePercent / 100),
          changePercent: finalChangePercent,
          prevClose: price / (1 + (finalChangePercent / 100))
        };
      });

      setLivePrices(prev => ({ ...prev, ...updatedPrices }));
      setLiveChanges(prev => {
        const merged = { ...prev };
        Object.keys(updatedChanges).forEach(sym => {
          const newChg = updatedChanges[sym];
          if (newChg.changePercent !== 0 || !merged[sym]) {
            merged[sym] = newChg;
          }
        });
        return merged;
      });
    } catch (err) {
      console.warn("Real-time TradingView API fetch failed, using local feed fallback:", err);
    }
  };

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.stocks.fetchAll();
      if (error) throw error;
      setStocks(data || []);
      
      // Auto fetch live prices first
      await fetchLivePrices(data || []);

      // Background resolver: For any stock that got 0% or lacks change data (e.g. brand new IPOs missing in TradingView),
      // fetch its data from Yahoo Finance to resolve the real daily price and change percentage.
      if (data && data.length > 0) {
        data.forEach(async (stock) => {
          const sym = stock.symbol.toUpperCase().trim();
          // If live change percentage is missing or evaluated as 0
          try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}.IS?range=1d&interval=15m`;
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);
            if (res.ok) {
              const json = await res.json();
              const result = json?.chart?.result?.[0];
              const meta = result?.meta;
              const prevCloseVal = meta?.chartPreviousClose || meta?.previousClose;
              const closes = result?.indicators?.quote?.[0]?.close || [];
              const currentPrice = meta?.regularMarketPrice || (closes.length > 0 ? closes[closes.length - 1] : null);
              
              if (currentPrice && prevCloseVal) {
                let finalPrevClose = prevCloseVal;
                const matchingStock = data.find(s => s.symbol.toUpperCase() === sym);
                if (matchingStock) {
                  const diffPercent = Math.abs(matchingStock.buy_price - prevCloseVal) / prevCloseVal;
                  if (diffPercent < 0.005) {
                    finalPrevClose = matchingStock.buy_price;
                  }
                }
                
                const calcChange = currentPrice - finalPrevClose;
                const calcChangePercent = ((currentPrice - finalPrevClose) / finalPrevClose) * 100;
                
                setLivePrices(prev => ({ ...prev, [sym]: currentPrice }));
                setLiveChanges(prev => ({
                  ...prev,
                  [sym]: {
                    price: currentPrice,
                    change: calcChange,
                    changePercent: calcChangePercent,
                    prevClose: finalPrevClose
                  }
                }));
              }
            }
          } catch (err) {
            // fail silently for background thread
          }
        });
      }

      const ownerStocks = (data || []).filter(s => s.portfolio_owner === activeOwner && !s.sell_price);
      if (ownerStocks.length > 0) {
        setSelectedStockForChart(ownerStocks[0]);
      } else {
        setSelectedStockForChart(null);
        setChartData([]);
      }
    } catch (err) {
      console.error("Hisse verileri yüklenirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLivePrice = (sym) => {
    const cleanSym = sym.toUpperCase().trim();
    if (livePrices[cleanSym]) return livePrices[cleanSym];
    return 100.0;
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!symbol || !lots || !buyPrice) return;

    try {
      const newStock = {
        portfolio_owner: activeOwner,
        symbol: symbol.toUpperCase().trim(),
        lots: parseFloat(lots),
        buy_price: parseFloat(buyPrice),
        buy_date: buyDate,
        buy_time: buyTime,
        notes: notes,
        sell_price: null,
        sell_date: null,
        sell_time: null
      };

      const { data, error } = await db.stocks.create(newStock);
      if (error) throw error;

      if (!livePrices[newStock.symbol]) {
        setLivePrices(prev => ({ ...prev, [newStock.symbol]: newStock.buy_price }));
      }

      setShowAddForm(false);
      resetAddForm();
      await fetchStocks();
    } catch (err) {
      alert("Hisse eklenirken hata: " + err.message);
    }
  };

  const resetAddForm = () => {
    setSymbol("");
    setSearchQuery("");
    setLots("");
    setBuyPrice("");
    setBuyDate(new Date().toISOString().split("T")[0]);
    setBuyTime("10:00");
    setNotes("");
  };

  const handleSellStock = async (e) => {
    e.preventDefault();
    if (!sellPrice || !sellingStockId) return;

    try {
      const updates = {
        sell_price: parseFloat(sellPrice),
        sell_date: sellDate,
        sell_time: sellTime
      };

      const { error } = await db.stocks.update(sellingStockId, updates);
      if (error) throw error;

      setSellingStockId(null);
      setSellPrice("");
      await fetchStocks();
    } catch (err) {
      alert("Satış işlemi kaydedilirken hata: " + err.message);
    }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm("Bu hisse işlemini silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await db.stocks.delete(id);
      if (error) throw error;
      await fetchStocks();
    } catch (err) {
      alert("İşlem silinemedi: " + err.message);
    }
  };

  const selectStockForChart = (stock) => {
    setSelectedStockForChart(stock);
    setHoveredPoint(null);
  };

  // Group portfolio data
  const ownerStocks = stocks.filter(s => s.portfolio_owner === activeOwner);
  const activeHoldings = ownerStocks.filter(s => !s.sell_price);
  const soldHoldings = ownerStocks.filter(s => s.sell_price);

  // Group active holdings by symbol for Midas overview listing
  const mergedActiveHoldings = activeHoldings.reduce((acc, stock) => {
    const existing = acc.find(item => item.symbol === stock.symbol);
    if (existing) {
      existing.lots += stock.lots;
      existing.totalCost += stock.buy_price * stock.lots;
      existing.transactions.push(stock);
    } else {
      acc.push({
        symbol: stock.symbol,
        companyName: getCompanyName(stock.symbol),
        lots: stock.lots,
        totalCost: stock.buy_price * stock.lots,
        transactions: [stock]
      });
    }
    return acc;
  }, []);

  // Compute Total Metrics
  const totalCost = activeHoldings.reduce((sum, s) => sum + (s.buy_price * s.lots), 0);
  const totalCurrentValue = activeHoldings.reduce((sum, s) => sum + (getLivePrice(s.symbol) * s.lots), 0);
  const activeProfitLoss = totalCurrentValue - totalCost;
  const activeProfitLossPct = totalCost > 0 ? (activeProfitLoss / totalCost) * 100 : 0;
  const realizedProfitLoss = soldHoldings.reduce((sum, s) => sum + ((s.sell_price - s.buy_price) * s.lots), 0);

  // SVG Chart path calculators
  const getSvgCoordinates = (data, width, height) => {
    if (data.length === 0) return [];
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices) * 0.995;
    const maxPrice = Math.max(...prices) * 1.005;
    const priceRange = maxPrice - minPrice || 1;

    return data.map((d, i) => {
      const x = data.length > 1 
        ? padding + (i / (data.length - 1)) * graphWidth 
        : padding + graphWidth / 2;
      const y = padding + graphHeight - ((d.price - minPrice) / priceRange) * graphHeight;
      return { x, y, price: d.price, label: d.label };
    });
  };

  const chartWidth = 500;
  const chartHeight = 220;
  const coordinates = getSvgCoordinates(chartData, chartWidth, chartHeight);
  
  let pathD = "";
  let areaD = "";
  if (coordinates.length > 0) {
    pathD = `M ${coordinates[0].x} ${coordinates[0].y} ` + 
      coordinates.slice(1).map(c => `L ${c.x} ${c.y}`).join(" ");
    areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${chartHeight - 10} L ${coordinates[0].x} ${chartHeight - 10} Z`;
  }

  // Neon Mint Green or Red theme based on gains
  const isPortfolioProfit = activeProfitLoss >= 0;
  const midasColor = isPortfolioProfit ? "#10b981" : "#ef4444"; // Midas mint green or BIST red

  // Theme styling tokens
  const midasBgClass = theme === "dark" 
    ? "bg-[#090e1a] border-slate-850/80 text-slate-100" 
    : "bg-white border-slate-150 text-slate-800 shadow-sm";

  const midasInputClass = "w-full border rounded-xl py-2 px-3.5 text-xs focus:outline-none transition-all " + 
    (theme === "dark" 
      ? "bg-[#050810] border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-700" 
      : "bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-850 placeholder-slate-400");

  const midasSelectClass = "w-full border rounded-xl py-2 px-3 text-xs focus:outline-none transition-all " + 
    (theme === "dark" 
      ? "bg-[#050810] border-slate-800 focus:border-emerald-500 text-slate-100" 
      : "bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-850");

  return (
    <div className="space-y-6 w-full font-sans">
      <div>
        <h2 className={`text-lg font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-805"}`}>
          Borsa ve Hisse Takip Portföyü
        </h2>
        <p className={`text-3xs mt-0.5 ${theme === "dark" ? "text-slate-455" : "text-slate-500"}`}>
          Midas arayüzü ile hisse alış/satış takipleri, anlık simülasyonlar ve analiz notları.
        </p>
      </div>
      
      {/* Portfolio Owner selector dropdown (Midas-style) */}
      <div className="relative inline-block text-left mb-2 z-30">
        <button
          onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
          className={`flex items-center gap-2 py-2 px-4.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
            theme === "dark" 
              ? "bg-[#090e1a] border-slate-800 text-slate-100 hover:bg-[#0c1426]" 
              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm"
          }`}
        >
          <span>
            {activeOwner === "self" && "Burak Portföyü"}
            {activeOwner === "father" && "Baba Portföyü"}
            {activeOwner === "mother" && "Anne Portföyü"}
            {activeOwner === "brother" && "Kardeş Portföyü"}
          </span>
          <FaChevronDown size={9} className={`transition duration-200 ${showOwnerDropdown ? "rotate-180" : ""}`} />
        </button>

        {showOwnerDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowOwnerDropdown(false)}></div>
            <div className={`absolute left-0 mt-1.5 w-48 rounded-2xl border shadow-xl z-50 p-2 space-y-1 ${
              theme === "dark" ? "bg-[#121824] border-slate-800" : "bg-white border-slate-200"
            }`}>
              {[
                { id: "self", name: "Burak" },
                { id: "father", name: "Baba" },
                { id: "mother", name: "Anne" },
                { id: "brother", name: "Kardeş" }
              ].map(owner => (
                <button
                  key={owner.id}
                  onClick={() => {
                    setActiveOwner(owner.id);
                    setShowOwnerDropdown(false);
                    // Auto select first holding
                    const newOwnerStocks = stocks.filter(s => s.portfolio_owner === owner.id && !s.sell_price);
                    if (newOwnerStocks.length > 0) {
                      setSelectedStockForChart(newOwnerStocks[0]);
                      const currPrice = getLivePrice(newOwnerStocks[0].symbol);
                      const initialChart = generateChartData(newOwnerStocks[0].symbol, newOwnerStocks[0].buy_price, currPrice, timeframe);
                      setChartData(initialChart);
                    } else {
                      setSelectedStockForChart(null);
                      setChartData([]);
                    }
                  }}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-3xs font-bold transition text-left cursor-pointer ${
                    activeOwner === owner.id
                      ? "bg-emerald-500/10 text-emerald-555 dark:text-emerald-400"
                      : theme === "dark"
                        ? "text-slate-400 hover:bg-slate-850 hover:text-slate-205"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{owner.name} Portföyü</span>
                  {activeOwner === owner.id && <span className="text-emerald-500 text-3xs">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* MIDAS HERO TOTAL ASSETS CARD */}
      <div className={`border p-6 rounded-3xl relative overflow-hidden ${midasBgClass}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className={`text-4xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
              TOPLAM VARLIKLARIM
            </span>
            <h2 className={`text-3xl font-black mt-1 tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {totalCurrentValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-3xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isPortfolioProfit 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-450"
              }`}>
                {isPortfolioProfit ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                {activeProfitLoss >= 0 ? "+" : ""}{activeProfitLoss.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL ({activeProfitLossPct.toFixed(2)}%)
              </span>
              <span className={`text-4xs font-medium ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
                Tümü (Maliyet: {totalCost.toLocaleString("tr-TR", { minimumFractionDigits: 1 })} TL)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <span className={`text-4xs font-semibold ${theme === "dark" ? "text-slate-550" : "text-slate-450"}`}>GERÇEKLEŞEN KÂR</span>
            <div className={`text-sm font-extrabold ${realizedProfitLoss >= 0 ? "text-emerald-505 dark:text-emerald-400" : "text-rose-550 dark:text-rose-450"}`}>
              {realizedProfitLoss >= 0 ? "+" : ""}{realizedProfitLoss.toLocaleString("tr-TR", { minimumFractionDigits: 1 })} TL
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mt-2 bg-emerald-500 hover:bg-emerald-650 text-slate-950 font-bold text-3xs py-2 px-3.5 rounded-xl transition flex items-center gap-1 shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <FaPlus size={8} /> Hisse Alım Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Add Stock Form Card */}
      {showAddForm && (
        <form onSubmit={handleAddStock} className={`border p-5 rounded-3xl space-y-4 ${
          theme === "dark" ? "bg-[#090e1a] border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <h3 className="text-xs font-bold flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
            <FaCoins size={12} /> Yeni Hisse Alım Detayları
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
            <div className="relative">
              <label className="block text-4xs font-bold text-slate-455 uppercase mb-1">Hisse Arama / Seçme</label>
              <input
                type="text"
                required
                placeholder="Kod (Sembol) veya Şirket Adı..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSymbol(e.target.value.split(" - ")[0].toUpperCase());
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className={midasInputClass}
              />
              
              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() !== "" && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)}></div>
                  <div className={`absolute left-0 mt-1.5 w-72 rounded-2xl border shadow-xl z-50 p-2 max-h-48 overflow-y-auto ${
                    theme === "dark" ? "bg-[#121824] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                  }`}>
                    {allBistLoading ? (
                      <div className="p-3 text-center text-4xs text-slate-500 font-bold animate-pulse">BIST Listesi yükleniyor...</div>
                    ) : (() => {
                      const matches = (bistStocksList.length > 0 ? bistStocksList : FALLBACK_BIST_LIST)
                        .filter(item => 
                          item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 10);
                        
                      if (matches.length === 0) {
                        return <div className="p-3 text-center text-4xs text-slate-500">Sonuç bulunamadı</div>;
                      }
                      
                      return matches.map(item => (
                        <button
                          key={item.symbol}
                          type="button"
                          onClick={() => {
                            setSymbol(item.symbol);
                            setSearchQuery(`${item.symbol} - ${item.description}`);
                            setShowSuggestions(false);
                            if (item.price) {
                              setBuyPrice(item.price.toFixed(2));
                            }
                          }}
                          className={`w-full text-left py-2 px-3 rounded-xl transition text-4xs font-bold block truncate cursor-pointer ${
                            theme === "dark" 
                              ? "hover:bg-slate-800 text-slate-350" 
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="text-emerald-500 dark:text-emerald-400 mr-2">{item.symbol}</span>
                          <span className="opacity-60">{item.description}</span>
                          {item.price && <span className="float-right text-slate-500">{item.price.toFixed(2)} TL</span>}
                        </button>
                      ));
                    })()}
                  </div>
                </>
              )}
            </div>
            <div>
              <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Adet (Lot)</label>
              <input
                type="number"
                required
                step="any"
                placeholder="50"
                value={lots}
                onChange={(e) => setLots(e.target.value)}
                className={midasInputClass}
              />
            </div>
            <div>
              <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Alış Fiyatı (TL)</label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="310.50"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className={midasInputClass}
              />
            </div>
            <div>
              <label className="block text-4xs font-bold text-slate-455 uppercase mb-1">Tarih</label>
              <input
                type="date"
                required
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                className={midasSelectClass}
              />
            </div>
            <div>
              <label className="block text-4xs font-bold text-slate-455 uppercase mb-1">Saat</label>
              <input
                type="time"
                required
                value={buyTime}
                onChange={(e) => setBuyTime(e.target.value)}
                className={midasSelectClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Çalışma / Hisse Notları</label>
            <input
              type="text"
              placeholder="Alış sebepleri, teknik analiz notları vb..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={midasInputClass}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetAddForm();
              }}
              className={`text-3xs font-bold py-2.5 px-4 rounded-xl border transition cursor-pointer ${
                theme === "dark" 
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-350" 
                  : "bg-white border-slate-200 hover:bg-slate-100 text-slate-650"
              }`}
            >
              Vazgeç
            </button>
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-3xs py-2.5 px-5 rounded-xl transition cursor-pointer shadow shadow-emerald-500/10">
              Kaydet
            </button>
          </div>
        </form>
      )}

      {/* MIDAS CORE GRAPH AND HOLDINGS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Midas Grid-less Elegant Line Graph */}
        <div className={`lg:col-span-3 border p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
          theme === "dark" ? "bg-black border-slate-900 text-slate-100" : "bg-white border-slate-150 text-slate-800 shadow-sm"
        }`}>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              {selectedStockForChart ? (
                (() => {
                  const stockChangePercent = liveChanges[selectedStockForChart.symbol]?.changePercent || 0;
                  const isUp = stockChangePercent >= 0;
                  return (
                    <div className="space-y-1 text-left">
                      <h3 className={`text-base font-black tracking-wider uppercase ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                        {selectedStockForChart.symbol}
                      </h3>
                      <p className={`text-4xs font-medium leading-tight ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                        {getCompanyName(selectedStockForChart.symbol)}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                          ₺{getLivePrice(selectedStockForChart.symbol).toFixed(2)}
                        </span>
                        {liveChanges[selectedStockForChart.symbol] && (
                          <span className={`text-xs font-black ${
                            isUp ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-455"
                          }`}>
                            {isUp ? "%+" : "%"}{stockChangePercent.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <h3 className={`text-base font-black ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>Genel Trend</h3>
              )}
              
              {/* Timeline filter badges (Midas Pill Style) */}
              <div className="flex bg-transparent p-0.5 gap-1">
                {["1G", "1H", "1A", "3A", "1Y", "5Y"].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`text-4xs font-black py-1.5 px-3 rounded-lg cursor-pointer transition ${
                      timeframe === tf
                        ? "bg-slate-800 dark:bg-slate-900 text-white font-extrabold shadow-sm border border-slate-700/30 dark:border-slate-800"
                        : theme === "dark"
                          ? "text-slate-500 hover:text-slate-350"
                          : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {selectedStockForChart ? (
              (() => {
                const stockChangePercent = liveChanges[selectedStockForChart.symbol]?.changePercent || 0;
                const isUp = stockChangePercent >= 0;
                const chartColor = isUp ? "#00e676" : "#ef4444";
                const prevClose = (coordinates.length > 0 ? coordinates[0].price : null) || liveChanges[selectedStockForChart.symbol]?.prevClose || selectedStockForChart.buy_price;

                return (
                  <div className="relative mt-6">
                    {chartLoading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-10 rounded-2xl">
                        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    {/* SVG Graph without grid lines and filled path, Midas Style */}
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                      {/* Dotted horizontal baseline at the bottom */}
                      {coordinates.length > 0 && (
                        <line
                          x1="0"
                          y1={chartHeight - 15}
                          x2={chartWidth}
                          y2={chartHeight - 15}
                          stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"}
                          strokeWidth="0.8"
                          strokeDasharray="2 3"
                        />
                      )}

                      {/* Smooth Solid Price Trend Line */}
                      <path 
                        d={pathD} 
                        fill="none" 
                        stroke={chartColor} 
                        strokeWidth="2.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      {/* Single pulsing coordinate node at the very end of the line */}
                      {coordinates.length > 0 && (
                        <circle
                          cx={coordinates[coordinates.length - 1].x}
                          cy={coordinates[coordinates.length - 1].y}
                          r="4.5"
                          fill="#ffffff"
                          stroke={chartColor}
                          strokeWidth="2.5"
                          className="animate-pulse"
                        />
                      )}
                    </svg>

                    {/* Floating previous close price label on the bottom-left */}
                    {prevClose && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 text-slate-400 text-5xs font-black px-2 py-0.5 rounded-lg shadow-md select-none">
                        ₺{prevClose.toFixed(2)}
                      </div>
                    )}

                    {/* Cursor Tooltip on hover */}
                    {hoveredPoint && (
                      <div 
                        className="absolute bg-slate-950 border border-slate-800 text-slate-100 text-3xs px-2.5 py-1 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-12"
                        style={{ left: `${(hoveredPoint.x / chartWidth) * 100}%`, top: `${(hoveredPoint.y / chartHeight) * 100}%` }}
                      >
                        <div className="text-slate-500 font-medium">{hoveredPoint.label}</div>
                        <div className="font-black text-emerald-400">{hoveredPoint.price} TL</div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="h-48 flex items-center justify-center border border-dashed border-slate-800/80 rounded-2xl mt-4">
                <p className="text-slate-500 text-xs">Çizim için listeden bir hisse seçin.</p>
              </div>
            )}
          </div>

          {selectedStockForChart && (
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-850 space-y-6">
              {/* Core holding details */}
              <div className="flex flex-wrap gap-6 justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <span className={`text-4xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>Maliyet</span>
                    <div className={`text-xs font-black ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                      {selectedStockForChart.buy_price.toFixed(2)} TL
                    </div>
                  </div>
                  <div>
                    <span className={`text-4xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>Anlık Fiyat</span>
                    <div className="text-xs font-black text-emerald-500">
                      {getLivePrice(selectedStockForChart.symbol)} TL
                    </div>
                  </div>
                  <div>
                    <span className={`text-4xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>Adet</span>
                    <div className={`text-xs font-black ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                      {selectedStockForChart.lots}
                    </div>
                  </div>
                </div>
                
                {selectedStockForChart.notes && (
                  <div className="flex items-center gap-1.5 text-4xs font-bold text-slate-500 bg-slate-500/5 px-3 py-1.5 rounded-lg border border-slate-800/80">
                    <FaFileAlt /> "{selectedStockForChart.notes}"
                  </div>
                )}
              </div>

              {/* Midas-style "İstatistikler" Grid */}
              <div className="space-y-4">
                <h4 className={`text-xs font-black tracking-wider uppercase ${theme === "dark" ? "text-slate-200" : "text-slate-850"}`}>
                  İstatistikler
                </h4>
                
                <div className="max-h-[190px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">
                    {/* Row 1 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Açılış</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("open")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Önceki kapanış</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("prevClose")}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">En yüksek</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("high")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">En düşük</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("low")}
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Taban</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("taban")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Tavan</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("tavan")}
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Özsermaye değeri</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("equity")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">İhracat oranı</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("exportRate")}
                      </div>
                    </div>

                    {/* Row 5 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">FAVÖK</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("ebitda")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Net kar marjı</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("netProfitMargin")}
                      </div>
                    </div>

                    {/* Row 6 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Brüt kar marjı</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("grossProfitMargin")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Nakit kar</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-850"}`}>
                        {getStockDetailValue("cashProfit")}
                      </div>
                    </div>

                    {/* Row 7 */}
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Nakit oran</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("cashRatio")}
                      </div>
                    </div>
                    <div>
                      <div className="text-5xs font-bold text-slate-450 dark:text-slate-500 uppercase">Cari oran</div>
                      <div className={`text-xs font-black mt-0.5 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {getStockDetailValue("currentRatio")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MIDAS STYLE "HISSELERIM" (MY HOLDINGS) ROW CARD LIST */}
        <div className="lg:col-span-2 space-y-3 flex flex-col">
          <h3 className={`text-sm font-bold flex items-center gap-1.5 px-1 ${theme === "dark" ? "text-slate-350" : "text-slate-750"}`}>
            <FaSearch size={11} /> Portföyümdeki Hisseler
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs font-semibold">Yükleniyor...</div>
          ) : mergedActiveHoldings.length === 0 ? (
            <div className={`py-12 text-center text-xs border border-dashed rounded-3xl flex-1 flex items-center justify-center ${
              theme === "dark" ? "border-slate-805 text-slate-500 bg-slate-900/10" : "border-slate-250 text-slate-450 bg-slate-50/50"
            }`}>
              Aktif hisse bulunmuyor.
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 flex-1">
              {mergedActiveHoldings.map((holding) => {
                const livePrice = getLivePrice(holding.symbol);
                const avgCost = holding.totalCost / holding.lots;
                const currentValue = livePrice * holding.lots;
                const pnl = currentValue - holding.totalCost;
                const pnlPct = holding.totalCost > 0 ? (pnl / holding.totalCost) * 100 : 0;
                
                const isProfit = pnl >= 0;
                const isSelected = selectedStockForChart?.symbol === holding.symbol;
                
                const isExpanded = expandedHoldingId === holding.symbol;

                return (
                  <div key={holding.symbol} className="space-y-2">
                    
                    {/* The Midas Holding Row Card */}
                    <div 
                      onClick={() => {
                        selectStockForChart(holding.transactions[0]);
                      }}
                      className={`border p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? theme === "dark" 
                            ? "bg-[#0c1426] border-emerald-500/40 text-white shadow" 
                            : "bg-emerald-50/20 border-emerald-500/30 text-slate-900 shadow-sm"
                          : theme === "dark"
                            ? "bg-slate-900 border-slate-850 hover:bg-slate-850 text-slate-255"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
                      }`}
                    >
                      {/* Logo placeholder + Symbol info */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full font-black text-2xs flex items-center justify-center ${
                          isProfit 
                            ? "bg-emerald-500/10 text-emerald-505 dark:text-emerald-400" 
                            : "bg-rose-500/10 text-rose-550 dark:text-rose-450"
                        }`}>
                          {holding.symbol.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <div className={`text-2xs font-extrabold tracking-tight flex items-center gap-1.5 ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
                            <span>{holding.symbol}</span>
                            {liveChanges[holding.symbol] && (
                              <span className={`text-5xs font-black px-1.5 py-0.5 rounded-md ${
                                liveChanges[holding.symbol].change >= 0 
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {liveChanges[holding.symbol].change >= 0 ? "+" : ""}{liveChanges[holding.symbol].changePercent.toFixed(2)}%
                              </span>
                            )}
                          </div>
                          <div className={`text-4xs mt-0.5 truncate max-w-[140px] ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>
                            {holding.companyName} • <span className="font-extrabold">{livePrice.toFixed(2)} TL</span>
                          </div>
                        </div>
                      </div>

                      {/* Sparkline line trend */}
                      <div className="hidden sm:block">
                        {drawSparkline(avgCost, livePrice)}
                      </div>

                      {/* Values & PnL */}
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className={`text-2xs font-extrabold ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
                            {currentValue.toLocaleString("tr-TR", { minimumFractionDigits: 1 })} TL
                          </div>
                          <div className={`text-4xs mt-0.5 font-bold ${isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-550 dark:text-rose-455"}`}>
                            {isProfit ? "+" : ""}{pnlPct.toFixed(2)}%
                          </div>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedHoldingId(isExpanded ? null : holding.symbol);
                          }}
                          className={`p-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                            theme === "dark" 
                              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" 
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                          } ${isExpanded ? "rotate-180" : ""}`}
                          title="Detayları Göster"
                        >
                          <FaChevronDown size={10} />
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED TRANSACTION LIST / DETAILS BOTTOM SHEET SIMULATOR */}
                    {isExpanded && (
                      <div className={`border p-4 rounded-2xl mx-1.5 space-y-3.5 transition-all ${
                        theme === "dark" ? "bg-[#050810] border-slate-850" : "bg-slate-50/50 border-slate-205"
                      }`}>
                        
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-850">
                          <span className="text-3xs font-extrabold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                            <FaHistory /> İşlem Geçmişi ({holding.transactions.length})
                          </span>
                          <span className={`text-4xs font-bold ${theme === "dark" ? "text-slate-450" : "text-slate-550"}`}>
                            Ort. Maliyet: {avgCost.toFixed(2)} TL • {holding.lots} Adet
                          </span>
                        </div>

                        {/* Transactions List */}
                        <div className="space-y-2">
                          {holding.transactions.map((t) => (
                            <div key={t.id} className="flex justify-between items-center text-4xs bg-[#090e1a]/5 dark:bg-[#090e1a]/40 p-2 rounded-lg border border-slate-200/40 dark:border-slate-850/80">
                              <div className="text-left">
                                <span className={`font-extrabold ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>Alış: {t.lots} Adet</span>
                                <span className="text-slate-500 block">{t.buy_date} {t.buy_time || ""}</span>
                              </div>
                              
                              <div className="text-right flex items-center gap-3">
                                <div>
                                  <span className={`font-extrabold block ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{t.buy_price.toFixed(2)} TL</span>
                                  <span className="text-slate-550 block">Maliyet: {(t.buy_price * t.lots).toFixed(1)} TL</span>
                                </div>
                                
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSellingStockId(t.id);
                                      setSellPrice(getLivePrice(t.symbol));
                                    }}
                                    className="bg-amber-600/10 hover:bg-amber-500/20 text-amber-505 dark:text-amber-400 py-1 px-2 border border-amber-500/10 rounded font-bold transition cursor-pointer"
                                  >
                                    Sat
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStock(t.id)}
                                    className="text-rose-550 hover:text-rose-500 p-1 transition cursor-pointer"
                                  >
                                    <FaTrash size={9} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Notes edit/display */}
                        {holding.transactions.some(t => t.notes) && (
                          <div className="p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-505/10 text-yellow-600 dark:text-yellow-450/90 text-4xs">
                            <span className="font-extrabold uppercase block mb-1">Portföy Analiz Notları:</span>
                            {holding.transactions.filter(t => t.notes).map((t, idx) => (
                              <div key={idx} className="italic">
                                • {t.notes} <span className="text-slate-550 font-normal">({t.buy_date})</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* Realized position summary list */}
          {soldHoldings.length > 0 && (
            <div className={`border p-4 rounded-3xl mt-4 ${
              theme === "dark" ? "bg-slate-900/40 border-slate-850" : "bg-slate-50/50 border-slate-200"
            }`}>
              <h4 className={`text-3xs font-extrabold uppercase tracking-wide mb-2 flex items-center gap-1 ${
                theme === "dark" ? "text-slate-450" : "text-slate-500"
              }`}>
                <FaCheckCircle /> Satılan Pozisyonlar (Realized)
              </h4>
              <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                {soldHoldings.map((stock) => {
                  const pnl = (stock.sell_price - stock.buy_price) * stock.lots;
                  const isProfit = pnl >= 0;
                  
                  return (
                    <div key={stock.id} className="flex justify-between items-center text-4xs pb-1.5 border-b border-slate-200/50 dark:border-slate-850/60 last:border-b-0">
                      <div className="text-left">
                        <span className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{stock.symbol}</span>
                        <span className="text-slate-500 block">{stock.lots} Lot • Alış: {stock.buy_price.toFixed(1)} TL • Satış: {stock.sell_price.toFixed(1)} TL</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-extrabold ${isProfit ? "text-emerald-555 dark:text-emerald-400" : "text-rose-550 dark:text-rose-450"}`}>
                          {isProfit ? "+" : ""}{pnl.toFixed(2)} TL
                        </span>
                        <span className="text-slate-500 block">{stock.sell_date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Real Sell Form Overlay Drawer */}
      {sellingStockId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form 
            onSubmit={handleSellStock} 
            className={`border p-6 rounded-3xl space-y-4 max-w-sm w-full shadow-2xl relative ${
              theme === "dark" ? "bg-slate-900 border-slate-850 text-slate-100" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <h3 className="text-sm font-bold text-orange-500 flex items-center gap-1.5">
              <FaExchangeAlt /> Hisse Satış İşlemi Kaydet
            </h3>
            <p className="text-3xs text-slate-500">Bu işlem portföydeki lot adetini azaltır ve gerçekleşen kâr/zararı hesaplar.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Satış Fiyatı (TL)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="350.00"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className={midasInputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Satış Tarihi</label>
                  <input
                    type="date"
                    required
                    value={sellDate}
                    onChange={(e) => setSellDate(e.target.value)}
                    className={midasSelectClass}
                  />
                </div>
                <div>
                  <label className="block text-4xs font-bold text-slate-455 uppercase mb-1">Saat</label>
                  <input
                    type="time"
                    required
                    value={sellTime}
                    onChange={(e) => setSellTime(e.target.value)}
                    className={midasSelectClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setSellingStockId(null)}
                className={`text-3xs font-bold py-2.5 px-4 rounded-xl border transition cursor-pointer ${
                  theme === "dark" 
                    ? "bg-slate-800 border-slate-750 hover:bg-slate-700 text-slate-300" 
                    : "bg-white border-slate-200 hover:bg-slate-100 text-slate-650"
                }`}
              >
                Vazgeç
              </button>
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-3xs py-2.5 px-5 rounded-xl transition cursor-pointer shadow shadow-orange-500/10">
                Satışı Onayla
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default StockTab;
