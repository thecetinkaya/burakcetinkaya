import React, { useState, useEffect } from "react";
import DenemeAnalizCizelgesi from "./DenemeAnalizCizelgesi";
import {
  LuBookOpen, LuTrendingUp, LuPlus, LuTrash2,
  LuCalendar, LuClock, LuTarget, LuFilter, LuSearch,
  LuSparkles, LuChevronDown, LuChevronUp, LuAward, LuRotateCcw,
  LuX, LuCheck
} from "react-icons/lu";

// Genel Deneme Lisans Branş Tanımları (KPSS Lisans 120 Soru)
const GENEL_DENEME_BRANCHES = [
  { key: "turkce", title: "Türkçe", totalQuestions: 30, color: "rose", badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30", textCol: "text-rose-400" },
  { key: "matematik", title: "Matematik", totalQuestions: 30, color: "cyan", badgeBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", textCol: "text-cyan-400" },
  { key: "tarih", title: "Tarih", totalQuestions: 27, color: "amber", badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30", textCol: "text-amber-400" },
  { key: "cografya", title: "Coğrafya", totalQuestions: 18, color: "emerald", badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", textCol: "text-emerald-400" },
  { key: "vatandaslik", title: "Vatandaşlık", totalQuestions: 15, color: "purple", badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30", textCol: "text-purple-400" }
];

const createEmptyBranches = () => ({
  turkce: { correct: 0, incorrect: 0, empty: 30, net: 0 },
  matematik: { correct: 0, incorrect: 0, empty: 30, net: 0 },
  tarih: { correct: 0, incorrect: 0, empty: 27, net: 0 },
  cografya: { correct: 0, incorrect: 0, empty: 18, net: 0 },
  vatandaslik: { correct: 0, incorrect: 0, empty: 15, net: 0 }
});

// Varsayılan Kullanıcı Kitapları & Kaynakları
const INITIAL_BOOKS = [
  {
    id: "book-cografya-657",
    title: "Hedef 657 Coğrafya Branş Denemesi",
    subject: "Coğrafya",
    publisher: "Hedef 657",
    totalDeneme: 18,
    questionsPerDeneme: 18,
    color: "emerald",
    icon: "🗺️",
    denemes: Array.from({ length: 18 }, (_, idx) => ({
      id: idx + 1,
      solved: false,
      correct: 0,
      incorrect: 0,
      empty: 18,
      net: 0,
      date: "",
      durationMin: "",
      notes: ""
    }))
  },
  {
    id: "book-tarih-boru",
    title: "Tarih Börü Branş Denemesi",
    subject: "Tarih",
    publisher: "Börü",
    totalDeneme: 19,
    questionsPerDeneme: 27,
    color: "amber",
    icon: "🏛️",
    denemes: Array.from({ length: 19 }, (_, idx) => ({
      id: idx + 1,
      solved: false,
      correct: 0,
      incorrect: 0,
      empty: 27,
      net: 0,
      date: "",
      durationMin: "",
      notes: ""
    }))
  },
  {
    id: "book-tarih-500",
    title: "Tarih 500 Soruda Genel Tekrar",
    subject: "Tarih",
    publisher: "Genel Tekrar",
    totalDeneme: 10,
    questionsPerDeneme: 50,
    color: "amber",
    icon: "📜",
    denemes: Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 1,
      solved: false,
      correct: 0,
      incorrect: 0,
      empty: 50,
      net: 0,
      date: "",
      durationMin: "",
      notes: ""
    }))
  },
  {
    id: "book-vatandaslik-30",
    title: "Vatandaşlık Branş Denemesi",
    subject: "Vatandaşlık",
    publisher: "Özel Yayınlar",
    totalDeneme: 30,
    questionsPerDeneme: 9,
    color: "purple",
    icon: "⚖️",
    denemes: Array.from({ length: 30 }, (_, idx) => ({
      id: idx + 1,
      solved: false,
      correct: 0,
      incorrect: 0,
      empty: 9,
      net: 0,
      date: "",
      durationMin: "",
      notes: ""
    }))
  },
  {
    id: "book-pegem-genel-10",
    title: "Pegem 10'lu Genel Deneme Lisans",
    subject: "Genel Deneme",
    publisher: "Pegem Akademi",
    totalDeneme: 10,
    questionsPerDeneme: 120,
    hasBranches: true,
    color: "blue",
    icon: "🎯",
    denemes: Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 1,
      solved: false,
      correct: 0,
      incorrect: 0,
      empty: 120,
      net: 0,
      date: "",
      durationMin: "",
      notes: "",
      branches: createEmptyBranches()
    }))
  }
];

const SUBJECT_STYLES = {
  "Coğrafya": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", badge: "bg-emerald-500/15 text-emerald-400" },
  "Tarih": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", badge: "bg-amber-500/15 text-amber-400" },
  "Vatandaşlık": { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", badge: "bg-purple-500/15 text-purple-400" },
  "Genel Deneme": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", badge: "bg-blue-500/15 text-blue-400" },
  "Türkçe": { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", badge: "bg-rose-500/15 text-rose-400" },
  "Matematik": { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20", badge: "bg-cyan-500/15 text-cyan-400" },
};

const DenemeTakipTab = ({ theme }) => {
  const isDark = theme === "dark";

  // Helper to guarantee branch format on general practice exams
  const ensureBranches = (bookList) => {
    return bookList.map(b => {
      const isGenel = b.id === "book-pegem-genel-10" || b.subject === "Genel Deneme" || b.hasBranches;
      if (!isGenel) return b;
      return {
        ...b,
        hasBranches: true,
        denemes: b.denemes.map(d => ({
          ...d,
          branches: d.branches ? { ...createEmptyBranches(), ...d.branches } : createEmptyBranches()
        }))
      };
    });
  };

  // State: Books List
  const [books, setBooks] = useState(() => {
    const savedV4 = localStorage.getItem("kpss_deneme_kaynaklari_v4");
    if (savedV4) {
      try { return ensureBranches(JSON.parse(savedV4)); } catch (e) {}
    }
    const savedV3 = localStorage.getItem("kpss_deneme_kaynaklari_v3");
    if (savedV3) {
      try { return ensureBranches(JSON.parse(savedV3)); } catch (e) {}
    }
    const savedV2 = localStorage.getItem("kpss_deneme_kaynaklari_v2");
    if (savedV2) {
      try {
        const parsed = JSON.parse(savedV2);
        if (!parsed.some(b => b.id === "book-tarih-500")) {
          const tarih500Book = INITIAL_BOOKS.find(b => b.id === "book-tarih-500");
          if (tarih500Book) parsed.push(tarih500Book);
        }
        return ensureBranches(parsed);
      } catch (e) {}
    }
    return ensureBranches(INITIAL_BOOKS);
  });

  // View Mode State: 'kaynaklar' | 'cizelge'
  const [mainViewMode, setMainViewMode] = useState("kaynaklar");

  // Filters & Expanded Card State
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("Tüm Kaynaklar");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBookId, setExpandedBookId] = useState(null);

  // Modal State for Logging Deneme Result
  const [activeModal, setActiveModal] = useState(null); // { bookId, denemeId }
  const [formData, setFormData] = useState({
    correct: 0,
    incorrect: 0,
    empty: 0,
    date: new Date().toISOString().split("T")[0],
    durationMin: "",
    notes: "",
    branches: createEmptyBranches()
  });

  // Modal State for Adding New Book
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookData, setNewBookData] = useState({
    title: "",
    subject: "Coğrafya",
    publisher: "",
    totalDeneme: 10,
    questionsPerDeneme: 18,
    icon: "📚"
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("kpss_deneme_kaynaklari_v4", JSON.stringify(books));
  }, [books]);

  // Open Log Result Modal
  const handleOpenLogModal = (bookId, denemeId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const deneme = book.denemes.find(d => d.id === denemeId);
    if (!deneme) return;

    setActiveModal({ bookId, denemeId });
    setFormData({
      correct: deneme.solved ? deneme.correct : 0,
      incorrect: deneme.solved ? deneme.incorrect : 0,
      empty: deneme.solved ? deneme.empty : book.questionsPerDeneme,
      date: deneme.date || new Date().toISOString().split("T")[0],
      durationMin: deneme.durationMin || "",
      notes: deneme.notes || "",
      branches: deneme.branches ? { ...createEmptyBranches(), ...deneme.branches } : createEmptyBranches()
    });
  };

  // Handle Score Inputs Change for Standard Exams
  const handleScoreChange = (field, value) => {
    const book = activeModal ? books.find(b => b.id === activeModal.bookId) : null;
    const maxQ = book ? book.questionsPerDeneme : 100;
    const numVal = Math.max(0, parseInt(value) || 0);

    setFormData(prev => {
      let newCorrect = prev.correct;
      let newIncorrect = prev.incorrect;

      if (field === "correct") newCorrect = Math.min(maxQ, numVal);
      if (field === "incorrect") newIncorrect = Math.min(maxQ - newCorrect, numVal);

      const calculatedEmpty = Math.max(0, maxQ - (newCorrect + newIncorrect));

      return {
        ...prev,
        [field]: numVal,
        correct: newCorrect,
        incorrect: newIncorrect,
        empty: calculatedEmpty
      };
    });
  };

  // Handle Score Inputs Change for Branch-Based General Exams
  const handleBranchScoreChange = (branchKey, field, value) => {
    const numVal = Math.max(0, parseInt(value) || 0);
    const branchDef = GENEL_DENEME_BRANCHES.find(b => b.key === branchKey);
    const maxQ = branchDef ? branchDef.totalQuestions : 30;

    setFormData(prev => {
      const currentBranch = prev.branches?.[branchKey] || { correct: 0, incorrect: 0, empty: maxQ, net: 0 };
      let newCorrect = currentBranch.correct;
      let newIncorrect = currentBranch.incorrect;

      if (field === "correct") newCorrect = Math.min(maxQ, numVal);
      if (field === "incorrect") newIncorrect = Math.min(maxQ - newCorrect, numVal);

      const calculatedEmpty = Math.max(0, maxQ - (newCorrect + newIncorrect));
      const calculatedNet = parseFloat((newCorrect - newIncorrect / 4).toFixed(2));

      const updatedBranches = {
        ...prev.branches,
        [branchKey]: {
          correct: newCorrect,
          incorrect: newIncorrect,
          empty: calculatedEmpty,
          net: calculatedNet
        }
      };

      let totalC = 0, totalI = 0, totalE = 0;
      Object.values(updatedBranches).forEach(br => {
        totalC += br.correct || 0;
        totalI += br.incorrect || 0;
        totalE += br.empty || 0;
      });

      return {
        ...prev,
        branches: updatedBranches,
        correct: totalC,
        incorrect: totalI,
        empty: totalE
      };
    });
  };

  // Save Deneme Entry
  const handleSaveDeneme = (e) => {
    e.preventDefault();
    if (!activeModal) return;

    const { bookId, denemeId } = activeModal;
    const book = books.find(b => b.id === bookId);
    const isGenel = book?.hasBranches || book?.subject === "Genel Deneme";

    let correct, incorrect, empty, net, branches;

    if (isGenel) {
      branches = formData.branches || createEmptyBranches();
      correct = 0;
      incorrect = 0;
      empty = 0;
      Object.values(branches).forEach(br => {
        correct += br.correct || 0;
        incorrect += br.incorrect || 0;
        empty += br.empty || 0;
      });
      net = parseFloat((correct - incorrect / 4).toFixed(2));
    } else {
      correct = Math.max(0, parseInt(formData.correct) || 0);
      incorrect = Math.max(0, parseInt(formData.incorrect) || 0);
      empty = Math.max(0, parseInt(formData.empty) || 0);
      net = parseFloat((correct - incorrect / 4).toFixed(2));
      branches = null;
    }

    setBooks(prevBooks =>
      prevBooks.map(b => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          denemes: b.denemes.map(d => {
            if (d.id !== denemeId) return d;
            return {
              ...d,
              solved: true,
              correct,
              incorrect,
              empty,
              net,
              date: formData.date,
              durationMin: formData.durationMin,
              notes: formData.notes,
              ...(branches ? { branches } : {})
            };
          })
        };
      })
    );

    setActiveModal(null);
  };

  // Reset Deneme Entry (Mark as Unsolved)
  const handleResetDeneme = (bookId, denemeId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const isGenel = book.hasBranches || book.subject === "Genel Deneme";

    setBooks(prevBooks =>
      prevBooks.map(b => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          denemes: b.denemes.map(d => {
            if (d.id !== denemeId) return d;
            return {
              ...d,
              solved: false,
              correct: 0,
              incorrect: 0,
              empty: book.questionsPerDeneme,
              net: 0,
              date: "",
              durationMin: "",
              notes: "",
              ...(isGenel ? { branches: createEmptyBranches() } : {})
            };
          })
        };
      })
    );
    setActiveModal(null);
  };

  // Add New Custom Book
  const handleAddNewBook = (e) => {
    e.preventDefault();
    if (!newBookData.title.trim()) return;

    const totalD = Math.max(1, parseInt(newBookData.totalDeneme) || 10);
    const isGenel = newBookData.subject === "Genel Deneme";
    const questionsD = isGenel ? 120 : Math.max(1, parseInt(newBookData.questionsPerDeneme) || 18);

    const newBook = {
      id: "book-custom-" + Date.now(),
      title: newBookData.title.trim(),
      subject: newBookData.subject,
      publisher: newBookData.publisher.trim() || "Kişisel Kaynak",
      totalDeneme: totalD,
      questionsPerDeneme: questionsD,
      hasBranches: isGenel,
      color: newBookData.subject === "Coğrafya" ? "emerald" : newBookData.subject === "Tarih" ? "amber" : newBookData.subject === "Genel Deneme" ? "blue" : "purple",
      icon: newBookData.icon || "📚",
      denemes: Array.from({ length: totalD }, (_, idx) => ({
        id: idx + 1,
        solved: false,
        correct: 0,
        incorrect: 0,
        empty: questionsD,
        net: 0,
        date: "",
        durationMin: "",
        notes: "",
        ...(isGenel ? { branches: createEmptyBranches() } : {})
      }))
    };

    setBooks(prev => [newBook, ...prev]);
    setShowAddBookModal(false);
    setNewBookData({
      title: "",
      subject: "Coğrafya",
      publisher: "",
      totalDeneme: 10,
      questionsPerDeneme: 18,
      icon: "📚"
    });
  };

  // Delete Custom Book
  const handleDeleteBook = (bookId) => {
    if (window.confirm("Bu kitabı ve tüm deneme kayıtlarını silmek istediğinize emin misiniz?")) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
    }
  };

  // Calculate Overall Statistics
  let grandTotalDenemes = 0;
  let grandSolvedDenemes = 0;
  let grandTotalCorrect = 0;
  let grandTotalIncorrect = 0;
  let grandTotalEmpty = 0;
  let sumOfNets = 0;
  let maxNetRecorded = 0;

  books.forEach(b => {
    grandTotalDenemes += b.totalDeneme;
    b.denemes.forEach(d => {
      if (d.solved) {
        grandSolvedDenemes++;
        grandTotalCorrect += d.correct;
        grandTotalIncorrect += d.incorrect;
        grandTotalEmpty += d.empty;
        sumOfNets += d.net;
        if (d.net > maxNetRecorded) maxNetRecorded = d.net;
      }
    });
  });

  const overallProgressPercent = grandTotalDenemes > 0 ? Math.round((grandSolvedDenemes / grandTotalDenemes) * 100) : 0;
  const overallAvgNet = grandSolvedDenemes > 0 ? (sumOfNets / grandSolvedDenemes).toFixed(2) : "0.00";

  // Filter books by subject and search query
  const filteredBooks = books.filter(b => {
    const matchesSubject = selectedSubjectFilter === "Tüm Kaynaklar" || b.subject === selectedSubjectFilter;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── TOP LEVEL VIEW SELECTOR TABS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMainViewMode("kaynaklar")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
              mainViewMode === "kaynaklar"
                ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20"
                : isDark
                  ? "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            📚 Kaynak & Net Takibi
          </button>
          
          <button
            onClick={() => setMainViewMode("cizelge")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer border ${
              mainViewMode === "cizelge"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-500/25"
                : isDark
                  ? "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            🎯 Pegem 10'lu Konu Analiz Çizelgesi
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-400 text-slate-950 uppercase shadow-sm">
              5 Branş
            </span>
          </button>
        </div>

        {mainViewMode === "kaynaklar" && (
          <button
            onClick={() => setShowAddBookModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer transition shrink-0"
          >
            <LuPlus size={16} />
            Yeni Kaynak / Kitap Ekle
          </button>
        )}
      </div>

      {/* ── VIEW 1: PEGEM 10'LU KONU ANALİZ ÇİZELGESİ ── */}
      {mainViewMode === "cizelge" ? (
        <DenemeAnalizCizelgesi theme={theme} />
      ) : (
        <>
          {/* ── HEADER BANNER ── */}
          <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 ${
            isDark
              ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-purple-950/30 border-slate-800"
              : "bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200"
          }`}>
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/10">
                    📚
                  </span>
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                      Kaynak & Branş Denemesi Takip Çizelgesi
                    </h2>
                    <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Elimdeki soru bankaları ve branş denemelerini deneme deneme takip et, doğru/yanlış ve netlerini analiz et!
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Switch to Analysis Grid */}
              <button
                onClick={() => setMainViewMode("cizelge")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition shrink-0"
              >
                <LuSparkles size={16} />
                🎯 Pegem 10'lu Konu Analizi (5 Ders)
              </button>
            </div>

        {/* ── OVERALL METRICS CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/80">
          
          <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Toplam Kaynak</div>
            <div className="text-xl font-black text-purple-400 mt-1">{books.length} Kitap</div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Çözülen Deneme</div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {grandSolvedDenemes} <span className="text-xs font-normal text-slate-400">/ {grandTotalDenemes}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgressPercent}%` }}></div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Genel Net Ortalaması</div>
            <div className="text-xl font-black text-blue-400 mt-1">{overallAvgNet} Net</div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">En Yüksek Net</div>
            <div className="text-xl font-black text-amber-400 mt-1">{maxNetRecorded.toFixed(2)} Net</div>
          </div>

          <div className={`col-span-2 md:col-span-1 p-4 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Toplam D / Y / B</div>
            <div className="text-sm font-black mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400">{grandTotalCorrect} D</span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400">{grandTotalIncorrect} Y</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{grandTotalEmpty} B</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["Tüm Kaynaklar", "Coğrafya", "Tarih", "Vatandaşlık", "Genel Deneme"].map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubjectFilter(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                selectedSubjectFilter === subj
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20"
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
        <div className="relative w-full sm:w-64">
          <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kaynak adı veya yayın ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border outline-none transition ${
              isDark
                ? "bg-slate-900/80 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500"
            }`}
          />
        </div>
      </div>

      {/* ── BOOKS GRID ── */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBooks.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${isDark ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
            <LuBookOpen size={36} className="mx-auto mb-3 opacity-40 text-purple-400" />
            <p className="text-sm font-bold">Aradığınız kriterlere uygun kaynak bulunamadı.</p>
            <button onClick={() => { setSelectedSubjectFilter("Tüm Kaynaklar"); setSearchQuery(""); }} className="mt-3 text-xs font-bold text-purple-500 hover:underline">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          filteredBooks.map(book => {
            const style = SUBJECT_STYLES[book.subject] || SUBJECT_STYLES["Coğrafya"];
            const solvedCount = book.denemes.filter(d => d.solved).length;
            const progressPct = Math.round((solvedCount / book.totalDeneme) * 100);

            let bookTotalNet = 0;
            let bookTotalD = 0;
            let bookTotalY = 0;
            let bookTotalB = 0;

            book.denemes.forEach(d => {
              if (d.solved) {
                bookTotalNet += d.net;
                bookTotalD += d.correct;
                bookTotalY += d.incorrect;
                bookTotalB += d.empty;
              }
            });

            const bookAvgNet = solvedCount > 0 ? (bookTotalNet / solvedCount).toFixed(2) : "0.00";
            const isExpanded = expandedBookId === book.id;
            const isGenelBook = book.hasBranches || book.subject === "Genel Deneme";

            return (
              <div
                key={book.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-xl"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-md"
                }`}
              >
                {/* Book Card Header */}
                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center text-2xl shrink-0">
                      {book.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${style.badge} ${style.border}`}>
                          {book.subject}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {book.publisher} • {book.questionsPerDeneme} Soru / Deneme
                        </span>
                        {isGenelBook && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            Branş Bazlı Takip
                          </span>
                        )}
                      </div>
                      <h3 className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                        {book.title}
                      </h3>
                    </div>
                  </div>

                  {/* Progress & Quick Stats */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-black text-purple-400">{solvedCount} / {book.totalDeneme} Çözüldü (%{progressPct})</div>
                      <div className="text-[11px] font-medium text-slate-400">Ortalama: <strong className={isDark ? "text-white" : "text-slate-900"}>{bookAvgNet} Net</strong></div>
                    </div>

                    {isGenelBook && (
                      <button
                        onClick={() => setMainViewMode("cizelge")}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition"
                        title="Konu bazlı 10'lu Deneme Analiz Çizelgesini Aç"
                      >
                        <LuSparkles size={14} />
                        Konu Analiz Çizelgesi
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border cursor-pointer transition ${
                        isExpanded
                          ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20"
                          : isDark
                            ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isExpanded ? "Denemeleri Gizle" : "Denemeleri Gör & Yönet"}
                      {isExpanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                    </button>

                    {book.id.startsWith("book-custom-") && (
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Kitabı Sil"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Quick Deneme Badges Grid (Always visible overview) */}
                <div className="p-5 md:p-6 bg-slate-500/5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                    <span>{isGenelBook ? "Genel Denemeler Matrix (5 Branş)" : "Branş Denemeleri Matrix"}</span>
                    <span>Tıkla ve Net Girişi Yap 👇</span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2">
                    {book.denemes.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleOpenLogModal(book.id, d.id)}
                        className={`p-2 rounded-xl text-center transition cursor-pointer border flex flex-col items-center justify-center relative group ${
                          d.solved
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 shadow-sm"
                            : isDark
                              ? "bg-slate-900 border-slate-800 text-slate-400 hover:border-purple-500/50 hover:text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:border-purple-400 hover:text-slate-900"
                        }`}
                        title={d.solved ? `Deneme ${d.id}: ${d.net} Net (${d.correct}D / ${d.incorrect}Y)` : `Deneme ${d.id}: Çözülmedi`}
                      >
                        <span className="text-[10px] font-black">#{d.id}</span>
                        {d.solved ? (
                          <span className="text-[9px] font-extrabold text-emerald-400 leading-tight">{d.net}N</span>
                        ) : (
                          <span className="text-[8px] opacity-40">—</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expanded Detailed Table View */}
                {isExpanded && (
                  <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <LuTarget size={14} className="text-purple-400" />
                        {book.title} — Detaylı Deneme Listesi
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        Toplam Net: <strong className="text-emerald-400">{bookTotalNet.toFixed(2)}</strong> ({bookTotalD} Doğru, {bookTotalY} Yanlış, {bookTotalB} Boş)
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                            <th className="py-3 px-3">No</th>
                            <th className="py-3 px-3">Durum</th>
                            <th className="py-3 px-3">Doğru / Yanlış / Boş</th>
                            <th className="py-3 px-3">NET</th>
                            {isGenelBook && <th className="py-3 px-3">Branş Net Dağılımı</th>}
                            <th className="py-3 px-3">Tarih</th>
                            <th className="py-3 px-3">Süre</th>
                            <th className="py-3 px-3">Notlar</th>
                            <th className="py-3 px-3 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {book.denemes.map(d => (
                            <tr key={d.id} className={`hover:bg-slate-500/5 transition ${d.solved ? (isDark ? "bg-emerald-500/5" : "bg-emerald-50/50") : ""}`}>
                              <td className="py-2.5 px-3 font-black text-slate-400">Deneme #{d.id}</td>
                              <td className="py-2.5 px-3">
                                {d.solved ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    ✓ Çözüldü
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                    Henüz Çözülmedi
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-medium">
                                {d.solved ? (
                                  <span className="flex items-center gap-1.5">
                                    <strong className="text-emerald-400">{d.correct} D</strong>
                                    <span className="text-slate-500">•</span>
                                    <strong className="text-rose-400">{d.incorrect} Y</strong>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-400">{d.empty} B</span>
                                  </span>
                                ) : "-"}
                              </td>
                              <td className="py-2.5 px-3 font-black text-blue-400 text-sm">{d.solved ? `${d.net} Net` : "-"}</td>
                              {isGenelBook && (
                                <td className="py-2.5 px-3">
                                  {d.solved && d.branches ? (
                                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold" title={`Türkçe: ${d.branches.turkce?.correct || 0}D / ${d.branches.turkce?.incorrect || 0}Y`}>
                                        TR: {d.branches.turkce?.net ?? 0}N
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold" title={`Matematik: ${d.branches.matematik?.correct || 0}D / ${d.branches.matematik?.incorrect || 0}Y`}>
                                        MAT: {d.branches.matematik?.net ?? 0}N
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold" title={`Tarih: ${d.branches.tarih?.correct || 0}D / ${d.branches.tarih?.incorrect || 0}Y`}>
                                        TAR: {d.branches.tarih?.net ?? 0}N
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold" title={`Coğrafya: ${d.branches.cografya?.correct || 0}D / ${d.branches.cografya?.incorrect || 0}Y`}>
                                        COĞ: {d.branches.cografya?.net ?? 0}N
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold" title={`Vatandaşlık: ${d.branches.vatandaslik?.correct || 0}D / ${d.branches.vatandaslik?.incorrect || 0}Y`}>
                                        VAT: {d.branches.vatandaslik?.net ?? 0}N
                                      </span>
                                    </div>
                                  ) : "-"}
                                </td>
                              )}
                              <td className="py-2.5 px-3 text-slate-400 font-medium">{d.date || "-"}</td>
                              <td className="py-2.5 px-3 text-slate-400 font-medium">{d.durationMin ? `${d.durationMin} dk` : "-"}</td>
                              <td className="py-2.5 px-3 text-slate-400 italic max-w-xs truncate">{d.notes || "-"}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => handleOpenLogModal(book.id, d.id)}
                                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[11px] font-bold transition cursor-pointer"
                                >
                                  {d.solved ? "Düzenle" : "Sonuc Gir"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
      </>
      )}

      {/* ══ MODAL: LOG DENEME RESULT ══ */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          {(() => {
            const book = books.find(b => b.id === activeModal.bookId);
            const isGenelBook = book?.hasBranches || book?.subject === "Genel Deneme";
            const maxQ = book ? book.questionsPerDeneme : 18;
            const netPreview = (formData.correct - formData.incorrect / 4).toFixed(2);

            return (
              <div className={`w-full ${isGenelBook ? "max-w-xl" : "max-w-md"} rounded-2xl border p-6 shadow-2xl relative my-8 ${
                isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <LuX size={18} />
                </button>

                <form onSubmit={handleSaveDeneme} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                      {book?.subject} • {book?.publisher}
                    </span>
                    <h3 className="text-lg font-black tracking-tight mt-0.5">
                      {book?.title} — Deneme #{activeModal.denemeId}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isGenelBook ? "Genel Deneme 120 Soru (Türkçe, Matematik, Tarih, Coğrafya, Vatandaşlık)" : `Bu denemedeki soru sayısı: ${maxQ}`}
                    </p>
                  </div>

                  {/* Net Calculated Live Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-purple-400">Hesaplanan Toplam Net</div>
                      <div className="text-3xl font-black text-purple-400 my-0.5">{netPreview} Net</div>
                      <div className="text-[10px] text-slate-400 font-medium">Formül: Doğru - (Yanlış / 4)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-400">{formData.correct} Doğru</div>
                      <div className="text-xs font-black text-rose-400">{formData.incorrect} Yanlış</div>
                      <div className="text-xs font-bold text-slate-400">{formData.empty} Boş</div>
                    </div>
                  </div>

                  {/* Score Inputs */}
                  {isGenelBook ? (
                    /* ── BRANCH-BASED SCORE INPUTS ── */
                    <div className="space-y-3 pt-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Branş Bazlı Doğru / Yanlış Girişi</span>
                        <span>Toplam 120 Soru</span>
                      </div>

                      {GENEL_DENEME_BRANCHES.map(bDef => {
                        const brData = formData.branches?.[bDef.key] || { correct: 0, incorrect: 0, empty: bDef.totalQuestions, net: 0 };
                        return (
                          <div key={bDef.key} className={`p-3 rounded-xl border transition ${isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${bDef.badgeBg}`}>
                                  {bDef.title}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-400">{bDef.totalQuestions} Soru</span>
                              </div>
                              <div className={`text-xs font-black ${bDef.textCol}`}>
                                Net: {brData.net ?? 0}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-emerald-400 mb-0.5">Doğru (D)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max={bDef.totalQuestions}
                                  value={brData.correct}
                                  onChange={e => handleBranchScoreChange(bDef.key, "correct", e.target.value)}
                                  className={`w-full p-2 rounded-lg border text-center font-black text-xs outline-none ${
                                    isDark ? "bg-slate-900 border-slate-700 text-emerald-400" : "bg-white border-slate-200 text-emerald-600"
                                  }`}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-rose-400 mb-0.5">Yanlış (Y)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max={bDef.totalQuestions}
                                  value={brData.incorrect}
                                  onChange={e => handleBranchScoreChange(bDef.key, "incorrect", e.target.value)}
                                  className={`w-full p-2 rounded-lg border text-center font-black text-xs outline-none ${
                                    isDark ? "bg-slate-900 border-slate-700 text-rose-400" : "bg-white border-slate-200 text-rose-600"
                                  }`}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Boş (B)</label>
                                <input
                                  type="number"
                                  readOnly
                                  value={brData.empty}
                                  className={`w-full p-2 rounded-lg border text-center font-black text-xs outline-none opacity-60 ${
                                    isDark ? "bg-slate-900/50 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ── STANDARD SINGLE SUBJECT SCORE INPUTS ── */
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-400 mb-1">Doğru (D)</label>
                        <input
                          type="number"
                          min="0"
                          max={maxQ}
                          value={formData.correct}
                          onChange={e => handleScoreChange("correct", e.target.value)}
                          className={`w-full p-2.5 rounded-xl border text-center font-black text-sm outline-none ${
                            isDark ? "bg-slate-800 border-slate-700 text-emerald-400" : "bg-slate-50 border-slate-200 text-emerald-600"
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-rose-400 mb-1">Yanlış (Y)</label>
                        <input
                          type="number"
                          min="0"
                          max={maxQ}
                          value={formData.incorrect}
                          onChange={e => handleScoreChange("incorrect", e.target.value)}
                          className={`w-full p-2.5 rounded-xl border text-center font-black text-sm outline-none ${
                            isDark ? "bg-slate-800 border-slate-700 text-rose-400" : "bg-slate-50 border-slate-200 text-rose-600"
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Boş (B)</label>
                        <input
                          type="number"
                          readOnly
                          value={formData.empty}
                          className={`w-full p-2.5 rounded-xl border text-center font-black text-sm outline-none opacity-70 ${
                            isDark ? "bg-slate-800/50 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Optional Details: Date & Duration */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Çözülme Tarihi</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full p-2 text-xs rounded-xl border outline-none ${
                          isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Süre (Dakika)</label>
                      <input
                        type="number"
                        placeholder="Örn: 120"
                        value={formData.durationMin}
                        onChange={e => setFormData({ ...formData, durationMin: e.target.value })}
                        className={`w-full p-2 text-xs rounded-xl border outline-none ${
                          isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Notlar / Hatalı Konular</label>
                    <textarea
                      rows="2"
                      placeholder="Dikkat hatası yapılan konular, tekrar edilecek başlıklar..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => handleResetDeneme(activeModal.bookId, activeModal.denemeId)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      Sıfırla / Çözülmedi Yap
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-500/25 transition cursor-pointer"
                      >
                        Sonucu Kaydet
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══ MODAL: ADD NEW BOOK ══ */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <button
              onClick={() => setShowAddBookModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <LuX size={18} />
            </button>

            <form onSubmit={handleAddNewBook} className="space-y-4">
              <div>
                <h3 className="text-lg font-black tracking-tight">Yeni Kaynak / Kitap Ekle</h3>
                <p className="text-xs text-slate-400">Takip etmek istediğiniz yeni deneme kitabını ekleyin.</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Kitap / Yayın Adı *</label>
                <input
                  type="text"
                  placeholder="Örn: Benim Hoca Coğrafya Branş Denemesi"
                  value={newBookData.title}
                  onChange={e => setNewBookData({ ...newBookData, title: e.target.value })}
                  className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                    isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Ders / Kategori</label>
                  <select
                    value={newBookData.subject}
                    onChange={e => setNewBookData({ ...newBookData, subject: e.target.value })}
                    className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  >
                    <option value="Coğrafya">Coğrafya</option>
                    <option value="Tarih">Tarih</option>
                    <option value="Vatandaşlık">Vatandaşlık</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="Matematik">Matematik</option>
                    <option value="Genel Deneme">Genel Deneme (5 Branş)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Yayıncı / Yazar</label>
                  <input
                    type="text"
                    placeholder="Örn: Pegem, Yargı"
                    value={newBookData.publisher}
                    onChange={e => setNewBookData({ ...newBookData, publisher: e.target.value })}
                    className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Toplam Deneme Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newBookData.totalDeneme}
                    onChange={e => setNewBookData({ ...newBookData, totalDeneme: e.target.value })}
                    className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Deneme Başı Soru Sayısı</label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={newBookData.subject === "Genel Deneme" ? 120 : newBookData.questionsPerDeneme}
                    disabled={newBookData.subject === "Genel Deneme"}
                    onChange={e => setNewBookData({ ...newBookData, questionsPerDeneme: e.target.value })}
                    className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                      newBookData.subject === "Genel Deneme" ? "opacity-60 cursor-not-allowed " : ""
                    }${
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-500/25 transition cursor-pointer"
                >
                  Kitabı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DenemeTakipTab;
