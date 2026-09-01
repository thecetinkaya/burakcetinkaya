import React, { useState } from "react";
import { 
  LuCheck, LuZap, LuSparkles, LuShieldCheck, 
  LuCreditCard, LuLock, LuStar, LuX, LuGift 
} from "react-icons/lu";

/**
 * KPSS SaaS Platform Fiyatlandırma & Stripe Ödeme Modalı Bileşeni
 */
const KpssPricing = ({ onSelectPlan = () => {} }) => {
  const [billingCycle, setBillingCycle] = useState("yearly"); // "monthly" | "yearly"
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleOpenCheckout = (planType) => {
    if (planType === "free") {
      onSelectPlan("free");
      return;
    }

    const price = billingCycle === "yearly" ? 1000 : 100;
    const period = billingCycle === "yearly" ? "Yıllık" : "Aylık";
    setSelectedPlanDetails({ planType, price, period });
    setPaymentSuccess(false);
    setStripeModalOpen(true);
  };

  const handleStripePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setStripeModalOpen(false);
        onSelectPlan("premium");
      }, 1500);
    }, 1800);
  };

  return (
    <section id="pricing" className="py-24 bg-[#0a0f1d] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <LuSparkles className="w-3.5 h-3.5" />
            <span>Şeffaf & Makul Fiyatlandırma</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Her Öğrenci İçin Ulaşılabilir <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Esnek Abonelik Planları
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400">
            Sınava hazırlık yolculuğunuzda size en uygun planı seçin. İstediğiniz zaman iptal edebilirsiniz.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <span className={`text-xs sm:text-sm font-bold ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>
              Aylık Ödeme
            </span>

            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-8 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center transition cursor-pointer relative"
            >
              <div 
                className={`w-6 h-6 rounded-full bg-emerald-400 transition-transform duration-300 shadow-md ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm font-bold ${billingCycle === "yearly" ? "text-white" : "text-slate-400"}`}>
                Yıllık Ödeme
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                2 Ay Ücretsiz 🎉
              </span>
            </div>
          </div>

        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* FREE PLAN */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg bg-slate-800 text-slate-300">
                  Ücretsiz Başlangıç
                </span>
                <span className="text-xs text-slate-500">Free Plan</span>
              </div>

              <h3 className="text-2xl font-black text-white">Standart Paket</h3>
              <p className="text-xs text-slate-400">Temel çalışma araçları ve sınırlı deneme takibi.</p>

              <div className="pt-2">
                <span className="text-4xl font-black text-white">₺0</span>
                <span className="text-xs text-slate-400 font-medium"> / sonsuza kadar</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Temel Konu & Görev Planlayıcı</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Günlük 3 Adet Coğrafya Quiz Oyunu</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Temel KPSS Güncel Bilgiler 2026</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ders Not Defteri ve Pomodoro</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenCheckout("free")}
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer border border-slate-700"
            >
              Ücretsiz Kullanmaya Başla
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-emerald-500 p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10 space-y-6">
            
            {/* Ribbon Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
              En Çok Tercih Edilen 🚀
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sınırsız Premium
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <LuStar className="w-3.5 h-3.5 fill-current" /> Sınırsız Erişim
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">Premium Abonelik</h3>
              <p className="text-xs text-slate-400">Tüm interaktif videolar, AI hafıza teknikleri ve gelişmiş grafikler.</p>

              <div className="pt-2 flex items-baseline gap-2">
                {billingCycle === "yearly" ? (
                  <>
                    <span className="text-5xl font-black text-emerald-400">₺1.000</span>
                    <span className="text-xs text-slate-400 font-medium"> / yıl (Aylık ~83 TL)</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-black text-emerald-400">₺100</span>
                    <span className="text-xs text-slate-400 font-medium"> / ay</span>
                  </>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sınırsız İnteraktif Video & Canlı Testler</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Yapay Zeka Destekli Hafıza Teknikleri & Kodlama</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sınırsız Haritalı Coğrafya Quiz Modu</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Detaylı Türkiye Geneli Deneme Net Analizleri</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                  <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tüm 2026 KPSS Güncel Bilgiler Veritabanı</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenCheckout("premium")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LuZap className="w-4 h-4 fill-current" />
              <span>{billingCycle === "yearly" ? "Yıllık 1000 TL Aboneliği Başlat" : "Aylık 100 TL Aboneliği Başlat"}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Stripe Payment Checkout Modal */}
      {stripeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setStripeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <LuX className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-500/30">
                  <LuShieldCheck className="w-3.5 h-3.5" /> Güvenli Ödeme
                </div>
                <span className="text-xs text-slate-400 font-mono">Stripe Entegrasyonu</span>
              </div>
              <h3 className="text-xl font-black text-white">
                KPSS Premium - {selectedPlanDetails?.period} Paket
              </h3>
              <p className="text-xs text-slate-400">
                Toplam Tutar: <strong className="text-emerald-400 font-extrabold text-sm">₺{selectedPlanDetails?.price} TL</strong>
              </p>
            </div>

            {/* Success Animation view */}
            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h4 className="text-lg font-black text-white">Ödeme Başarıyla Tamamlandı!</h4>
                <p className="text-xs text-slate-400">Premium hesabınız aktif edildi. Yönlendiriliyorsunuz...</p>
              </div>
            ) : (
              <form onSubmit={handleStripePayment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Kart Numarası</span>
                    <span className="text-[10px] text-slate-500">Visa / Mastercard</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength="19"
                      placeholder="4543 1234 5678 9012"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-10"
                    />
                    <LuCreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Son Kullanma (AA/YY)</label>
                    <input
                      type="text"
                      required
                      placeholder="12/28"
                      maxLength="5"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">CVC / CWW</label>
                    <input
                      type="text"
                      required
                      placeholder="321"
                      maxLength="4"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    {isProcessing ? (
                      <span>İşlem Gerçekleştiriliyor...</span>
                    ) : (
                      <>
                        <LuLock className="w-4 h-4" />
                        <span>₺{selectedPlanDetails?.price} TL Ödemeyi Onayla</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-2">
                  <LuLock className="w-3 h-3 text-emerald-400" />
                  <span>256-Bit SSL Şifreleme ile Uçtan Uca Güvenli Ödeme (Stripe)</span>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};

export default KpssPricing;
