import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { LuPlus, LuTrash2, LuExternalLink, LuFolderKanban, LuSquareKanban } from "react-icons/lu";

const ProjectsTab = ({ theme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("portfolio");
  const [showAddForm, setShowAddForm] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.projects.fetchAll();
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Projeler yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!title || !description || !link) return;

    try {
      const newProj = {
        title,
        description,
        link,
        category
      };

      const { error } = await db.projects.create(newProj);
      if (error) throw error;

      setShowAddForm(false);
      resetForm();
      await fetchProjects();
    } catch (err) {
      alert("Proje eklenirken hata: " + err.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setCategory("portfolio");
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await db.projects.delete(id);
      if (error) throw error;
      await fetchProjects();
    } catch (err) {
      alert("Proje silinemedi: " + err.message);
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "portfolio": return "Portföy";
      case "blog": return "Blog / Tanıtım";
      case "ecommerce": return "E-Ticaret / Kurumsal";
      default: return cat;
    }
  };

  const inputClass = `w-full rounded-[16px] py-3.5 px-4 text-[14px] focus:outline-none transition-all duration-300 border ${
    isDark 
      ? "bg-[#0a0a0a]/50 border-white/10 focus:border-amber-500/50 focus:bg-white/[0.03] focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] text-slate-100 placeholder-white/20" 
      : "bg-slate-50 border-black/5 focus:border-amber-400 focus:bg-white focus:shadow-[0_0_20px_rgba(245,158,11,0.1)] text-slate-800 placeholder-slate-400"
  }`;

  const labelClass = `block text-[11px] font-extrabold uppercase tracking-widest mb-2 ${
    isDark ? "text-white/40" : "text-slate-500"
  }`;

  const cardClass = `w-full p-8 md:p-10 rounded-[32px] border transition-all duration-300 ${
    isDark 
      ? "bg-[#090e1a] border-white/5 backdrop-blur-xl shadow-2xl text-slate-100" 
      : "bg-white border-black/[0.04] shadow-sm text-slate-800"
  }`;

  return (
    <div className="animate-fade-in pb-32 flex flex-col h-full w-full font-sans">
      <div className={cardClass}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className={`text-[28px] font-bold tracking-tight ${isDark ? "text-white/90" : "text-slate-800"}`}>
            Ana Site Proje Yönetimi
          </h2>
          <p className={`text-[15px] mt-2 max-w-xl leading-relaxed ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Buradan eklediğiniz projeler ana sitenin "Projects" sayfasında dinamik olarak güncellenir.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] text-[14px] font-bold text-white transition-all overflow-hidden bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-0.5`}
        >
          <LuPlus strokeWidth={3} size={18} /> Yeni Proje Ekle
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <form onSubmit={handleAddProject} className={`mb-10 p-8 rounded-[24px] border space-y-8 animate-fade-in ${
          isDark ? "bg-[#0a0a0a]/30 border-white/10" : "bg-slate-50/50 border-black/5"
        }`}>
          <h3 className={`text-[15px] font-semibold flex items-center gap-3 border-b pb-4 ${isDark ? "text-white/80 border-white/5" : "text-slate-800 border-black/5"}`}>
            <div className={`p-2 rounded-xl ${isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-600"}`}>
              <LuFolderKanban strokeWidth={2.5} size={18} />
            </div>
            Proje Detayları
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Proje Başlığı</label>
              <input
                type="text"
                required
                placeholder="Örn: Eventeaze"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="portfolio">Portföy (Eventeaze vb.)</option>
                <option value="blog">Blog / Akademik (TÜBİTAK vb.)</option>
                <option value="ecommerce">E-Ticaret / Yönetim Uygulamaları</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Proje Linki (GitHub / Canlı Demo URL)</label>
            <input
              type="url"
              required
              placeholder="https://github.com/username/project"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Proje Açıklaması</label>
            <textarea
              required
              rows={3}
              placeholder="Projede hangi teknolojiler kullanıldı, ne işe yarıyor? Kısa bir açıklama girin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="flex gap-4 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className={`px-6 py-3.5 rounded-[16px] text-[14px] font-bold transition-all border ${
                isDark 
                  ? "bg-transparent border-white/10 hover:bg-white/5 text-white/70" 
                  : "bg-transparent border-black/10 hover:bg-black/5 text-slate-600"
              }`}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-[16px] text-[14px] font-bold text-white transition-all bg-amber-600 hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
            >
              Projeyi Yayınla
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {loading ? (
        <div className={`py-20 flex justify-center text-[14px] font-semibold ${isDark ? "text-white/40" : "text-slate-500"}`}>
          Projeler yükleniyor...
        </div>
      ) : projects.length === 0 ? (
        <div className={`py-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-[24px] ${
          isDark ? "border-white/10 text-white/40" : "border-black/10 text-slate-400 bg-slate-50/50"
        }`}>
          <LuSquareKanban strokeWidth={1.5} size={48} className="mb-4 opacity-50" />
          <p className="text-[15px] font-semibold">Henüz hiç proje yüklenmemiş.</p>
          <p className="text-[13px] mt-1 opacity-70">Yukarıdaki "Yeni Proje Ekle" butonunu kullanarak ilk projenizi ekleyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className={`group relative flex flex-col justify-between p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-1 ${
              isDark 
                ? "bg-white/[0.015] border-white/5 hover:border-amber-500/30 hover:bg-amber-500/[0.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]" 
                : "bg-white border-black/5 hover:border-amber-500/30 hover:bg-amber-50 hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)] shadow-sm"
            }`}>
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-[24px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-amber-500/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-full ${
                    isDark 
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {getCategoryLabel(proj.category)}
                  </span>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      isDark
                        ? "text-white/30 hover:text-rose-400 hover:bg-rose-500/10"
                        : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    }`}
                    title="Projeyi Sil"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
                
                <h4 className={`text-[18px] font-bold tracking-tight mb-2 ${isDark ? "text-white/90" : "text-slate-800"}`}>{proj.title}</h4>
                <p className={`text-[13px] leading-relaxed line-clamp-3 ${isDark ? "text-white/60" : "text-slate-600"}`}>{proj.description}</p>
              </div>

              <div className={`mt-6 pt-4 border-t flex justify-between items-center relative z-10 ${
                isDark ? "border-white/5" : "border-black/5"
              }`}>
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[12px] flex items-center gap-2 font-bold transition-colors ${
                    isDark ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-700"
                  }`}
                >
                  Proje Linki <LuExternalLink strokeWidth={2.5} size={14} />
                </a>
                <span className={`text-[11px] font-mono ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  ID: {typeof proj.id === "string" ? proj.id.slice(0, 8) : proj.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ProjectsTab;
