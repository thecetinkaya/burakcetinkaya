import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/supabase";
import { 
  LuListTodo, LuChartLine, LuBookOpen, LuGlobe, LuBrain, 
  LuVideo, LuTimer, LuNotebook, LuSparkles, LuCheck, LuArrowLeft,
  LuLock, LuZap, LuLogOut, LuSun, LuMoon, LuUserCheck, LuShieldCheck, LuCrown
} from "react-icons/lu";

import KpssPricing from "../components/kpss/KpssPricing";

// Lazy Loaded KPSS Sub-Tabs
const KpssTab = lazy(() => import("./admin/KpssTab"));
const DenemeTakipTab = lazy(() => import("./admin/DenemeTakipTab"));
const VideoTakipTab = lazy(() => import("./admin/VideoTakipTab"));
const KpssGuncelBilgilerTab = lazy(() => import("./admin/KpssGuncelBilgilerTab"));
const GeographyMapQuiz = lazy(() => import("./admin/GeographyMapQuiz"));
const HafizaTeknikleriTab = lazy(() => import("./admin/HafizaTeknikleriTab"));
const TarihKartlariTab = lazy(() => import("./admin/TarihKartlariTab"));
const PomodoroTab = lazy(() => import("./admin/PomodoroTab"));
const DersNotlariTab = lazy(() => import("./admin/DersNotlariTab"));

// Loader Fallback Component
const TabLoader = () => (
  <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs font-semibold uppercase tracking-wider">Modül Yükleniyor...</span>
  </div>
);

/**
 * Giriş Yapmış Kullanıcılar İçin Müstakil Öğrenci Çalışma Paneli (/student)
 */
const StudentWorkspacePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("kanban");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // User Plan State: "free" | "premium"
  const [userPlan, setUserPlan] = useState(() => {
    return localStorage.getItem("kpss_user_plan") || "free";
  });

  // Dark/Light Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

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

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const { data: { user: sessionUser } } = await db.auth.getSessionUser();
        if (sessionUser) {
          setUser(sessionUser);
          if (sessionUser.plan) {
            setUserPlan(sessionUser.plan);
            localStorage.setItem("kpss_user_plan", sessionUser.plan);
          }
        } else {
          // If not logged in, redirect directly to /kpss SaaS landing page!
          navigate("/kpss", { replace: true });
        }
      } catch (err) {
        navigate("/kpss", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener("kpss_auth_change", handleAuthChange);
    return () => window.removeEventListener("kpss_auth_change", handleAuthChange);
  }, [navigate]);

  const handleLogout = async () => {
    await db.auth.logout();
    navigate("/kpss", { replace: true });
  };

  const handleUpgradeSuccess = () => {
    setUserPlan("premium");
    localStorage.setItem("kpss_user_plan", "premium");
    setUpgradeModalOpen(false);
  };

  const TABS = [
    { id: "kanban", label: "Konu Planlayıcı", icon: LuListTodo, isPremium: false, badge: "Ücretsiz" },
    { id: "deneme", label: "Deneme & Net Takip", icon: LuChartLine, isPremium: true, badge: "Premium" },
    { id: "guncel", label: "Güncel Bilgiler 2026", icon: LuBookOpen, isPremium: false, badge: "Ücretsiz" },
    { id: "cografya", label: "Coğrafya Quiz", icon: LuGlobe, isPremium: false, badge: "Ücretsiz" },
    { id: "hafiza", label: "Hafıza Teknikleri & AI", icon: LuBrain, isPremium: true, badge: "Premium" },
    { id: "tarihkartlari", label: "Tarih Kartları", icon: LuBookOpen, isPremium: false },
    { id: "videos", label: "Ders Video Takip", icon: LuVideo, isPremium: true, badge: "Premium" },
    { id: "pomodoro", label: "Pomodoro Timer", icon: LuTimer, isPremium: false },
    { id: "notes", label: "Ders Notlarım", icon: LuNotebook, isPremium: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-wider">Oturum Kontrol Ediliyor...</span>
      </div>
    );
  }

  if (!user) return null;

  const currentTabObj = TABS.find(t => t.id === activeTab) || TABS[0];
  const isLocked = currentTabObj.isPremium && userPlan === "free";

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* Student Workspace Header Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-emerald-400 text-sm">
                KP
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white">Öğrenci Çalışma Paneli</span>
                {userPlan === "premium" ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/30 flex items-center gap-1">
                    <LuCrown className="w-3 h-3 text-amber-400" /> Premium Öğrenci
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase border border-slate-700">
                    Free Plan
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">👤 {user.email || "Öğrenci Hesabı"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {userPlan === "free" && (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <LuZap className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Premium'a Yükselt (₺100/ay)</span>
                <span className="sm:hidden">Premium</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-amber-300 border border-slate-800 cursor-pointer"
              title="Tema Değiştir"
            >
              {theme === "dark" ? <LuSun className="w-4 h-4 text-amber-400" /> : <LuMoon className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LuLogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Banner Notification for Free Plan User */}
        {userPlan === "free" && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <LuSparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Ücretsiz Paket Kullanıyorsunuz
                </h3>
                <p className="text-[11px] text-slate-400">
                  Free planda Konu Planlayıcı, Güncel Bilgiler 2026, Coğrafya Quiz ve Ders Notları açıktır. Gelişmiş Deneme Analizi ve AI Hafıza Teknikleri için Premium'a geçebilirsiniz.
                </p>
              </div>
            </div>

            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shrink-0"
            >
              Aboneliği Yükselt 🚀
            </button>
          </div>
        )}

        {/* Workspace Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isTabLocked = tab.isPremium && userPlan === "free";

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black"
                    : isTabLocked
                    ? "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : isTabLocked ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {isTabLocked && (
                  <LuLock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                {tab.badge && !isTabLocked && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                    isActive ? "bg-slate-950 text-emerald-300" : "bg-slate-800 text-slate-400"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Workspace Content Display Box */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-8 shadow-2xl backdrop-blur-xl min-h-[550px] relative">
          
          {isLocked ? (
            /* Premium Locked Feature Screen */
            <div className="py-20 text-center max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
                <LuLock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase border border-amber-500/30">
                  Premium Özellik Kilitli 🔒
                </span>
                <h2 className="text-2xl font-black text-white">
                  {currentTabObj.label} Modülüne Erişmek İçin Premium Paket Gereklidir
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bu modül yapay zeka destekli analizler, Türkiye geneli net grafikleri ve sınırsız kaynakları içerir. Aylık sadece 100 TL veya Yıllık 1000 TL ile sınırsız erişim sağlayın.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setUpgradeModalOpen(true)}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <LuZap className="w-4 h-4 fill-current" />
                  <span>Premium Aboneliği Başlat (₺100 / ay)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unlocked Component Display */
            <Suspense fallback={<TabLoader />}>
              {activeTab === "kanban" && <KpssTab />}
              {activeTab === "deneme" && <DenemeTakipTab />}
              {activeTab === "guncel" && <KpssGuncelBilgilerTab />}
              {activeTab === "cografya" && <GeographyMapQuiz />}
              {activeTab === "hafiza" && <HafizaTeknikleriTab />}
              {activeTab === "tarihkartlari" && <TarihKartlariTab />}
              {activeTab === "videos" && <VideoTakipTab />}
              {activeTab === "pomodoro" && <PomodoroTab />}
              {activeTab === "notes" && <DersNotlariTab />}
            </Suspense>
          )}

        </div>

      </main>

      {/* Upgrade / Pricing Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4 my-8">
            <button
              onClick={() => setUpgradeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <KpssPricing onSelectPlan={handleUpgradeSuccess} />
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentWorkspacePage;
