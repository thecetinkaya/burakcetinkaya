import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { 
  FaBookOpen, FaBullseye, FaCalendarCheck, FaClock, FaPlus, FaTrash, 
  FaCheckCircle, FaRunning, FaArrowLeft, FaArrowRight, FaTasks, FaClipboardList,
  FaCalendarAlt, FaChevronDown, FaChevronUp, FaInfoCircle, FaHourglassHalf, FaChartLine
} from "react-icons/fa";
import GeographyMapQuiz from "./GeographyMapQuiz";

// Subject styling map matching Midas theme palette
const SUBJECT_COLORS = {
  "Coğrafya": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "Tarih": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "Türkçe": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Matematik": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "Vatandaşlık": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  "Güncel Bilgiler": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  "Eğitim Bilimleri": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
};

const KpssTab = ({ theme }) => {
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [subTab, setSubTab] = useState("overview"); // "overview" | "map"

  // Solved Questions Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("Coğrafya");
  const [solved, setSolved] = useState("");
  const [target, setTarget] = useState("100");
  const [trials, setTrials] = useState("");
  const [notes, setNotes] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Kanban Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Coğrafya");
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeOverColumn, setActiveOverColumn] = useState(null); // 'todo', 'in_progress', 'done'

  // Tooltip/Hover state for SVG trend graph
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchTasks();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.kpss.fetchAll();
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("KPSS kayıtları yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setTasksLoading(true);
    try {
      const { data, error } = await db.kpss_tasks.fetchAll();
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error("Kanban görevleri yüklenirken hata:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!solved && !trials) return;

    try {
      const record = {
        date,
        subject,
        questions_solved: solved ? parseInt(solved) : 0,
        target_questions: target ? parseInt(target) : 0,
        trials_solved: trials ? parseInt(trials) : 0,
        notes
      };

      const { error } = await db.kpss.create(record);
      if (error) throw error;

      setShowAddForm(false);
      resetLogForm();
      await fetchLogs();
    } catch (err) {
      alert("Kayıt eklenirken hata: " + err.message);
    }
  };

  const resetLogForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setSolved("");
    setTarget("100");
    setTrials("");
    setNotes("");
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Bu çalışma kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await db.kpss.delete(id);
      if (error) throw error;
      await fetchLogs();
    } catch (err) {
      alert("Kayıt silinemedi: " + err.message);
    }
  };

  // Kanban operations
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const task = {
        title: newTaskTitle.trim(),
        subject: newTaskSubject,
        status: "todo"
      };

      const { error } = await db.kpss_tasks.create(task);
      if (error) throw error;

      setNewTaskTitle("");
      setShowTaskForm(false);
      await fetchTasks();
    } catch (err) {
      alert("Görev eklenirken hata: " + err.message);
    }
  };



  const handleMoveTask = async (id, currentStatus, direction) => {
    let nextStatus = currentStatus;
    if (direction === "right") {
      if (currentStatus === "todo") nextStatus = "in_progress";
      else if (currentStatus === "in_progress") nextStatus = "done";
    } else if (direction === "left") {
      if (currentStatus === "done") nextStatus = "in_progress";
      else if (currentStatus === "in_progress") nextStatus = "todo";
    }

    if (nextStatus === currentStatus) return;

    try {
      const { error } = await db.kpss_tasks.update(id, { status: nextStatus });
      if (error) throw error;
      await fetchTasks();
    } catch (err) {
      console.error("Görev güncellenemedi:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await db.kpss_tasks.delete(id);
      if (error) throw error;
      await fetchTasks();
    } catch (err) {
      alert("Görev silinemedi: " + err.message);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, status) => {
    e.preventDefault();
    setActiveOverColumn(status);
  };

  const handleDragLeave = () => {
    setActiveOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      // Optimistic update for instant responsiveness
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));

      try {
        const { error } = await db.kpss_tasks.update(taskId, { status: targetStatus });
        if (error) throw error;
      } catch (err) {
        console.error("Sürükle bırak güncellenirken hata oluştu:", err);
        await fetchTasks(); // rollback on error
      }
    }
    setDraggedTaskId(null);
  };

  // Metrics calculations
  const totalSolved = logs.reduce((sum, r) => sum + (r.questions_solved || 0), 0);
  const totalTrials = logs.reduce((sum, r) => sum + (r.trials_solved || 0), 0);
  
  // Weekly calculations
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyLogs = logs.filter(r => new Date(r.date) >= oneWeekAgo);
  const weeklySolved = weeklyLogs.reduce((sum, r) => sum + (r.questions_solved || 0), 0);
  const weeklyTarget = weeklyLogs.reduce((sum, r) => sum + (r.target_questions || 0), 0);
  const weeklyProgressPct = weeklyTarget > 0 ? (weeklySolved / weeklyTarget) * 100 : 0;

  // Generate SVG trend chart data (similar to Midas Stock Chart)
  const getTrendData = () => {
    // Group questions by date
    const grouped = logs.reduce((acc, log) => {
      const dateStr = log.date;
      acc[dateStr] = (acc[dateStr] || 0) + (log.questions_solved || 0);
      return acc;
    }, {});
    
    // Sort dates ascending
    const sortedDates = Object.keys(grouped).sort();
    
    // Take the last 8 active study days for a clean visualization
    return sortedDates.slice(-8).map((date, idx) => ({
      index: idx,
      label: date.split("-").slice(1).reverse().join("/"), // DD/MM format
      price: grouped[date] // Treat questions solved as "price/value"
    }));
  };

  const trendData = getTrendData();

  // SVG Chart path calculation (Midas-style area/line graph)
  const chartWidth = 500;
  const chartHeight = 180;
  
  const getSvgCoordinates = (data, width, height) => {
    if (data.length === 0) return [];
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const values = data.map(d => d.price);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05 || 10;
    const valRange = maxVal - minVal || 1;

    return data.map((d, i) => {
      const x = data.length > 1 
        ? padding + (i / (data.length - 1)) * graphWidth 
        : padding + graphWidth / 2;
      const y = padding + graphHeight - ((d.price - minVal) / valRange) * graphHeight;
      return { x, y, price: d.price, label: d.label };
    });
  };

  const coordinates = getSvgCoordinates(trendData, chartWidth, chartHeight);
  
  let pathD = "";
  let areaD = "";
  if (coordinates.length > 0) {
    pathD = `M ${coordinates[0].x} ${coordinates[0].y} ` + 
      coordinates.slice(1).map(c => `L ${c.x} ${c.y}`).join(" ");
    areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${chartHeight - 15} L ${coordinates[0].x} ${chartHeight - 15} Z`;
  }

  // Theme styling tokens (Midas Theme)
  const cardClass = "border rounded-3xl p-6 transition-all duration-300 " + 
    (theme === "dark" 
      ? "bg-[#0c1322] border-slate-850/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-slate-100" 
      : "bg-white border-slate-150 text-slate-800 shadow-sm text-slate-800");

  const inputClass = "w-full border rounded-xl py-2 px-3.5 text-xs focus:outline-none transition-all " + 
    (theme === "dark" 
      ? "bg-[#060a12] border-slate-800 focus:border-purple-500 text-slate-100 placeholder-slate-700" 
      : "bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-850 placeholder-slate-400");

  const selectClass = "w-full border rounded-xl py-2 px-3 text-xs focus:outline-none transition-all " + 
    (theme === "dark" 
      ? "bg-[#060a12] border-slate-800 focus:border-purple-500 text-slate-100" 
      : "bg-slate-50 border-slate-200 focus:border-purple-500 text-slate-850");

  return (
    <div className="space-y-8 w-full font-sans">
      
      {/* Premium Header */}
      <div>
        <h2 className={`text-xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-850"}`}>
          KPSS Ders Çalışma ve Deneme Analitiği
        </h2>
        <p className={`text-xs mt-0.5 ${theme === "dark" ? "text-slate-455" : "text-slate-500"}`}>
          Midas tarzı grafikler, günlük soru hedefleri ve sürükle-bırak Kanban çalışma planlayıcı.
        </p>
      </div>

      {/* Sub-tab selection */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-px">
        <button
          onClick={() => setSubTab("overview")}
          className={`pb-2.5 px-2 text-2xs font-extrabold uppercase tracking-wider transition border-b-2 cursor-pointer ${
            subTab === "overview"
              ? "border-[#13d179] text-[#13d179]"
              : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          Çalışma Analitiği
        </button>
        <button
          onClick={() => setSubTab("map")}
          className={`pb-2.5 px-2 text-2xs font-extrabold uppercase tracking-wider transition border-b-2 cursor-pointer ${
            subTab === "map"
              ? "border-[#13d179] text-[#13d179]"
              : "border-transparent text-slate-500 hover:text-slate-350"
          }`}
        >
          Coğrafya Harita Çalışması (İnteraktif)
        </button>
      </div>

      {subTab === "map" ? (
        <GeographyMapQuiz theme={theme} />
      ) : (
        <>
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Solved */}
        <div className={`border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] ${
          theme === "dark" ? "bg-[#0c1322] border-slate-850/80 shadow-md" : "bg-white border-slate-150 shadow-sm"
        }`}>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FaBookOpen size={20} />
          </div>
          <div>
            <p className={`text-3xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
              Toplam Soru Çözümü
            </p>
            <h4 className={`text-base font-black tracking-tight mt-0.5 ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
              {totalSolved.toLocaleString("tr-TR")} Soru
            </h4>
          </div>
        </div>

        {/* Weekly Solved */}
        <div className={`border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] ${
          theme === "dark" ? "bg-[#0c1322] border-slate-850/80 shadow-md" : "bg-white border-slate-150 shadow-sm"
        }`}>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <FaBullseye size={20} />
          </div>
          <div>
            <p className={`text-3xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
              Haftalık Soru
            </p>
            <h4 className={`text-base font-black tracking-tight mt-0.5 ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
              {weeklySolved} Soru
            </h4>
          </div>
        </div>

        {/* Total Trials */}
        <div className={`border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] ${
          theme === "dark" ? "bg-[#0c1322] border-slate-850/80 shadow-md" : "bg-white border-slate-150 shadow-sm"
        }`}>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FaCalendarCheck size={20} />
          </div>
          <div>
            <p className={`text-3xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
              Çözülen Deneme
            </p>
            <h4 className={`text-base font-black tracking-tight mt-0.5 ${theme === "dark" ? "text-slate-100" : "text-slate-850"}`}>
              {totalTrials} Deneme
            </h4>
          </div>
        </div>

        {/* Target Progress */}
        <div className={`border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] ${
          theme === "dark" ? "bg-[#0c1322] border-slate-850/80 shadow-md" : "bg-white border-slate-150 shadow-sm"
        }`}>
          <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-500 dark:text-orange-400">
            <FaRunning size={20} />
          </div>
          <div className="flex-grow">
            <p className={`text-3xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
              Haftalık Hedef
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-full h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(weeklyProgressPct, 100)}%` }} 
                />
              </div>
              <span className={`text-2xs font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                {weeklyProgressPct.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Midas-style SVG Chart & Study logger */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: SVG Performance Chart & Subject distribution */}
        <div className={`${cardClass} xl:col-span-2 space-y-6 flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                <FaChartLine className="text-purple-600 dark:text-purple-400" /> Soru Performans Analizi (Son Gelişmeler)
              </h3>
              <span className="text-4xs text-slate-500 font-medium">Son 8 Çalışma Günü</span>
            </div>

            {/* SVG Trend Wave Chart */}
            <div className={`relative flex items-center justify-center border rounded-2xl p-4 overflow-hidden ${
              theme === "dark" ? "bg-[#060a12] border-slate-850/60" : "bg-slate-50/50 border-slate-100"
            }`}>
              {trendData.length < 2 ? (
                <div className="py-14 text-center text-3xs text-slate-400 font-semibold space-y-2">
                  <FaInfoCircle className="mx-auto text-slate-500" size={16} />
                  <p>Grafik çizilebilmesi için en az 2 gün soru çözüm kaydı olmalıdır.</p>
                </div>
              ) : (
                <div className="w-full h-[180px] relative">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="kpssTrendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="20" y1="35" x2="480" y2="35" stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="0.8" strokeDasharray="3 3" />
                    <line x1="20" y1="90" x2="480" y2="90" stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="0.8" strokeDasharray="3 3" />
                    <line x1="20" y1="145" x2="480" y2="145" stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="0.8" strokeDasharray="3 3" />

                    {/* Gradient Area under curve */}
                    <path d={areaD} fill="url(#kpssTrendGradient)" />

                    {/* Smooth Neon Line Path */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />

                    {/* Coordinate Nodes */}
                    {coordinates.map((pt, idx) => (
                      <g key={idx}>
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={hoveredPoint?.index === idx ? "6" : "4.5"} 
                          fill={theme === "dark" ? "#060a12" : "#ffffff"} 
                          stroke="#8b5cf6" 
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredPoint({ ...pt, index: idx })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Interactive Dynamic Tooltip */}
                  {hoveredPoint && (
                    <div 
                      className={`absolute z-10 p-2.5 rounded-xl border shadow-xl text-3xs font-bold pointer-events-none transition-all duration-150 ${
                        theme === "dark" 
                          ? "bg-[#0c1322] border-slate-800 text-slate-100" 
                          : "bg-white border-slate-200 text-slate-850 shadow-md"
                      }`}
                      style={{
                        left: `${(hoveredPoint.x / chartWidth) * 90}%`,
                        top: `${(hoveredPoint.y / chartHeight) * 70}%`
                      }}
                    >
                      <div className="text-slate-500 text-4xs mb-0.5">{hoveredPoint.label}</div>
                      <div className="text-purple-600 dark:text-purple-400">{hoveredPoint.price} Soru Çözüldü</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subject Pills Distribution */}
          <div>
            <h4 className="text-3xs font-bold text-slate-500 uppercase tracking-widest mb-3">Derslere Göre Toplam Dağılım</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {Object.keys(SUBJECT_COLORS).map(sub => {
                const subLogs = logs.filter(l => l.subject === sub);
                const subSolved = subLogs.reduce((sum, r) => sum + (r.questions_solved || 0), 0);
                
                return (
                  <div 
                    key={sub} 
                    className={`border p-2.5 rounded-xl text-center space-y-1 ${
                      theme === "dark" ? "bg-[#060a12]/50 border-slate-900" : "bg-slate-50/50 border-slate-100 shadow-3xs"
                    }`}
                  >
                    <div className="truncate text-4xs font-bold text-slate-500">{sub}</div>
                    <div className={`text-xs font-black truncate ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                      {subSolved}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Study Tracker Timeline & Form */}
        <div className={cardClass}>
          <div className="h-full flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "dark" ? "text-slate-200" : "text-slate-855"}`}>
                  <FaClipboardList className="text-purple-600 dark:text-purple-400" /> Günlük Çalışma Günlüğü
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-purple-650 hover:bg-purple-600 text-white text-3xs font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <FaPlus size={7} /> Kaydet
                </button>
              </div>

              {/* Add Study Log Form */}
              {showAddForm && (
                <form onSubmit={handleAddLog} className={`border p-4 rounded-2xl mb-4 space-y-3.5 ${
                  theme === "dark" ? "bg-[#060a12] border-slate-850" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Tarih</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={selectClass}
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Ders Konusu</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={selectClass}
                      >
                        {Object.keys(SUBJECT_COLORS).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Soru</label>
                      <input
                        type="number"
                        placeholder="80"
                        value={solved}
                        onChange={(e) => setSolved(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Hedef</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Deneme</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={trials}
                        onChange={(e) => setTrials(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Konu Detayı ve Notlar</label>
                    <input
                      type="text"
                      placeholder="Osmanlı gerileme dönemi soru çözümü..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)} 
                      className={`flex-1 font-bold text-xs py-2 rounded-xl border transition ${
                        theme === "dark" 
                          ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      İptal
                    </button>
                    <button type="submit" className="flex-grow bg-purple-600 hover:bg-purple-550 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer">
                      Kaydet
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline Scrollable List */}
              {loading ? (
                <div className="py-12 flex justify-center text-slate-450 text-xs font-semibold">Yükleniyor...</div>
              ) : logs.length === 0 ? (
                <div className={`py-12 flex items-center justify-center text-sm border border-dashed rounded-2xl ${
                  theme === "dark" ? "border-slate-855 text-slate-500" : "border-slate-205 text-slate-400 bg-slate-50/50"
                }`}>
                  Kayıtlı çalışma bulunmuyor.
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3.5">
                  {logs.map((log) => {
                    const targetMet = log.questions_solved >= log.target_questions;
                    
                    return (
                      <div key={log.id} className={`border p-3.5 rounded-2xl flex items-start justify-between group transition duration-200 ${
                        theme === "dark" ? "bg-[#060a12] border-slate-850/60" : "bg-slate-50/50 border-slate-200"
                      }`}>
                        <div className="space-y-1.5 flex-1 min-w-0 mr-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-4xs uppercase tracking-wider font-bold py-0.5 px-2 rounded-full border ${
                              SUBJECT_COLORS[log.subject] || "text-slate-400"
                            }`}>
                              {log.subject}
                            </span>
                            <span className="text-slate-500 text-4xs flex items-center gap-1">
                              <FaClock size={8} /> {log.date}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
                            <div>
                              <span className="text-4xs text-slate-450">Soru: </span>
                              <span className={`text-xs font-black ${
                                theme === "dark" 
                                  ? targetMet ? "text-emerald-400" : "text-slate-300"
                                  : targetMet ? "text-emerald-600" : "text-slate-800"
                              }`}>
                                {log.questions_solved}
                              </span>
                              <span className="text-4xs text-slate-500">/{log.target_questions}</span>
                            </div>
                            {log.trials_solved > 0 && (
                              <div className="text-4xs text-blue-600 dark:text-blue-400 bg-blue-500/5 px-2 py-0.5 border border-blue-500/10 rounded-md font-bold">
                                {log.trials_solved} Deneme
                              </div>
                            )}
                          </div>
                          
                          {log.notes && (
                            <p className={`text-4xs leading-relaxed italic border-t pt-1.5 mt-1.5 truncate ${
                              theme === "dark" ? "text-slate-500 border-slate-900" : "text-slate-500 border-slate-200"
                            }`} title={log.notes}>
                              "{log.notes}"
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-rose-550 hover:text-rose-500 text-xs p-1 opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer"
                          title="Sil"
                        >
                          <FaTrash size={9} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* KANBAN PLANNER BOARD WITH DRAG & DROP */}
      <div className={cardClass}>
        <div>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "dark" ? "text-slate-200" : "text-slate-805"}`}>
                <FaTasks className="text-purple-650 dark:text-purple-400" /> Çalışma Konuları Planlama Tahtası (Kanban)
              </h3>
              <p className={`text-3xs mt-1 ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
                Kartları istediğiniz sütuna sürükleyip bırakarak durumlarını güncelleyebilirsiniz.
              </p>
            </div>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="bg-purple-650 hover:bg-purple-600 text-white text-3xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <FaPlus size={8} /> Yeni Konu Ekle
            </button>
          </div>

          {/* Create Task Form */}
          {showTaskForm && (
            <form onSubmit={handleAddTask} className={`border p-4.5 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end max-w-3xl ${
              theme === "dark" ? "bg-[#060a12] border-slate-850" : "bg-slate-50 border-slate-200"
            }`}>
              <div>
                <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Ders Seçin</label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className={selectClass}
                >
                  {Object.keys(SUBJECT_COLORS).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <div className="flex-1">
                  <label className="block text-4xs font-bold text-slate-500 uppercase mb-1">Konu / Ünite Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Türkiye'nin Akarsuları Harita Çalışması"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end gap-1.5">
                  <button type="submit" className="bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer">
                    Ekle
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowTaskForm(false);
                      setNewTaskTitle("");
                    }} 
                    className={`text-xs py-2.5 px-3 rounded-xl border ${
                      theme === "dark"
                        ? "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400"
                        : "bg-white hover:bg-slate-100 border-slate-200 text-slate-655"
                    }`}
                  >
                    İptal
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN: TODO */}
            <div 
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, "todo")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "todo")}
              className={`border p-4 rounded-2xl flex flex-col min-h-[420px] max-h-[500px] transition-all duration-200 ${
                theme === "dark" 
                  ? activeOverColumn === "todo" ? "bg-[#060a12] border-purple-500 border-dashed" : "bg-[#060a12]/50 border-slate-850/80" 
                  : activeOverColumn === "todo" ? "bg-purple-500/5 border-purple-500 border-dashed" : "bg-slate-100/50 border-slate-200 shadow-3xs"
              }`}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/40 dark:border-slate-850/40">
                <span className={`text-xs font-black flex items-center gap-1.5 ${theme === "dark" ? "text-slate-300" : "text-slate-750"}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Çalışılacaklar
                </span>
                <span className={`text-4xs font-black px-2 py-0.5 rounded-full ${
                  theme === "dark" ? "bg-slate-900 text-slate-450" : "bg-slate-200 text-slate-600"
                }`}>
                  {tasks.filter(t => t.status === "todo").length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {tasksLoading ? (
                  <div className="py-6 text-center text-4xs text-slate-500 font-semibold animate-pulse">Konular yükleniyor...</div>
                ) : tasks.filter(t => t.status === "todo").length === 0 ? (
                  <div className="py-12 text-center text-4xs text-slate-500 border border-dashed rounded-xl border-slate-200/50 dark:border-slate-800/50">
                    Buraya bir kart sürükleyin.
                  </div>
                ) : (
                  tasks.filter(t => t.status === "todo").map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`border p-3.5 rounded-xl space-y-2.5 group relative cursor-grab active:cursor-grabbing hover:scale-[1.01] hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 ${
                        theme === "dark" ? "bg-[#0c1322] border-slate-855" : "bg-white border-slate-200 shadow-3xs"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-4xs font-bold px-2 py-0.5 border rounded-full ${SUBJECT_COLORS[task.subject] || "text-slate-405"}`}>
                          {task.subject}
                        </span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-rose-500 hover:text-rose-455 opacity-0 group-hover:opacity-100 p-0.5 transition cursor-pointer"
                          title="Sil"
                        >
                          <FaTrash size={9} />
                        </button>
                      </div>
                      <h4 className={`text-xs font-bold leading-normal ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {task.title}
                      </h4>
                      
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleMoveTask(task.id, "todo", "right")}
                          className={`p-1 border rounded-lg transition cursor-pointer flex items-center gap-1 text-4xs font-bold ${
                            theme === "dark" 
                              ? "text-purple-400 bg-[#060a12] border-slate-850 hover:border-purple-500" 
                              : "text-purple-650 bg-slate-50 border-slate-200 hover:border-purple-600"
                          }`}
                        >
                          Başla <FaArrowRight size={7} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN: IN PROGRESS */}
            <div 
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, "in_progress")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "in_progress")}
              className={`border p-4 rounded-2xl flex flex-col min-h-[420px] max-h-[500px] transition-all duration-200 ${
                theme === "dark" 
                  ? activeOverColumn === "in_progress" ? "bg-[#060a12] border-purple-500 border-dashed" : "bg-[#060a12]/50 border-slate-850/80" 
                  : activeOverColumn === "in_progress" ? "bg-purple-500/5 border-purple-500 border-dashed" : "bg-slate-100/50 border-slate-200 shadow-3xs"
              }`}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/40 dark:border-slate-850/40">
                <span className={`text-xs font-black flex items-center gap-1.5 ${theme === "dark" ? "text-slate-300" : "text-slate-750"}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-650 animate-pulse" /> Çalışılıyor
                </span>
                <span className={`text-4xs font-black px-2 py-0.5 rounded-full ${
                  theme === "dark" ? "bg-slate-900 text-slate-450" : "bg-slate-200 text-slate-600"
                }`}>
                  {tasks.filter(t => t.status === "in_progress").length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {tasksLoading ? (
                  <div className="py-6 text-center text-4xs text-slate-500 font-semibold animate-pulse">Konular yükleniyor...</div>
                ) : tasks.filter(t => t.status === "in_progress").length === 0 ? (
                  <div className="py-12 text-center text-4xs text-slate-500 border border-dashed rounded-xl border-slate-200/50 dark:border-slate-800/50">
                    Buraya bir kart sürükleyin.
                  </div>
                ) : (
                  tasks.filter(t => t.status === "in_progress").map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`border p-3.5 rounded-xl space-y-2.5 group relative cursor-grab active:cursor-grabbing hover:scale-[1.01] hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-200 ${
                        theme === "dark" ? "bg-[#0c1322] border-slate-855" : "bg-white border-slate-200 shadow-3xs"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-4xs font-bold px-2 py-0.5 border rounded-full ${SUBJECT_COLORS[task.subject] || "text-slate-405"}`}>
                          {task.subject}
                        </span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-rose-550 hover:text-rose-500 opacity-0 group-hover:opacity-100 p-0.5 transition cursor-pointer"
                          title="Sil"
                        >
                          <FaTrash size={9} />
                        </button>
                      </div>
                      <h4 className={`text-xs font-bold leading-normal ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                        {task.title}
                      </h4>
                      
                      <div className="flex justify-between items-center pt-1">
                        <button
                          onClick={() => handleMoveTask(task.id, "in_progress", "left")}
                          className={`p-1 border rounded-lg transition cursor-pointer flex items-center gap-1 text-4xs font-bold ${
                            theme === "dark" 
                              ? "text-slate-400 bg-[#060a12] border-slate-855 hover:border-slate-700" 
                              : "text-slate-550 bg-slate-50 border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <FaArrowLeft size={7} /> Geri
                        </button>
                        <button
                          onClick={() => handleMoveTask(task.id, "in_progress", "right")}
                          className={`p-1 border rounded-lg transition cursor-pointer flex items-center gap-1 text-4xs font-bold ${
                            theme === "dark" 
                              ? "text-emerald-450 bg-[#060a12] border-slate-855 hover:border-emerald-500" 
                              : "text-emerald-650 bg-slate-50 border-slate-200 hover:border-emerald-600"
                          }`}
                        >
                          Bitir <FaArrowRight size={7} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN: DONE */}
            <div 
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, "done")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "done")}
              className={`border p-4 rounded-2xl flex flex-col min-h-[420px] max-h-[500px] transition-all duration-200 ${
                theme === "dark" 
                  ? activeOverColumn === "done" ? "bg-[#060a12] border-purple-500 border-dashed" : "bg-[#060a12]/50 border-slate-850/80" 
                  : activeOverColumn === "done" ? "bg-purple-500/5 border-purple-500 border-dashed" : "bg-slate-100/50 border-slate-200 shadow-3xs"
              }`}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200/40 dark:border-slate-855/40">
                <span className={`text-xs font-black flex items-center gap-1.5 ${theme === "dark" ? "text-slate-300" : "text-slate-750"}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Tamamlandı
                </span>
                <span className={`text-4xs font-black px-2 py-0.5 rounded-full ${
                  theme === "dark" ? "bg-slate-900 text-slate-450" : "bg-slate-200 text-slate-600"
                }`}>
                  {tasks.filter(t => t.status === "done").length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {tasksLoading ? (
                  <div className="py-6 text-center text-4xs text-slate-500 font-semibold animate-pulse">Konular yükleniyor...</div>
                ) : tasks.filter(t => t.status === "done").length === 0 ? (
                  <div className="py-12 text-center text-4xs text-slate-500 border border-dashed rounded-xl border-slate-200/50 dark:border-slate-800/50">
                    Buraya bir kart sürükleyin.
                  </div>
                ) : (
                  tasks.filter(t => t.status === "done").map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`border p-3.5 rounded-xl space-y-2.5 group relative cursor-grab active:cursor-grabbing hover:scale-[1.01] hover:border-slate-350 dark:hover:border-slate-755 transition-all duration-200 ${
                        theme === "dark" ? "bg-[#0c1322]/40 border-slate-855/80 opacity-70" : "bg-white/80 border-slate-200/80 shadow-3xs opacity-80"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-4xs font-bold px-2 py-0.5 border rounded-full opacity-60 ${SUBJECT_COLORS[task.subject] || "text-slate-405"}`}>
                          {task.subject}
                        </span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-rose-550 hover:text-rose-500 opacity-0 group-hover:opacity-100 p-0.5 transition cursor-pointer"
                          title="Sil"
                        >
                          <FaTrash size={9} />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold line-through text-slate-450 dark:text-slate-500 leading-normal">
                        {task.title}
                      </h4>
                      
                      <div className="flex justify-start pt-1">
                        <button
                          onClick={() => handleMoveTask(task.id, "done", "left")}
                          className={`p-1 border rounded-lg transition cursor-pointer flex items-center gap-1 text-4xs font-bold ${
                            theme === "dark" 
                              ? "text-slate-400 bg-[#060a12] border-slate-855 hover:border-slate-700" 
                              : "text-slate-550 bg-slate-50 border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <FaArrowLeft size={7} /> Geri Al
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      </>
      )}

    </div>
  );
};

export default KpssTab;
