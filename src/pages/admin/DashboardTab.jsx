import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { 
  LuTrendingUp, 
  LuGraduationCap, 
  LuSquarePlay, 
  LuSquareKanban, 
  LuBookmark, 
  LuSettings,
  LuSparkles,
  LuClock
} from "react-icons/lu";

const DashboardTab = ({ theme, setActiveTab, profile }) => {
  const isDark = theme === "dark";
  const [summaryData, setSummaryData] = useState({ loading: true, activeTasks: 0, kpssDays: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const { data: kpssTasks } = await db.kpss_tasks.fetchAll();
        // Since there is no projects fetchAll in mock we'll just use kpss_tasks if available or fallback
        const activeCount = (kpssTasks || []).filter(t => t.status !== 'done').length;

        // Calculate KPSS Days Left
        let daysLeft = null;
        if (profile?.kpss_date) {
          const kpssDate = new Date(profile.kpss_date);
          const today = new Date();
          const diffTime = kpssDate - today;
          daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        setSummaryData({ loading: false, activeTasks: activeCount, kpssDays: daysLeft });
      } catch (err) {
        console.error(err);
        setSummaryData({ loading: false, activeTasks: 0, kpssDays: null });
      }
    };
    fetchData();
  }, [profile]);

  // Tokens
  const tokens = {
    bgContainer: isDark ? "bg-[#090e1a] border-white/5 shadow-2xl" : "bg-[#fcfcfc] border-black/5 shadow-sm",
    textPrimary: isDark ? "text-white/90" : "text-[#1d1d1f]",
    textSecondary: isDark ? "text-white/40" : "text-[#86868b]",
  };

  const widgets = [
    {
      id: "stocks",
      title: "Borsa Portföyü",
      desc: "Hisse senedi yatırımlarınızı, kar/zarar durumunuzu takip edin.",
      icon: LuTrendingUp,
      bgHover: isDark ? "hover:bg-emerald-500/[0.03]" : "hover:bg-emerald-50",
      borderHover: isDark ? "hover:border-emerald-500/30" : "hover:border-emerald-500/30",
      shadowHover: isDark ? "hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)]",
      iconBg: isDark ? "bg-emerald-500/10" : "bg-emerald-100",
      iconColor: isDark ? "text-emerald-400" : "text-emerald-600",
      glowBg: "bg-emerald-500/20"
    },
    {
      id: "kpss",
      title: "KPSS Planlayıcı",
      desc: "Sınav sayaçları, çalışma programı ve net takibi yapın.",
      icon: LuGraduationCap,
      bgHover: isDark ? "hover:bg-purple-500/[0.03]" : "hover:bg-purple-50",
      borderHover: isDark ? "hover:border-purple-500/30" : "hover:border-purple-500/30",
      shadowHover: isDark ? "hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]" : "hover:shadow-[0_4px_20px_rgba(168,85,247,0.15)]",
      iconBg: isDark ? "bg-purple-500/10" : "bg-purple-100",
      iconColor: isDark ? "text-purple-400" : "text-purple-600",
      glowBg: "bg-purple-500/20"
    },
    {
      id: "videos",
      title: "Ders Video Takip",
      desc: "İzlediğiniz ders videolarını bölüm bölüm ilerleme ile kaydedin.",
      icon: LuSquarePlay,
      bgHover: isDark ? "hover:bg-blue-500/[0.03]" : "hover:bg-blue-50",
      borderHover: isDark ? "hover:border-blue-500/30" : "hover:border-blue-500/30",
      shadowHover: isDark ? "hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
      iconBg: isDark ? "bg-blue-500/10" : "bg-blue-100",
      iconColor: isDark ? "text-blue-400" : "text-blue-600",
      glowBg: "bg-blue-500/20"
    },
    {
      id: "projects",
      title: "Proje Yönetimi",
      desc: "Kanban board ile projelerinizi yönetin ve görevleri takip edin.",
      icon: LuSquareKanban,
      bgHover: isDark ? "hover:bg-amber-500/[0.03]" : "hover:bg-amber-50",
      borderHover: isDark ? "hover:border-amber-500/30" : "hover:border-amber-500/30",
      shadowHover: isDark ? "hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]" : "hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)]",
      iconBg: isDark ? "bg-amber-500/10" : "bg-amber-100",
      iconColor: isDark ? "text-amber-400" : "text-amber-600",
      glowBg: "bg-amber-500/20"
    },
    {
      id: "sites",
      title: "Önemli Siteler",
      desc: "Tüm sık kullanılan bağlantılarınızı ağaç yapısında yönetin.",
      icon: LuBookmark,
      bgHover: isDark ? "hover:bg-indigo-500/[0.03]" : "hover:bg-indigo-50",
      borderHover: isDark ? "hover:border-indigo-500/30" : "hover:border-indigo-500/30",
      shadowHover: isDark ? "hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]" : "hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)]",
      iconBg: isDark ? "bg-indigo-500/10" : "bg-indigo-100",
      iconColor: isDark ? "text-indigo-400" : "text-indigo-600",
      glowBg: "bg-indigo-500/20"
    }
  ];

  return (
    <div className="animate-fade-in pb-32 flex flex-col h-full w-full">
      <div className={`w-full rounded-[32px] p-6 md:p-10 transition-colors duration-500 border ${tokens.bgContainer}`}>
        
        {/* Header */}
        <div className="mb-8 w-full">
          <h1 className={`text-[32px] font-bold tracking-tight mb-2 ${tokens.textPrimary}`}>
            Genel Bakış
          </h1>
          <p className={`text-[15px] ${tokens.textSecondary}`}>
            Tüm panellerinize hızlı ve kolay bir şekilde erişin.
          </p>
        </div>
      <div className={`w-full rounded-[32px] p-6 md:p-8 mb-8 transition-colors duration-500 border relative overflow-hidden ${
        isDark ? "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/5 shadow-2xl" : "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100 shadow-sm"
      }`}>
        {/* Dekoratif Arka Plan Işığı */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-30 ${isDark ? "bg-purple-500" : "bg-purple-300"}`}></div>
        <div className={`absolute -left-20 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-30 ${isDark ? "bg-blue-500" : "bg-blue-300"}`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <LuSparkles className={isDark ? "text-amber-400" : "text-amber-500"} size={20} />
              <h2 className={`font-bold text-lg ${tokens.textPrimary}`}>Günlük Zeka Özeti</h2>
            </div>
            
            {summaryData.loading ? (
              <div className="h-6 w-48 bg-black/5 dark:bg-white/5 rounded animate-pulse"></div>
            ) : (
              <div className="space-y-1">
                <p className={`text-[15px] leading-relaxed font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  Günaydın {profile?.first_name || "Kullanıcı"}! 
                  {summaryData.kpssDays !== null && summaryData.kpssDays > 0 && (
                    <span className="font-bold"> KPSS'ye {summaryData.kpssDays} gün kaldı.</span>
                  )}
                </p>
                <p className={`text-[14px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Bugün seni bekleyen toplam <span className="font-bold text-purple-500 dark:text-purple-400">{summaryData.activeTasks} adet aktif görev</span> bulunuyor. Çalışmalarına hemen başlamak için aşağıdaki modülleri kullanabilirsin.
                </p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setActiveTab("kpss")}
            className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-[16px] font-bold text-sm transition-all duration-300 ${
              isDark 
                ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" 
                : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm"
            }`}
          >
            <LuClock size={16} />
            Hemen Çalışmaya Başla
          </button>
        </div>
      </div>

      {/* Main Container for Widgets */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            return (
              <div 
                key={widget.id}
                onClick={() => setActiveTab(widget.id)}
                className={`group relative flex flex-col w-full p-6 rounded-[24px] border transition-all duration-300 ease-out cursor-pointer ${
                  isDark ? "bg-white/[0.015] border-white/5 backdrop-blur-xl" : "bg-white border-black/[0.04]"
                } ${widget.bgHover} ${widget.borderHover} ${widget.shadowHover} hover:-translate-y-1`}
              >
                {/* Glow behind icon */}
                <div className="relative w-14 h-14 mb-6 rounded-[16px] flex items-center justify-center shrink-0 transition-colors">
                  <div className={`absolute inset-0 rounded-[16px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${widget.glowBg}`}></div>
                  <div className={`relative z-10 w-full h-full flex items-center justify-center rounded-[16px] ${widget.iconBg}`}>
                    <Icon strokeWidth={2} size={24} className={widget.iconColor} />
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className={`font-semibold text-[18px] tracking-tight mb-2 ${tokens.textPrimary}`}>
                    {widget.title}
                  </h3>
                  <p className={`text-[14px] leading-relaxed ${tokens.textSecondary}`}>
                    {widget.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};

export default DashboardTab;
