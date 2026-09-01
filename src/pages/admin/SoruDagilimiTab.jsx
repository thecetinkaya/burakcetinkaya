import React, { useState } from "react";
import { 
  LuTarget, LuBookOpen, LuBrain, LuGlobe, LuShieldCheck, 
  LuAward, LuSparkles, LuCheckCircle2, LuHelpCircle, LuInfo 
} from "react-icons/lu";

/**
 * KPSS, AGS ve YKS Soru Dağılımı & Sınav Strateji Rehberi Sekmesi
 */
const SoruDagilimiTab = ({ theme = "dark" }) => {
  const isDark = theme === "dark";
  const [selectedExam, setSelectedExam] = useState("kpss_lisans");

  const EXAM_DATA = {
    kpss_lisans: {
      title: "KPSS Lisans (Genel Yetenek & Genel Kültür)",
      totalQuestions: 120,
      duration: "130 Dakika",
      gy: {
        total: 60,
        topics: [
          { name: "Türkçe", count: "30 Soru (%50)", desc: "Sözel mantık (4 Soru), Paragrafta anlam, Cümlede anlam, Sözcükte anlam, Dil bilgisi ve Yazım kuralları." },
          { name: "Matematik", count: "26 Soru (%43)", desc: "Sayısal mantık (6 Soru), Temel matematik, Problemler, Üslü-Köklü sayılar, Çarpanlara ayırma, Oran-orantı." },
          { name: "Geometri", count: "4 Soru (%7)", desc: "Üçgenler, Dörtgenler, Çember ve daire, Analitik geometri." }
        ]
      },
      gk: {
        total: 60,
        topics: [
          { name: "Tarih", count: "27 Soru (%45)", desc: "İslamiyet Öncesi (1), Türk-İslam Devletleri (2), Osmanlı Tarihi (9), İnkılap Tarihi (12), Çağdaş Türk ve Dünya Tarihi (3)." },
          { name: "Coğrafya", count: "18 Soru (%30)", desc: "Türkiye'nin fiziki coğrafyası (7), Beşeri coğrafyası (3), Ekonomik coğrafyası (8)." },
          { name: "Vatandaşlık", count: "9 Soru (%15)", desc: "Hukuk başlangıcı, Anayasa hukuku, İdare hukuku." },
          { name: "Güncel Bilgiler", count: "6 Soru (%10)", desc: "Güncel sosyo-politik olaylar, uluslararası kuruluşlar, kültür-sanat ve bilimsel gelişmeler." }
        ]
      }
    },
    kpss_onlisans: {
      title: "KPSS Önlisans & Ortaöğretim",
      totalQuestions: 120,
      duration: "130 Dakika",
      gy: {
        total: 60,
        topics: [
          { name: "Türkçe", count: "30 Soru", desc: "Anlam bilgisi, dil bilgisi, paragraf ve sözel mantık muhakeme soruları." },
          { name: "Matematik & Geometri", count: "30 Soru", desc: "Temel kavramlar, temel matematik operasyonları, problemler, geometri ve sayısal mantık." }
        ]
      },
      gk: {
        total: 60,
        topics: [
          { name: "Tarih", count: "27 Soru", desc: "Osmanlı Devleti siyasi ve teşkilat yapısı, İnkılap tarihi ve İlkeler." },
          { name: "Coğrafya", count: "18 Soru", desc: "Türkiye harita bilgisi, iklim, nüfus, tarım, hayvancılık, madenler ve sanayi." },
          { name: "Vatandaşlık & Güncel", count: "15 Soru", desc: "Temel yurttaşlık bilgisi, 1982 Anayasası, Devlet organları ve Güncel konular." }
        ]
      }
    },
    ags_akademi: {
      title: "AGS (Akademi Giriş Sınavı - Öğretmenlik)",
      totalQuestions: 80,
      duration: "110 Dakika",
      gy: {
        total: 40,
        topics: [
          { name: "Türkçe & Sözel Akıl Yürütme", count: "20 Soru", desc: "Okuduğunu anlama, çıkarım yapma, sözel mantık dizilimi." },
          { name: "Matematik & Sayısal Akıl Yürütme", count: "20 Soru", desc: "Problem çözme becerisi, veri analizi ve grafik yorumlama." }
        ]
      },
      gk: {
        total: 40,
        topics: [
          { name: "Tarih & Türk Kültürü", count: "15 Soru", desc: "Türk tarihi, medeniyet tarihi ve kültür mirası." },
          { name: "Türkiye Coğrafyası", count: "15 Soru", desc: "Fiziki ve beşeri coğrafya özellikleri." },
          { name: "Eğitim Esasları & Mevzuat", count: "10 Soru", desc: "Milli eğitim temel kanunu, öğretmenlik meslek kanunu ve genel mevzuat." }
        ]
      }
    }
  };

  const currentData = EXAM_DATA[selectedExam];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? "bg-[#0b101d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
      } flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider mb-1">
            <LuAward className="w-4 h-4" />
            <span>ÖSYM Müfredat Rehberi</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Soru Dağılımı & Konu Analiz Rehberi</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hedeflediğiniz sınavın soru sayıları, konu ağırlıkları ve çalışma stratejileri.
          </p>
        </div>

        {/* Exam Selector Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedExam("kpss_lisans")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              selectedExam === "kpss_lisans" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            KPSS Lisans
          </button>

          <button
            onClick={() => setSelectedExam("kpss_onlisans")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              selectedExam === "kpss_onlisans" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Önlisans
          </button>

          <button
            onClick={() => setSelectedExam("ags_akademi")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              selectedExam === "ags_akademi" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            AGS Akademi
          </button>
        </div>
      </div>

      {/* Overview Stats Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${
          isDark ? "bg-[#0b101d] border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Sınav Adı</span>
          <p className="text-sm font-black text-emerald-500 dark:text-emerald-400 mt-0.5">{currentData.title}</p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? "bg-[#0b101d] border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Toplam Soru Sayısı</span>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{currentData.totalQuestions} Soru</p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? "bg-[#0b101d] border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Sınav Süresi</span>
          <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{currentData.duration}</p>
        </div>
      </div>

      {/* Question Breakdown Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Genel Yetenek Section */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? "bg-[#0b101d] border-slate-800" : "bg-white border-slate-200 shadow-sm"
        } space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs">🧠</span>
              Genel Yetenek Testi
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/20">
              {currentData.gy.total} Soru
            </span>
          </div>

          <div className="space-y-3">
            {currentData.gy.topics.map((t, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${
                isDark ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200"
              } space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-200">{t.name}</span>
                  <span className="text-[11px] font-black text-emerald-500">{t.count}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Genel Kültür Section */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? "bg-[#0b101d] border-slate-800" : "bg-white border-slate-200 shadow-sm"
        } space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs">🌍</span>
              Genel Kültür Testi
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/20">
              {currentData.gk.total} Soru
            </span>
          </div>

          <div className="space-y-3">
            {currentData.gk.topics.map((t, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${
                isDark ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200"
              } space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-200">{t.name}</span>
                  <span className="text-[11px] font-black text-emerald-500">{t.count}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SoruDagilimiTab;
