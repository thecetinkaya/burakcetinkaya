import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LuGraduationCap, LuSparkles, LuUserCheck, LuLogIn, 
  LuSun, LuMoon, LuMenu, LuX, LuLayoutDashboard, LuArrowLeft, LuShieldCheck
} from "react-icons/lu";

/**
 * KPSS / AGS / TYT / AYT Hazırlık Platformu Özel Navigasyon Çubuğu
 */
const KpssNavbar = ({ 
  currentMode = "landing", // "landing" | "workspace"
  onToggleMode = () => {}, 
  onOpenAuth = () => {}, 
  user = null,
  onLogout = () => {}
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Dark/Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentMode !== "landing") {
      onToggleMode("landing");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/85 dark:bg-[#070b14]/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-2xl py-3" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Back to Main Home */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold border border-slate-700/50"
            title="Ana Sayfaya Dön"
          >
            <LuArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>

          <div 
            onClick={() => onToggleMode("landing")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <LuGraduationCap className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  KPSS <span className="text-emerald-400">PRO</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">KPSS • AGS • YKS • TYT • AYT</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
          <button 
            onClick={() => scrollToSection("features")}
            className="hover:text-emerald-400 transition cursor-pointer"
          >
            Özellikler
          </button>
          <button 
            onClick={() => scrollToSection("interactive-video")}
            className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 text-emerald-300"
          >
            <LuSparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            İnteraktif Videolar
          </button>
          <button 
            onClick={() => scrollToSection("pricing")}
            className="hover:text-emerald-400 transition cursor-pointer"
          >
            Fiyatlandırma
          </button>
          <button 
            onClick={() => scrollToSection("mobile-app")}
            className="hover:text-emerald-400 transition cursor-pointer text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            App Store / Play Store 📱
          </button>
        </nav>

        {/* Right Controls: Workspace Toggle, Theme & Auth */}
        <div className="flex items-center gap-3">
          
          {/* Workspace Mode Switcher Button */}
          <button
            onClick={() => {
              if (user) {
                navigate("/student");
              } else {
                onOpenAuth("login");
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-emerald-500/20"
          >
            <LuLayoutDashboard className="w-4 h-4" />
            <span>{user ? "Öğrenci Paneline Git ➔" : "Giriş Yap / Panele Geç"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition cursor-pointer"
            title={theme === "dark" ? "Açık Moda Geç" : "Koyu Moda Geç"}
          >
            {theme === "dark" ? <LuSun className="w-4 h-4 text-amber-400" /> : <LuMoon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-semibold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                👤 {user.email?.split('@')[0] || "Öğrenci"}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 transition cursor-pointer"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition items-center gap-1.5 cursor-pointer"
            >
              <LuLogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Giriş Yap / Üye Ol</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
          >
            {mobileMenuOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3 font-semibold text-slate-300 text-sm">
            <button 
              onClick={() => scrollToSection("features")}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition"
            >
              🚀 Özellikler & Modüller
            </button>
            <button 
              onClick={() => scrollToSection("interactive-video")}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition flex items-center justify-between"
            >
              <span>🎬 İnteraktif Videolar</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">YENİ</span>
            </button>
            <button 
              onClick={() => scrollToSection("pricing")}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition"
            >
              💎 Fiyatlandırma & Paketler
            </button>
            <button 
              onClick={() => scrollToSection("mobile-app")}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition"
            >
              📱 Mobil Uygulama (App Store & Play Store)
            </button>
          </div>

          {!user && (
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth("login"); }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-bold text-center border border-slate-800"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth("register"); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black text-center"
              >
                Ücretsiz Kayıt Ol
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default KpssNavbar;
