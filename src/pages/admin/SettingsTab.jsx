import React, { useState } from "react";
import { db, isMockMode } from "../../lib/supabase";
import { FaUserCog, FaCalendarAlt, FaNetworkWired, FaCheck } from "react-icons/fa";

const SettingsTab = ({ profile, onProfileUpdate, theme }) => {
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [kpssDate, setKpssDate] = useState(profile?.kpss_date || "2026-09-06");
  const [alesDate, setAlesDate] = useState(profile?.ales_date || "2026-11-22");
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const cardClass = "w-full border p-6 space-y-6 transition-all duration-200 " + 
    (theme === "dark" 
      ? "bg-slate-900 border-slate-800 text-slate-100" 
      : "bg-white border-slate-200 shadow-sm text-slate-800");

  const inputClass = "w-full border rounded-lg py-2 px-3 text-xs focus:outline-none transition-all " + 
    (theme === "dark" 
      ? "bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-100" 
      : "bg-slate-50 border-slate-205 focus:border-purple-500 text-slate-800");

  return (
    <div className={cardClass}>
      <div>
        <h2 className={`text-base font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
          Asistan & Hesap Ayarları
        </h2>
        <p className={`text-3xs mt-1 ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
          Kişisel profil bilgilerinizi, sınav sayaçlarını ve veritabanı bağlantı durumunu buradan yönetin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Settings */}
        <div className="space-y-4">
          <h3 className={`text-xs font-bold flex items-center gap-1.5 border-b pb-2 ${
            theme === "dark" ? "text-slate-300 border-slate-850" : "text-slate-700 border-slate-100"
          }`}>
            <FaUserCog className="text-purple-650 dark:text-purple-405" /> Profil Bilgileri
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Adınız</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-4xs font-bold text-slate-455 uppercase mb-1">Soyadınız</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-4 border p-4.5 rounded-2xl bg-slate-500/5 border-slate-200/50 dark:border-slate-850">
              {/* Photo preview */}
              <div className="relative shrink-0">
                <img 
                  src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"} 
                  alt="Avatar Preview" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30 shadow-sm"
                />
              </div>

              {/* Upload controls */}
              <div className="flex-1 space-y-2 text-left w-full">
                <label className="block text-4xs font-bold text-slate-450 dark:text-slate-450 uppercase">Profil Fotoğrafı</label>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* File Upload Button */}
                  <label className="flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-3xs font-extrabold py-2 px-4 rounded-xl border border-purple-500/20 transition cursor-pointer select-none">
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
                    placeholder="Veya fotoğraf linki yapıştırın (https://...)"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 border rounded-xl py-2 px-3 text-4xs focus:outline-none transition-all bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-100 placeholder-slate-600"
                  />
                </div>
                <p className="text-5xs text-slate-500">Maksimum dosya boyutu: 1MB. JPG, PNG, WEBP, GIF desteklenir.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Dates Settings */}
        <div className="space-y-4">
          <h3 className={`text-xs font-bold flex items-center gap-1.5 border-b pb-2 ${
            theme === "dark" ? "text-slate-300 border-slate-850" : "text-slate-700 border-slate-100"
          }`}>
            <FaCalendarAlt className="text-purple-650 dark:text-purple-405" /> Sınav Tarihleri (Sayaçlar İçin)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">KPSS Lisans Sınav Tarihi</label>
              <input
                type="date"
                required
                value={kpssDate}
                onChange={(e) => setKpssDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">ALES Sınav Tarihi</label>
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
        <div className="space-y-4">
          <h3 className={`text-xs font-bold flex items-center gap-1.5 border-b pb-2 ${
            theme === "dark" ? "text-slate-300 border-slate-850" : "text-slate-700 border-slate-100"
          }`}>
            <FaNetworkWired className="text-purple-650 dark:text-purple-405" /> Veritabanı Bağlantısı
          </h3>
          
          <div className={`border p-4 rounded-xl flex items-center justify-between ${
            theme === "dark" ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"
          }`}>
            <div>
              <div className={`text-xs font-bold flex items-center gap-2 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                Bağlantı Modu:
                {isMockMode ? (
                  <span className="text-4xs uppercase px-2.5 py-0.5 bg-orange-500/10 text-orange-655 dark:text-orange-400 border border-orange-500/20 rounded-full font-bold animate-pulse">
                    Yerel Çevrimdışı (LocalStorage)
                  </span>
                ) : (
                  <span className="text-4xs uppercase px-2.5 py-0.5 bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border border-emerald-550/20 rounded-full font-bold">
                    Supabase Cloud Bulut Aktif
                  </span>
                )}
              </div>
              <p className={`text-4xs mt-1.5 max-w-xl leading-relaxed ${theme === "dark" ? "text-slate-500" : "text-slate-455"}`}>
                {isMockMode 
                  ? "Supabase URL ve Anon Key ortam değişkenleri (.env) tanımlanmadığı için verileriniz tarayıcınızın LocalStorage belleğinde tutulmaktadır. Cloud sync için .env dosyası oluşturup VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlayın."
                  : "Ortam değişkenleriniz başarıyla okundu! Verileriniz Supabase bulut veritabanında güvenle saklanmaktadır."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-purple-655 hover:bg-purple-600 disabled:bg-purple-800 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition cursor-pointer"
          >
            {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
          
          {success && (
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <FaCheck /> Ayarlar başarıyla güncellendi!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
