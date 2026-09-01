import React, { useState } from "react";
import { 
  LuSmartphone, LuBell, LuSparkles, LuCheck, LuApple 
} from "react-icons/lu";

/**
 * KPSS App Store & Google Play Yakında Duyuru Bileşeni
 */
const KpssAppStoreBadge = () => {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (notifyEmail.trim()) {
      setSubscribed(true);
      setNotifyEmail("");
    }
  };

  return (
    <section id="mobile-app" className="py-20 bg-[#070b14] text-white relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Badge Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
              <LuSmartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cebinizdeki Akıllı Sınav Asistanı</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Pek Yakında <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                App Store & Google Play Store'da!
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              KPSS, AGS, TYT ve AYT sınavlarına hazırlanırken telefonunuzdan anlık soru çözün, ders push bildirimleri alın ve offline modda coğrafya haritaları çalışın.
            </p>

            {/* Store Badges Preview */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              {/* App Store Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 shadow-lg group hover:border-emerald-500/40 transition">
                <LuApple className="w-7 h-7 text-white" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Pek Yakında</span>
                  <span className="text-xs font-black text-white">App Store'dan İndir</span>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold uppercase">
                  iOS
                </span>
              </div>

              {/* Google Play Store Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 shadow-lg group hover:border-cyan-500/40 transition">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center font-black text-cyan-400 text-xs">
                  ▶
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Pek Yakında</span>
                  <span className="text-xs font-black text-white">Google Play'den İndir</span>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-extrabold uppercase">
                  Android
                </span>
              </div>

            </div>

            {/* Notification Subscription Form */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                🔔 Mobil Uygulama Yayınlandığında İlk Siz Haberdar Olun:
              </span>

              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <LuCheck className="w-4 h-4 text-emerald-400" />
                  <span>Harika! Yayınlandığı gün e-posta adresinize indirme bağlantısı göndereceğiz.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresiniz..."
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shrink-0"
                  >
                    Haber Ver!
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Mobile Phone Graphic Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 sm:w-72 rounded-[40px] border-4 border-slate-800 bg-slate-950 p-4 shadow-2xl relative space-y-4">
              
              {/* Phone Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2"></div>

              {/* Phone Screen Mock Content */}
              <div className="space-y-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                  <span>📱 KPSS Mobile App</span>
                  <span className="text-slate-500 font-mono">v1.0.0</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400">🔔 Push Bildirimi</span>
                  <p className="text-[11px] text-slate-300 font-medium leading-snug">
                    Bugünkü 2026 KPSS Güncel Bilgi sorusuna cevap verdiniz mi?
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400">📊 Günlük Çalışma</span>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Tarih: 40 Soru / %90 Başarı
                  </p>
                </div>

                <div className="py-2 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 animate-pulse">
                    App Store Entegrasyonu Hazırlanıyor
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default KpssAppStoreBadge;
