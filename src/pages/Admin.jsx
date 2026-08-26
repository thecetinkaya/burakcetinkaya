import React, { useState, useEffect, Suspense, lazy } from "react";
import { db } from "../lib/supabase";

// Lazy Loaded Sub-Tabs for High Performance
const StockTab = lazy(() => import("./admin/StockTab"));
const KpssTab = lazy(() => import("./admin/KpssTab"));
const ProjectsTab = lazy(() => import("./admin/ProjectsTab"));
const VideoTakipTab = lazy(() => import("./admin/VideoTakipTab"));
const ImportantSitesTab = lazy(() => import("./admin/ImportantSitesTab"));
const SettingsTab = lazy(() => import("./admin/SettingsTab"));
const DashboardTab = lazy(() => import("./admin/DashboardTab"));
const PomodoroTab = lazy(() => import("./admin/PomodoroTab"));
const TarihKartlariTab = lazy(() => import("./admin/TarihKartlariTab"));
const HafizaTeknikleriTab = lazy(() => import("./admin/HafizaTeknikleriTab"));
const HafizaTeknikleriEgitTab = lazy(() => import("./admin/HafizaTeknikleriEgitTab"));
const KpssGuncelBilgilerTab = lazy(() => import("./admin/KpssGuncelBilgilerTab"));
const GeographyMapQuiz = lazy(() => import("./admin/GeographyMapQuiz"));
const DenemeTakipTab = lazy(() => import("./admin/DenemeTakipTab"));
const NotesTab = lazy(() => import("./admin/NotesTab"));
import {
  LuChartLine, LuListTodo, LuFolderOpen, LuSettings, LuLogOut,
  LuShieldCheck, LuChevronLeft, LuChevronRight, LuChevronDown, LuLock,
  LuMail, LuHourglass, LuSun, LuMoon, LuCircle, LuCheck
} from "react-icons/lu";

const GeographyIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const SecurityBookletIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

// Custom high-fidelity SVGs matching Gemini Advanced side panels
const BCLogo = () => (
  <div className="relative w-8 h-8 flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-md shadow-emerald-500/10 select-none">
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 via-teal-600 to-blue-500"></div>
    {/* Glossy Overlay */}
    <div className="absolute inset-[1px] bg-slate-900/10 dark:bg-slate-900/35 backdrop-blur-[2px] rounded-[10px]"></div>
    {/* Text Monogram */}
    <span className="relative text-[12px] font-black tracking-tighter text-white font-sans">
      BC
    </span>
  </div>
);

const NewChatIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ImagesIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const VideosIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const PomodoroIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LibraryIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const NotebookIcon = () => (
  <svg className="w-3.5 h-3.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 3v18" />
  </svg>
);

const NotesIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-emerald-400 fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const SidebarToggleIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const ThreeDotsIcon = () => (
  <svg className="w-3.5 h-3.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const CogIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const EgitIcon = () => (
  <svg className="w-4.5 h-4.5 stroke-purple-400 fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

// Categorized Navigation Groups for Clean & Related Tab Organization
const NAV_GROUPS = [
  {
    category: "📌 Genel & Üretkenlik",
    items: [
      { id: "dashboard", label: "Genel Bakış", icon: DashboardIcon, badge: null },
      { id: "notes", label: "Not Defteri", icon: NotesIcon, badge: "Zettelkasten" },
      { id: "pomodoro", label: "Çalışma & Pomodoro", icon: PomodoroIcon, badge: "Timer" },
    ]
  },
  {
    category: "🎓 KPSS 2026 Hazırlık",
    items: [
      { id: "kpss", label: "Konu & Görev Planlayıcı", icon: SearchIcon, badge: "Kanban" },
      { id: "denemetakip", label: "Kaynak & Deneme Takibi", icon: LibraryIcon, badge: "Deneme" },
      { id: "videos", label: "Ders Video Takip", icon: VideosIcon, badge: "Video" },
      { id: "guncel", label: "KPSS Güncel Bilgiler 2026", icon: LibraryIcon, badge: "2026" },
    ]
  },
  {
    category: "🧠 Akıl & Hafıza Teknikleri",
    items: [
      { id: "hafiza", label: "Hafıza Teknikleri", icon: NotebookIcon, badge: null },
      { id: "hafizaegit", label: "KPSS Hafıza (Eğit)", icon: EgitIcon, badge: "AI Bot" },
      { id: "cografya", label: "Haritalarla Coğrafya", icon: GeographyIcon, badge: "Quiz" },
      { id: "tarihkartlari", label: "Tarih Bilgi Kartları", icon: LibraryIcon, badge: null },
    ]
  },
  {
    category: "💼 Finans & Yazılım",
    items: [
      { id: "stocks", label: "Borsa & BES Portföyü", icon: NewChatIcon, badge: "Portföy" },
      { id: "projects", label: "Proje Yönetimi", icon: ImagesIcon, badge: null },
      { id: "sites", label: "Önemli Siteler & AI", icon: BookmarkIcon, badge: null },
    ]
  },
  {
    category: "⚙️ Sistem",
    items: [
      { id: "settings", label: "Ayarlar & Profil", icon: CogIcon, badge: null },
    ]
  }
];

const Admin = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "dashboard";
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");

  // Theme state
  const [themePref, setThemePref] = useState(() => {
    return localStorage.getItem("admin_theme_pref") || "system";
  });
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    localStorage.setItem("admin_theme_pref", themePref);
    if (themePref === "system") {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? "dark" : "light");
      const handler = (e) => setTheme(e.matches ? "dark" : "light");
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setTheme(themePref);
    }
  }, [themePref]);

  // Sync activeTab to localStorage
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Countdown timers state
  const [kpssTimeLeft, setKpssTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    checkSession();
  }, []);



  // Set up live countdown ticking
  useEffect(() => {
    if (!profile) return;

    const calculateTimeLeft = (targetDate) => {
      if (!targetDate) return { days: 0, hours: 0, minutes: 0 };
      const cleanDate = targetDate.replace(/-/g, "/");
      const targetTime = new Date(`${cleanDate} 09:00:00`).getTime();

      if (isNaN(targetTime)) return { days: 0, hours: 0, minutes: 0 };

      const difference = targetTime - Date.now();
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0 };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60)
      };
    };

    setKpssTimeLeft(calculateTimeLeft(profile.kpss_date));

    const interval = setInterval(() => {
      setKpssTimeLeft(calculateTimeLeft(profile.kpss_date));
    }, 60000);

    return () => clearInterval(interval);
  }, [profile]);

  const checkSession = async () => {
    setLoading(true);
    try {
      const { data: { user: sessionUser } } = await db.auth.getSessionUser();
      if (sessionUser) {
        setUser(sessionUser);
        const { data: userProfile } = await db.auth.getProfile(sessionUser.id);
        setProfile(userProfile);
      }
    } catch (err) {
      console.error("Oturum kontrol edilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");

    try {
      const { data, error } = await db.auth.login(email, password);
      if (error) throw error;

      setUser(data.user);
      const { data: userProfile } = await db.auth.getProfile(data.user.id);
      setProfile(userProfile);
    } catch (err) {
      setAuthError(err.message || "Giriş başarısız oldu.");
    } finally {
      setLoggingIn(false);
    }
  };

  const toggleTheme = () => {
    setThemePref(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    if (!window.confirm("Çıkış yapmak istediğinize emin misiniz?")) return;
    try {
      await db.auth.logout();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Çıkış yapılırken hata:", err);
    }
  };



  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#090e1a] text-slate-400" : "bg-slate-50 text-slate-500"}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Asistan Yükleniyor...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN RENDER
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans ${theme === "dark" ? "bg-[#090e1a]" : "bg-slate-50"
        }`}>
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Theme Switcher on Login Screen */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full border transition cursor-pointer ${theme === "dark"
              ? "bg-[#121824] border-slate-800 text-amber-400 hover:bg-slate-855"
              : "bg-white border-slate-200 text-slate-655 hover:bg-slate-100"
              }`}
          >
            {theme === "dark" ? <LuSun size={14} /> : <LuMoon size={14} />}
          </button>
        </div>

        <div className={`w-full max-w-md border p-8 rounded-3xl shadow-2xl relative z-10 ${theme === "dark"
          ? "bg-[#121824]/60 backdrop-blur-xl border-slate-800"
          : "bg-white border-slate-200/80"
          }`}>
          <div className="text-center mb-8">
            <div className={`inline-flex p-3.5 rounded-2xl mb-3 border ${theme === "dark"
              ? "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/25"
              : "bg-emerald-50 text-[#0f9f72] border-emerald-100"
              }`}>
              <LuShieldCheck size={28} />
            </div>
            <h2 className={`text-2xl font-black tracking-tight ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>
              Kişisel Asistan Girişi
            </h2>
            <p className={`text-xs mt-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              Yönetim ve takip paneline erişmek için oturum açın.
            </p>
          </div>

          {authError && (
            <div className={`border text-xs py-3 px-4 rounded-xl mb-6 font-semibold ${theme === "dark"
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
              : "bg-rose-50 border-rose-100 text-rose-650"
              }`}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-4xs font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-455" : "text-slate-655"}`}>
                E-Posta Adresi
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500">
                  <LuMail size={14} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-all ${theme === "dark"
                    ? "bg-[#090e1a] border-slate-800 focus:border-emerald-550 focus:ring-1 focus:ring-emerald-500/30 text-slate-100 placeholder-slate-700"
                    : "bg-slate-50 border-slate-205 focus:border-emerald-550 focus:ring-1 focus:ring-emerald-500/20 text-slate-800 placeholder-slate-400"
                    }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-4xs font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-slate-455" : "text-slate-655"}`}>
                Şifre
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500">
                  <LuLock size={14} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-all ${theme === "dark"
                    ? "bg-[#090e1a] border-slate-800 focus:border-emerald-550 focus:ring-1 focus:ring-emerald-500/30 text-slate-100"
                    : "bg-slate-50 border-slate-205 focus:border-emerald-550 focus:ring-1 focus:ring-emerald-500/20 text-slate-800"
                    }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-slate-950 font-black py-3 rounded-xl transition duration-200 mt-2 flex items-center justify-center gap-2 text-sm shadow shadow-emerald-500/10 cursor-pointer"
            >
              {loggingIn ? "Giriş Yapılıyor..." : "Yönetim Paneline Gir"}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // MAIN DASHBOARD PANEL RENDER
  return (
    <div className={`min-h-screen flex font-sans antialiased overflow-x-hidden pt-0 transition-colors duration-250 ${theme === "dark" ? "bg-[#090e1a] text-slate-200 dark" : "bg-slate-50 text-slate-800"
      }`}>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-35 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* SIDEBAR - GEMINI ADVANCED THEME */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 border-r md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "md:w-18 w-68" : "w-68"} ${
          theme === "dark"
            ? "bg-white/[0.01] border-white/5 backdrop-blur-xl text-slate-100"
            : "bg-white/80 border-black/5 backdrop-blur-xl text-slate-800"
        }`}
      >
        <svg style={{ display: "none" }}>
          <defs>
            <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="30%" stopColor="#9b51e0" />
              <stop offset="70%" stopColor="#e94235" />
              <stop offset="100%" stopColor="#fabb05" />
            </linearGradient>
          </defs>
        </svg>

        {isCollapsed ? (
          /* COLLAPSED SIDEBAR VIEW */
          <div className="flex-1 flex flex-col justify-between items-center py-4 w-full">
            <div className="group relative flex items-center justify-center w-full mb-4">
              <button onClick={() => setIsCollapsed(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#1e1f20] transition cursor-pointer">
                <SidebarToggleIcon />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5 w-full overflow-y-auto custom-scrollbar px-1 py-1">
              {NAV_GROUPS.map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {groupIdx > 0 && <div className="w-6 border-b border-slate-700/40 my-1.5"></div>}
                  {group.items.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <div key={tab.id} className="relative group/tooltip">
                        <button
                          onClick={() => { setIsCollapsed(false); setActiveTab(tab.id); setMobileMenuOpen(false); }}
                          className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                            isActive
                              ? theme === "dark" ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm" : "bg-purple-100 text-purple-700 border border-purple-200 shadow-sm"
                              : theme === "dark" ? "text-slate-400 hover:bg-[#1e1f20] hover:text-slate-100" : "text-slate-600 hover:bg-[#e2e7ec]"
                          }`}
                        >
                          <Icon />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-slate-950 text-slate-100 text-xs font-bold shadow-2xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition z-50">
                          <span className="text-[9px] text-purple-400 font-black uppercase tracking-wider block mb-0.5">{group.category}</span>
                          {tab.label}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="relative flex flex-col items-center gap-4 w-full border-t border-slate-200/50 dark:border-slate-800/60 pt-4 pb-2">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`p-2 rounded-xl transition cursor-pointer ${theme === "dark" ? "text-slate-400 hover:text-slate-100 hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-black/5"}`}
              >
                <CogIcon />
              </button>
              
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 hover:border-slate-400 transition cursor-pointer shrink-0"
              >
                <img
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                  <div className={`absolute bottom-0 left-14 mb-2 w-48 rounded-2xl border shadow-xl z-50 p-2 ${theme === "dark" ? "bg-[#1e1f20] border-white/10" : "bg-white border-black/10"}`}>
                    <button onClick={() => { setActiveTab("settings"); setIsCollapsed(false); setProfileMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>Ayarlar & Profil</button>
                    <div className="relative group/theme w-full">
                      <div className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition cursor-default ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                        <div className="flex items-center gap-2">
                           {theme === "dark" ? <LuMoon size={14}/> : <LuSun size={14}/>} 
                           Tema
                        </div>
                        <LuChevronRight size={14} className="opacity-50" />
                      </div>
                      <div className={`absolute bottom-0 left-full ml-1 w-48 rounded-2xl border shadow-xl p-1.5 opacity-0 invisible group-hover/theme:opacity-100 group-hover/theme:visible transition-all duration-200 z-[60] ${theme === "dark" ? "bg-[#1e1f20] border-white/10" : "bg-white border-black/10"}`}>
                        <button onClick={() => { setThemePref("system"); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                          Sistem {themePref === "system" && <LuCheck size={14}/>}
                        </button>
                        <button onClick={() => { setThemePref("light"); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                          Açık {themePref === "light" && <LuCheck size={14}/>}
                        </button>
                        <button onClick={() => { setThemePref("dark"); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                          Koyu {themePref === "dark" && <LuCheck size={14}/>}
                        </button>
                      </div>
                    </div>
                    <div className={`my-1 border-t ${theme === "dark" ? "border-white/10" : "border-black/5"}`}></div>
                    <button onClick={() => { handleLogout(); setProfileMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition ${theme === "dark" ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-rose-50 text-rose-600"}`}>Çıkış Yap</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* EXPANDED SIDEBAR VIEW */
          <div className="flex-1 flex flex-col justify-between h-full w-full overflow-hidden">
            <div className="p-4 flex items-center justify-between shrink-0 border-b border-slate-200/30 dark:border-slate-800/40">
              <div onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }} className="flex items-center gap-2.5 select-none cursor-pointer">
                <BCLogo />
                <div>
                  <span className={`text-sm font-black tracking-tight block ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    Asistanım
                  </span>
                  <span className="text-[10px] font-bold text-purple-400 tracking-wide uppercase block -mt-0.5">
                    Modüler Yönetim
                  </span>
                </div>
              </div>
              <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-lg cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
                <SidebarToggleIcon />
              </button>
            </div>

            {/* Quick Search Bar */}
            <div className="px-3 pt-3 pb-1 shrink-0">
              <div className={`relative flex items-center rounded-xl border px-3 py-1.5 transition ${
                theme === "dark" ? "bg-slate-900/80 border-slate-800 text-slate-200 focus-within:border-purple-500/50" : "bg-slate-100 border-slate-200 text-slate-800"
              }`}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Sekme ara..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full bg-transparent text-xs pl-2.5 focus:outline-none placeholder:text-slate-500 font-medium"
                />
                {sidebarSearch && (
                  <button onClick={() => setSidebarSearch("")} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
                )}
              </div>
            </div>

            {/* Categorized Nav List */}
            <nav className="px-3 py-2 space-y-3.5 flex-1 overflow-y-auto custom-scrollbar">
              {NAV_GROUPS.map((group, groupIdx) => {
                const filteredItems = group.items.filter(item =>
                  item.label.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
                  group.category.toLowerCase().includes(sidebarSearch.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div 
                    key={groupIdx} 
                    className={`rounded-2xl p-2 transition-all border ${
                      theme === "dark" 
                        ? "bg-slate-900/50 border-slate-800/80 shadow-sm" 
                        : "bg-slate-100/70 border-slate-200/90 shadow-2xs"
                    }`}
                  >
                    {/* Category Header */}
                    <div className="px-2.5 py-1.5 mb-1.5 flex items-center justify-between border-b border-slate-800/40 dark:border-slate-800/50">
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        {group.category}
                      </span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.3 rounded-full border ${
                        theme === "dark" ? "bg-purple-950/80 text-purple-300 border-purple-800/50" : "bg-purple-100 text-purple-800 border-purple-200"
                      }`}>
                        {filteredItems.length}
                      </span>
                    </div>

                    {/* Sub-items */}
                    <div className="space-y-1">
                      {filteredItems.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${isActive
                              ? theme === "dark"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 border border-purple-400/40"
                                : "bg-purple-600 text-white shadow-md shadow-purple-500/20 border border-purple-500"
                              : theme === "dark"
                                ? "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                                : "text-slate-700 hover:bg-black/[0.06] hover:text-slate-900"
                              }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon />
                              <span className="truncate">{tab.label}</span>
                            </div>
                            {tab.badge && (
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border shrink-0 ${
                                isActive
                                  ? "bg-white/20 text-white border-white/30"
                                  : theme === "dark" ? "bg-slate-950 text-purple-400 border-slate-800" : "bg-white text-purple-700 border-slate-300"
                              }`}>
                                {tab.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
            <div className="mt-auto shrink-0">
              {/* KPSS countdown box */}
              <div className={`px-5 py-2.5 space-y-1.5 border-t border-slate-200/30 dark:border-slate-800/40 transition-all ${theme === "dark" ? "bg-[#1e1f20]/30" : "bg-slate-200/20"
                }`}>
                {/* KPSS */}
                <div className="flex items-center gap-2.5 text-4xs">
                  <span className={`px-1.5 py-0.5 rounded-md font-extrabold border text-5xs tracking-wide uppercase ${theme === "dark"
                    ? "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/25"
                    : "text-purple-750 bg-purple-50 border-purple-100"
                    }`}>
                    KPSS
                  </span>
                  <span className={`font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {kpssTimeLeft.days}g {kpssTimeLeft.hours}sa {kpssTimeLeft.minutes}dk
                  </span>
                </div>
              </div>

              <div className={`relative p-3.5 border-t ${theme === "dark" ? "border-white/5 bg-transparent" : "border-black/5 bg-transparent"}`}>
                <div onClick={() => setProfileMenuOpen(!profileMenuOpen)} className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"} className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className={`text-xs font-black truncate transition ${theme === "dark" ? "text-slate-200" : "text-slate-850"}`}>
                        {profile?.first_name || "Burak"} {profile?.last_name || "Çetinkaya"}
                      </div>
                      <div className={`text-5xs font-black uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>
                        Pro
                      </div>
                    </div>
                  </div>
                  <CogIcon />
                </div>
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                    <div className={`absolute bottom-full left-4 right-4 mb-2 rounded-2xl border shadow-xl z-50 p-2 ${theme === "dark" ? "bg-[#1e1f20] border-white/10" : "bg-white border-black/10"}`}>
                      <button onClick={() => { setActiveTab("settings"); setProfileMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>Ayarlar & Profil</button>
                    <div className="relative group/theme w-full">
                      <div className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition cursor-default ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                        <div className="flex items-center gap-2">
                           {theme === "dark" ? <LuMoon size={14}/> : <LuSun size={14}/>} 
                           Tema
                        </div>
                        <LuChevronRight size={14} className="opacity-50" />
                      </div>
                      <div className={`absolute bottom-0 left-full ml-1 w-48 rounded-2xl border shadow-xl p-1.5 opacity-0 invisible group-hover/theme:opacity-100 group-hover/theme:visible transition-all duration-200 z-[60] ${theme === "dark" ? "bg-[#1e1f20] border-white/10" : "bg-white border-black/10"}`}>
                        <button onClick={() => { setThemePref("system"); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                          Sistem {themePref === "system" && <LuCheck size={14}/>}
                        </button>
                        <button onClick={() => { setThemePref("light"); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                          Açık {themePref === "light" && <LuCheck size={14}/>}
                        </button>
                        <button onClick={() => { setThemePref("dark"); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition ${theme === "dark" ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-100 text-slate-800"}`}>
                          Koyu {themePref === "dark" && <LuCheck size={14}/>}
                        </button>
                      </div>
                    </div>
                      <div className={`my-1 border-t ${theme === "dark" ? "border-white/10" : "border-black/5"}`}></div>
                      <button onClick={() => { handleLogout(); setProfileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition ${theme === "dark" ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-rose-50 text-rose-600"}`}>
                        Çıkış Yap <LuLogOut size={12}/>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto h-screen">
        {/* Mobile Navbar Header */}
        <header className={`md:hidden flex items-center justify-between p-4 border-b shrink-0 z-20 transition-colors duration-300 ${
          theme === "dark" ? "bg-[#131314] border-slate-800/80 text-slate-100" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                theme === "dark" ? "text-slate-400 hover:text-slate-150 hover:bg-[#1e1f20]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-2xs"
              }`}
            >
              <SidebarToggleIcon />
            </button>
            <span className="text-sm font-black tracking-tight">Asistanım</span>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Theme switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                theme === "dark" ? "bg-slate-950 border-slate-850 text-amber-400 hover:bg-slate-850" : "bg-white border-slate-205 text-slate-655 hover:bg-slate-100"
              }`}
            >
              {theme === "dark" ? <LuSun size={11} /> : <LuMoon size={11} />}
            </button>
            
            {/* Profile trigger or tab */}
            <button 
              type="button"
              onClick={() => setActiveTab("settings")}
              className="w-7 h-7 rounded-full overflow-hidden border border-slate-600 cursor-pointer hover:opacity-85 transition"
            >
              <img 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </button>
          </div>
        </header>

        {/* TOP DESKTOP CATEGORY NAVIGATION BAR */}
        <div className={`hidden md:flex items-center gap-2.5 px-6 py-3 border-b shrink-0 overflow-x-auto custom-scrollbar transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0b101d] border-slate-800/70 text-slate-200" : "bg-white border-slate-200 text-slate-700 shadow-2xs"
        }`}>
          {NAV_GROUPS.map((group, groupIdx) => {
            const isGroupActive = group.items.some(item => item.id === activeTab);
            return (
              <div key={groupIdx} className="relative group/cat">
                <button
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-2 border cursor-pointer ${
                    isGroupActive
                      ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20"
                      : theme === "dark"
                        ? "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/70"
                  }`}
                >
                  <span>{group.category}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    isGroupActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {group.items.length}
                  </span>
                  <LuChevronDown size={13} className="opacity-70 group-hover/cat:rotate-180 transition-transform" />
                </button>

                {/* Dropdown Menu for Category Sub-Items */}
                <div className={`absolute top-full left-0 mt-1.5 w-60 rounded-2xl border shadow-2xl p-1.5 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-[70] ${
                  theme === "dark" ? "bg-[#141926] border-slate-800" : "bg-white border-slate-200"
                }`}>
                  {group.items.map(subItem => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeTab === subItem.id;
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveTab(subItem.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition cursor-pointer text-left ${
                          isSubActive
                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                            : theme === "dark"
                              ? "hover:bg-white/5 text-slate-300"
                              : "hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <SubIcon />
                          <span className="truncate">{subItem.label}</span>
                        </div>
                        {subItem.badge && (
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                            isSubActive ? "bg-white/20 text-white" : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                          }`}>
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <main className={`p-6 flex-1 w-full max-w-full ${theme === "dark" ? "bg-[#090e1a]" : "bg-slate-50"}`}>
          <Suspense fallback={
            <div className="flex items-center justify-center p-16 text-slate-400">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Modül Yükleniyor...</span>
              </div>
            </div>
          }>
            {activeTab === "dashboard" && <DashboardTab theme={theme} setActiveTab={setActiveTab} profile={profile} />}
            {activeTab === "notes" && <NotesTab theme={theme} />}
            {activeTab === "stocks" && <StockTab theme={theme} />}
            {activeTab === "kpss" && <KpssTab theme={theme} />}
            {activeTab === "cografya" && <GeographyMapQuiz theme={theme} />}
            {activeTab === "hafiza" && <HafizaTeknikleriTab theme={theme} />}
            {activeTab === "hafizaegit" && <HafizaTeknikleriEgitTab theme={theme} />}
            {activeTab === "guncel" && <KpssGuncelBilgilerTab theme={theme} />}
            {activeTab === "videos" && <VideoTakipTab theme={theme} />}
            {activeTab === "tarihkartlari" && <TarihKartlariTab theme={theme} />}
            {activeTab === "pomodoro" && <PomodoroTab theme={theme} />}
            {activeTab === "denemetakip" && <DenemeTakipTab theme={theme} />}
            {activeTab === "projects" && <ProjectsTab theme={theme} />}
            {activeTab === "sites" && <ImportantSitesTab theme={theme} />}
            {activeTab === "settings" && (
              <SettingsTab
                profile={profile}
                theme={theme}
                onProfileUpdate={(newProfile) => setProfile(newProfile)}
              />
            )}
          </Suspense>
        </main>
      </div>

    </div>
  );
};

export default Admin;
