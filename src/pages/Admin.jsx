import React, { useState, useEffect } from "react";
import { db } from "../lib/supabase";
import StockTab from "./admin/StockTab";
import KpssTab from "./admin/KpssTab";
import ProjectsTab from "./admin/ProjectsTab";
import VideoTakipTab from "./admin/VideoTakipTab";
import SettingsTab from "./admin/SettingsTab";
import {
  FaChartLine, FaTasks, FaFolderOpen, FaCog, FaSignOutAlt,
  FaUserShield, FaChevronLeft, FaChevronRight, FaLock,
  FaEnvelope, FaHourglassHalf, FaSun, FaMoon, FaCircle
} from "react-icons/fa";

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

const Admin = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "stocks"; // stocks, kpss, projects, settings
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("admin_theme") || "dark";
  });

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
  const [alesTimeLeft, setAlesTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    checkSession();
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("admin_theme", theme);
  }, [theme]);

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
    setAlesTimeLeft(calculateTimeLeft(profile.ales_date));

    const interval = setInterval(() => {
      setKpssTimeLeft(calculateTimeLeft(profile.kpss_date));
      setAlesTimeLeft(calculateTimeLeft(profile.ales_date));
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

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
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
            {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
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
              <FaUserShield size={28} />
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
                  <FaEnvelope size={14} />
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
                  <FaLock size={14} />
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
        className={`fixed md:relative inset-y-0 left-0 z-40 flex flex-col justify-between transition-all duration-300 border-r md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "md:w-18 w-68" : "w-68"} ${
          theme === "dark"
            ? "bg-[#131314] border-[#202124] text-slate-100"
            : "bg-[#f0f4f9] border-[#e3e3e3] text-slate-800"
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
            <div className="group relative flex items-center justify-center w-full mb-6">
              <button onClick={() => setIsCollapsed(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1e1f20] transition cursor-pointer">
                <SidebarToggleIcon />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3 w-full">
              {[
                { id: "stocks", label: "Borsa Portföyü", icon: NewChatIcon },
                { id: "kpss", label: "KPSS Planlayıcı", icon: SearchIcon },
                { id: "videos", label: "Ders Video Takip", icon: VideosIcon },
                { id: "projects", label: "Proje Yönetimi", icon: ImagesIcon },
                { id: "settings", label: "Ayarlar & Profil", icon: CogIcon }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => { setIsCollapsed(false); setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`p-2.5 rounded-full transition cursor-pointer ${isActive ? theme === "dark" ? "bg-[#1e1f20] text-slate-100" : "bg-[#e2e7ec] text-slate-905" : theme === "dark" ? "text-slate-400 hover:bg-[#1e1f20]" : "text-slate-600 hover:bg-[#e2e7ec]"}`}>
                    <Icon />
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col items-center gap-4 w-full border-t border-slate-200/50 dark:border-slate-800/60 pt-4">
              {/* Settings Gear */}
              <button
                onClick={() => {
                  setIsCollapsed(false);
                  setActiveTab("settings");
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#1e1f20] transition cursor-pointer"
              >
                <FaCog size={16} />
              </button>

              {/* User Avatar */}
              <button
                onClick={() => {
                  setIsCollapsed(false);
                  setActiveTab("settings");
                  setMobileMenuOpen(false);
                }}
                className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 hover:border-slate-400 transition cursor-pointer shrink-0"
              >
                <img
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        ) : (
          /* EXPANDED SIDEBAR VIEW */
          <div className="flex-1 flex flex-col justify-between h-full overflow-hidden w-full">
            <div className="p-4 flex items-center justify-between shrink-0">
              <div onClick={() => { setActiveTab("stocks"); setMobileMenuOpen(false); }} className="select-none cursor-pointer">
                <span className={`text-base font-black tracking-tight ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                  Asistanım
                </span>
              </div>
              <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-lg cursor-pointer">
                <SidebarToggleIcon />
              </button>
            </div>
            <nav className="px-3 py-2 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
              {[
                { id: "stocks", label: "Borsa Portföyü", icon: NewChatIcon },
                { id: "kpss", label: "KPSS Planlayıcı", icon: SearchIcon },
                { id: "videos", label: "Ders Video Takip", icon: VideosIcon },
                { id: "projects", label: "Proje Yönetimi", icon: ImagesIcon },
                { id: "settings", label: "Ayarlar & Profil", icon: CogIcon }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-left ${isActive
                      ? theme === "dark"
                        ? "bg-[#1e1f20] text-slate-100"
                        : "bg-[#e2e7ec] text-slate-905"
                      : theme === "dark"
                        ? "text-slate-400 hover:bg-[#1e1f20]/50 hover:text-slate-200"
                        : "text-slate-600 hover:bg-[#e2e7ec]/50 hover:text-slate-900"
                      }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto shrink-0">
              {/* KPSS / ALES countdown boxes */}
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

                {/* ALES */}
                <div className="flex items-center gap-2.5 text-4xs">
                  <span className={`px-1.5 py-0.5 rounded-md font-extrabold border text-5xs tracking-wide uppercase ${theme === "dark"
                    ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/25"
                    : "text-indigo-750 bg-indigo-50 border-indigo-105"
                    }`}>
                    ALES
                  </span>
                  <span className={`font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    {alesTimeLeft.days}g {alesTimeLeft.hours}sa {alesTimeLeft.minutes}dk
                  </span>
                </div>
              </div>

              <div className={`p-3.5 border-t ${theme === "dark" ? "border-slate-800/60 bg-[#171719]" : "border-slate-200 bg-[#e7ebf0]"}`}>
                <div className="flex items-center justify-between">
                  <div onClick={() => setActiveTab("settings")} className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0">
                    <img src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"} className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className={`text-xs font-black truncate group-hover:text-purple-500 transition ${theme === "dark" ? "text-slate-200" : "text-slate-850"}`}>
                        {profile?.first_name || "Burak"} {profile?.last_name || "Çetinkaya"}
                      </div>
                      <div className={`text-5xs font-black uppercase tracking-wider ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>
                        Pro
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Theme Switcher */}
                    <button
                      onClick={toggleTheme}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${theme === "dark"
                        ? "bg-slate-950 border-slate-800 text-amber-400 hover:bg-slate-850"
                        : "bg-white border-slate-200 text-slate-655 hover:bg-slate-105 shadow-2xs"
                        }`}
                      title={theme === "dark" ? "Açık Tema" : "Koyu Tema"}
                    >
                      {theme === "dark" ? <FaSun size={10} /> : <FaMoon size={10} />}
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className={`border border-transparent rounded-lg transition cursor-pointer p-1.5 ${theme === "dark"
                        ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 hover:border-rose-500/10"
                        : "text-slate-655 hover:text-rose-650 hover:bg-rose-50 hover:border-rose-100"
                        }`}
                      title="Çıkış Yap"
                    >
                      <FaSignOutAlt size={12} />
                    </button>
                  </div>
                </div>
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
              {theme === "dark" ? <FaSun size={11} /> : <FaMoon size={11} />}
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

        <main className={`p-6 flex-1 w-full max-w-full ${theme === "dark" ? "bg-[#090e1a]" : "bg-slate-50"}`}>
          {activeTab === "stocks" && <StockTab theme={theme} />}
          {activeTab === "kpss" && <KpssTab theme={theme} />}
          {activeTab === "videos" && <VideoTakipTab theme={theme} />}
          {activeTab === "projects" && <ProjectsTab theme={theme} />}
          {activeTab === "settings" && (
            <SettingsTab
              profile={profile}
              theme={theme}
              onProfileUpdate={(newProfile) => setProfile(newProfile)}
            />
          )}
        </main>
      </div>

    </div>
  );
};

export default Admin;
