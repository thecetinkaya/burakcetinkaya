import React, { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../../lib/supabase";
import {
  FaBook, FaCheck, FaCheckDouble, FaHourglassHalf,
  FaCalendarCheck, FaLightbulb, FaPlus, FaMinus, FaChevronRight,
  FaPlay, FaPause, FaRedo, FaClock, FaTrash
} from "react-icons/fa";

const INITIAL_COGRAFYA_VIDEOS = [
  { id: "c-21", no: 21, duration: "1:11:38", title: "Türkiye'de Nüfus 1", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-22", no: 22, duration: "40:33",   title: "Türkiye'de Nüfus Yoğunlukları ve Nüfusun Fiziki Yapısı", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-23", no: 23, duration: "37:42",   title: "Türkiye'de Nüfus Hareketleri ve Yerleşme", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-24", no: 24, duration: "14:54",   title: "Türkiye'de Nüfus — Sorularla Genel Tekrar", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-25", no: 25, duration: "1:27:02", title: "Türkiye'de Tarım", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-26", no: 26, duration: "43:37",   title: "Türkiye'de Hayvancılık", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-27", no: 27, duration: "12:57",   title: "Tarım ve Hayvancılık — Sorularla Genel Tekrar", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-28", no: 28, duration: "35:47",   title: "Türkiye'de Madenler", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-29", no: 29, duration: "27:52",   title: "Türkiye'de Enerji Kaynakları", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-30", no: 30, duration: "39:11",   title: "Türkiye'de Sanayi", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-31", no: 31, duration: "15:56",   title: "Madenler, Enerji Kaynakları ve Sanayi — Genel Tekrar", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-32", no: 32, duration: "1:25:04", title: "Türkiye'de Ulaşım, Ticaret ve Turizm", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-33", no: 33, duration: "14:31",   title: "Ulaşım, Ticaret, Turizm — Sorularla Genel Tekrar", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
  { id: "c-34", no: 34, duration: "42:27",   title: "Bölgeler", channel: "Benim Hocam", ticks: 0, questionsSolved: 0 },
];

const INITIAL_TARIH_VIDEOS = [
  { id: "t-76", no: 76, duration: "51:30", title: "Saltanatın Kaldırılması ve Lozan Konferansı", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-77", no: 77, duration: "25:48", title: "İç Politika 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-78", no: 78, duration: "35:39", title: "İç Politika 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-79", no: 79, duration: "31:08", title: "ATATÜRK İlkeleri", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-80", no: 80, duration: "38:54", title: "ATATÜRK İnkılapları 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-81", no: 81, duration: "24:53", title: "ATATÜRK İnkılapları 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-82", no: 82, duration: "38:50", title: "ATATÜRK İnkılapları 3. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-83", no: 83, duration: "26:10", title: "ATATÜRK İnkılapları 4. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-84", no: 84, duration: "31:45", title: "Cumhuriyet'in Önemli Şahsiyetleri ve Atatürk", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-85", no: 85, duration: "33:31", title: "Dış Politika 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-86", no: 86, duration: "31:37", title: "Dış Politika 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-87", no: 87, duration: "45:39", title: "XX. yy. Başlarında Dünya 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-88", no: 88, duration: "16:51", title: "XX. yy. Başlarında Dünya 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-89", no: 89, duration: "48:46", title: "2. Dünya Savaşı 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-90", no: 90, duration: "32:25", title: "2. Dünya Savaşı 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-91", no: 91, duration: "50:28", title: "Soğuk Savaş Dönemi 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-92", no: 92, duration: "25:27", title: "Soğuk Savaş Dönemi 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-93", no: 93, duration: "56:48", title: "Yumuşama Dönemi 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-94", no: 94, duration: "30:29", title: "Yumuşama Dönemi 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-95", no: 95, duration: "28:05", title: "Küreselleşen Dünya 1. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
  { id: "t-96", no: 96, duration: "15:23", title: "Küreselleşen Dünya 2. Bölüm", channel: "Yediiklim", ticks: 0, questionsSolved: 0 },
];

const parseDurationToMinutes = (duration) => {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return 0;
};

const WORK_SEC  = 50 * 60; // 50 dakika
const BREAK_SEC = 10 * 60; // 10 dakika

const VideoTakipTab = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("cografya");
  const [studiedToday, setStudiedToday] = useState(() =>
    Number(localStorage.getItem("studied_today") || "0")
  );
  const [statsOpen, setStatsOpen] = useState(false);

  // ── Pomodoro ─────────────────────────────────────────────

  const [pomodoroSec, setPomodoroSec]       = useState(WORK_SEC);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode]     = useState("work"); // "work" | "break"
  const [pomodoroStats, setPomodoroStats]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("pomodoro_stats") || "null") || { workDone: 0, breakDone: 0 }; }
    catch { return { workDone: 0, breakDone: 0 }; }
  });
  const intervalRef = useRef(null);

  // Tarayıcı bildirimi için ses
  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(); osc.stop(ctx.currentTime + 0.8);
    } catch (err) {
      console.warn("AudioContext beep failed", err);
    }
  }, []);

  useEffect(() => {
    if (pomodoroRunning) {
      intervalRef.current = setInterval(() => {
        setPomodoroSec(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setPomodoroRunning(false);
            playBeep();
            // Mod geçişi ve istatistik güncelleme
            setPomodoroMode(m => {
              const next = m === "work" ? "break" : "work";
              setPomodoroSec(next === "work" ? WORK_SEC : BREAK_SEC);
              setPomodoroStats(s => {
                const updated = m === "work"
                  ? { ...s, workDone: s.workDone + 1 }
                  : { ...s, breakDone: s.breakDone + 1 };
                localStorage.setItem("pomodoro_stats", JSON.stringify(updated));
                return updated;
              });
              return next;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [pomodoroRunning, playBeep]);

  const pomodoroReset = () => {
    setPomodoroRunning(false);
    setPomodoroMode("work");
    setPomodoroSec(WORK_SEC);
  };

  const totalSec     = pomodoroMode === "work" ? WORK_SEC : BREAK_SEC;
  const pomMin       = String(Math.floor(pomodoroSec / 60)).padStart(2, "0");
  const pomSec2      = String(pomodoroSec % 60).padStart(2, "0");
  // ─────────────────────────────────────────────────────────

  const [videos, setVideos] = useState({ cografya: [], tarih: [] });
  const [videosLoading, setVideosLoading] = useState(true);

  // Single Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoNo, setVideoNo] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoChannel, setVideoChannel] = useState("Benim Hocam");

  // Bulk Add form
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkText, setBulkText] = useState("");

  // Multi-select state for bulk delete
  const [selectedVideoIds, setSelectedVideoIds] = useState([]);

  // Clear selections on tab switch
  useEffect(() => {
    setSelectedVideoIds([]);
  }, [activeTab]);

  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const { data, error } = await db.videos.fetchAll();
      if (error) throw error;
      if (data) {
        setVideos(data);
      }
    } catch (err) {
      console.error("Videolar yüklenemedi:", err);
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    localStorage.setItem("kpss_video_progress_v2", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("studied_today", studiedToday.toString());
  }, [studiedToday]);

  const currentList = activeTab === "cografya" ? videos.cografya : videos.tarih;

  // 0 → 1 (izlendi) → 2 (izlendi + soru çözüldü) → 0
  const handleTickToggle = async (videoId) => {
    let nextTick = 0;
    let nextQ = 0;
    
    const updated = {
      cografya: videos.cografya.map(v => {
        if (v.id !== videoId) return v;
        nextTick = (v.ticks + 1) % 3;
        nextQ = nextTick === 0 ? 0 : nextTick === 2 && v.questionsSolved === 0 ? 30 : v.questionsSolved;
        return { ...v, ticks: nextTick, questionsSolved: nextQ };
      }),
      tarih: videos.tarih.map(v => {
        if (v.id !== videoId) return v;
        nextTick = (v.ticks + 1) % 3;
        nextQ = nextTick === 0 ? 0 : nextTick === 2 && v.questionsSolved === 0 ? 30 : v.questionsSolved;
        return { ...v, ticks: nextTick, questionsSolved: nextQ };
      })
    };

    setVideos(updated);

    try {
      await db.videos.update(videoId, { ticks: nextTick, questionsSolved: nextQ });
    } catch (err) {
      console.error("Tick güncellenemedi:", err);
    }
  };

  const handleQuestionChange = async (videoId, val) => {
    const n = Math.max(0, parseInt(val) || 0);
    let targetTick = 0;

    const updated = {
      cografya: videos.cografya.map(v => {
        if (v.id !== videoId) return v;
        targetTick = n > 0 && v.ticks === 0 ? 1 : v.ticks;
        return { ...v, questionsSolved: n, ticks: targetTick };
      }),
      tarih: videos.tarih.map(v => {
        if (v.id !== videoId) return v;
        targetTick = n > 0 && v.ticks === 0 ? 1 : v.ticks;
        return { ...v, questionsSolved: n, ticks: targetTick };
      })
    };

    setVideos(updated);

    try {
      await db.videos.update(videoId, { questionsSolved: n, ticks: targetTick });
    } catch (err) {
      console.error("Soru sayısı güncellenemedi:", err);
    }
  };

  const handleAddSingleVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    const currentList = activeTab === "cografya" ? videos.cografya : videos.tarih;
    const finalNo = parseInt(videoNo) || (currentList.length > 0 ? Math.max(...currentList.map(v => v.no)) + 1 : 1);

    const newVideo = {
      no: finalNo,
      title: videoTitle.trim(),
      duration: videoDuration.trim() || "00:00",
      channel: videoChannel.trim() || "Benim Hocam",
      subject: activeTab,
      ticks: 0,
      questionsSolved: 0
    };

    try {
      const { error } = await db.videos.create(newVideo);
      if (error) throw error;

      setVideoTitle("");
      setVideoNo("");
      setVideoDuration("");
      setShowAddForm(false);
      await fetchVideos();
    } catch (err) {
      alert("Video eklenirken hata: " + err.message);
    }
  };

  const handleAddBulkVideos = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    const newVideos = [];
    const currentList = activeTab === "cografya" ? videos.cografya : videos.tarih;
    
    // Check if there are duration markers (e.g., "25:48", "1:11:38")
    const hasDurations = lines.some(line => /^\d{1,2}:\d{2}(:\d{2})?$/.test(line));
    
    if (hasDurations) {
      // Advanced Youtube Playlist Parser!
      let i = 0;
      let nextNo = currentList.length > 0 ? Math.max(...currentList.map(v => v.no)) + 1 : 1;
      
      while (i < lines.length) {
        const line = lines[i];
        
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(line)) {
          const duration = line;
          let title = "";
          let channel = activeTab === "cografya" ? "Bayram Meral" : "Ahmet Uğur Karakuza";
          let no = nextNo++;
          
          // Search for the next line that is not a duration, a boolean, or a simple number
          let titleIdx = i + 1;
          while (titleIdx < lines.length) {
            const nextL = lines[titleIdx];
            if (nextL !== "true" && nextL !== "false" && !/^\d+$/.test(nextL) && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(nextL)) {
              title = nextL;
              break;
            }
            titleIdx++;
          }
          
          if (title) {
            // Parse sequence number from title if it exists, e.g. "74 - İç Politika"
            const numMatch = title.match(/^(\d+)\s*[-.)\]\s]+(.*)$/);
            if (numMatch) {
              no = parseInt(numMatch[1]);
              title = numMatch[2].trim();
            }
            
            // Clean trailing lecturer name (e.g. "- Ahmet Uğur KARAKUZA")
            title = title.replace(/\s*-\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]+[A-ZÇĞİÖŞÜ]$/, "").trim();
            
            // Channel is usually the line right after the title
            if (titleIdx + 1 < lines.length) {
              const possibleChannel = lines[titleIdx + 1];
              if (possibleChannel !== "true" && possibleChannel !== "false" && !/^\d+$/.test(possibleChannel) && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(possibleChannel)) {
                channel = possibleChannel;
              }
            }
            
            newVideos.push({
              no,
              title,
              duration,
              channel,
              subject: activeTab,
              ticks: 0,
              questionsSolved: 0
            });
            
            // Move loop past the title/channel lines
            i = titleIdx + 1;
            continue;
          }
        }
        i++;
      }
    } else {
      // Fallback simple line-by-line parser
      let nextNo = currentList.length > 0 ? Math.max(...currentList.map(v => v.no)) + 1 : 1;
      for (const line of lines) {
        if (line === "true" || line === "false" || /^\d+$/.test(line) || /^\d{1,2}:\d{2}(:\d{2})?$/.test(line)) {
          continue; // ignore standalone numbers, true/false, durations
        }
        
        const numMatch = line.match(/^(\d+)\s*[-.)\]\s]+(.*)$/);
        let no, title;
        if (numMatch) {
          no = parseInt(numMatch[1]);
          title = numMatch[2].trim();
        } else {
          no = nextNo++;
          title = line;
        }
        
        // Clean trailing names
        title = title.replace(/\s*-\s*[A-ZÇĞİÖŞÜa-zçğıöşü\s]+[A-ZÇĞİÖŞÜ]$/, "").trim();
        
        newVideos.push({
          no,
          title,
          duration: "00:00",
          channel: activeTab === "cografya" ? "Bayram Meral" : "Ahmet Uğur Karakuza",
          subject: activeTab,
          ticks: 0,
          questionsSolved: 0
        });
      }
    }

    if (newVideos.length === 0) return;

    try {
      const { error } = await db.videos.create(newVideos);
      if (error) throw error;

      setBulkText("");
      setShowBulkForm(false);
      await fetchVideos();
    } catch (err) {
      alert("Toplu konular eklenirken hata: " + err.message);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Bu konuyu/videoyu silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await db.videos.delete(videoId);
      if (error) throw error;
      await fetchVideos();
    } catch (err) {
      alert("Video silinemedi: " + err.message);
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideoIds(prev =>
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const handleSelectAllToggle = () => {
    const allIds = currentList.map(v => v.id);
    const isAllSelected = allIds.length > 0 && allIds.every(id => selectedVideoIds.includes(id));
    if (isAllSelected) {
      setSelectedVideoIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedVideoIds(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleBulkDeleteSelected = async () => {
    if (selectedVideoIds.length === 0) return;
    if (!window.confirm(`Seçilen ${selectedVideoIds.length} konuyu silmek istediğinize emin misiniz?`)) return;

    try {
      const { error } = await db.videos.delete(selectedVideoIds);
      if (error) throw error;

      setSelectedVideoIds([]);
      await fetchVideos();
    } catch (err) {
      alert("Seçilen konular silinemedi: " + err.message);
    }
  };

  // Ortak günlük öneri — 8 saat = 2s coğrafya video + 2s coğrafya soru + 2s tarih video + 2s tarih soru
  const getSharedRecommendation = () => {
    const buildBlock = (list, targetMin) => {
      const unwatched = list.filter(v => v.ticks < 1);
      if (unwatched.length === 0) return { done: true, selected: [], sumMin: 0 };
      let selected = [], sum = 0;
      for (const v of unwatched) {
        const d = parseDurationToMinutes(v.duration);
        if (sum + d <= targetMin + 15) { selected.push(v); sum += d; }
        else { if (!selected.length) { selected.push(v); sum += d; } break; }
      }
      return { done: false, selected, sumMin: sum };
    };

    const cogrBlock = buildBlock(videos.cografya, 120); // 2 saat coğrafya video
    const tarihBlock = buildBlock(videos.tarih, 120);   // 2 saat tarih video

    const fmt = (min) => {
      const h = Math.floor(min / 60), m = Math.round(min % 60);
      return `${h > 0 ? `${h} saat ` : ""}${m} dakika`;
    };

    return {
      cografya: {
        done: cogrBlock.done,
        selected: cogrBlock.selected,
        videoTimeStr: fmt(cogrBlock.sumMin),
        qSuggested: Math.round((cogrBlock.sumMin / 60) * 40),
      },
      tarih: {
        done: tarihBlock.done,
        selected: tarihBlock.selected,
        videoTimeStr: fmt(tarihBlock.sumMin),
        qSuggested: Math.round((tarihBlock.sumMin / 60) * 40),
      },
      allDone: cogrBlock.done && tarihBlock.done,
    };
  };

  const rec = getSharedRecommendation();
  const total = currentList.length;
  const watched = currentList.filter(v => v.ticks >= 1).length;
  const solved = currentList.filter(v => v.ticks === 2).length;
  const totalQ = currentList.reduce((a, v) => a + v.questionsSolved, 0);
  const pct = total > 0 ? Math.round((watched / total) * 100) : 0;

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-slate-800"} transition-colors duration-300`}>
      {/* Başlık */}
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
        <FaBook className="text-[#13d179]" size={18} />
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Ders Video Takip Paneli</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
            Coğrafya ve Tarih derslerini planlayın, takip edin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">

        {/* ── SOL PANEL ── */}
        <div className="space-y-4 lg:col-span-3">

          {/* ══ Pomodoro + Günlük Hedef — tek birleşik kart ══ */}
          <div className={`bg-white dark:bg-[#121826] border rounded-2xl shadow-md overflow-hidden transition-colors duration-300 ${
            pomodoroMode === "work"
              ? "border-[#13d179]/25 dark:border-[#13d179]/15"
              : "border-amber-400/30 dark:border-amber-400/20"
          }`}>
            {/* Kart başlık şeridi */}
            <div className={`px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 ${
              pomodoroMode === "work" ? "bg-[#13d179]/5" : "bg-amber-400/5"
            }`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <FaClock size={9} className={pomodoroMode === "work" ? "text-[#13d179]" : "text-amber-400"} />
                Çalışma Paneli
              </span>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                pomodoroMode === "work"
                  ? "bg-[#13d179]/10 text-[#13d179]"
                  : "bg-amber-400/10 text-amber-500"
              }`}>
                {pomodoroMode === "work" ? "🍅 Odak" : "☕ Mola"}
              </span>
            </div>

            {/* Alt alta içerik */}
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 p-5 gap-0">

              {/* Pomodoro */}
              <div className="flex items-center gap-5 pb-5">
                {/* Halka */}
                <div className="relative w-[88px] h-[88px] shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="44" cy="44" r="36" strokeWidth="4.5" fill="transparent" className="stroke-slate-100 dark:stroke-slate-800" />
                    <circle
                      cx="44" cy="44" r="36" strokeWidth="4.5" fill="transparent"
                      stroke={pomodoroMode === "work" ? "#13d179" : "#f59e0b"}
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - pomodoroSec / totalSec)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center leading-none">
                    <span className={`text-lg font-black tabular-nums ${
                      pomodoroMode === "work" ? "text-[#13d179]" : "text-amber-400"
                    }`}>{pomMin}:{pomSec2}</span>
                    <span className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase">
                      {pomodoroMode === "work" ? "50 dk" : "10 dk"}
                    </span>
                  </div>
                </div>
                {/* Sağ: etiket + kontroller */}
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Pomodoro</p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={pomodoroReset} title="Sıfırla"
                      className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-300 transition cursor-pointer">
                      <FaRedo size={8} />
                    </button>
                    <button onClick={() => setPomodoroRunning(r => !r)} title={pomodoroRunning ? "Duraklat" : "Başlat"}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer shadow-sm font-black ${
                        pomodoroMode === "work"
                          ? "bg-[#13d179] text-[#0b0f19] hover:bg-emerald-400"
                          : "bg-amber-400 text-[#0b0f19] hover:bg-amber-300"
                      }`}>
                      {pomodoroRunning ? <FaPause size={11} /> : <FaPlay size={11} />}
                    </button>
                    <button title="Modu Değiştir"
                      onClick={() => { setPomodoroRunning(false); const n = pomodoroMode === "work" ? "break" : "work"; setPomodoroMode(n); setPomodoroSec(n === "work" ? WORK_SEC : BREAK_SEC); }}
                      className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#13d179] hover:border-emerald-300 transition cursor-pointer text-[10px]">
                      {pomodoroMode === "work" ? "☕" : "💪"}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    🍅 {pomodoroStats.workDone} · ☕ {pomodoroStats.breakDone}
                  </p>
                </div>
              </div>

              {/* Günlük Hedef */}
              <div className="flex items-center gap-5 pt-5">
                {/* Halka */}
                <div className="relative w-[88px] h-[88px] shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="44" cy="44" r="36" strokeWidth="4.5" fill="transparent" className="stroke-slate-100 dark:stroke-slate-800" />
                    <circle
                      cx="44" cy="44" r="36" strokeWidth="4.5" fill="transparent"
                      stroke="#13d179"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - Math.min(1, studiedToday / 8))}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center leading-none">
                    <span className="text-lg font-black text-[#13d179]">{studiedToday}h</span>
                    <span className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase">/ 8 saat</span>
                  </div>
                </div>
                {/* Sağ: etiket + kontroller */}
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Günlük Hedef</p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setStudiedToday(p => Math.max(0, p - 1))}
                      className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-300 transition cursor-pointer">
                      <FaMinus size={8} />
                    </button>
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300 w-5 text-center tabular-nums">{studiedToday}</span>
                    <button onClick={() => setStudiedToday(p => Math.min(24, p + 1))}
                      className="w-6 h-6 rounded-md bg-[#13d179] text-[#0b0f19] flex items-center justify-center hover:bg-emerald-400 transition cursor-pointer">
                      <FaPlus size={8} />
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold">
                    {8 - studiedToday > 0 ? `${8 - studiedToday}s kaldı` : "🎉 Tamamdı!"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ══ İstatistikler — aç/kapa ══ */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md overflow-hidden">
            <button
              onClick={() => setStatsOpen(o => !o)}
              className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FaHourglassHalf size={9} className="text-[#13d179]" /> İstatistikler
              </span>
              <FaChevronRight
                size={9}
                className={`text-slate-400 transition-transform duration-300 ${statsOpen ? "rotate-90" : "rotate-0"}`}
              />
            </button>

            {statsOpen && (
              <div className="px-5 pb-5 space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                {/* Video istatistikleri */}
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Videolar ({activeTab === "cografya" ? "Coğrafya" : "Tarih"})</p>
                {[
                  { label: "Kalan Video", value: `${total - watched} / ${total}`, color: "" },
                  { label: "Sadece İzlenen", value: watched - solved, color: "text-amber-500" },
                  { label: "İzlendi + Soru", value: solved, color: "text-[#13d179]" },
                  { label: "Çözülen Soru", value: totalQ, color: "text-[#13d179]" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{row.label}</span>
                    <span className={`font-extrabold ${row.color}`}>{row.value}</span>
                  </div>
                ))}

                {/* İlerleme */}
                <div className="pt-1">
                  <div className="flex justify-between text-[9px] text-slate-400 mb-1.5">
                    <span>İzlenme</span><span>%{pct}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#13d179] h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Pomodoro istatistikleri */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Pomodoro</p>
                  {[
                    { label: "🍅 Tamamlanan", value: `${pomodoroStats.workDone} × 50 dk`, color: "text-[#13d179]" },
                    { label: "☕ Alınan Mola", value: `${pomodoroStats.breakDone} × 10 dk`, color: "text-amber-400" },
                    { label: "⏱ Toplam Odak", value: `${Math.floor(pomodoroStats.workDone * 50 / 60)}s ${(pomodoroStats.workDone * 50) % 60}dk`, color: "" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{row.label}</span>
                      <span className={`font-extrabold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>


        {/* ── SAĞ PANEL ── */}
        <div className="space-y-5 lg:col-span-7">

          {/* Günlük Öneri — her iki ders için ortak */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-[#13d179]" />
            <div className="flex gap-4">
              <div className="p-3 bg-[#13d179]/10 rounded-2xl text-[#13d179] shrink-0 mt-0.5">
                <FaLightbulb size={18} />
              </div>
              <div className="space-y-3 w-full">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Günlük Öneri (8 Saat Planı)</h3>
                {rec.allDone ? (
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tebrikler! Her iki dersteki tüm videoları tamamladınız. Harika bir iş!</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      8 saatlik çalışma planı: <span className="text-[#13d179] font-black">2s Coğrafya video + 2s Coğrafya soru + 2s Tarih video + 2s Tarih soru</span>
                    </p>

                    {/* Coğrafya bloğu */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">📍 Coğrafya</span>
                        {rec.cografya.done
                          ? <span className="text-[10px] text-emerald-400 font-bold">✓ Tamamlandı</span>
                          : <span className="text-[10px] text-slate-400">{rec.cografya.videoTimeStr} video · ~{rec.cografya.qSuggested} soru</span>
                        }
                      </div>
                      {!rec.cografya.done && rec.cografya.selected.map(v => (
                        <div key={v.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-3">
                          <FaChevronRight size={8} className="text-[#13d179] shrink-0" />
                          <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 shrink-0">NO {v.no}</span>
                          <span className="truncate flex-1" title={v.title}>{v.title}</span>
                          <span className="text-slate-400 text-[10px] shrink-0">{v.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tarih bloğu */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">📍 Tarih</span>
                        {rec.tarih.done
                          ? <span className="text-[10px] text-emerald-400 font-bold">✓ Tamamlandı</span>
                          : <span className="text-[10px] text-slate-400">{rec.tarih.videoTimeStr} video · ~{rec.tarih.qSuggested} soru</span>
                        }
                      </div>
                      {!rec.tarih.done && rec.tarih.selected.map(v => (
                        <div key={v.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-3">
                          <FaChevronRight size={8} className="text-amber-400 shrink-0" />
                          <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 shrink-0">NO {v.no}</span>
                          <span className="truncate flex-1" title={v.title}>{v.title}</span>
                          <span className="text-slate-400 text-[10px] shrink-0">{v.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ders Sekmeleri */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-md">
            <div className="flex gap-2">
              {[
                { key: "cografya", label: "Coğrafya — Bayram MERAL" },
                { key: "tarih",    label: "Tarih — Ahmet Uğur KARAKUZA" }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer
                    ${activeTab === t.key
                      ? "bg-[#13d179] text-[#0b0f19]"
                      : "text-slate-500 dark:text-slate-400 hover:text-[#13d179]"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Listesi */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {currentList.length > 0 && (
                  <input
                    type="checkbox"
                    checked={currentList.every(v => selectedVideoIds.includes(v.id))}
                    onChange={handleSelectAllToggle}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#13d179] focus:ring-[#13d179] cursor-pointer"
                    title="Tümünü Seç / Kaldır"
                  />
                )}
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <FaBook className="text-[#13d179]" /> Kalan Konularım
                </h3>
                {selectedVideoIds.filter(id => currentList.some(v => v.id === id)).length > 0 && (
                  <button
                    onClick={handleBulkDeleteSelected}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-[9px] font-black py-1 px-2 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <FaTrash size={7} /> Seçilenleri Sil ({selectedVideoIds.filter(id => currentList.some(v => v.id === id)).length})
                  </button>
                )}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setShowBulkForm(false);
                  }}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition border cursor-pointer ${
                    showAddForm
                      ? "bg-[#13d179] text-[#0b0f19] border-[#13d179]"
                      : theme === "dark"
                        ? "bg-[#13d179]/10 hover:bg-[#13d179]/20 text-[#13d179] border-[#13d179]/20"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <FaPlus size={7} /> Tekil Ekle
                </button>
                <button
                  onClick={() => {
                    setShowBulkForm(!showBulkForm);
                    setShowAddForm(false);
                  }}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition border cursor-pointer ${
                    showBulkForm
                      ? "bg-[#13d179] text-[#0b0f19] border-[#13d179]"
                      : theme === "dark"
                        ? "bg-[#13d179]/10 hover:bg-[#13d179]/20 text-[#13d179] border-[#13d179]/20"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <FaBook size={8} /> Toplu Ekle
                </button>
              </div>
            </div>

            {/* Single Add Video Form */}
            {showAddForm && (
              <form onSubmit={handleAddSingleVideo} className={`border p-3.5 rounded-xl mb-4 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end ${
                theme === "dark" ? "bg-[#060a12] border-slate-850" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="sm:col-span-2">
                  <label className="block text-[8px] font-black uppercase text-slate-550 mb-1">Konu Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Türkiye'nin Gölleri"
                    value={videoTitle}
                    onChange={e => setVideoTitle(e.target.value)}
                    className={`w-full p-2 text-xs font-bold rounded-lg border outline-none ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-[#13d179]/40" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase text-slate-550 mb-1">Sıra No</label>
                  <input
                    type="number"
                    placeholder={`Örn: ${currentList.length + 1}`}
                    value={videoNo}
                    onChange={e => setVideoNo(e.target.value)}
                    className={`w-full p-2 text-xs font-bold rounded-lg border outline-none ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-[#13d179]/40" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase text-slate-550 mb-1">Süre (Dk:Sn)</label>
                  <input
                    type="text"
                    placeholder="Örn: 42:30"
                    value={videoDuration}
                    onChange={e => setVideoDuration(e.target.value)}
                    className={`w-full p-2 text-xs font-bold rounded-lg border outline-none ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-[#13d179]/40" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-600"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase text-slate-550 mb-1">Kanal / Yayın</label>
                  <input
                    type="text"
                    placeholder="Örn: Benim Hocam"
                    value={videoChannel}
                    onChange={e => setVideoChannel(e.target.value)}
                    className={`w-full p-2 text-xs font-bold rounded-lg border outline-none ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-[#13d179]/40" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-600"
                    }`}
                  />
                </div>
                <div className="sm:col-span-5 flex justify-end gap-1.5">
                  <button type="submit" className="bg-[#13d179] text-[#0b0f19] font-black text-[10px] py-2 px-4 rounded-xl transition cursor-pointer">
                    Kaydet
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className={`text-[10px] font-bold py-2 px-3 rounded-xl border ${
                    theme === "dark" ? "bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-665 hover:bg-slate-50"
                  }`}>
                    İptal
                  </button>
                </div>
              </form>
            )}

            {/* Bulk Add Videos Form */}
            {showBulkForm && (
              <form onSubmit={handleAddBulkVideos} className={`border p-3.5 rounded-xl mb-4 space-y-3 ${
                theme === "dark" ? "bg-[#060a12] border-slate-850" : "bg-slate-50 border-slate-200"
              }`}>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[8px] font-black uppercase text-slate-500">Toplu Konu Listesi (Satır Satır)</label>
                    <span className="text-[8px] text-slate-450 font-bold uppercase">Sıra Numaraları Otomatik Algılanır</span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    placeholder={`Örn:
1. Türkiye'de Nüfus 1
2. Türkiye'de Nüfus Yoğunlukları
3. Türkiye'de Nüfus Yerleşmeleri`}
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                    className={`w-full p-3 text-xs font-semibold rounded-lg border outline-none ${
                      theme === "dark" ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-[#13d179]/50" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-600"
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-1.5">
                  <button type="submit" className="bg-[#13d179] text-[#0b0f19] font-black text-[10px] py-2 px-4 rounded-xl transition cursor-pointer">
                    Toplu Ekle ({bulkText.split("\n").filter(l => l.trim()).length} Konu)
                  </button>
                  <button type="button" onClick={() => { setShowBulkForm(false); setBulkText(""); }} className={`text-[10px] font-bold py-2 px-3 rounded-xl border ${
                    theme === "dark" ? "bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-665 hover:bg-slate-50"
                  }`}>
                    İptal
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[450px] overflow-y-auto">
              {videosLoading ? (
                <div className="py-12 text-center text-xs font-semibold text-slate-500 animate-pulse">
                  Konular yükleniyor...
                </div>
              ) : currentList.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-slate-500 border border-dashed border-slate-200 dark:border-slate-800/50 rounded-xl">
                  Henüz konu eklenmemiş. Yukarıdaki "Ekle" butonlarından ekleme yapabilirsiniz.
                </div>
              ) : (
                currentList.map(video => {
                  const isSelected = selectedVideoIds.includes(video.id);
                  return (
                    <div key={video.id}
                      className={`py-2 px-1 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition group rounded-xl ${
                        isSelected ? "bg-emerald-500/5 dark:bg-emerald-500/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectVideo(video.id)}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-[#13d179] focus:ring-[#13d179] cursor-pointer"
                      />

                      {/* NO badge */}
                      <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-black text-slate-500 uppercase tracking-wider shrink-0">
                        {video.no}
                      </span>

                      {/* Başlık + süre — tek satır */}
                      <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate" title={video.title}>
                          {video.title}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                          ({video.duration})
                        </span>
                      </div>

                      {/* Soru kutusu */}
                      <div className="flex flex-col items-center shrink-0">
                        <input
                          type="text"
                          value={video.questionsSolved === 0 ? "" : video.questionsSolved}
                          onChange={e => handleQuestionChange(video.id, e.target.value)}
                          placeholder="0"
                          className="w-10 text-center py-0.5 text-xs font-black bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                        />
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Soru</span>
                      </div>

                      {/* Tik butonu */}
                      <button
                        onClick={() => handleTickToggle(video.id)}
                        title={video.ticks === 2 ? "İzlendi & Soru Çözüldü" : video.ticks === 1 ? "İzlendi" : "İzlenmedi"}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 transition cursor-pointer shrink-0
                          ${video.ticks === 2
                            ? "bg-emerald-500/10 border-[#13d179] text-[#13d179]"
                            : video.ticks === 1
                            ? "bg-amber-500/10 border-amber-400/50 text-amber-500"
                            : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"
                          }`}
                      >
                        {video.ticks === 2 ? <FaCheckDouble size={12} /> : video.ticks === 1 ? <FaCheck size={11} /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      </button>

                      {/* Silme Butonu */}
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center border-2 transition cursor-pointer shrink-0 border-transparent text-slate-400 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 opacity-0 group-hover:opacity-100"
                        title="Sil"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoTakipTab;
