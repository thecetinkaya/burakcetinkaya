import React, { useState } from "react";
import { 
  LuListTodo, LuChartLine, LuVideo, LuBookOpen, LuGlobe, 
  LuBrain, LuSparkles, LuTimer, LuArrowRight, LuCheck, LuShieldCheck
} from "react-icons/lu";

/**
 * KPSS / AGS / TYT / AYT Platform Özellikleri Vitrin Bileşeni
 */
const KpssFeatureShowcase = ({ onSelectFeature = () => {} }) => {
  const [activeTab, setActiveTab] = useState("kanban");

  const FEATURES = [
    {
      id: "kanban",
      title: "Konu & Görev Planlayıcı",
      badge: "Kanban Düzeni",
      icon: LuListTodo,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-400",
      description: "KPSS, AGS ve YKS müfredatındaki tüm konuları 'Yapılacak', 'Devam Eden' ve 'Bitti' sütunlarında görsel olarak yönetin.",
      bullets: [
        "Ders bazlı konu ilerleme yüzdeleri",
        "Öncelik seviyeleri ve hedef tarihler",
        "Otomatik tamamlama istatistikleri"
      ],
      previewContent: {
        header: "Tarih - Osmanlı Yükselme Dönemi",
        stats: "Tamamlanan: 14 / 18 Konu (%77)",
        columns: [
          { name: "Yapılacak", items: ["19. Yüzyıl Islahatları", "I. Dünya Savaşı"] },
          { name: "Çalışılıyor", items: ["Kurtuluş Savaşı Hazırlık"] },
          { name: "Tamamlandı", items: ["İstanbul'un Fethi", "Preveze Deniz Zaferi", "Kapitülasyonlar"] }
        ]
      }
    },
    {
      id: "deneme",
      title: "Deneme Takibi & Gelişmiş Analiz",
      badge: "Grafikli Net Analizi",
      icon: LuChartLine,
      color: "from-cyan-500 to-blue-500",
      textColor: "text-cyan-400",
      description: "Çözdüğünüz tüm Türkiye geneli ve kurum denemelerini kaydedin. Doğru/yanlış ve net grafiklerinizi anlık inceleyin.",
      bullets: [
        "Genel Yetenek - Genel Kültür net hesaplama",
        "Tarih, Coğrafya, Türkçe, Matematik ders bazlı döküm",
        "Hedef puana ne kadar kaldığını gösteren radar"
      ],
      previewContent: {
        header: "Pegem Türkiye Geneli Deneme #4",
        stats: "Toplam Net: 98.75 | Puan: 89.40",
        columns: [
          { name: "Türkçe", items: ["27 Doğru", "3 Yanlış", "26.25 Net"] },
          { name: "Matematik", items: ["25 Doğru", "2 Yanlış", "24.50 Net"] },
          { name: "Tarih/Coğrafya", items: ["49 Doğru", "4 Yanlış", "48.00 Net"] }
        ]
      }
    },
    {
      id: "guncel",
      title: "KPSS Güncel Bilgiler 2026",
      badge: "Canlı Veritabanı",
      icon: LuBookOpen,
      color: "from-purple-500 to-indigo-500",
      textColor: "text-purple-400",
      description: "2026 yılı uluslararası kuruluşlar, cumhurbaşkanlığı kararları, edebiyat, sanat ve spor dünyasından en sıcak güncel bilgiler.",
      bullets: [
        "Kategori bazlı filtreleme (TÜİK, Sanat, Dünya)",
        "Favorilere ekleme ve bilgi kartı çalışma modu",
        "Sınav öncesi hızlı tekrar modülleri"
      ],
      previewContent: {
        header: "2026 Güncel Bilgi Örnekleri",
        stats: "Kayıtlı Bilgi: 240+ Soru Değeri Yüksek",
        columns: [
          { name: "Uluslararası", items: ["2026 UEFA Şampiyonlar Ligi Finali Ev Sahibi", "G7 Liderler Zirvesi Dönem Başkanı"] },
          { name: "Kültür & Sanat", items: ["UNESCO Dünya Mirası Geçici Listesi Yeni Eseri", "2026 Türk Dünyası Kültür Başkenti"] }
        ]
      }
    },
    {
      id: "cografya",
      title: "Haritalarla Coğrafya Quiz",
      badge: "İnteraktif Türkiye Haritası",
      icon: LuGlobe,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400",
      description: "Türkiye'nin dağları, ovaları, akarsuları, madenleri ve milli parklarını harita üzerinde tıklayarak görsel olarak öğrenin.",
      bullets: [
        "Görsel lokasyon bulma quiz oyunu",
        "Anlık puanlama ve süre yarışı",
        "Hangi bölgelerde eksiğiniz var analizi"
      ],
      previewContent: {
        header: "Türkiye Fiziki Harita Soru Sınavı",
        stats: "Doğruluk Oranı: %94 | Süre: 14sn",
        columns: [
          { name: "Soru", items: ["Ağrı Dağı ve Cilo Dağları nerede?"] },
          { name: "Skor", items: ["100 Puan (Tam İsabet)"] }
        ]
      }
    },
    {
      id: "hafiza",
      title: "Hafıza Teknikleri & AI Öğrenme Asistanı",
      badge: "Yapay Zeka Destekli",
      icon: LuBrain,
      color: "from-rose-500 to-pink-500",
      textColor: "text-rose-400",
      description: "Zor hatırlanan tarih ve vatandaşlık kavramlarını akılda kalıcı hikayeler ve AI destekli kodlamalarla anında öğrenin.",
      bullets: [
        "Akrostiş ve hikayeleştirme kodlamaları",
        "Soru sorarak anında cevap alma yeteneği",
        "Kişiselleştirilmiş tekrar sistemi"
      ],
      previewContent: {
        header: "Osmanlı Eyalet Sistemi Şifrelemesi",
        stats: "Hafıza Çivisi: 'Salyaneli Eyaletler = Mısır, Bağdat, Basra'",
        columns: [
          { name: "Kodlama", items: ["MABABA şifresi ile tüm merkeze uzak eyaletleri ezberle!"] }
        ]
      }
    },
    {
      id: "video",
      title: "Ders Video Takip & İnteraktif Notlar",
      badge: "Video Ders Notları",
      icon: LuVideo,
      color: "from-emerald-400 to-cyan-400",
      textColor: "text-emerald-300",
      description: "YouTube ve özel platformlardaki KPSS oynatma listelerini ekleyin, kaldığınız dakikayı ve ders notlarınızı tek yerden takip edin.",
      bullets: [
        "Ders ve ünite bazlı video tamamlama",
        "Videoya bağlı zaman damgalı not alma",
        "Hızlandırma ve otomatik sonraki video geçişi"
      ],
      previewContent: {
        header: "Ramizan İpekten - KPSS Tarih #14",
        stats: "Kaldığınız Yer: 18:42 / 45:00",
        columns: [
          { name: "Eklenen Not", items: ["18. dakikada Amasya Genelgesi kararları vurgulandı."] }
        ]
      }
    }
  ];

  const currentFeature = FEATURES.find(f => f.id === activeTab) || FEATURES[0];

  return (
    <section id="features" className="py-24 bg-[#0a0f1d] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <LuSparkles className="w-3.5 h-3.5" />
            <span>Zengin Araç Çantası</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Sınavı Kazanmanız İçin <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              İhtiyacınız Olan Tüm Modüller
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Aşağıdaki sekmelerden platformumuzdaki modülleri detaylıca inceleyebilir, doğrudan denemek için tıkla butonuna basabilirsiniz.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            const isActive = activeTab === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer border ${
                  isActive
                    ? "bg-slate-900 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10 scale-105"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? feat.textColor : "text-slate-500"}`} />
                <span>{feat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Showcase Box */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <span>{currentFeature.badge}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {currentFeature.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentFeature.description}
            </p>

            <div className="space-y-3 pt-2">
              {currentFeature.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <LuCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onSelectFeature(currentFeature.id)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Bu Modülü Çalışma Paneline Aç</span>
                <LuArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Mockup Column */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  {currentFeature.previewContent.stats}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  📌 {currentFeature.previewContent.header}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentFeature.previewContent.columns.map((col, cIdx) => (
                    <div key={cIdx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <span className="text-xs font-black text-emerald-300 block border-b border-slate-800 pb-1.5">
                        {col.name}
                      </span>
                      <ul className="space-y-1.5">
                        {col.items.map((item, iIdx) => (
                          <li key={iIdx} className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default KpssFeatureShowcase;
