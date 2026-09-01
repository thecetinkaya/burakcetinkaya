import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { 
  LuUser, LuCalendar, LuImage, LuCheck, LuTarget, 
  LuSun, LuMoon, LuSave, LuShield, LuBell 
} from "react-icons/lu";

/**
 * Müstakil Öğrenci Profil & Sistem Ayarları Sekmesi
 */
const StudentSettingsTab = ({ theme, onThemeToggle }) => {
  const isDark = theme === "dark";

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [targetExam, setTargetExam] = useState(() => localStorage.getItem("kpss_target_exam") || "KPSS Lisans 2026");
  const [examDate, setExamDate] = useState(() => localStorage.getItem("kpss_exam_date") || "2026-09-06");
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user: sessionUser } } = await db.auth.getSessionUser();
        if (sessionUser) {
          setUser(sessionUser);
          setEmail(sessionUser.email || "");
          setFullName(sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || "Öğrenci");
          setAvatarUrl(sessionUser.user_metadata?.avatar_url || "");
          if (sessionUser.user_metadata?.target_exam) {
            setTargetExam(sessionUser.user_metadata.target_exam);
          }
        }
      } catch (err) {
        console.error("Profil bilgileri yüklenemedi:", err);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      localStorage.setItem("kpss_target_exam", targetExam);
      localStorage.setItem("kpss_exam_date", examDate);

      if (user) {
        const updates = {
          full_name: fullName,
          avatar_url: avatarUrl,
          target_exam: targetExam,
          kpss_date: examDate
        };
        await db.auth.updateProfile(user.id, updates);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Ayarlar kaydedilirken hata oluştu: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? "bg-[#0b101d] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
          <LuUser className="w-5 h-5 text-emerald-500" />
          <span>Profil & Sistem Ayarları</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Kişisel bilgilerinizi, hedef sınavınızı ve uygulama tercihlerinizi güncelleyin.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <LuCheck className="w-4 h-4 text-emerald-500" />
          <span>Profil ayarlarınız başarıyla güncellendi!</span>
        </div>
      )}

      {/* Main Settings Form Card */}
      <form onSubmit={handleSaveProfile} className={`p-6 sm:p-8 rounded-3xl border ${
        isDark ? "bg-[#0b101d] border-slate-800" : "bg-white border-slate-200 shadow-sm"
      } space-y-6`}>
        
        {/* Avatar & Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span>👤</span> Kişisel Profil Bilgileri
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Ad Soyad</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Burak Çetinkaya"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">E-Posta Adresi</label>
              <input
                type="email"
                disabled
                value={email}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs opacity-60 cursor-not-allowed ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Profil Resmi URL (Avatar)</label>
            <div className="flex gap-3 items-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-emerald-500/30 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm shrink-0">
                  {fullName ? fullName[0].toUpperCase() : "P"}
                </div>
              )}
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Exam Preparation Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <span>🎓</span> Sınav Tercihleri & Geri Sayım
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Hedef Sınavınız</label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <option value="KPSS Lisans 2026">KPSS Lisans 2026</option>
                <option value="KPSS Önlisans 2026">KPSS Önlisans 2026</option>
                <option value="AGS 2026 (Akademi Giriş)">AGS 2026 (Akademi Giriş)</option>
                <option value="YKS - TYT / AYT 2026">YKS - TYT / AYT 2026</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Sınav Tarihi</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <LuSave className="w-4 h-4" />
            <span>{saving ? "Kaydediliyor..." : "Ayarları Kaydet"}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default StudentSettingsTab;
