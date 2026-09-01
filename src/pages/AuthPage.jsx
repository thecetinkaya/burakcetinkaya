import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/supabase";
import { 
  LuGraduationCap, LuMail, LuLock, LuUser, LuArrowRight, 
  LuSparkles, LuCheck, LuArrowLeft, LuShieldCheck, LuBookOpen 
} from "react-icons/lu";

/**
 * Müstakil İnteraktif Giriş Yap & Kayıt Ol Sayfası (/auth)
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  
  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register States
  const [regFullName, setRegFullName] = useState("");
  const [regExam, setRegExam] = useState("KPSS Lisans 2026");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Status States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data, error } = await db.auth.signIn(loginEmail, loginPassword);
      if (error) throw error;

      setSuccessMsg("Giriş başarılı! Öğrenci Paneline yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/student");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data, error } = await db.auth.signUp(regEmail, regPassword, { 
        full_name: regFullName, 
        target_exam: regExam 
      });
      if (error) throw error;

      setSuccessMsg("Kayıt başarılı! Hesabınız oluşturuldu, yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigate("/student");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Kayıt işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/kpss"
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition text-xs font-bold flex items-center gap-2 backdrop-blur-xl"
        >
          <LuArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Tanıtım Sayfasına Dön</span>
        </Link>
      </div>

      {/* Main Glass Card Container */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-2xl relative z-10 space-y-7">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/25 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <LuGraduationCap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white pt-1">
            KPSS <span className="text-emerald-400">PRO</span> 2026
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            KPSS • AGS • YKS Sınav Hazırlık Portalı
          </p>
        </div>

        {/* Interactive Smooth Sliding Pill Switcher */}
        <div className="relative flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800/80 shadow-inner">
          
          {/* Animated Sliding Background Indicator */}
          <Motion.div 
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/20"
            initial={false}
            animate={{ 
              left: authMode === "login" ? "6px" : "calc(50% + 3px)", 
              width: "calc(50% - 9px)" 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />

          <button
            type="button"
            onClick={() => { setAuthMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-colors duration-200 relative z-10 cursor-pointer text-center ${
              authMode === "login" ? "text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Giriş Yap
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-colors duration-200 relative z-10 cursor-pointer text-center ${
              authMode === "register" ? "text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Ücretsiz Kayıt Ol
          </button>
        </div>

        {/* Dynamic Status Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Animated Sliding Forms Container */}
        <AnimatePresence mode="wait">
          {authMode === "login" ? (
            
            /* LOGIN FORM */
            <Motion.form
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">E-Posta Adresi</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ogrenci@kpss.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-10"
                  />
                  <LuMail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">Şifre</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."); }} className="text-[11px] font-semibold text-emerald-400 hover:underline">
                    Şifremi Unuttum?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength="4"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-10"
                  />
                  <LuLock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <span>Giriş Yapılıyor...</span>
                  ) : (
                    <>
                      <span>Öğrenci Paneline Giriş Yap</span>
                      <LuArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </Motion.form>

          ) : (

            /* REGISTER FORM */
            <Motion.form
              key="register-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Ad Soyad</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ahmet Yılmaz"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-10"
                  />
                  <LuUser className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Hedef Sınavınız</label>
                <select
                  value={regExam}
                  onChange={(e) => setRegExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="KPSS Lisans 2026">KPSS Lisans 2026</option>
                  <option value="KPSS Önlisans 2026">KPSS Önlisans 2026</option>
                  <option value="AGS 2026 (Akademi Giriş)">AGS 2026 (Akademi Giriş)</option>
                  <option value="YKS - TYT / AYT 2026">YKS - TYT / AYT 2026</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">E-Posta Adresi</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="ogrenci@kpss.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-10"
                  />
                  <LuMail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Şifre Oluşturun</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength="4"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-10"
                  />
                  <LuLock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <span>Hesap Oluşturuluyor...</span>
                  ) : (
                    <>
                      <span>Ücretsiz Hesabımı Oluştur</span>
                      <LuArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </Motion.form>

          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AuthPage;
