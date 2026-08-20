import React, { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../../lib/supabase";
import {
  LuNotebook, LuPlus, LuSearch, LuPin, LuStar, LuArchive, LuTrash2,
  LuTag, LuFolder, LuLayoutGrid, LuList, LuColumns2, LuCopy, LuDownload,
  LuSparkles, LuCheck, LuX, LuSquareCheck, LuSquare, LuCode,
  LuFileText, LuMaximize2, LuMinimize2, LuFlame, LuTriangleAlert,
  LuFilter, LuRefreshCw, LuChevronRight, LuEye, LuPencil,
  LuBold, LuItalic, LuStrikethrough, LuUnderline, LuHeading1, LuHeading2,
  LuListOrdered, LuQuote, LuHighlighter, LuType
} from "react-icons/lu";

// Rich inline style parser for live preview and note rendering
const parseInlineStyles = (str) => {
  if (!str) return "";
  return str
    .replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-amber-400/30 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">$1</mark>')
    .replace(/==(.*?)==/g, '<mark class="bg-amber-400/30 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">$1</mark>')
    .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-emerald-400 underline-offset-4 decoration-2">$1</u>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-[#10b981] dark:text-emerald-300">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-400 dark:text-slate-300">$1</em>')
    .replace(/~~(.*?)~~/g, '<del class="line-through opacity-50">$1</del>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px] border border-slate-700">$1</code>');
};

const renderRichContent = (text, fontFamily = "sans", fontSize = "base", isDark = true) => {
  if (!text) return null;

  const fontClass = fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";
  const sizeClass = fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : fontSize === "xl" ? "text-lg" : "text-sm";

  const lines = text.split("\n");
  return (
    <div className={`space-y-2 ${fontClass} ${sizeClass} leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
      {lines.map((line, idx) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-xl md:text-2xl font-black mt-4 mb-2 text-emerald-400 border-b border-emerald-500/20 pb-1.5 flex items-center gap-2">
              <span className="text-emerald-500 font-normal">#</span>
              {line.replace("# ", "")}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-lg md:text-xl font-extrabold mt-3.5 mb-1.5 text-indigo-400 border-b border-indigo-500/10 pb-1">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-base font-bold mt-3 mb-1 text-amber-400">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("> ")) {
          return (
            <blockquote key={idx} className="my-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-300 font-medium italic">
              {line.replace("> ", "")}
            </blockquote>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1 pl-2">
              <span className="text-emerald-400 font-bold shrink-0 mt-1">•</span>
              <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(line.substring(2)) }} />
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          return (
            <div key={idx} className="flex items-start gap-2.5 my-1 pl-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 text-5xs font-bold shrink-0 mt-0.5">{match?.[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(match?.[2] || "") }} />
            </div>
          );
        }

        return (
          <div key={idx} className="min-h-[1.25rem]">
            <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
          </div>
        );
      })}
    </div>
  );
};



// Color Palette Configurations
const COLOR_THEMES = {
  slate: {
    name: "Siyah / Slate",
    bg: "bg-slate-900/60",
    border: "border-slate-800",
    hoverBorder: "hover:border-slate-700",
    badgeBg: "bg-slate-800/80 text-slate-300 border-slate-700",
    accent: "text-slate-400",
    ring: "ring-slate-500/30",
    glow: "shadow-slate-500/5",
    lightBg: "bg-slate-100",
    lightBorder: "border-slate-300"
  },
  emerald: {
    name: "Zümrüt Yeşili",
    bg: "bg-emerald-950/20",
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/50",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    accent: "text-emerald-400",
    ring: "ring-emerald-500/40",
    glow: "shadow-emerald-500/10",
    lightBg: "bg-emerald-50/80",
    lightBorder: "border-emerald-200"
  },
  indigo: {
    name: "İndigo Mavisi",
    bg: "bg-indigo-950/20",
    border: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-500/50",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    accent: "text-indigo-400",
    ring: "ring-indigo-500/40",
    glow: "shadow-indigo-500/10",
    lightBg: "bg-indigo-50/80",
    lightBorder: "border-indigo-200"
  },
  amber: {
    name: "Kehribar / Sarı",
    bg: "bg-amber-950/20",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-500/50",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accent: "text-amber-400",
    ring: "ring-amber-500/40",
    glow: "shadow-amber-500/10",
    lightBg: "bg-amber-50/80",
    lightBorder: "border-amber-200"
  },
  rose: {
    name: "Gül Kırmızı",
    bg: "bg-rose-950/20",
    border: "border-rose-500/30",
    hoverBorder: "hover:border-rose-500/50",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    accent: "text-rose-400",
    ring: "ring-rose-500/40",
    glow: "shadow-rose-500/10",
    lightBg: "bg-rose-50/80",
    lightBorder: "border-rose-200"
  },
  purple: {
    name: "Mor / Asil",
    bg: "bg-purple-950/20",
    border: "border-purple-500/30",
    hoverBorder: "hover:border-purple-500/50",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    accent: "text-purple-400",
    ring: "ring-purple-500/40",
    glow: "shadow-purple-500/10",
    lightBg: "bg-purple-50/80",
    lightBorder: "border-purple-200"
  },
  teal: {
    name: "Turkuaz",
    bg: "bg-teal-950/20",
    border: "border-teal-500/30",
    hoverBorder: "hover:border-teal-500/50",
    badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    accent: "text-teal-400",
    ring: "ring-teal-500/40",
    glow: "shadow-teal-500/10",
    lightBg: "bg-teal-50/80",
    lightBorder: "border-teal-200"
  },
  cyan: {
    name: "Açık Mavi",
    bg: "bg-cyan-950/20",
    border: "border-cyan-500/30",
    hoverBorder: "hover:border-cyan-500/50",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    accent: "text-cyan-400",
    ring: "ring-cyan-500/40",
    glow: "shadow-cyan-500/10",
    lightBg: "bg-cyan-50/80",
    lightBorder: "border-cyan-200"
  }
};

const DEFAULT_CATEGORIES = ["Genel", "KPSS", "Projeler", "Finans", "Kişisel", "Fikirler"];

const NotesTab = ({ theme }) => {
  const isDark = theme === "dark";

  // State Management
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedViewTab, setSelectedViewTab] = useState("all"); // 'all', 'pinned', 'favorites', 'archive', 'trash'
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [viewMode, setViewMode] = useState("split"); // 'split', 'grid', 'list'
  
  // Note Modal / Editor state
  const [activeNote, setActiveNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Editor Draft State & Rich Formatting
  const editorRef = useRef(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorCategory, setEditorCategory] = useState("Genel");
  const [editorTags, setEditorTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [editorColor, setEditorColor] = useState("slate");
  const [editorType, setEditorType] = useState("text"); // 'text', 'checklist', 'code'
  const [editorChecklist, setEditorChecklist] = useState([]);
  const [newChecklistText, setNewChecklistText] = useState("");
  const [editorPriority, setEditorPriority] = useState("normal");
  const [editorFontFamily, setEditorFontFamily] = useState("sans"); // 'sans', 'serif', 'mono'
  const [editorFontSize, setEditorFontSize] = useState("base"); // 'sm', 'base', 'lg', 'xl'
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync contentEditable innerHTML when editor opens
  useEffect(() => {
    if (editorRef.current && isEditorOpen) {
      editorRef.current.innerHTML = convertMarkdownToHtml(editorContent);
    }
  }, [isEditorOpen]);

  const handleEditorInput = (e) => {
    setEditorContent(e.currentTarget.innerHTML);
  };

  // WYSIWYG Command Executor (Executes visual formatting commands instantly)
  const execCmd = (command, value = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (command === 'highlight') {
      document.execCommand('hiliteColor', false, 'rgba(245, 158, 11, 0.35)');
    } else {
      document.execCommand(command, false, value);
    }
    setEditorContent(editorRef.current.innerHTML);
  };

  // New Category Modal
  const [newCategoryName, setNewCategoryName] = useState("");
  const [customCategories, setCustomCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("admin_custom_note_categories") || "[]");
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.notes.fetchAll();
      if (error) throw error;
      setNotes(data || []);
      if (data && data.length > 0 && !activeNote) {
        setActiveNote(data[0]);
      }
    } catch (err) {
      console.error("Notlar çekilirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open note in editor
  const handleOpenEditor = (note = null, defaultType = "text") => {
    if (note) {
      setActiveNote(note);
      setEditorTitle(note.title || "");
      setEditorContent(note.content || "");
      setEditorCategory(note.category || "Genel");
      setEditorTags(note.tags || []);
      setEditorColor(note.color || "slate");
      setEditorType(note.type || "text");
      setEditorChecklist(note.checklist || []);
      setEditorPriority(note.priority || "normal");
      setEditorFontFamily(note.font_family || "sans");
      setEditorFontSize(note.font_size || "base");
    } else {
      setActiveNote(null);
      setEditorTitle("");
      setEditorContent("");
      setEditorCategory(selectedCategory !== "all" ? selectedCategory : "Genel");
      setEditorTags([]);
      setEditorColor("emerald");
      setEditorType(defaultType);
      setEditorChecklist([]);
      setEditorPriority("normal");
      setEditorFontFamily("sans");
      setEditorFontSize("base");
    }
    setIsEditorOpen(true);
  };

  // Save Note (Create or Update)
  const handleSaveNote = async () => {
    if (!editorTitle.trim() && !editorContent.trim() && editorChecklist.length === 0) {
      showToast("⚠️ Not başlığı veya içeriği boş olamaz!");
      return;
    }

    setIsSaving(true);
    const notePayload = {
      title: editorTitle.trim() || "İsimsiz Not",
      content: editorContent,
      category: editorCategory,
      tags: editorTags,
      color: editorColor,
      type: editorType,
      checklist: editorChecklist,
      priority: editorPriority,
      font_family: editorFontFamily,
      font_size: editorFontSize,
      is_pinned: activeNote ? activeNote.is_pinned : false,
      is_favorite: activeNote ? activeNote.is_favorite : false,
      is_archived: activeNote ? activeNote.is_archived : false,
      is_trash: activeNote ? activeNote.is_trash : false,
    };

    try {
      if (activeNote && activeNote.id) {
        // Update existing note
        const { data, error } = await db.notes.update(activeNote.id, notePayload);
        if (error) throw error;
        setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, ...notePayload, updated_at: new Date().toISOString() } : n));
        if (data) setActiveNote(data);
        showToast("✅ Not başarıyla güncellendi!");
      } else {
        // Create new note
        const { data, error } = await db.notes.create(notePayload);
        if (error) throw error;
        if (data) {
          setNotes(prev => [data, ...prev]);
          setActiveNote(data);
        }
        showToast("✨ Yeni not eklendi!");
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error("Not kaydedilirken hata:", err);
      showToast("❌ Not kaydedilemedi!");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Pin
  const handleTogglePin = async (e, noteId) => {
    e?.stopPropagation();
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;
    const updatedValue = !targetNote.is_pinned;

    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, is_pinned: updatedValue } : n));
    if (activeNote?.id === noteId) {
      setActiveNote(prev => ({ ...prev, is_pinned: updatedValue }));
    }

    try {
      await db.notes.update(noteId, { is_pinned: updatedValue });
      showToast(updatedValue ? "📌 Not başa tutturuldu!" : "📌 Not sabitliği kaldırıldı.");
    } catch (err) {
      console.error("Pin güncellenirken hata:", err);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (e, noteId) => {
    e?.stopPropagation();
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;
    const updatedValue = !targetNote.is_favorite;

    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, is_favorite: updatedValue } : n));
    if (activeNote?.id === noteId) {
      setActiveNote(prev => ({ ...prev, is_favorite: updatedValue }));
    }

    try {
      await db.notes.update(noteId, { is_favorite: updatedValue });
      showToast(updatedValue ? "⭐ Favorilere eklendi!" : "⭐ Favorilerden çıkarıldı.");
    } catch (err) {
      console.error("Favori güncellenirken hata:", err);
    }
  };

  // Toggle Archive
  const handleToggleArchive = async (e, noteId) => {
    e?.stopPropagation();
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;
    const updatedValue = !targetNote.is_archived;

    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, is_archived: updatedValue } : n));
    if (activeNote?.id === noteId) {
      setActiveNote(prev => ({ ...prev, is_archived: updatedValue }));
    }

    try {
      await db.notes.update(noteId, { is_archived: updatedValue });
      showToast(updatedValue ? "🗄️ Not arşivlendi." : "🗄️ Not arşivden çıkarıldı.");
    } catch (err) {
      console.error("Arşiv güncellenirken hata:", err);
    }
  };

  // Move to Trash or Delete Permanently
  const handleDeleteNote = async (e, noteId, permanent = false) => {
    e?.stopPropagation();
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;

    if (permanent) {
      if (!window.confirm("Bu notu kalıcı olarak silmek istediğinize emin misiniz?")) return;
      setNotes(prev => prev.filter(n => n.id !== noteId));
      if (activeNote?.id === noteId) setActiveNote(null);
      try {
        await db.notes.delete(noteId);
        showToast("🗑️ Not kalıcı olarak silindi.");
      } catch (err) {
        console.error("Silme hatası:", err);
      }
    } else {
      const updatedValue = !targetNote.is_trash;
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, is_trash: updatedValue } : n));
      if (activeNote?.id === noteId) {
        setActiveNote(prev => ({ ...prev, is_trash: updatedValue }));
      }
      try {
        await db.notes.update(noteId, { is_trash: updatedValue });
        showToast(updatedValue ? "🗑️ Not çöp kutusuna taşındı." : "♻️ Not geri yüklendi.");
      } catch (err) {
        console.error("Çöp kutusu güncellenirken hata:", err);
      }
    }
  };

  // Duplicate Note
  const handleDuplicateNote = async (e, note) => {
    e?.stopPropagation();
    const duplicatedPayload = {
      title: `${note.title} (Kopya)`,
      content: note.content,
      category: note.category,
      tags: note.tags,
      color: note.color,
      type: note.type,
      checklist: note.checklist,
      priority: note.priority,
      is_pinned: false,
      is_favorite: false,
      is_archived: false,
      is_trash: false
    };
    try {
      const { data, error } = await db.notes.create(duplicatedPayload);
      if (error) throw error;
      if (data) {
        setNotes(prev => [data, ...prev]);
        showToast("📋 Not çoğaltıldı!");
      }
    } catch (err) {
      console.error("Kopyalama hatası:", err);
    }
  };

  // Copy Content to Clipboard
  const handleCopyContent = (text) => {
    navigator.clipboard.writeText(text);
    showToast("📋 Not içeriği kopyalandı!");
  };

  // Export note as markdown
  const handleExportMarkdown = (note) => {
    const markdownContent = `# ${note.title}\n\n*Kategori: ${note.category} | Tarih: ${new Date(note.created_at).toLocaleDateString("tr-TR")}*\n\n${note.content}`;
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();
    showToast("📥 Not Markdown (.md) olarak indirildi.");
  };



  // Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().toLowerCase().replace('#', '');
    if (!editorTags.includes(cleanTag)) {
      setEditorTags(prev => [...prev, cleanTag]);
    }
    setNewTagInput("");
  };

  // Add Checklist Item in Editor
  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: "item-" + Date.now(),
      text: newChecklistText.trim(),
      completed: false
    };
    setEditorChecklist(prev => [...prev, newItem]);
    setNewChecklistText("");
  };

  // Toggle Checklist Item completion
  const handleToggleChecklistItem = (id) => {
    setEditorChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  // Toggle Checklist item completion directly in Active View Note
  const handleToggleActiveChecklist = async (itemId) => {
    if (!activeNote) return;
    const updatedChecklist = (activeNote.checklist || []).map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
    const updatedNote = { ...activeNote, checklist: updatedChecklist };
    setActiveNote(updatedNote);
    setNotes(prev => prev.map(n => n.id === activeNote.id ? updatedNote : n));
    try {
      await db.notes.update(activeNote.id, { checklist: updatedChecklist });
    } catch (err) {
      console.error("Checklist güncellenirken hata:", err);
    }
  };

  // Add Custom Category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    if (!DEFAULT_CATEGORIES.includes(name) && !customCategories.includes(name)) {
      const updated = [...customCategories, name];
      setCustomCategories(updated);
      localStorage.setItem("admin_custom_note_categories", JSON.stringify(updated));
      showToast(`📁 "${name}" kategorisi eklendi.`);
    }
    setNewCategoryName("");
  };

  // Categories list
  const allCategories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...customCategories];
  }, [customCategories]);

  // Tag Cloud
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach(n => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach(t => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [notes]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      // Trash filter
      if (selectedViewTab === "trash") {
        if (!n.is_trash) return false;
      } else {
        if (n.is_trash) return false;
      }

      // Main View Filters
      if (selectedViewTab === "pinned" && !n.is_pinned) return false;
      if (selectedViewTab === "favorites" && !n.is_favorite) return false;
      if (selectedViewTab === "archive" && !n.is_archived) return false;
      if (selectedViewTab === "all" && n.is_archived) return false; // Hide archived in main list

      // Category filter
      if (selectedCategory !== "all" && n.category !== selectedCategory) return false;

      // Tag filter
      if (selectedTag && (!Array.isArray(n.tags) || !n.tags.includes(selectedTag))) return false;

      // Priority filter
      if (selectedPriority !== "all" && n.priority !== selectedPriority) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (n.title || "").toLowerCase().includes(q);
        const contentMatch = (n.content || "").toLowerCase().includes(q);
        const categoryMatch = (n.category || "").toLowerCase().includes(q);
        const tagMatch = Array.isArray(n.tags) && n.tags.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !contentMatch && !categoryMatch && !tagMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      // Pinned notes always come first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
    });
  }, [notes, selectedViewTab, selectedCategory, selectedTag, selectedPriority, searchQuery]);

  // Counts for Stats
  const stats = useMemo(() => {
    const active = notes.filter(n => !n.is_trash && !n.is_archived);
    return {
      total: active.length,
      pinned: notes.filter(n => n.is_pinned && !n.is_trash).length,
      favorites: notes.filter(n => n.is_favorite && !n.is_trash).length,
      archived: notes.filter(n => n.is_archived && !n.is_trash).length,
      trash: notes.filter(n => n.is_trash).length
    };
  }, [notes]);

  // Relative Date Formatter
  const formatRelativeTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6 animate-fade-in relative font-sans">
      <style>{`
        .rich-note-content h1, [contenteditable] h1 {
          font-size: 1.4rem !important;
          font-weight: 900 !important;
          color: #10b981 !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
          border-bottom: 1px solid rgba(16, 185, 129, 0.25) !important;
          padding-bottom: 0.25rem !important;
        }
        .rich-note-content h2, [contenteditable] h2 {
          font-size: 1.2rem !important;
          font-weight: 800 !important;
          color: #818cf8 !important;
          margin-top: 0.6rem !important;
          margin-bottom: 0.3rem !important;
        }
        .rich-note-content h3, [contenteditable] h3 {
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          color: #fbbf24 !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.25rem !important;
        }
        .rich-note-content blockquote, [contenteditable] blockquote {
          border-left: 4px solid #10b981 !important;
          background: rgba(16, 185, 129, 0.1) !important;
          color: #6ee7b7 !important;
          padding: 0.6rem 0.85rem !important;
          margin: 0.6rem 0 !important;
          border-radius: 0.75rem !important;
          font-style: italic !important;
        }
        .rich-note-content ul, [contenteditable] ul {
          list-style-type: disc !important;
          padding-left: 1.4rem !important;
          margin: 0.4rem 0 !important;
        }
        .rich-note-content ol, [contenteditable] ol {
          list-style-type: decimal !important;
          padding-left: 1.4rem !important;
          margin: 0.4rem 0 !important;
        }
        .rich-note-content mark, [contenteditable] mark {
          background-color: rgba(245, 158, 11, 0.35) !important;
          color: #fde047 !important;
          padding: 0.15rem 0.35rem !important;
          border-radius: 0.35rem !important;
          font-weight: bold !important;
          border: 1px solid rgba(245, 158, 11, 0.3) !important;
        }
        .rich-note-content strong, [contenteditable] strong, .rich-note-content b, [contenteditable] b {
          font-weight: 900 !important;
          color: #34d399 !important;
        }
        .rich-note-content u, [contenteditable] u {
          text-decoration: underline !important;
          text-decoration-color: #10b981 !important;
          text-underline-offset: 4px !important;
        }
        .rich-note-content del, [contenteditable] del, .rich-note-content strike, [contenteditable] strike {
          text-decoration: line-through !important;
          opacity: 0.6 !important;
        }
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #64748b;
          pointer-events: none;
          display: block;
        }
      `}</style>
      
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-2 animate-bounce">
          <LuSparkles size={16} />
          {toastMessage}
        </div>
      )}

      {/* ── HEADER BANNER ── */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 transition-all ${
        isDark
          ? "bg-gradient-to-r from-slate-900 via-[#101726] to-[#0c1322] border-slate-800"
          : "bg-gradient-to-r from-emerald-50/70 via-indigo-50/50 to-amber-50/70 border-slate-200"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 text-white shadow-lg shadow-emerald-500/20">
                <LuNotebook size={26} />
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  Not Defteri & Bilgi Yönetimi
                </h1>
                <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Fikirleriniz, KPSS özetleriniz, projeleriniz ve yapılacaklar listeniz için dinamik ve profesyonel alan.
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions: New Note CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <button
                onClick={() => handleOpenEditor(null, "text")}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
              >
                <LuPlus size={16} />
                <span>Yeni Not Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-700/20 dark:border-slate-800/60">
          {[
            { label: "Toplam Not", count: stats.total, icon: LuNotebook, color: "text-emerald-400", tabKey: "all" },
            { label: "Başa Tutturulan", count: stats.pinned, icon: LuPin, color: "text-amber-400", tabKey: "pinned" },
            { label: "Favoriler", count: stats.favorites, icon: LuStar, color: "text-rose-400", tabKey: "favorites" },
            { label: "Arşivlenmiş", count: stats.archived, icon: LuArchive, color: "text-indigo-400", tabKey: "archive" },
            { label: "Çöp Kutusu", count: stats.trash, icon: LuTrash2, color: "text-slate-400", tabKey: "trash" }
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive = selectedViewTab === item.tabKey;
            return (
              <div
                key={idx}
                onClick={() => setSelectedViewTab(item.tabKey)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? isDark ? "bg-slate-800 border-emerald-500/50 shadow-md" : "bg-white border-emerald-500 shadow-md"
                    : isDark ? "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40" : "bg-white/60 border-slate-200 hover:bg-white"
                }`}
              >
                <div className={`p-2 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-100"} ${item.color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className={`text-base font-black ${isDark ? "text-slate-100" : "text-slate-800"}`}>{item.count}</div>
                  <div className={`text-5xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TOOLBAR & SEARCH BAR ── */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        isDark ? "bg-[#101726]/80 border-slate-800" : "bg-white border-slate-200 shadow-xs"
      }`}>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <LuSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Notlarda, etiketlerde ara..."
            className={`w-full py-2 pl-10 pr-8 text-xs rounded-xl border focus:outline-none transition-all ${
              isDark
                ? "bg-[#090e1a] border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500"
                : "bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
              <LuX size={14} />
            </button>
          )}
        </div>

        {/* View Mode Switcher + Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Priority Dropdown Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`text-4xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>Öncelik:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className={`py-1.5 px-2.5 rounded-xl text-xs border font-medium cursor-pointer focus:outline-none ${
                isDark ? "bg-[#090e1a] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <option value="all">Tümü</option>
              <option value="urgent">🔥 Acil</option>
              <option value="high">⚡ Yüksek</option>
              <option value="normal">🔹 Normal</option>
              <option value="low">🌱 Düşük</option>
            </select>
          </div>

          {/* View Mode Selector */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? "bg-[#090e1a] border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            {[
              { id: "split", label: "İkili Görünüm", icon: LuColumns2 },
              { id: "grid", label: "Izgara", icon: LuLayoutGrid },
              { id: "list", label: "Liste", icon: LuList }
            ].map(vm => {
              const Icon = vm.icon;
              const isActive = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  title={vm.label}
                  className={`p-2 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 font-bold ${
                    isActive
                      ? isDark ? "bg-slate-800 text-emerald-400 shadow-xs" : "bg-white text-emerald-600 shadow-xs"
                      : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline text-5xs">{vm.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar Filter Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Category List Panel */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-[#101726]/80 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <LuFolder size={14} className="text-emerald-400" />
                Kategoriler
              </h3>
              <span className="text-5xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                {allCategories.length}
              </span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === "all"
                    ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isDark ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>Tüm Kategoriler</span>
                <span className="text-5xs opacity-75">{notes.filter(n => !n.is_trash).length}</span>
              </button>

              {allCategories.map((cat) => {
                const count = notes.filter(n => !n.is_trash && n.category === cat).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isDark ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-5xs opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Category Input */}
            <div className="mt-4 pt-3 border-t border-slate-700/20 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="+ Yeni Kategori"
                  className={`w-full py-1.5 px-2.5 text-xs rounded-xl border focus:outline-none ${
                    isDark ? "bg-[#090e1a] border-slate-800 text-slate-200 placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                  }`}
                />
                <button
                  onClick={handleAddCategory}
                  className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition cursor-pointer"
                >
                  <LuPlus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Tags Cloud Filter */}
          {allTags.length > 0 && (
            <div className={`p-4 rounded-2xl border ${
              isDark ? "bg-[#101726]/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  <LuTag size={14} className="text-indigo-400" />
                  Etiketler
                </h3>
                {selectedTag && (
                  <button onClick={() => setSelectedTag(null)} className="text-5xs font-bold text-rose-400 hover:underline">
                    Filtreyi Temizle
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isActive ? null : tag)}
                      className={`px-2.5 py-1 rounded-lg text-5xs font-bold transition border cursor-pointer ${
                        isActive
                          ? "bg-indigo-500 text-white border-indigo-400"
                          : isDark
                            ? "bg-slate-800/80 text-indigo-300 border-slate-700 hover:bg-slate-700"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Main Content Views */}
        <div className="lg:col-span-9">

          {/* Empty State */}
          {filteredNotes.length === 0 && !loading && (
            <div className={`p-12 rounded-3xl border text-center space-y-4 ${
              isDark ? "bg-[#101726]/50 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl">
                📝
              </div>
              <h3 className={`text-lg font-black ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                {searchQuery || selectedCategory !== "all" || selectedTag ? "Aramanıza Uygun Not Bulunamadı" : "Henüz Not Eklenmemiş"}
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Yeni bir not oluşturarak çalışmaya başlayabilir veya filtreleme kriterlerini temizleyebilirsiniz.
              </p>
              <button
                onClick={() => handleOpenEditor(null, "text")}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <LuPlus size={16} />
                İlk Notu Oluştur
              </button>
            </div>
          )}

          {/* DUAL PANE / NOTION SPLIT VIEW */}
          {viewMode === "split" && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[650px] overflow-hidden">
              
              {/* Notes List Column */}
              <div className={`md:col-span-5 rounded-2xl border flex flex-col overflow-hidden ${
                isDark ? "bg-[#101726]/90 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="p-3 border-b border-slate-700/20 dark:border-slate-800 bg-slate-900/20 flex items-center justify-between text-xs font-black">
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>Not Listesi ({filteredNotes.length})</span>
                  <span className="text-5xs font-normal text-slate-500">Tarihe göre sıralı</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {filteredNotes.map((note) => {
                    const isActive = activeNote?.id === note.id;
                    const cTheme = COLOR_THEMES[note.color] || COLOR_THEMES.slate;
                    return (
                      <div
                        key={note.id}
                        onClick={() => setActiveNote(note)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                          isActive
                            ? isDark
                              ? `${cTheme.bg} ${cTheme.border} ring-1 ${cTheme.ring}`
                              : `${cTheme.lightBg} ${cTheme.lightBorder} ring-1 ring-emerald-500/40`
                            : isDark
                              ? "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50"
                              : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className={`text-xs font-black truncate flex-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {note.title || "İsimsiz Not"}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            {note.is_pinned && <LuPin size={12} className="text-amber-400" />}
                            {note.is_favorite && <LuStar size={12} className="text-rose-400 fill-rose-400" />}
                          </div>
                        </div>

                        <p className={`text-5xs line-clamp-2 leading-relaxed mb-2.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {note.content || (note.checklist?.length > 0 ? `[Yapılacaklar: ${note.checklist.length} Madde]` : "İçerik yok...")}
                        </p>

                        <div className="flex items-center justify-between text-5xs text-slate-500">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${cTheme.badgeBg}`}>
                            {note.category}
                          </span>
                          <span>{formatRelativeTime(note.updated_at || note.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Note Inspector / Reader Panel */}
              <div className={`md:col-span-7 rounded-2xl border flex flex-col overflow-hidden ${
                isDark ? "bg-[#101726]/90 border-slate-800" : "bg-white border-slate-200"
              }`}>
                {activeNote ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* Active Note Header Bar */}
                    <div className={`p-4 border-b flex items-center justify-between gap-3 ${
                      isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50/50"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-5xs font-black uppercase ${COLOR_THEMES[activeNote.color]?.badgeBg || COLOR_THEMES.slate.badgeBg}`}>
                          {activeNote.category}
                        </span>
                        <span className="text-5xs text-slate-500">
                          {formatRelativeTime(activeNote.updated_at || activeNote.created_at)}
                        </span>
                      </div>

                      {/* Control Icons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleTogglePin(e, activeNote.id)}
                          title={activeNote.is_pinned ? "Sabitlemeyi Kaldır" : "Başa Tuttur"}
                          className={`p-2 rounded-lg border transition cursor-pointer ${
                            activeNote.is_pinned
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                              : isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <LuPin size={14} />
                        </button>

                        <button
                          onClick={(e) => handleToggleFavorite(e, activeNote.id)}
                          title={activeNote.is_favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                          className={`p-2 rounded-lg border transition cursor-pointer ${
                            activeNote.is_favorite
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                              : isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <LuStar size={14} className={activeNote.is_favorite ? "fill-rose-400" : ""} />
                        </button>

                        <button
                          onClick={() => handleCopyContent(activeNote.content)}
                          title="İçeriği Kopyala"
                          className={`p-2 rounded-lg border transition cursor-pointer ${
                            isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <LuCopy size={14} />
                        </button>

                        <button
                          onClick={() => handleExportMarkdown(activeNote)}
                          title="Markdown Olarak İndir"
                          className={`p-2 rounded-lg border transition cursor-pointer ${
                            isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <LuDownload size={14} />
                        </button>

                        <button
                          onClick={() => handleOpenEditor(activeNote)}
                          title="Düzenle"
                          className="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition flex items-center gap-1.5 cursor-pointer ml-1"
                        >
                          <LuPencil size={14} />
                          <span>Düzenle</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Note Content Viewer */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                      <div>
                        <h2 className={`text-xl font-black ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                          {activeNote.title}
                        </h2>

                        {/* Tags list */}
                        {Array.isArray(activeNote.tags) && activeNote.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {activeNote.tags.map(t => (
                              <span key={t} className="px-2 py-0.5 rounded-md text-5xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Checklist rendering if note has checklist */}
                      {activeNote.type === "checklist" && Array.isArray(activeNote.checklist) && activeNote.checklist.length > 0 && (
                        <div className={`p-4 rounded-2xl border ${
                          isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}>
                          <div className="flex items-center justify-between text-xs font-bold mb-3">
                            <span className={isDark ? "text-slate-300" : "text-slate-700"}>Yapılacaklar Listesi</span>
                            <span className="text-emerald-400 font-extrabold">
                              {Math.round((activeNote.checklist.filter(i => i.completed).length / activeNote.checklist.length) * 100)}% Tamamlandı
                            </span>
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                              style={{ width: `${(activeNote.checklist.filter(i => i.completed).length / activeNote.checklist.length) * 100}%` }}
                            />
                          </div>

                          <div className="space-y-2">
                            {activeNote.checklist.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleToggleActiveChecklist(item.id)}
                                className={`flex items-center gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                                  item.completed
                                    ? "bg-emerald-500/5 border-emerald-500/20 opacity-70 line-through text-slate-400"
                                    : isDark ? "bg-slate-800/40 border-slate-700/50 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                                }`}
                              >
                                {item.completed ? (
                                  <LuSquareCheck size={16} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <LuSquare size={16} className="text-slate-400 shrink-0" />
                                )}
                                <span className="text-xs font-medium">{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Main Markdown Text content */}
                      {activeNote.content && renderRichContent(activeNote.content, activeNote.font_family, activeNote.font_size, isDark)}
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
                    <div>
                      <LuNotebook size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-medium">Görüntülemek için sol taraftan bir not seçin.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* GRID MASONRY CARDS VIEW */}
          {viewMode === "grid" && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNotes.map((note) => {
                const cTheme = COLOR_THEMES[note.color] || COLOR_THEMES.slate;
                return (
                  <div
                    key={note.id}
                    onClick={() => handleOpenEditor(note)}
                    className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 ${
                      isDark
                        ? `${cTheme.bg} ${cTheme.border} ${cTheme.hoverBorder} ${cTheme.glow}`
                        : `${cTheme.lightBg} ${cTheme.lightBorder} shadow-sm hover:shadow-md`
                    }`}
                  >
                    <div>
                      {/* Note Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-lg text-5xs font-black uppercase ${cTheme.badgeBg}`}>
                          {note.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleTogglePin(e, note.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              note.is_pinned ? "text-amber-400" : "text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-200"
                            }`}
                          >
                            <LuPin size={14} />
                          </button>
                          <button
                            onClick={(e) => handleToggleFavorite(e, note.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              note.is_favorite ? "text-rose-400" : "text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-200"
                            }`}
                          >
                            <LuStar size={14} className={note.is_favorite ? "fill-rose-400" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Preview */}
                      <h3 className={`text-sm font-black mb-2 line-clamp-1 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                        {note.title}
                      </h3>

                      <p className={`text-xs line-clamp-4 leading-relaxed mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {note.content || (note.checklist?.length > 0 ? `[Yapılacaklar: ${note.checklist.length} Madde]` : "İçerik yok...")}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-700/20 dark:border-slate-800/60 flex items-center justify-between text-5xs text-slate-500">
                      <span>{formatRelativeTime(note.updated_at || note.created_at)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDuplicateNote(e, note)}
                          className="hover:text-slate-200 p-1"
                          title="Çoğalt"
                        >
                          <LuCopy size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteNote(e, note.id, note.is_trash)}
                          className="hover:text-rose-400 p-1"
                          title={note.is_trash ? "Kalıcı Olarak Sil" : "Çöp Kutusuna Taşı"}
                        >
                          <LuTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* COMPACT LIST VIEW */}
          {viewMode === "list" && filteredNotes.length > 0 && (
            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? "bg-[#101726]/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="divide-y divide-slate-800/50">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleOpenEditor(note)}
                    className={`p-4 flex items-center justify-between gap-4 transition cursor-pointer hover:bg-slate-800/30`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 shrink-0">
                        {note.is_pinned && <LuPin size={14} className="text-amber-400" />}
                        {note.is_favorite && <LuStar size={14} className="text-rose-400 fill-rose-400" />}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg text-5xs font-black uppercase shrink-0 ${COLOR_THEMES[note.color]?.badgeBg || COLOR_THEMES.slate.badgeBg}`}>
                        {note.category}
                      </span>
                      <span className={`text-xs font-black truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        {note.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-xs text-slate-500">
                      <span>{formatRelativeTime(note.updated_at || note.created_at)}</span>
                      <LuChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── RICH EDITOR MODAL ── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? "bg-[#101726] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
          }`}>
            
            {/* Modal Header Bar */}
            <div className={`p-5 border-b flex items-center justify-between gap-4 ${
              isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"
            }`}>
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <LuPencil size={18} />
                </span>
                <h3 className="text-base font-black">
                  {activeNote ? "Notu Düzenle" : "Yeni Not Ekle"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                    isPreviewMode
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-400"
                      : isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <LuEye size={14} />
                  <span>{isPreviewMode ? "Düzenleme Modu" : "Önizleme"}</span>
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                >
                  <LuX size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
              
              {/* Title & Category Input Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-5xs font-bold uppercase tracking-wider text-slate-400">Not Başlığı</label>
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Örn: KPSS Tarih 1. Ünite Notları..."
                    className={`w-full py-2.5 px-3.5 text-sm font-bold rounded-xl border focus:outline-none ${
                      isDark ? "bg-[#090e1a] border-slate-800 focus:border-emerald-500 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-5xs font-bold uppercase tracking-wider text-slate-400">Kategori</label>
                  <select
                    value={editorCategory}
                    onChange={(e) => setEditorCategory(e.target.value)}
                    className={`w-full py-2.5 px-3.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer ${
                      isDark ? "bg-[#090e1a] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Type Switcher Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/30 border border-slate-800">
                
                {/* Note Type */}
                <div className="flex items-center gap-2">
                  <span className="text-5xs font-bold uppercase tracking-wider text-slate-400">Tür:</span>
                  {[
                    { id: "text", label: "Metin / Markdown", icon: LuFileText },
                    { id: "checklist", label: "Yapılacaklar", icon: LuSquareCheck },
                    { id: "code", label: "Kod Notu", icon: LuCode }
                  ].map(t => {
                    const Icon = t.icon;
                    const isActive = editorType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setEditorType(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        }`}
                      >
                        <Icon size={14} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Color Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-5xs font-bold uppercase tracking-wider text-slate-400">Renk:</span>
                  {Object.keys(COLOR_THEMES).map(cKey => (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setEditorColor(cKey)}
                      className={`w-5 h-5 rounded-full transition cursor-pointer border ${
                        editorColor === cKey ? "scale-125 ring-2 ring-emerald-400 border-white" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: cKey === "slate" ? "#334155" : cKey === "emerald" ? "#10b981" : cKey === "indigo" ? "#6366f1" : cKey === "amber" ? "#f59e0b" : cKey === "rose" ? "#f43f5e" : cKey === "purple" ? "#a855f7" : cKey === "teal" ? "#14b8a6" : "#06b6d4"
                      }}
                    />
                  ))}
                </div>

              </div>

              {/* Checklist Editor if Type is Checklist */}
              {editorType === "checklist" && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <label className="text-5xs font-bold uppercase tracking-wider text-slate-400">Yapılacak Maddeler</label>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                      placeholder="Yeni madde ekleyin (Enter'a basın)..."
                      className={`w-full py-2 px-3 text-xs rounded-xl border focus:outline-none ${
                        isDark ? "bg-[#090e1a] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddChecklistItem}
                      className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-600 transition shrink-0 cursor-pointer"
                    >
                      Ekle
                    </button>
                  </div>

                  <div className="space-y-2 mt-3">
                    {editorChecklist.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
                        <div
                          onClick={() => handleToggleChecklistItem(item.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                          {item.completed ? (
                            <LuSquareCheck size={16} className="text-emerald-400 shrink-0" />
                          ) : (
                            <LuSquare size={16} className="text-slate-400 shrink-0" />
                          )}
                          <span className={`text-xs ${item.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                            {item.text}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditorChecklist(prev => prev.filter(i => i.id !== item.id))}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <LuX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Content Area & Rich Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-5xs font-bold uppercase tracking-wider text-slate-400">Not İçeriği & Biçimlendirme</label>
                </div>

                {/* Rich Formatting Toolbar */}
                {editorType === "text" && !isPreviewMode && (
                  <div className={`p-2 rounded-2xl border flex flex-wrap items-center justify-between gap-2 ${
                    isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-100 border-slate-200"
                  }`}>
                    {/* Format Buttons */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => execCmd("bold")}
                        title="Kalın (Bold)"
                        className={`p-1.5 rounded-lg transition text-xs font-black cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuBold size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("italic")}
                        title="İtalik (Italic)"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuItalic size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("strikeThrough")}
                        title="Üstü Çizili (Strikethrough)"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuStrikethrough size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("underline")}
                        title="Altı Çizili (Underline)"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuUnderline size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("highlight")}
                        title="Sarı Vurgu (Highlight)"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-amber-400" : "hover:bg-slate-200 text-amber-600"
                        }`}
                      >
                        <LuHighlighter size={15} />
                      </button>

                      <div className="h-4 w-[1px] bg-slate-700/40 dark:bg-slate-800 mx-1" />

                      <button
                        type="button"
                        onClick={() => execCmd("formatBlock", "<h1>")}
                        title="Büyük Başlık (H1)"
                        className={`p-1.5 rounded-lg transition text-xs font-bold cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuHeading1 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("formatBlock", "<h2>")}
                        title="Alt Başlık (H2)"
                        className={`p-1.5 rounded-lg transition text-xs font-bold cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuHeading2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("insertUnorderedList")}
                        title="Madde İşaretli Liste"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuList size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("insertOrderedList")}
                        title="Numaralı Liste"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuListOrdered size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("formatBlock", "<blockquote>")}
                        title="Alıntı Kutusuna Dönüştür"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        <LuQuote size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => execCmd("removeFormat")}
                        title="Biçimlendirmeyi Temizle"
                        className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                          isDark ? "hover:bg-slate-800 text-rose-400" : "hover:bg-slate-200 text-rose-600"
                        }`}
                      >
                        <LuCode size={15} />
                      </button>
                    </div>

                    {/* Font Options */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={editorFontFamily}
                        onChange={(e) => setEditorFontFamily(e.target.value)}
                        className={`py-1 px-2 text-xs rounded-lg border font-medium focus:outline-none cursor-pointer ${
                          isDark ? "bg-[#090e1a] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      >
                        <option value="sans">Modern Sans</option>
                        <option value="serif">Klasik Kitap Serif</option>
                        <option value="mono">Kod Monospace</option>
                      </select>

                      <select
                        value={editorFontSize}
                        onChange={(e) => setEditorFontSize(e.target.value)}
                        className={`py-1 px-2 text-xs rounded-lg border font-medium focus:outline-none cursor-pointer ${
                          isDark ? "bg-[#090e1a] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      >
                        <option value="sm">Küçük Font</option>
                        <option value="base">Normal Font</option>
                        <option value="lg">Büyük Font</option>
                        <option value="xl">Çok Büyük</option>
                      </select>
                    </div>
                  </div>
                )}

                {isPreviewMode ? (
                  <div className={`p-4 rounded-2xl border min-h-[220px] text-xs leading-relaxed ${
                    isDark ? "bg-[#090e1a] border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}>
                    {editorContent ? (
                      renderRichContent(editorContent, editorFontFamily, editorFontSize, isDark)
                    ) : (
                      <em className="text-slate-500">*Henüz içerik girilmedi.*</em>
                    )}
                  </div>
                ) : (
                  <div
                    ref={editorRef}
                    contentEditable={!isPreviewMode}
                    onInput={handleEditorInput}
                    data-placeholder="Notlarınızı buraya yazın... Yazdığınız metni seçip yukarıdaki Kalın, İtalik, Vurgu, Başlık butonlarına bastığınızda canlı olarak biçimlendirilecektir."
                    className={`w-full min-h-[220px] max-h-[450px] overflow-y-auto p-4 rounded-2xl border focus:outline-none leading-relaxed transition-all custom-scrollbar ${
                      editorFontFamily === "serif" ? "font-serif" : editorFontFamily === "mono" ? "font-mono" : "font-sans"
                    } ${
                      editorFontSize === "sm" ? "text-xs" : editorFontSize === "lg" ? "text-base" : editorFontSize === "xl" ? "text-lg" : "text-sm"
                    } ${
                      isDark ? "bg-[#090e1a] border-slate-800 focus:border-emerald-500 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                )}
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="text-5xs font-bold uppercase tracking-wider text-slate-400">Etiketler</label>
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-900/30 border border-slate-800">
                  {editorTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-5xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                      #{tag}
                      <button type="button" onClick={() => setEditorTags(prev => prev.filter(t => t !== tag))} className="hover:text-rose-400">
                        <LuX size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="+ Etiket yazıp Enter'a basın"
                    className="bg-transparent border-none text-xs text-slate-200 focus:outline-none py-1 px-2"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-5 border-t flex items-center justify-between ${
              isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"
            }`}>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleSaveNote}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {isSaving ? (
                  <LuRefreshCw size={14} className="animate-spin" />
                ) : (
                  <LuCheck size={16} />
                )}
                <span>{isSaving ? "Kaydediliyor..." : "Notu Kaydet"}</span>
              </button>
            </div>

          </div>
        </div>
      )}



    </div>
  );
};

export default NotesTab;
