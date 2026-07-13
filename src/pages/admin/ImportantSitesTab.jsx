import React, { useState, useEffect, useRef } from "react";
import { db } from "../../lib/supabase";
import { 
  LuPlus, 
  LuTrash2, 
  LuGlobe, 
  LuChevronRight, 
  LuLayers, 
  LuLink, 
  LuCheck, 
  LuX, 
  LuNetwork, 
  LuFolderPlus 
} from "react-icons/lu";

const ImportantSitesTab = ({ theme }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Tree Expansion states
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [expandedSubcats, setExpandedSubcats] = useState(new Set());

  // Virtual Drafts
  const [virtualCats, setVirtualCats] = useState([]);
  const [virtualSubcats, setVirtualSubcats] = useState([]);

  // Inline Addition States
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [addingSubcatFor, setAddingSubcatFor] = useState(null);
  const [newSubcatName, setNewSubcatName] = useState("");

  const [addingSiteFor, setAddingSiteFor] = useState(null);
  const [newSiteTitle, setNewSiteTitle] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");

  // Refs for auto-focus
  const catInputRef = useRef(null);
  const subcatInputRef = useRef(null);
  const siteTitleRef = useRef(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    const { data, error } = await db.important_sites.fetchAll();
    if (!error && data) {
      setSites(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error } = await db.important_sites.delete(id);
    if (!error) {
      setSites(sites.filter(s => s.id !== id));
    }
    setDeletingId(null);
  };

  const toggleCategory = (cat) => {
    setExpandedCats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cat)) newSet.delete(cat);
      else newSet.add(cat);
      return newSet;
    });
  };

  const toggleSubcategory = (cat, subcat) => {
    const key = `${cat}|${subcat}`;
    setExpandedSubcats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  // Build tree structure
  const groupedSites = sites.reduce((acc, site) => {
    if (!acc[site.category]) acc[site.category] = {};
    if (!acc[site.category][site.subcategory]) acc[site.category][site.subcategory] = [];
    acc[site.category][site.subcategory].push(site);
    return acc;
  }, {});

  virtualCats.forEach(cat => {
    if (!groupedSites[cat]) groupedSites[cat] = {};
  });

  virtualSubcats.forEach(({ cat, subcat }) => {
    if (!groupedSites[cat]) groupedSites[cat] = {};
    if (!groupedSites[cat][subcat]) groupedSites[cat][subcat] = [];
  });

  const handleAddCatClick = () => {
    setAddingCat(true);
    setTimeout(() => catInputRef.current?.focus(), 50);
  };

  const confirmCat = () => {
    const name = newCatName.trim();
    if (name) {
      setVirtualCats(prev => [...prev, name]);
      setExpandedCats(prev => new Set(prev).add(name));
    }
    setAddingCat(false);
    setNewCatName("");
  };

  const handleAddSubcatClick = (catName) => {
    setExpandedCats(prev => new Set(prev).add(catName)); 
    setAddingSubcatFor(catName);
    setTimeout(() => subcatInputRef.current?.focus(), 50);
  };

  const confirmSubcat = (catName) => {
    const name = newSubcatName.trim();
    if (name) {
      setVirtualSubcats(prev => [...prev, { cat: catName, subcat: name }]);
      setExpandedSubcats(prev => new Set(prev).add(`${catName}|${name}`));
    }
    setAddingSubcatFor(null);
    setNewSubcatName("");
  };

  const handleAddSiteClick = (catName, subcatName) => {
    setExpandedSubcats(prev => new Set(prev).add(`${catName}|${subcatName}`));
    setAddingSiteFor(`${catName}|${subcatName}`);
    setTimeout(() => siteTitleRef.current?.focus(), 50);
  };

  const confirmSite = async (cat, subcat) => {
    const title = newSiteTitle.trim();
    let url = newSiteUrl.trim();
    
    if (title && url) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      
      const payload = { title, url, category: cat, subcategory: subcat };
      const { data, error } = await db.important_sites.create(payload);
      if (!error && data) {
        setSites([...sites, data]);
      }
    }
    setAddingSiteFor(null);
    setNewSiteTitle("");
    setNewSiteUrl("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isDark = theme === "dark";

  // Ultra-Premium Linear/Vercel Design Tokens
  const tokens = {
    bgContainer: isDark ? "bg-[#090e1a] border-white/5 shadow-2xl" : "bg-[#fcfcfc] border-black/5 shadow-sm",
    
    // Category Cards
    catBase: isDark ? "bg-white/[0.02] border-white/5 backdrop-blur-xl" : "bg-white border-black/5",
    catHover: isDark ? "hover:bg-white/[0.04] hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]" : "hover:border-indigo-500/30 hover:shadow-md",
    catExpanded: isDark ? "bg-white/[0.03] border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]" : "bg-white border-indigo-500/40 shadow-md",
    
    // Subcategory Cards
    subBase: isDark ? "bg-white/[0.015] border-white/5 backdrop-blur-lg" : "bg-white border-black/5",
    subHover: isDark ? "hover:bg-white/[0.03] hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.06)]" : "hover:border-emerald-500/30 hover:shadow-md",
    subExpanded: isDark ? "bg-white/[0.02] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)]" : "bg-white border-emerald-500/40 shadow-md",
    
    // Site Cards
    siteBase: isDark ? "bg-white/[0.01] border-white/5 backdrop-blur-md" : "bg-white border-black/5",
    siteHover: isDark ? "hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]" : "hover:shadow-md hover:-translate-y-[1px]",

    // Colors & Accents
    textPrimary: isDark ? "text-white/90" : "text-[#1d1d1f]",
    textSecondary: isDark ? "text-white/40" : "text-[#86868b]",
    line: isDark ? "bg-white/[0.06]" : "bg-black/[0.08]",
    borderCurve: isDark ? "border-white/[0.08] border-dashed" : "border-black/[0.1] border-dashed",
    btnPrimary: isDark ? "bg-white text-black hover:bg-white/90 font-medium" : "bg-black text-white hover:bg-black/90 font-medium",
    iconBg: isDark ? "bg-white/5" : "bg-black/5",
    iconHover: isDark ? "hover:bg-white/10 hover:text-white" : "hover:bg-black/10 hover:text-black",
    
    // Badges/Tags
    tagCat: isDark ? "text-indigo-400" : "text-indigo-600",
    tagSub: isDark ? "text-emerald-400" : "text-emerald-600",
  };

  return (
    <div className="animate-fade-in pb-32 flex flex-col h-full w-full">
      {/* Main Glassmorphism Container */}
      <div className={`w-full rounded-[32px] p-6 md:p-10 transition-colors duration-500 border ${tokens.bgContainer}`}>
        
        {/* Header */}
        <div className="mb-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div>
              <h1 className={`text-[32px] font-bold tracking-tight mb-2 ${tokens.textPrimary}`}>
                Önemli Siteler
              </h1>
              <p className={`text-[15px] ${tokens.textSecondary}`}>
                Tüm bağlantılarınızı profesyonel bir zihin haritasında yönetin.
              </p>
            </div>
            <button 
              onClick={handleAddCatClick}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] transition-all duration-300 active:scale-95 shadow-lg shadow-black/10 ${tokens.btnPrimary}`}
            >
              <LuPlus strokeWidth={2.5} size={15} />
              <span>Ana Başlık Ekle</span>
            </button>
          </div>
        </div>
        
        {Object.keys(groupedSites).length === 0 && !addingCat ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-80">
            <div className={`w-24 h-24 mb-6 rounded-[2rem] flex items-center justify-center ${tokens.iconBg} shadow-inner`}>
              <LuLink strokeWidth={1.5} size={40} className={tokens.textSecondary} />
            </div>
            <p className={`text-[18px] font-medium tracking-tight ${tokens.textPrimary}`}>Henüz bağlantı eklenmemiş</p>
            <p className={`text-[14px] mt-2 ${tokens.textSecondary}`}>Ağacınızı oluşturmak için yeni bir başlık ekleyin.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            
            {/* INLINE ADD ROOT CAT */}
            {addingCat && (
              <div className="flex w-full animate-fade-in">
                <div className={`w-full sm:w-[420px] flex items-center px-5 py-4 rounded-2xl border ${tokens.catExpanded}`}>
                  <input
                    ref={catInputRef}
                    type="text"
                    placeholder="Ana Başlık Adı..."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") confirmCat();
                      else if (e.key === "Escape") setAddingCat(false);
                    }}
                    className={`w-full bg-transparent outline-none text-[16px] font-semibold tracking-tight ${tokens.textPrimary} placeholder-[#86868b]`}
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={confirmCat} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${tokens.btnPrimary}`}><LuCheck strokeWidth={2.5} size={14}/></button>
                    <button onClick={() => setAddingCat(false)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${tokens.iconBg} ${tokens.iconHover} ${tokens.textSecondary}`}><LuX strokeWidth={2.5} size={14}/></button>
                  </div>
                </div>
              </div>
            )}

            {Object.entries(groupedSites).map(([catName, subcats]) => {
              const isCatExpanded = expandedCats.has(catName);
              const isAddingSubcat = addingSubcatFor === catName;
              
              const subcatEntries = Object.entries(subcats);
              const totalSubcatNodes = subcatEntries.length + (isAddingSubcat ? 1 : 0);
              
              return (
                <div key={catName} className="flex flex-col w-full">
                  
                  {/* CATEGORY ROW */}
                  <div 
                    onClick={() => toggleCategory(catName)}
                    className={`group relative flex items-center justify-between w-full sm:w-[420px] px-5 py-4 rounded-2xl border transition-all duration-300 ease-out cursor-pointer ${
                      isCatExpanded ? tokens.catExpanded : tokens.catBase
                    } ${!isCatExpanded && tokens.catHover}`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`}>
                        {isCatExpanded && <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-xl"></div>}
                        <LuLayers strokeWidth={2} size={18} className={`relative z-10 ${tokens.tagCat}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${tokens.textSecondary}`}>Kategori</span>
                        <span className={`font-semibold text-[16px] tracking-tight truncate ${tokens.textPrimary}`}>
                          {catName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Hover Actions (Slide in from right) */}
                      <div className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 flex items-center gap-1 transition-all duration-300" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => handleAddSubcatClick(catName)} 
                          className={`p-2.5 rounded-full transition-colors ${tokens.iconHover} ${tokens.textSecondary}`}
                          title="İçine Alt Başlık Ekle"
                        >
                          <LuNetwork strokeWidth={2} size={15} />
                        </button>
                        <button 
                          onClick={handleAddCatClick} 
                          className={`p-2.5 rounded-full transition-colors ${tokens.iconHover} ${tokens.textSecondary}`}
                          title="Yeni Ana Başlık Ekle"
                        >
                          <LuPlus strokeWidth={2.5} size={15} />
                        </button>
                      </div>
                      
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${tokens.iconBg} group-hover:${tokens.iconHover}`}>
                        <LuChevronRight strokeWidth={2.5} size={14} className={`transition-transform duration-300 ${tokens.textSecondary} ${isCatExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* BRANCH TO SUBCATEGORIES */}
                  {isCatExpanded && totalSubcatNodes > 0 && (
                    <div className="flex flex-col gap-4 mt-4 ml-7 md:ml-12 relative">
                      
                      {subcatEntries.map(([subcatName, sitesList], index) => {
                        const subcatKey = `${catName}|${subcatName}`;
                        const isSubExpanded = expandedSubcats.has(subcatKey);
                        const isAddingSite = addingSiteFor === subcatKey;
                        
                        const totalSiteNodes = sitesList.length + (isAddingSite ? 1 : 0);
                        const isLast = index === totalSubcatNodes - 1;
                        const isFirst = index === 0;

                        return (
                          <div key={subcatName} className="relative pl-8 md:pl-12 flex flex-col">
                            {/* Connect to Parent if first */}
                            {isFirst && <div className={`absolute left-0 -top-4 w-[1px] h-4 ${tokens.line}`}></div>}
                            
                            {/* Premium dashed sweeping curve */}
                            <div className={`absolute left-0 top-0 w-8 md:w-12 h-[30px] border-l border-b rounded-bl-[24px] ${tokens.borderCurve}`}></div>
                            
                            {/* Vertical spine to next subcat */}
                            {!isLast && <div className={`absolute left-0 top-[30px] w-[1px] h-[calc(100%+16px-30px)] ${tokens.line}`}></div>}

                            {/* SUBCATEGORY WRAPPER */}
                            <div 
                              onClick={() => toggleSubcategory(catName, subcatName)}
                              className={`group/subcat relative flex items-center justify-between w-full sm:w-[420px] px-4 py-3 rounded-xl border transition-all duration-300 ease-out cursor-pointer ${
                                isSubExpanded ? tokens.subExpanded : tokens.subBase
                              } ${!isSubExpanded && tokens.subHover}`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`}>
                                  {isSubExpanded && <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-lg"></div>}
                                  <LuLayers strokeWidth={2} size={14} className={`relative z-10 ${tokens.tagSub}`} />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-[9px] font-bold tracking-widest uppercase ${tokens.textSecondary}`}>Alt Başlık</span>
                                  <span className={`font-semibold text-[15px] tracking-tight truncate ${tokens.textPrimary}`}>
                                    {subcatName}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* Hover Actions */}
                                <div className="opacity-0 translate-x-2 group-hover/subcat:opacity-100 group-hover/subcat:translate-x-0 flex items-center transition-all duration-300" onClick={e => e.stopPropagation()}>
                                  <button 
                                    onClick={() => handleAddSiteClick(catName, subcatName)}
                                    className={`p-2 rounded-full transition-colors ${tokens.iconHover} ${tokens.textSecondary}`}
                                    title="İçine Yeni Site Ekle"
                                  >
                                    <LuFolderPlus strokeWidth={2} size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleAddSubcatClick(catName)}
                                    className={`p-2 rounded-full transition-colors ${tokens.iconHover} ${tokens.textSecondary}`}
                                    title="Yeni Alt Başlık Ekle"
                                  >
                                    <LuPlus strokeWidth={2.5} size={14} />
                                  </button>
                                </div>
                                <div className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${tokens.iconBg} group-hover/subcat:${tokens.iconHover}`}>
                                  <LuChevronRight strokeWidth={2.5} size={12} className={`transition-transform duration-300 ${tokens.textSecondary} ${isSubExpanded ? "rotate-90" : ""}`} />
                                </div>
                              </div>
                            </div>

                            {/* BRANCH TO SITES */}
                            {isSubExpanded && totalSiteNodes > 0 && (
                              <div className="flex flex-col gap-3 mt-3 ml-7 md:ml-12 relative">
                                {sitesList.map((site, siteIndex) => {
                                  const isLastSite = siteIndex === totalSiteNodes - 1;
                                  const isFirstSite = siteIndex === 0;

                                  return (
                                    <div key={site.id} className="relative pl-8 md:pl-12 flex flex-col pr-4 md:pr-0">
                                      {/* Connect to Subcat if first */}
                                      {isFirstSite && <div className={`absolute left-0 -top-3 w-[1px] h-3 ${tokens.line}`}></div>}
                                      
                                      {/* Sweeping curve to Site */}
                                      <div className={`absolute left-0 top-0 w-8 md:w-12 h-[24px] border-l border-b rounded-bl-[20px] ${tokens.borderCurve}`}></div>
                                      
                                      {/* Vertical spine to next site */}
                                      {!isLastSite && <div className={`absolute left-0 top-[24px] w-[1px] h-[calc(100%+12px-24px)] ${tokens.line}`}></div>}

                                      {/* SITE LEAF NODE */}
                                      <div className={`group/site relative flex items-center justify-between w-full sm:w-[420px] px-4 py-2.5 rounded-xl border transition-all duration-300 ease-out ${tokens.siteBase} ${tokens.siteHover}`}>
                                        <a 
                                          href={site.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-3 w-full truncate cursor-pointer group/link"
                                        >
                                          {/* Glass Favicon Box */}
                                          <div className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-[10px] shadow-sm border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                                            <img 
                                              src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=64`} 
                                              alt="" 
                                              className="w-[18px] h-[18px] rounded-[4px]"
                                              onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                              }}
                                            />
                                            <LuGlobe strokeWidth={2} className="w-4 h-4 hidden text-white/30" />
                                          </div>
                                          <span className={`font-medium text-[14.5px] tracking-tight truncate transition-colors group-hover/link:underline ${tokens.textPrimary}`}>
                                            {site.title}
                                          </span>
                                        </a>
                                        
                                        <div className="opacity-0 translate-x-2 group-hover/site:opacity-100 group-hover/site:translate-x-0 flex items-center pl-3 shrink-0 transition-all duration-300">
                                          <button 
                                            onClick={() => handleDelete(site.id)}
                                            disabled={deletingId === site.id}
                                            className={`p-2.5 rounded-full transition-colors ${isDark ? 'text-[#ff453a] hover:bg-[#ff453a]/15' : 'text-[#ff3b30] hover:bg-[#ff3b30]/10'}`}
                                            title="Sil"
                                          >
                                            <LuTrash2 strokeWidth={2} size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* INLINE ADD SITE */}
                                {isAddingSite && (
                                  <div className="relative pl-8 md:pl-12 flex flex-col animate-fade-in pr-4 md:pr-0">
                                    {totalSiteNodes === 1 && <div className={`absolute left-0 -top-3 w-[1px] h-3 ${tokens.line}`}></div>}
                                    <div className={`absolute left-0 top-0 w-8 md:w-12 h-[24px] border-l border-b rounded-bl-[20px] ${tokens.borderCurve}`}></div>
                                    
                                    <div className={`flex flex-col md:flex-row md:items-center w-full sm:w-[420px] px-4 py-3 gap-3 rounded-xl border ${tokens.siteBase}`}>
                                      <input
                                        ref={siteTitleRef}
                                        type="text"
                                        placeholder="Site Adı..."
                                        value={newSiteTitle}
                                        onChange={e => setNewSiteTitle(e.target.value)}
                                        onKeyDown={e => {
                                          if (e.key === "Enter") confirmSite(catName, subcatName);
                                          else if (e.key === "Escape") setAddingSiteFor(null);
                                        }}
                                        className={`w-full bg-transparent outline-none text-[14.5px] font-medium tracking-tight ${tokens.textPrimary} placeholder-[#86868b]`}
                                      />
                                      <div className={`hidden md:block w-[1px] h-5 ${tokens.line}`}></div>
                                      <input
                                        type="text"
                                        placeholder="URL (Örn: apple.com)"
                                        value={newSiteUrl}
                                        onChange={e => setNewSiteUrl(e.target.value)}
                                        onKeyDown={e => {
                                          if (e.key === "Enter") confirmSite(catName, subcatName);
                                          else if (e.key === "Escape") setAddingSiteFor(null);
                                        }}
                                        className={`w-full bg-transparent outline-none text-[14.5px] font-medium tracking-tight ${tokens.textPrimary} placeholder-[#86868b]`}
                                      />
                                      <div className="flex items-center gap-2 shrink-0 justify-end mt-2 md:mt-0">
                                        <button onClick={() => confirmSite(catName, subcatName)} className={`w-8 h-8 flex items-center justify-center rounded-[10px] transition-colors ${tokens.btnPrimary}`}><LuCheck strokeWidth={2.5} size={14}/></button>
                                        <button onClick={() => setAddingSiteFor(null)} className={`w-8 h-8 flex items-center justify-center rounded-[10px] transition-colors ${tokens.iconBg} ${tokens.iconHover} ${tokens.textSecondary}`}><LuX strokeWidth={2.5} size={14}/></button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* INLINE ADD SUBCAT */}
                      {isAddingSubcat && (
                        <div className="relative pl-8 md:pl-12 flex flex-col animate-fade-in">
                          {totalSubcatNodes === 1 && <div className={`absolute left-0 -top-4 w-[1px] h-4 ${tokens.line}`}></div>}
                          <div className={`absolute left-0 top-0 w-8 md:w-12 h-[30px] border-l border-b rounded-bl-[24px] ${tokens.borderCurve}`}></div>
                          
                          <div className={`flex items-center w-full sm:w-[420px] px-5 py-3 rounded-xl border ${tokens.subExpanded}`}>
                            <input
                              ref={subcatInputRef}
                              type="text"
                              placeholder="Alt Başlık Adı..."
                              value={newSubcatName}
                              onChange={e => setNewSubcatName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") confirmSubcat(catName);
                                else if (e.key === "Escape") setAddingSubcatFor(null);
                              }}
                              className={`w-full bg-transparent outline-none text-[15px] font-semibold tracking-tight ${tokens.textPrimary} placeholder-[#86868b]`}
                            />
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <button onClick={() => confirmSubcat(catName)} className={`w-8 h-8 flex items-center justify-center rounded-[10px] transition-colors ${tokens.btnPrimary}`}><LuCheck strokeWidth={2.5} size={14}/></button>
                              <button onClick={() => setAddingSubcatFor(null)} className={`w-8 h-8 flex items-center justify-center rounded-[10px] transition-colors ${tokens.iconBg} ${tokens.iconHover} ${tokens.textSecondary}`}><LuX strokeWidth={2.5} size={14}/></button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportantSitesTab;
