import React, { useState, Suspense, lazy } from "react";
import { 
  LuListTodo, LuChartLine, LuBookOpen, LuGlobe, LuBrain, 
  LuVideo, LuTimer, LuNotebook, LuSparkles, LuCheck, LuArrowLeft
} from "react-icons/lu";

// Lazy Loaded KPSS Sub-Tabs
const KpssTab = lazy(() => import("../../pages/admin/KpssTab"));
const DenemeTakipTab = lazy(() => import("../../pages/admin/DenemeTakipTab"));
const VideoTakipTab = lazy(() => import("../../pages/admin/VideoTakipTab"));
const KpssGuncelBilgilerTab = lazy(() => import("../../pages/admin/KpssGuncelBilgilerTab"));
const GeographyMapQuiz = lazy(() => import("../../pages/admin/GeographyMapQuiz"));
const HafizaTeknikleriTab = lazy(() => import("../../pages/admin/HafizaTeknikleriTab"));
const TarihKartlariTab = lazy(() => import("../../pages/admin/TarihKartlariTab"));
const PomodoroTab = lazy(() => import("../../pages/admin/PomodoroTab"));
const DersNotlariTab = lazy(() => import("../../pages/admin/DersNotlariTab"));

// Loader Fallback Component
const TabLoader = () => (
  <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
    <div className="w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs font-semibold uppercase tracking-wider">Modül Yükleniyor...</span>
  </div>
);

/**
 * KPSS / AGS / TYT / AYT Canlı Öğrenci Çalışma Paneli (Workspace)
 */
const KpssWorkspaceView = ({ initialTab = "kanban", onBackToLanding = () => {} }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const TABS = [
    { id: "kanban", label: "Konu Planlayıcı", icon: LuListTodo, badge: "Kanban" },
    { id: "deneme", label: "Deneme & Net Takip", icon: LuChartLine, badge: "Analiz" },
    { id: "guncel", label: "Güncel Bilgiler 2026", icon: LuBookOpen, badge: "2026" },
    { id: "cografya", label: "Coğrafya Quiz", icon: LuGlobe, badge: "Harita" },
    { id: "hafiza", label: "Hafıza Teknikleri & AI", icon: LuBrain, badge: "AI Bot" },
    { id: "tarihkartlari", label: "Tarih Kartları", icon: LuBookOpen },
    { id: "videos", label: "Video Takip", icon: LuVideo },
    { id: "pomodoro", label: "Pomodoro Timer", icon: LuTimer },
    { id: "notes", label: "Ders Notlarım", icon: LuNotebook }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Workspace Top Header Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Canlı Öğrenci Çalışma Portalı</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              KPSS • AGS • YKS Sınav Çalışma Alanı
            </h1>
          </div>

          <button
            onClick={onBackToLanding}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <LuArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Tanıtım & Fiyatlandırmaya Dön</span>
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
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

        {/* Tab Content Display Box */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-8 shadow-2xl backdrop-blur-xl min-h-[500px]">
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
        </div>

      </div>
    </div>
  );
};

export default KpssWorkspaceView;
