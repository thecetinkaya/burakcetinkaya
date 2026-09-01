import React, { useState, useEffect } from "react";
import { 
  LuGraduationCap, LuSparkles, LuArrowRight, LuCheck, 
  LuShieldCheck, LuSmartphone, LuZap, LuClock, LuBookOpen, LuTrophy, LuStar
} from "react-icons/lu";

/**
 * KPSS / AGS / TYT / AYT SaaS Landing Hero Karşılama Manşet Bileşeni
 */
const KpssHero = ({ 
  onStart = () => {}, 
  onOpenAuth = () => {}, 
  onExploreVideo = () => {} 
}) => {
  // KPSS 2026 Hedef Geri Sayımı (Varsayılan 2026 Temmuz)
  const [timeLeft, setTimeLeft] = useState({ days: 300, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const targetDate = new Date("2026-07-19T09:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#070b14] text-white">
      {/* Background Glowing Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges & Mobile Announcement */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <LuSparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Tüm Sınavlar İçin Tek Platform: KPSS • AGS • TYT • AYT</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold">
            <LuSmartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Yakında <strong className="text-white">App Store</strong> & <strong className="text-white">Google Play</strong>'de!</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15]">
            Sınav Hazırlığında <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Yapay Zeka Ve İnteraktif
            </span> Devrim
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            KPSS, AGS, TYT ve AYT sınavlarına hazırlık sürecini Akıllı Konu Planlayıcı, Haritalı Coğrafya Quizleri, İnteraktif Ders Videoları ve AI Hafıza Kartları ile yönetin.
          </p>

          {/* Countdown Widget */}
          <div className="inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/25 backdrop-blur-xl shadow-xl my-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <LuClock className="w-3.5 h-3.5" /> 2026 KPSS Lisans / Önlisans Kalan Süre
            </span>
            <div className="flex items-center gap-3 sm:gap-6 text-center">
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-white font-mono">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gün</span>
              </div>
              <span className="text-xl sm:text-3xl font-bold text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saat</span>
              </div>
              <span className="text-xl sm:text-3xl font-bold text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-teal-300 font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dakika</span>
              </div>
              <span className="text-xl sm:text-3xl font-bold text-slate-600">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-black text-cyan-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saniye</span>
              </div>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStart}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:scale-[1.02] flex items-center gap-3 cursor-pointer"
            >
              <LuZap className="w-5 h-5 fill-current" />
              <span>Hemen Ücretsiz Dene</span>
              <LuArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreVideo}
              className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-base border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex items-center gap-2.5 cursor-pointer backdrop-blur-xl"
            >
              <LuSparkles className="w-5 h-5 text-amber-400" />
              <span>İnteraktif Videoları Test Et</span>
            </button>
          </div>

          {/* Feature Bullets */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400 pt-4">
            <div className="flex items-center gap-1.5">
              <LuCheck className="w-4 h-4 text-emerald-400" />
              <span>Kredi Kartı Gerekmez</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuCheck className="w-4 h-4 text-emerald-400" />
              <span>Sınırsız Deneme Analizi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuCheck className="w-4 h-4 text-emerald-400" />
              <span>Güncel Bilgiler 2026 Modülü</span>
            </div>
          </div>

        </div>

        {/* Hero Visual Mockup Grid */}
        <div className="mt-14 relative rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-slate-800/40 to-slate-900/60 shadow-2xl backdrop-blur-2xl">
          <div className="bg-slate-950/90 rounded-[22px] p-4 sm:p-8 overflow-hidden">
            
            {/* Mock Header bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">kpss-pro-workspace.app</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                <LuTrophy className="w-3.5 h-3.5" />
                <span>Canlı Çalışma Modu Aktif</span>
              </div>
            </div>

            {/* Feature Cards Showcase Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform">
                  <LuBookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">Konu & Görev Planlayıcı</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ders bazlı konuları Kanban panosunda sürükleyip bırakarak adım adım bitirin.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                  <span>%82 Tamamlandı</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[82%] h-full bg-emerald-400"></div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3 text-cyan-400 group-hover:scale-110 transition-transform">
                  <LuTrophy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">Deneme & Net Analizi</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Doğru, yanlış, netlerinizi grafikle izleyin. Eksik dersleri otomatik tespit edin.
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-cyan-300">
                  <span>Ortalama Net: 94.50</span>
                  <span className="text-emerald-400">+12 Net Artış</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-110 transition-transform">
                  <LuStar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">Haritalı Coğrafya Quiz</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Türkiye fiziki haritasında dağları, ovaları, akarsuları tıklayarak interaktif öğrenin.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <LuSparkles className="w-3.5 h-3.5" />
                  <span>Harita Skoru: 980 Puan</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default KpssHero;
