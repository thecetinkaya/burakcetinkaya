import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/supabase";
import { 
  LuListTodo, LuChartLine, LuBookOpen, LuGlobe, LuBrain, 
  LuVideo, LuTimer, LuNotebook, LuSparkles, LuCheck, LuTarget, LuSettings,
  LuLock, LuZap, LuLogOut, LuSun, LuMoon, LuCrown, LuMenu, LuX, LuChevronRight, LuUser
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
const SoruDagilimiTab = lazy(() => import("./admin/SoruDagilimiTab"));
const StudentSettingsTab = lazy(() => import("./admin/StudentSettingsTab"));

// Loader Fallback Component
const TabLoader = () => (
  <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs font-bold uppercase tracking-wider">Modül Yükleniyor...</span>
  </div>
);

/**
 * Müstakil Sol Menülü (Left Sidebar) Öğrenci Dashboard Sayfası (/student)
 * Bağımsız Sol Menü Yüksekliği (Fixed h-screen) & Tam Genişlik Yayınımı
 */
const StudentWorkspacePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("kanban");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
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
    { id: "kanban", label: "Konu Planlayıcı", icon: LuListTodo, category: "Temel Araçlar", isPremium: false },
    { id: "sorudagilimi", label: "Soru Dağılımı & Rehber", icon: LuTarget, category: "Temel Araçlar", isPremium: false },
    { id: "guncel", label: "Güncel Bilgiler 2026", icon: LuBookOpen, category: "Temel Araçlar", isPremium: false },
    { id: "cografya", label: "Coğrafya Quiz", icon: LuGlobe, category: "Temel Araçlar", isPremium: false },
    { id: "tarihkartlari", label: "Tarih Kartları", icon: LuBookOpen, category: "Temel Araçlar", isPremium: false },
    { id: "pomodoro", label: "Pomodoro Timer", icon: LuTimer, category: "Temel Araçlar", isPremium: false },
    { id: "notes", label: "Ders Notlarım", icon: LuNotebook, category: "Temel Araçlar", isPremium: false },

    { id: "deneme", label: "Deneme & Net Takip", icon: LuChartLine, category: "Analiz & AI", isPremium: true },
    { id: "hafiza", label: "Hafıza Teknikleri & AI", icon: LuBrain, category: "Analiz & AI", isPremium: true },
    { id: "videos", label: "Ders Video Takip", icon: LuVideo, category: "Analiz & AI", isPremium: true },

    { id: "settings", label: "Ayarlar & Profil", icon: LuUser, category: "Sistem", isPremium: false }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] dark:bg-[#070b14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-wider">Oturum Kontrol Ediliyor...</span>
      </div>
    );
  }

  if (!user) return null;

  const currentTabObj = TABS.find(t => t.id === activeTab) || TABS[0];
  const isLocked = currentTabObj.isPremium && userPlan === "free";

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200 ${
      theme === "dark" 
        ? "bg-[#070b14] text-slate-100" 
        : "bg-slate-100 text-slate-900"
    }`}>
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {mobileSidebarOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
          </button>
          <span className="font-black text-sm text-slate-900 dark:text-white">KPSS PRO 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-amber-400 cursor-pointer"
          >
            {theme === "dark" ? <LuSun className="w-4 h-4" /> : <LuMoon className="w-4 h-4 text-slate-700" />}
          </button>
          {userPlan === "free" && (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
            >
              Yükselt
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-screen relative">
        
        {/* Independent Fixed Left Sidebar (Ekrandan uzamayan h-screen sabit menü) */}
        <aside className={`fixed top-0 left-0 h-screen z-50 w-64 transform lg:transform-none transition-transform duration-300 ease-in-out flex flex-col border-r shadow-2xl ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          theme === "dark" 
            ? "bg-slate-950 border-slate-800/80 text-slate-200" 
            : "bg-white border-slate-200 text-slate-800"
        }`}>
          
          {/* Sidebar Header Logo */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-emerald-500/20">
                KP
              </div>
              <div>
                <h1 className="font-black text-sm tracking-tight text-slate-900 dark:text-white">KPSS PRO 2026</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Öğrenci Paneli</p>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          {/* User Plan Badge Box */}
          <div className="p-3.5 mx-4 mt-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Abonelik</span>
              {userPlan === "premium" ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-500 dark:text-amber-300 text-[10px] font-black uppercase flex items-center gap-1 border border-amber-400/30">
                  <LuCrown className="w-3 h-3" /> Premium
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                  Free Paket
                </span>
              )}
            </div>

            {userPlan === "free" && (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <LuZap className="w-3.5 h-3.5 fill-current" />
                <span>Premium'a Geç (₺100)</span>
              </button>
            )}
          </div>

          {/* Independently Scrollable Sidebar Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
            
            {["Temel Araçlar", "Analiz & AI", "Sistem"].map((cat) => {
              const categoryTabs = TABS.filter(t => t.category === cat);
              if (categoryTabs.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                    {cat}
                  </p>
                  
                  {categoryTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isTabLocked = tab.isPremium && userPlan === "free";

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : isTabLocked ? "text-amber-500 dark:text-amber-400" : "text-slate-500"}`} />
                          <span>{tab.label}</span>
                        </div>

                        {isTabLocked ? (
                          <LuLock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        ) : isActive ? (
                          <LuChevronRight className="w-4 h-4 text-slate-950" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              );
            })}

          </nav>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2 shrink-0">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-slate-500 font-semibold">Tema Seçimi</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-amber-400 border border-slate-300 dark:border-slate-800 cursor-pointer"
                title="Tema Değiştir"
              >
                {theme === "dark" ? <LuSun className="w-4 h-4" /> : <LuMoon className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-900 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-500 border border-slate-300 dark:border-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LuLogOut className="w-4 h-4" />
              <span>Oturumu Kapat</span>
            </button>
          </div>

        </aside>

        {/* Main Content Viewport (Full Width Layout with Independent Scrolling) */}
        <main className="lg:ml-64 flex-1 p-4 sm:p-8 min-h-screen w-full overflow-y-auto">
          
          {/* Free Plan Top Warning Card */}
          {userPlan === "free" && (
            <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <LuSparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Ücretsiz Öğrenci Hesabı
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Konu Planlayıcı, Güncel Bilgiler, Coğrafya Quiz ve Ders Notları açıktır. Gelişmiş Net Analizleri ve AI Modülü için Premium'a geçebilirsiniz.
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

          {/* Module Content Display Box - Full Width */}
          <div className="w-full rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-8 shadow-xl min-h-[650px] relative">
            
            {isLocked ? (
              /* Premium Locked Feature Screen */
              <div className="py-20 text-center max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 dark:text-amber-400 shadow-xl">
                  <LuLock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-black uppercase border border-amber-500/30">
                    Premium Özellik 🔒
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {currentTabObj.label} Modülüne Erişmek İçin Premium Paket Gereklidir
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Bu modül yapay zeka destekli analizler, Türkiye geneli net grafikleri ve sınırsız kaynakları içerir. Aylık 100 TL veya Yıllık 1000 TL ile sınırsız erişim sağlayın.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setUpgradeModalOpen(true)}
                    className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <LuZap className="w-4 h-4 fill-current" />
                    <span>Premium Aboneliği Başlat (₺100 / ay)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Unlocked Subcomponent View */
              <Suspense fallback={<TabLoader />}>
                {activeTab === "kanban" && <KpssTab theme={theme} />}
                {activeTab === "sorudagilimi" && <SoruDagilimiTab theme={theme} />}
                {activeTab === "guncel" && <KpssGuncelBilgilerTab theme={theme} />}
                {activeTab === "cografya" && <GeographyMapQuiz theme={theme} />}
                {activeTab === "hafiza" && <HafizaTeknikleriTab theme={theme} />}
                {activeTab === "tarihkartlari" && <TarihKartlariTab theme={theme} />}
                {activeTab === "videos" && <VideoTakipTab theme={theme} />}
                {activeTab === "pomodoro" && <PomodoroTab theme={theme} />}
                {activeTab === "notes" && <DersNotlariTab theme={theme} />}
                {activeTab === "deneme" && <DenemeTakipTab theme={theme} />}
                {activeTab === "settings" && <StudentSettingsTab theme={theme} onThemeToggle={toggleTheme} />}
              </Suspense>
            )}

          </div>

        </main>

      </div>

      {/* Upgrade / Pricing Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4 my-8">
            <button
              onClick={() => setUpgradeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
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
