import React, { useState, useEffect } from "react";
import { db } from "../../lib/supabase";
import { FaPlus, FaTrash, FaExternalLinkAlt, FaFolder } from "react-icons/fa";

const ProjectsTab = ({ theme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("portfolio");
  const [showAddForm, setShowAddForm] = useState(false);

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

  const inputClass = "w-full border rounded-lg py-2 px-3 text-xs focus:outline-none transition-all " + 
    (theme === "dark" 
      ? "bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-100" 
      : "bg-slate-50 border-slate-205 focus:border-purple-500 text-slate-800");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-base font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
            Ana Site Proje Yönetimi
          </h2>
          <p className={`text-3xs mt-1 ${theme === "dark" ? "text-slate-450" : "text-slate-500"}`}>
            Buradan eklediğiniz veya sildiğiniz projeler ana sitenin "Projects" sayfasında dinamik olarak güncellenir.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-650 hover:bg-purple-600 text-white text-3xs font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
        >
          <FaPlus size={10} /> Yeni Proje Ekle
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <form onSubmit={handleAddProject} className={`border p-5 rounded-2xl space-y-4 max-w-2xl ${
          theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${theme === "dark" ? "text-slate-250" : "text-slate-800"}`}>
            <FaFolder className="text-purple-650 dark:text-purple-400" /> Proje Detayları
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Proje Başlığı</label>
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
              <label className="block text-4xs font-bold text-slate-455 uppercase mb-1">Kategori</label>
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
            <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Proje Linki (GitHub / Canlı Demo URL)</label>
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
            <label className="block text-4xs font-bold text-slate-450 uppercase mb-1">Proje Açıklaması</label>
            <textarea
              required
              rows={3}
              placeholder="Projede hangi teknolojiler kullanıldı, ne işe yarıyor? Kısa bir açıklama girin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className={`text-xs font-semibold py-2 px-4 rounded-lg transition border cursor-pointer ${
                theme === "dark" 
                  ? "bg-slate-850 border-slate-750 hover:bg-slate-800 text-slate-350" 
                  : "bg-white border-slate-200 hover:bg-slate-100 text-slate-650"
              }`}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="bg-purple-650 hover:bg-purple-600 text-white text-xs font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
            >
              Projeyi Yayınla
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="py-12 flex justify-center text-slate-450 text-xs font-semibold">Projeler yükleniyor...</div>
      ) : projects.length === 0 ? (
        <div className={`py-12 flex items-center justify-center text-sm border border-dashed rounded-xl ${
          theme === "dark" ? "border-slate-800 text-slate-500" : "border-slate-250 text-slate-400 bg-slate-50/50"
        }`}>
          Yüklenmiş proje bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className={`border p-5 rounded-2xl flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition duration-200 ${
              theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-850 shadow-sm"
            }`}>
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`text-4xs font-bold px-2 py-0.5 border rounded-full ${
                    theme === "dark" 
                      ? "bg-slate-950 text-purple-400 border-purple-500/10" 
                      : "bg-purple-50 text-purple-700 border-purple-100"
                  }`}>
                    {getCategoryLabel(proj.category)}
                  </span>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                      theme === "dark"
                        ? "bg-slate-950 border-slate-850 text-rose-500 hover:text-rose-400 hover:bg-rose-500/5"
                        : "bg-white border-slate-150 text-rose-650 hover:text-rose-500 hover:bg-rose-50"
                    }`}
                    title="Projeyi Sil"
                  >
                    <FaTrash size={9} />
                  </button>
                </div>
                
                <h4 className={`text-sm font-bold mb-1 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{proj.title}</h4>
                <p className={`text-3xs leading-relaxed line-clamp-3 ${theme === "dark" ? "text-slate-400" : "text-slate-550"}`}>{proj.description}</p>
              </div>

              <div className={`mt-4 pt-3 border-t flex justify-between items-center ${
                theme === "dark" ? "border-slate-950" : "border-slate-100"
              }`}>
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-650 dark:text-purple-400 hover:underline text-3xs flex items-center gap-1 font-bold"
                >
                  Proje Linki <FaExternalLinkAlt size={8} />
                </a>
                <span className="text-4xs text-slate-500">
                  ID: {typeof proj.id === "string" ? proj.id.slice(0, 8) : proj.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
