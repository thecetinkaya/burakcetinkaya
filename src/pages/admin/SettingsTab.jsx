import React, { useState } from "react";
import { db, isMockMode } from "../../lib/supabase";
import { LuUser, LuCalendar, LuServer, LuCheck, LuImagePlus } from "react-icons/lu";

const SettingsTab = ({ profile, onProfileUpdate, theme }) => {
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [kpssDate, setKpssDate] = useState(profile?.kpss_date || "2026-09-06");
  const [alesDate, setAlesDate] = useState(profile?.ales_date || "2026-11-22");
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const updates = {
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        kpss_date: kpssDate,
        ales_date: alesDate
      };

      const { data, error } = await db.auth.updateProfile(profile.id, updates);
      if (error) throw error;
      
      onProfileUpdate(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Ayarlar güncellenirken hata oluştu: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Tokens matching Dashboard
  const tokens = {
    bgContainer: isDark ? "bg-[#090e1a] border-white/5 shadow-2xl" : "bg-[#fcfcfc] border-black/5 shadow-sm",
    textPrimary: isDark ? "text-white/90" : "text-[#1d1d1f]",
    textSecondary: isDark ? "text-white/40" : "text-[#86868b]",
  };

  const inputClass = `w-full rounded-[16px] py-3.5 px-4 text-[14px] focus:outline-none transition-all duration-300 border ${
    isDark 
      ? "bg-[#0a0a0a]/50 border-white/10 focus:border-purple-500/50 focus:bg-white/[0.03] focus:shadow-[0_0_20px_rgba(168,85,247,0.1)] text-slate-100 placeholder-white/20" 
      : "bg-slate-50 border-black/5 focus:border-purple-400 focus:bg-white focus:shadow-[0_0_20px_rgba(168,85,247,0.1)] text-slate-800 placeholder-slate-400"
  }`;

  const labelClass = `block text-[11px] font-extrabold uppercase tracking-widest mb-2 ${
    isDark ? "text-white/40" : "text-slate-500"
  }`;

  const sectionHeaderClass = `text-[15px] font-semibold flex items-center gap-2 border-b pb-3 mb-5 ${
    isDark ? "text-white/80 border-white/5" : "text-slate-800 border-black/5"
  }`;

  const iconClass = `p-1.5 rounded-lg ${
    isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-600"
  }`;

  return (
    <div className="animate-fade-in pb-32 flex flex-col h-full w-full font-sans">
      <div className={`w-full rounded-[32px] p-6 md:p-10 transition-colors duration-500 border ${tokens.bgContainer}`}>
        
        <div className="mb-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`text-[32px] font-bold tracking-tight mb-2 ${tokens.textPrimary}`}>
              Hesap Ayarları
            </h1>
            <p className={`text-[15px] ${tokens.textSecondary}`}>
              Kişisel profil bilgilerinizi, sınav sayaçlarını ve hesap ayarlarını yönetin.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Profile Settings */}
        <div>
          <h3 className={sectionHeaderClass}>
            <div className={iconClass}>
              <LuUser strokeWidth={2.5} size={16} />
            </div>
            Profil Bilgileri
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Adınız</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Soyadınız</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
            
            <div className={`sm:col-span-2 flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[24px] border transition-colors ${
              isDark ? "bg-[#0a0a0a]/30 border-white/5 hover:border-white/10" : "bg-slate-50/50 border-black/5 hover:border-black/10"
            }`}>
              {/* Photo preview */}
              <div className="relative shrink-0">
                <div className={`absolute inset-0 blur-xl opacity-50 rounded-full ${isDark ? "bg-purple-500/20" : "bg-purple-200"}`}></div>
                <img 
                  src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
                  alt="Avatar Preview" 
                  className={`relative z-10 w-20 h-20 rounded-full object-cover border-2 shadow-lg ${
                    isDark ? "border-purple-500/30" : "border-white"
                  }`}
                />
              </div>

              {/* Upload controls */}
              <div className="flex-1 space-y-3 w-full">
                <label className={labelClass}>Profil Fotoğrafı</label>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* File Upload Button */}
                  <label className={`flex items-center justify-center gap-2 px-5 py-3 rounded-[16px] border text-[13px] font-bold transition-all cursor-pointer ${
                    isDark 
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20" 
                      : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  }`}>
                    <LuImagePlus size={18} />
                    <span>Dosya Seç</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 1024 * 1024) {
                          alert("Profil fotoğrafı boyutu 1MB'den küçük olmalıdır.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatarUrl(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }} 
                      className="hidden" 
                    />
                  </label>

                  {/* URL fallback Input */}
                  <input
                    type="url"
                    placeholder="Veya fotoğraf URL'si yapıştırın (https://...)"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <p className={`text-[11px] ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  Maks. 1MB (JPG, PNG, WEBP)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Dates Settings */}
        <div>
          <h3 className={sectionHeaderClass}>
            <div className={iconClass}>
              <LuCalendar strokeWidth={2.5} size={16} />
            </div>
            Sınav Tarihleri (Sayaçlar İçin)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>KPSS Lisans Sınav Tarihi</label>
              <input
                type="date"
                required
                value={kpssDate}
                onChange={(e) => setKpssDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>ALES Sınav Tarihi</label>
              <input
                type="date"
                required
                value={alesDate}
                onChange={(e) => setAlesDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Database Connection Info */}
        <div>
          <h3 className={sectionHeaderClass}>
            <div className={iconClass}>
              <LuServer strokeWidth={2.5} size={16} />
            </div>
            Veritabanı Bağlantısı
          </h3>
          
          <div className={`p-6 rounded-[24px] border ${
            isDark ? "bg-[#0a0a0a]/30 border-white/5" : "bg-slate-50/50 border-black/5"
          }`}>
            <div className={`text-[13px] font-bold flex items-center gap-3 mb-3 ${isDark ? "text-white/80" : "text-slate-800"}`}>
              Bağlantı Modu:
              {isMockMode ? (
                <span className="text-[11px] uppercase tracking-widest px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full font-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  Yerel (LocalStorage)
                </span>
              ) : (
                <span className="text-[11px] uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-black shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  Supabase Cloud
                </span>
              )}
            </div>
            <p className={`text-[13px] leading-relaxed ${isDark ? "text-white/40" : "text-slate-500"}`}>
              {isMockMode 
                ? "Supabase URL ve Anon Key ortam değişkenleri (.env) bulunamadığı için verileriniz tarayıcınızın LocalStorage belleğinde tutulmaktadır. Bulut senkronizasyonu için .env dosyasını ayarlayın."
                : "Ortam değişkenleriniz başarıyla okundu! Verileriniz Supabase bulut veritabanında güvenle saklanmaktadır."
              }
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className={`relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-[16px] text-[14px] font-bold text-white transition-all overflow-hidden ${
              saving ? "bg-purple-800 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-0.5"
            }`}
          >
            {saving ? (
              <span className="animate-pulse">Kaydediliyor...</span>
            ) : (
              <>
                <LuCheck strokeWidth={3} size={18} />
                Ayarları Kaydet
              </>
            )}
          </button>
          
          {success && (
            <span className="text-emerald-400 text-[13px] font-bold flex items-center gap-2 animate-fade-in bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
              <LuCheck size={16} /> Başarıyla güncellendi!
            </span>
          )}
        </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
