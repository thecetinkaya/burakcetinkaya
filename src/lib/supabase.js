import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

const isSupabaseConfigured = supabaseUrl.trim() !== "" && supabaseAnonKey.trim() !== "";

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const isMockMode = !isSupabaseConfigured;

// Mock profiles: default admin credentials
const DEFAULT_PROFILE = {
  id: "mock-user-id",
  first_name: "Burak",
  last_name: "Çetinkaya",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  kpss_date: "2026-09-06",
  ales_date: "2026-11-22"
};

// Initial Mock Projects
const DEFAULT_PROJECTS = [];

// Initial mock stocks
const DEFAULT_STOCKS = [];

// Initial mock KPSS items
const DEFAULT_KPSS = [];

// Initial mock KPSS Tasks (Kanban board topics)
const DEFAULT_KPSS_TASKS = [];

// Initial mock Important Sites
const DEFAULT_IMPORTANT_SITES = [
  {
    id: "site-1",
    title: "OpusClip",
    url: "https://www.opus.pro",
    category: "Yapay Zeka Siteleri",
    subcategory: "Video Yapay Zeka Siteleri",
    created_at: new Date().toISOString()
  },
  {
    id: "site-2",
    title: "PulseBoost",
    url: "https://pulseboost.ai",
    category: "Yapay Zeka Siteleri",
    subcategory: "Video Yapay Zeka Siteleri",
    created_at: new Date().toISOString()
  }
];

// Initial mock Notes
const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "🚀 KPSS 2026 Genel Çalışma Stratejisi ve Hedefler",
    content: "## KPSS Lisans Hazırlık Planı\n\nHaftalık minimum 25 saat aktif çalışma süresi hedeflenmektedir. Ders konuları tamamlandıktan sonra bol soru çözümü ve deneme analizleri yapılacaktır.\n\n### Günlük Odak Noktaları:\n- **Tarih**: Ahmet Uğur Karakuza videoları ve soru bankaları.\n- **Coğrafya**: Harita quizleri ve lokasyon ezberleri.\n- **Vatandaşlık**: Anayasa maddeleri ve güncel bilgiler.\n\n> *Gelişim süreklilik gerektirir!*",
    category: "KPSS",
    tags: ["kpss", "planlama", "hedef"],
    color: "emerald",
    is_pinned: true,
    is_favorite: true,
    is_archived: false,
    is_trash: false,
    type: "checklist",
    checklist: [
      { id: "c1", text: "Tarih 1. Ünite Özet Çıkarılması", completed: true },
      { id: "c2", text: "Coğrafya Türkiye Dağları & Gölleri Harita Alıştırması", completed: true },
      { id: "c3", text: "Vatandaşlık 50 Soru Bankası Testi", completed: false },
      { id: "c4", text: "Haftalık KPSS Genel Denemesi Çözümü", completed: false }
    ],
    priority: "high",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "note-2",
    title: "💡 Modern Fullstack Web Mimarisi ve Fikirler",
    content: "## Yeni Proje Mimarisi Notları\n\n### Kullanılan Teknolojiler:\n1. **Frontend**: React + Vite + Tailwind CSS\n2. **Backend / DB**: Supabase PostgreSQL + Realtime Subscription\n3. **Deployment**: Vercel / Netlify\n\n```js\n// Supabase Realtime Örnek Dinleyici\nconst subscription = supabase\n  .channel('notes_changes')\n  .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, payload => {\n    console.log('Change received!', payload);\n  })\n  .subscribe();\n```\n\n- [x] Responsive mobil uyumlu arayüz\n- [ ] PWA desteği ekleme",
    category: "Projeler",
    tags: ["react", "supabase", "web", "yazilim"],
    color: "indigo",
    is_pinned: true,
    is_favorite: false,
    is_archived: false,
    is_trash: false,
    type: "text",
    checklist: [],
    priority: "normal",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "note-3",
    title: "📈 Borsa & Portföy Stratejisi Notları",
    content: "## Yatırım ve Portföy Çeşitlendirmesi\n\n- BIST 30 teknoloji ve temettü hisselerine düzenli kademeli alım.\n- BES fon takibi (VGA Altın Fonu & Hisse Fonu).\n- Risk yönetimi: Stop-loss %5 seviyesinde tutulacak.\n\n> *Piyasalarda sabır, zekadan daha önemlidir.*",
    category: "Finans",
    tags: ["borsa", "yatirim", "bes"],
    color: "amber",
    is_pinned: false,
    is_favorite: true,
    is_archived: false,
    is_trash: false,
    type: "text",
    checklist: [],
    priority: "urgent",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "note-4",
    title: "🎯 Günlük Rutin ve Verimlilik Taktikleri",
    content: "1. 07:30 Erken kalkış ve güne başlama.\n2. Pomodoro (25 dk çalışma / 5 dk mola) 4 set.\n3. Gün sonu notları ve bir sonraki günün yapılacaklar listesini hazırlama.",
    category: "Kişisel",
    tags: ["rutin", "pomodoro", "disiplin"],
    color: "purple",
    is_pinned: false,
    is_favorite: false,
    is_archived: false,
    is_trash: false,
    type: "text",
    checklist: [],
    priority: "normal",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const getLocalStorage = (key, defaults) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaults;
};

const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Wrapper client
export const db = {
  // Authentication services
  auth: {
    async login(email, password) {
      if (!isSupabaseConfigured) {
        // Mock Login: matches admin@admin.com / admin123
        if (email === "admin@admin.com" && password === "admin123") {
          const user = { id: "mock-user-id", email };
          setLocalStorage("mock_session", user);
          return { data: { user }, error: null };
        }
        return { data: { user: null }, error: new Error("Hatalı e-posta veya şifre! (Giriş için: admin@admin.com / admin123)") };
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },

    async logout() {
      if (!isSupabaseConfigured) {
        localStorage.removeItem("mock_session");
        return { error: null };
      }
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    async getSessionUser() {
      if (!isSupabaseConfigured) {
        const user = getLocalStorage("mock_session", null);
        return { data: { user }, error: null };
      }
      const { data: { user }, error } = await supabase.auth.getUser();
      return { data: { user }, error };
    },

    async getProfile(userId) {
      if (!isSupabaseConfigured) {
        const profile = getLocalStorage("mock_profile", DEFAULT_PROFILE);
        return { data: profile, error: null };
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return { data, error };
    },

    async updateProfile(userId, profileData) {
      if (!isSupabaseConfigured) {
        const profile = getLocalStorage("mock_profile", DEFAULT_PROFILE);
        const updated = { ...profile, ...profileData };
        setLocalStorage("mock_profile", updated);
        return { data: updated, error: null };
      }
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId)
        .select()
        .single();
      return { data, error };
    }
  },

  // Projects services
  projects: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_projects_v2", DEFAULT_PROJECTS);
        return { data: list, error: null };
      }
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      return { data, error };
    },

    async create(project) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_projects_v2", DEFAULT_PROJECTS);
        const newProj = {
          ...project,
          id: "proj-" + Date.now(),
          created_at: new Date().toISOString()
        };
        list.unshift(newProj);
        setLocalStorage("mock_projects_v2", list);
        return { data: newProj, error: null };
      }
      const { data, error } = await supabase
        .from("projects")
        .insert([project])
        .select()
        .single();
      return { data, error };
    },

    async delete(id) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_projects_v2", DEFAULT_PROJECTS);
        const filtered = list.filter(p => p.id !== id);
        setLocalStorage("mock_projects_v2", filtered);
        return { error: null };
      }
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      return { error };
    }
  },

  // Stocks services
  stocks: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_stocks", DEFAULT_STOCKS);
        return { data: list, error: null };
      }
      const { data, error } = await supabase
        .from("stocks")
        .select("*")
        .order("buy_date", { ascending: false });
      return { data, error };
    },

    async create(stock) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_stocks", DEFAULT_STOCKS);
        const newStock = {
          ...stock,
          id: "stock-" + Date.now(),
          created_at: new Date().toISOString()
        };
        list.unshift(newStock);
        setLocalStorage("mock_stocks", list);
        return { data: newStock, error: null };
      }
      const { data, error } = await supabase
        .from("stocks")
        .insert([stock])
        .select()
        .single();
      return { data, error };
    },

    async update(id, updates) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_stocks", DEFAULT_STOCKS);
        const index = list.findIndex(s => s.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updates };
          setLocalStorage("mock_stocks", list);
          return { data: list[index], error: null };
        }
        return { data: null, error: new Error("Stock not found") };
      }
      const { data, error } = await supabase
        .from("stocks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      return { data, error };
    },

    async delete(id) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_stocks", DEFAULT_STOCKS);
        const filtered = list.filter(s => s.id !== id);
        setLocalStorage("mock_stocks", filtered);
        return { error: null };
      }
      const { error } = await supabase
        .from("stocks")
        .delete()
        .eq("id", id);
      return { error };
    }
  },

  // KPSS services
  kpss: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss", DEFAULT_KPSS);
        return { data: list, error: null };
      }
      const { data, error } = await supabase
        .from("kpss_tracker")
        .select("*")
        .order("date", { ascending: false });
      return { data, error };
    },

    async create(record) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss", DEFAULT_KPSS);
        const newRecord = {
          ...record,
          id: "kpss-" + Date.now(),
          created_at: new Date().toISOString()
        };
        list.unshift(newRecord);
        setLocalStorage("mock_kpss", list);
        return { data: newRecord, error: null };
      }
      const { data, error } = await supabase
        .from("kpss_tracker")
        .insert([record])
        .select()
        .single();
      return { data, error };
    },

    async delete(id) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss", DEFAULT_KPSS);
        const filtered = list.filter(r => r.id !== id);
        setLocalStorage("mock_kpss", filtered);
        return { error: null };
      }
      const { error } = await supabase
        .from("kpss_tracker")
        .delete()
        .eq("id", id);
      return { error };
    }
  },

  // KPSS Tasks (Kanban Planner) services
  kpss_tasks: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss_tasks", DEFAULT_KPSS_TASKS);
        return { data: list, error: null };
      }
      const { data, error } = await supabase
        .from("kpss_tasks")
        .select("*")
        .order("created_at", { ascending: true });
      return { data, error };
    },

    async create(task) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss_tasks", DEFAULT_KPSS_TASKS);
        const tasksArray = Array.isArray(task) ? task : [task];
        const newTasks = tasksArray.map((t, idx) => ({
          ...t,
          id: "task-" + (Date.now() + idx),
          created_at: new Date().toISOString()
        }));
        list.push(...newTasks);
        setLocalStorage("mock_kpss_tasks", list);
        return { data: Array.isArray(task) ? newTasks : newTasks[0], error: null };
      }
      const tasksArray = Array.isArray(task) ? task : [task];
      const { data, error } = await supabase
        .from("kpss_tasks")
        .insert(tasksArray)
        .select();
      return { data: Array.isArray(task) ? data : data?.[0], error };
    },

    async update(id, updates) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss_tasks", DEFAULT_KPSS_TASKS);
        const index = list.findIndex(t => t.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updates };
          setLocalStorage("mock_kpss_tasks", list);
          return { data: list[index], error: null };
        }
        return { data: null, error: new Error("Task not found") };
      }
      const { data, error } = await supabase
        .from("kpss_tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      return { data, error };
    },

    async delete(id) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_kpss_tasks", DEFAULT_KPSS_TASKS);
        const filtered = list.filter(t => t.id !== id);
        setLocalStorage("mock_kpss_tasks", filtered);
        return { error: null };
      }
      const { error } = await supabase
        .from("kpss_tasks")
        .delete()
        .eq("id", id);
      return { error };
    }
  },

  // BES (Bireysel Emeklilik Sistemi) services
  bes: {
    async fetch() {
      if (!isSupabaseConfigured) {
        const data = getLocalStorage("bes_portfolio_data", null);
        return { data, error: null };
      }
      try {
        const { data, error } = await supabase
          .from("bes_portfolio")
          .select("*")
          .eq("id", "bes-main")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const initialRow = {
            id: "bes-main",
            monthly_contribution: 5295,
            total_deposited: 57592,
            deposited_return: 54636,
            state_contribution: 12775,
            state_return: 6790,
            gold_baseline_price: 69.90,
            fund_name: "VGA Altın Fonu",
            company_name: "Türkiye Sigorta",
            logs: []
          };
          const { data: inserted, error: insertError } = await supabase
            .from("bes_portfolio")
            .insert([initialRow])
            .select()
            .single();
          if (insertError) throw insertError;
          return { data: {
            monthlyContribution: parseFloat(inserted.monthly_contribution) || 0,
            totalDeposited: parseFloat(inserted.total_deposited) || 0,
            depositedReturn: parseFloat(inserted.deposited_return) || 0,
            stateContribution: parseFloat(inserted.state_contribution) || 0,
            stateReturn: parseFloat(inserted.state_return) || 0,
            goldBaselinePrice: parseFloat(inserted.gold_baseline_price) || 69.90,
            fundName: inserted.fund_name,
            companyName: inserted.company_name,
            logs: Array.isArray(inserted.logs) ? inserted.logs : []
          }, error: null };
        }

        const mapped = {
          monthlyContribution: parseFloat(data.monthly_contribution) || 0,
          totalDeposited: parseFloat(data.total_deposited) || 0,
          depositedReturn: parseFloat(data.deposited_return) || 0,
          stateContribution: parseFloat(data.state_contribution) || 0,
          stateReturn: parseFloat(data.state_return) || 0,
          goldBaselinePrice: parseFloat(data.gold_baseline_price) || 69.90,
          fundName: data.fund_name,
          companyName: data.company_name,
          logs: Array.isArray(data.logs) ? data.logs : []
        };
        return { data: mapped, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async update(updates) {
      if (!isSupabaseConfigured) {
        return { data: null, error: null };
      }
      try {
        const mappedUpdates = {};
        if (updates.monthlyContribution !== undefined) mappedUpdates.monthly_contribution = updates.monthlyContribution;
        if (updates.totalDeposited !== undefined) mappedUpdates.total_deposited = updates.totalDeposited;
        if (updates.depositedReturn !== undefined) mappedUpdates.deposited_return = updates.depositedReturn;
        if (updates.stateContribution !== undefined) mappedUpdates.state_contribution = updates.stateContribution;
        if (updates.stateReturn !== undefined) mappedUpdates.state_return = updates.stateReturn;
        if (updates.goldBaselinePrice !== undefined) mappedUpdates.gold_baseline_price = updates.goldBaselinePrice;
        if (updates.fundName !== undefined) mappedUpdates.fund_name = updates.fundName;
        if (updates.companyName !== undefined) mappedUpdates.company_name = updates.companyName;
        if (updates.logs !== undefined) mappedUpdates.logs = updates.logs;

        const { data, error } = await supabase
          .from("bes_portfolio")
          .update(mappedUpdates)
          .eq("id", "bes-main")
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const mapped = {
            monthlyContribution: parseFloat(data.monthly_contribution) || 0,
            totalDeposited: parseFloat(data.total_deposited) || 0,
            depositedReturn: parseFloat(data.deposited_return) || 0,
            stateContribution: parseFloat(data.state_contribution) || 0,
            stateReturn: parseFloat(data.state_return) || 0,
            goldBaselinePrice: parseFloat(data.gold_baseline_price) || 69.90,
            fundName: data.fund_name,
            companyName: data.company_name,
            logs: Array.isArray(data.logs) ? data.logs : []
          };
          return { data: mapped, error: null };
        }
        return { data: null, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }
  },

  // Video Tracker services
  videos: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem("kpss_video_progress_v2");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            return { data: { cografya: parsed.cografya || [], tarih: parsed.tarih || [], vatandaslik: parsed.vatandaslik || [] }, error: null };
          } catch {
            // ignore
          }
        }
        return { data: { cografya: [], tarih: [], vatandaslik: [] }, error: null };
      }
      try {
        const { data, error } = await supabase
          .from("video_tracker")
          .select("*")
          .order("no", { ascending: true });

        if (error) throw error;

        const grouped = {
          cografya: [],
          tarih: [],
          vatandaslik: []
        };
        (data || []).forEach(v => {
          const mapped = {
            id: v.id,
            no: v.no,
            title: v.title,
            duration: v.duration,
            channel: v.channel,
            ticks: v.ticks,
            questionsSolved: v.questions_solved
          };
          if (v.subject === "cografya") {
            grouped.cografya.push(mapped);
          } else if (v.subject === "tarih") {
            grouped.tarih.push(mapped);
          } else if (v.subject === "vatandaslik") {
            grouped.vatandaslik.push(mapped);
          }
        });
        return { data: grouped, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async create(videoOrVideos) {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem("kpss_video_progress_v2");
        let currentVideos = { cografya: [], tarih: [], vatandaslik: [] };
        if (saved) {
          try { currentVideos = JSON.parse(saved); } catch { /* ignore */ }
        }
        const array = Array.isArray(videoOrVideos) ? videoOrVideos : [videoOrVideos];
        const newVids = array.map((v, idx) => ({
          id: v.id || "vid-" + (Date.now() + idx),
          no: parseInt(v.no) || 0,
          title: v.title,
          duration: v.duration || "00:00",
          channel: v.channel || "Benim Hocam",
          ticks: parseInt(v.ticks) || 0,
          questionsSolved: parseInt(v.questionsSolved) || 0,
          subject: v.subject
        }));

        newVids.forEach(v => {
          const subKey = v.subject || "cografya";
          if (!currentVideos[subKey]) currentVideos[subKey] = [];
          currentVideos[subKey].push(v);
          currentVideos[subKey].sort((a, b) => a.no - b.no);
        });

        localStorage.setItem("kpss_video_progress_v2", JSON.stringify(currentVideos));
        return { data: Array.isArray(videoOrVideos) ? newVids : newVids[0], error: null };
      }

      try {
        const array = Array.isArray(videoOrVideos) ? videoOrVideos : [videoOrVideos];
        const dbRows = array.map(v => ({
          id: v.id || "vid-" + Math.random().toString(36).substr(2, 9),
          no: parseInt(v.no) || 0,
          title: v.title,
          duration: v.duration || "00:00",
          channel: v.channel || "Benim Hocam",
          subject: v.subject,
          ticks: parseInt(v.ticks) || 0,
          questions_solved: parseInt(v.questionsSolved) || 0
        }));

        const { data, error } = await supabase
          .from("video_tracker")
          .insert(dbRows)
          .select();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async update(id, updates) {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem("kpss_video_progress_v2");
        if (saved) {
          try {
            const currentVideos = JSON.parse(saved);
            let found = false;
            ["cografya", "tarih", "vatandaslik"].forEach(sub => {
              if (currentVideos[sub]) {
                currentVideos[sub] = currentVideos[sub].map(v => {
                  if (v.id === id) {
                    found = true;
                    return {
                      ...v,
                      ...updates
                    };
                  }
                  return v;
                });
              }
            });
            if (found) {
              localStorage.setItem("kpss_video_progress_v2", JSON.stringify(currentVideos));
            }
          } catch {
            // ignore
          }
        }
        return { data: null, error: null };
      }
      try {
        const dbUpdates = {};
        if (updates.no !== undefined) dbUpdates.no = parseInt(updates.no);
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
        if (updates.channel !== undefined) dbUpdates.channel = updates.channel;
        if (updates.ticks !== undefined) dbUpdates.ticks = parseInt(updates.ticks);
        if (updates.questionsSolved !== undefined) dbUpdates.questions_solved = parseInt(updates.questionsSolved);

        const { data, error } = await supabase
          .from("video_tracker")
          .update(dbUpdates)
          .eq("id", id)
          .select();

        if (error) throw error;
        return { data: data?.[0], error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async delete(idOrIds) {
      if (!isSupabaseConfigured) {
        const saved = localStorage.getItem("kpss_video_progress_v2");
        if (saved) {
          try {
            const currentVideos = JSON.parse(saved);
            const array = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
            ["cografya", "tarih", "vatandaslik"].forEach(sub => {
              if (currentVideos[sub]) {
                currentVideos[sub] = currentVideos[sub].filter(v => !array.includes(v.id));
              }
            });
            localStorage.setItem("kpss_video_progress_v2", JSON.stringify(currentVideos));
          } catch {
            // ignore
          }
        }
        return { error: null };
      }
      try {
        const array = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
        const { error } = await supabase
          .from("video_tracker")
          .delete()
          .in("id", array);
        if (error) throw error;
        return { error: null };
      } catch (err) {
        return { error: err };
      }
    }
  },

  // Important Sites (Roadmap) services
  important_sites: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_important_sites", DEFAULT_IMPORTANT_SITES);
        return { data: list, error: null };
      }
      const { data, error } = await supabase
        .from("important_sites")
        .select("*")
        .order("created_at", { ascending: true });
      return { data, error };
    },

    async create(site) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_important_sites", DEFAULT_IMPORTANT_SITES);
        const newSite = {
          ...site,
          id: "site-" + Date.now(),
          created_at: new Date().toISOString()
        };
        list.push(newSite);
        setLocalStorage("mock_important_sites", list);
        return { data: newSite, error: null };
      }
      const { data, error } = await supabase
        .from("important_sites")
        .insert([site])
        .select()
        .single();
      return { data, error };
    },

    async update(id, updates) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_important_sites", DEFAULT_IMPORTANT_SITES);
        const index = list.findIndex(s => s.id === id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updates };
          setLocalStorage("mock_important_sites", list);
          return { data: list[index], error: null };
        }
        return { data: null, error: new Error("Site not found") };
      }
      const { data, error } = await supabase
        .from("important_sites")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      return { data, error };
    },

    async delete(id) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_important_sites", DEFAULT_IMPORTANT_SITES);
        const filtered = list.filter(s => s.id !== id);
        setLocalStorage("mock_important_sites", filtered);
        return { error: null };
      }
      const { error } = await supabase
        .from("important_sites")
        .delete()
        .eq("id", id);
      return { error };
    }
  },

  // Paper Trading (Sanal Portföy & Sinyal Botu) services
  paper: {
    async getProfile() {
      const DEFAULT_USER = {
        id: "paper-user-main",
        email: "burak@cetinkaya.dev",
        virtual_balance: 100000.00,
        initial_balance: 100000.00,
        updated_at: new Date().toISOString()
      };

      if (!isSupabaseConfigured) {
        const user = getLocalStorage("mock_paper_user", DEFAULT_USER);
        return { data: user, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_users")
          .select("*")
          .eq("id", "paper-user-main")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const { data: inserted, error: insertErr } = await supabase
            .from("paper_users")
            .insert([DEFAULT_USER])
            .select()
            .single();
          if (insertErr) throw insertErr;
          return { data: inserted, error: null };
        }
        return { data, error: null };
      } catch (err) {
        console.warn("Using localStorage fallback for paper profile:", err);
        const user = getLocalStorage("mock_paper_user", DEFAULT_USER);
        return { data: user, error: null };
      }
    },

    async updateProfile(updates) {
      if (!isSupabaseConfigured) {
        const current = getLocalStorage("mock_paper_user", {
          id: "paper-user-main",
          email: "burak@cetinkaya.dev",
          virtual_balance: 100000.00,
          initial_balance: 100000.00
        });
        const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
        setLocalStorage("mock_paper_user", updated);
        return { data: updated, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_users")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", "paper-user-main")
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        const current = getLocalStorage("mock_paper_user", {
          id: "paper-user-main",
          virtual_balance: 100000.00,
          initial_balance: 100000.00
        });
        const updated = { ...current, ...updates };
        setLocalStorage("mock_paper_user", updated);
        return { data: updated, error: null };
      }
    },

    async getPortfolios() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_portfolios", []);
        return { data: list, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_portfolios")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_portfolios", []);
        return { data: list, error: null };
      }
    },

    async savePortfolio(item) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_portfolios", []);
        const idx = list.findIndex(p => p.symbol === item.symbol);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...item, updated_at: new Date().toISOString() };
        } else {
          list.unshift({
            ...item,
            id: item.id || "pfolio-" + Date.now(),
            created_at: new Date().toISOString()
          });
        }
        setLocalStorage("mock_paper_portfolios", list);
        return { data: item, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_portfolios")
          .upsert([item], { onConflict: "user_id,symbol" })
          .select();

        if (error) {
          // If custom column missing, strip extra fields and retry with core portfolio columns
          const coreItem = {
            user_id: item.user_id || "paper-user-main",
            symbol: item.symbol,
            average_cost: item.average_cost,
            quantity: item.quantity,
            total_spent: item.total_spent,
            stop_loss_price: item.stop_loss_price,
            take_profit_price: item.take_profit_price,
            updated_at: new Date().toISOString()
          };
          if (item.id) coreItem.id = item.id;

          const { data: retryData, error: retryErr } = await supabase
            .from("paper_portfolios")
            .upsert([coreItem], { onConflict: "user_id,symbol" })
            .select();

          if (retryErr) throw retryErr;
          return { data: retryData?.[0] || coreItem, error: null };
        }
        return { data: data?.[0], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_portfolios", []);
        const idx = list.findIndex(p => p.symbol === item.symbol);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...item };
        } else {
          list.unshift({ ...item, id: "pfolio-" + Date.now() });
        }
        setLocalStorage("mock_paper_portfolios", list);
        return { data: item, error: null };
      }
    },

    async deletePortfolio(symbolOrId) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_portfolios", []);
        const filtered = list.filter(p => p.id !== symbolOrId && p.symbol !== symbolOrId);
        setLocalStorage("mock_paper_portfolios", filtered);
        return { error: null };
      }

      try {
        const { error } = await supabase
          .from("paper_portfolios")
          .delete()
          .or(`id.eq.${symbolOrId},symbol.eq.${symbolOrId}`);

        if (error) throw error;
        return { error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_portfolios", []);
        const filtered = list.filter(p => p.id !== symbolOrId && p.symbol !== symbolOrId);
        setLocalStorage("mock_paper_portfolios", filtered);
        return { error: null };
      }
    },

    async getTradeHistory() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_history", []);
        return { data: list, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_trade_history")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_history", []);
        return { data: list, error: null };
      }
    },

    async addTradeHistory(tradeLog) {
      const logItem = {
        ...tradeLog,
        id: tradeLog.id || "trade-" + Date.now(),
        timestamp: tradeLog.timestamp || new Date().toISOString()
      };

      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_history", []);
        list.unshift(logItem);
        setLocalStorage("mock_paper_history", list);
        return { data: logItem, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_trade_history")
          .insert([logItem])
          .select()
          .single();

        if (error) {
          // Fallback mapping if database constraint hasn't been updated yet
          const fallbackType = logItem.type === "PARTIAL_TP" ? "TAKE_PROFIT" : logItem.type === "TRAILING_STOP" ? "SELL" : logItem.type;
          const fallbackItem = { ...logItem, type: fallbackType };
          const { data: fbData } = await supabase.from("paper_trade_history").insert([fallbackItem]).select().single();
          return { data: fbData || fallbackItem, error: null };
        }
        return { data, error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_history", []);
        list.unshift(logItem);
        setLocalStorage("mock_paper_history", list);
        return { data: logItem, error: null };
      }
    },

    async getSignals() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_signals", []);
        return { data: list, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_signals")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_signals", []);
        return { data: list, error: null };
      }
    },

    async addSignal(signal) {
      const signalItem = {
        ...signal,
        id: signal.id || "sig-" + Date.now(),
        created_at: signal.created_at || new Date().toISOString()
      };

      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_signals", []);
        list.unshift(signalItem);
        if (list.length > 100) list.pop();
        setLocalStorage("mock_paper_signals", list);
        return { data: signalItem, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_signals")
          .insert([signalItem])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        const list = getLocalStorage("mock_paper_signals", []);
        list.unshift(signalItem);
        setLocalStorage("mock_paper_signals", list);
        return { data: signalItem, error: null };
      }
    },

    async addSignalsBulk(signalsArray) {
      if (!signalsArray || signalsArray.length === 0) return { data: [], error: null };
      const formatted = signalsArray.map((sig, idx) => ({
        ...sig,
        id: sig.id || `sig-${Date.now()}-${idx}`,
        created_at: sig.created_at || new Date().toISOString()
      }));

      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_paper_signals", []);
        const combined = [...formatted, ...list].slice(0, 100);
        setLocalStorage("mock_paper_signals", combined);
        return { data: formatted, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("paper_signals")
          .insert(formatted);
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async resetAccount() {
      const resetUser = {
        id: "paper-user-main",
        email: "burak@cetinkaya.dev",
        virtual_balance: 100000.00,
        initial_balance: 100000.00,
        updated_at: new Date().toISOString()
      };

      setLocalStorage("mock_paper_user", resetUser);
      setLocalStorage("mock_paper_portfolios", []);
      setLocalStorage("mock_paper_history", []);
      setLocalStorage("mock_paper_signals", []);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("paper_users").upsert([resetUser]);
          await supabase.from("paper_portfolios").delete().neq("id", "none");
          await supabase.from("paper_trade_history").delete().neq("id", "none");
          await supabase.from("paper_signals").delete().neq("id", "none");
        } catch (err) {
          console.warn("Supabase paper reset fallback used:", err);
        }
      }
      return { error: null };
    },

    async getLogs(limit = 100) {
      if (!isSupabaseConfigured) {
        const logs = getLocalStorage("mock_paper_bot_logs", []);
        return { data: logs.slice(0, limit), error: null };
      }
      try {
        const { data, error } = await supabase
          .from("paper_bot_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const logs = getLocalStorage("mock_paper_bot_logs", []);
        return { data: logs.slice(0, limit), error: null };
      }
    },

    async addLogs(logEntries = []) {
      if (!logEntries || logEntries.length === 0) return { error: null };
      const rows = logEntries.map(msg => ({
        user_id: "paper-user-main",
        log_type: typeof msg === "string" && (msg.includes("🔴") || msg.includes("Zarar Kes")) ? "SELL" : typeof msg === "string" && (msg.includes("🟢") || msg.includes("Alındı")) ? "BUY" : typeof msg === "string" && msg.includes("🛡️") ? "RISK" : "INFO",
        message: typeof msg === "string" ? msg : JSON.stringify(msg)
      }));

      if (!isSupabaseConfigured) {
        const logs = getLocalStorage("mock_paper_bot_logs", []);
        setLocalStorage("mock_paper_bot_logs", [...rows, ...logs].slice(0, 500));
        return { error: null };
      }
      try {
        const { error } = await supabase.from("paper_bot_logs").insert(rows);
        if (error) throw error;
        return { error: null };
      } catch (err) {
        const logs = getLocalStorage("mock_paper_bot_logs", []);
        setLocalStorage("mock_paper_bot_logs", [...rows, ...logs].slice(0, 500));
        return { error: null };
      }
    }
  },

  // Day Trading & High Volume IPO Scalper services
  daytrading: {
    async getProfile() {
      const DEFAULT_USER = {
        id: "day-trading-user-main",
        email: "burak@cetinkaya.dev",
        virtual_balance: 50000.00,
        initial_balance: 50000.00,
        updated_at: new Date().toISOString()
      };

      if (!isSupabaseConfigured) {
        const user = getLocalStorage("mock_daytrading_user", DEFAULT_USER);
        return { data: user, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_users")
          .select("*")
          .eq("id", "day-trading-user-main")
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          const { data: inserted, error: insertErr } = await supabase
            .from("day_trading_users")
            .insert([DEFAULT_USER])
            .select()
            .single();
          if (insertErr) throw insertErr;
          return { data: inserted, error: null };
        }
        return { data, error: null };
      } catch (err) {
        const user = getLocalStorage("mock_daytrading_user", DEFAULT_USER);
        return { data: user, error: null };
      }
    },

    async updateProfile(updates) {
      if (!isSupabaseConfigured) {
        const current = getLocalStorage("mock_daytrading_user", {
          id: "day-trading-user-main",
          virtual_balance: 50000.00,
          initial_balance: 50000.00
        });
        const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
        setLocalStorage("mock_daytrading_user", updated);
        return { data: updated, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_users")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", "day-trading-user-main")
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        const current = getLocalStorage("mock_daytrading_user", {
          id: "day-trading-user-main",
          virtual_balance: 50000.00,
          initial_balance: 50000.00
        });
        const updated = { ...current, ...updates };
        setLocalStorage("mock_daytrading_user", updated);
        return { data: updated, error: null };
      }
    },

    async getPortfolios() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_portfolios", []);
        return { data: list, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_portfolios")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_portfolios", []);
        return { data: list, error: null };
      }
    },

    async savePortfolio(item) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_portfolios", []);
        const idx = list.findIndex(p => p.symbol === item.symbol);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...item, updated_at: new Date().toISOString() };
        } else {
          list.unshift({
            ...item,
            id: item.id || "dtfolio-" + Date.now(),
            created_at: new Date().toISOString()
          });
        }
        setLocalStorage("mock_daytrading_portfolios", list);
        return { data: item, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_portfolios")
          .upsert([item], { onConflict: "user_id,symbol" })
          .select();

        if (error) {
          // If custom column missing, strip extra fields and retry with core portfolio columns
          const coreItem = {
            user_id: item.user_id || "day-trading-user-main",
            symbol: item.symbol,
            average_cost: item.average_cost,
            quantity: item.quantity,
            total_spent: item.total_spent,
            stop_loss_price: item.stop_loss_price,
            take_profit_price: item.take_profit_price,
            updated_at: new Date().toISOString()
          };
          if (item.id) coreItem.id = item.id;

          const { data: retryData, error: retryErr } = await supabase
            .from("day_trading_portfolios")
            .upsert([coreItem], { onConflict: "user_id,symbol" })
            .select();

          if (retryErr) throw retryErr;
          return { data: retryData?.[0] || coreItem, error: null };
        }
        return { data: data?.[0], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_portfolios", []);
        const idx = list.findIndex(p => p.symbol === item.symbol);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...item };
        } else {
          list.unshift({ ...item, id: "dtfolio-" + Date.now() });
        }
        setLocalStorage("mock_daytrading_portfolios", list);
        return { data: item, error: null };
      }
    },

    async deletePortfolio(symbolOrId) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_portfolios", []);
        const filtered = list.filter(p => p.id !== symbolOrId && p.symbol !== symbolOrId);
        setLocalStorage("mock_daytrading_portfolios", filtered);
        return { error: null };
      }

      try {
        const { error } = await supabase
          .from("day_trading_portfolios")
          .delete()
          .or(`id.eq.${symbolOrId},symbol.eq.${symbolOrId}`);

        if (error) throw error;
        return { error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_portfolios", []);
        const filtered = list.filter(p => p.id !== symbolOrId && p.symbol !== symbolOrId);
        setLocalStorage("mock_daytrading_portfolios", filtered);
        return { error: null };
      }
    },

    async getTradeHistory() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_history", []);
        return { data: list, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_history")
          .select("*")
          .order("timestamp", { ascending: false });

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_history", []);
        return { data: list, error: null };
      }
    },

    async addTradeHistory(tradeLog) {
      const logItem = {
        ...tradeLog,
        id: tradeLog.id || "dt-trade-" + Date.now(),
        timestamp: tradeLog.timestamp || new Date().toISOString()
      };

      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_history", []);
        list.unshift(logItem);
        setLocalStorage("mock_daytrading_history", list);
        return { data: logItem, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_history")
          .insert([logItem])
          .select()
          .single();

        if (error) {
          // Fallback mapping if database constraint hasn't been updated yet
          const fallbackType = logItem.type === "PARTIAL_TP" ? "TAKE_PROFIT" : logItem.type === "TRAILING_STOP" ? "SELL" : logItem.type;
          const fallbackItem = { ...logItem, type: fallbackType };
          const { data: fbData } = await supabase.from("day_trading_history").insert([fallbackItem]).select().single();
          return { data: fbData || fallbackItem, error: null };
        }
        return { data, error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_history", []);
        list.unshift(logItem);
        setLocalStorage("mock_daytrading_history", list);
        return { data: logItem, error: null };
      }
    },

    async getSignals() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_signals", []);
        return { data: list, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_signals")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_signals", []);
        return { data: list, error: null };
      }
    },

    async addSignal(signal) {
      const signalItem = {
        ...signal,
        id: signal.id || "dt-sig-" + Date.now(),
        created_at: signal.created_at || new Date().toISOString()
      };

      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_signals", []);
        list.unshift(signalItem);
        if (list.length > 100) list.pop();
        setLocalStorage("mock_daytrading_signals", list);
        return { data: signalItem, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_signals")
          .insert([signalItem])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        const list = getLocalStorage("mock_daytrading_signals", []);
        list.unshift(signalItem);
        setLocalStorage("mock_daytrading_signals", list);
        return { data: signalItem, error: null };
      }
    },

    async addSignalsBulk(signalsArray) {
      if (!signalsArray || signalsArray.length === 0) return { data: [], error: null };
      const formatted = signalsArray.map((sig, idx) => ({
        ...sig,
        id: sig.id || `dt-sig-${Date.now()}-${idx}`,
        created_at: sig.created_at || new Date().toISOString()
      }));

      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_daytrading_signals", []);
        const combined = [...formatted, ...list].slice(0, 100);
        setLocalStorage("mock_daytrading_signals", combined);
        return { data: formatted, error: null };
      }

      try {
        const { data, error } = await supabase
          .from("day_trading_signals")
          .insert(formatted);
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    async resetAccount() {
      const resetUser = {
        id: "day-trading-user-main",
        email: "burak@cetinkaya.dev",
        virtual_balance: 50000.00,
        initial_balance: 50000.00,
        updated_at: new Date().toISOString()
      };

      setLocalStorage("mock_daytrading_user", resetUser);
      setLocalStorage("mock_daytrading_portfolios", []);
      setLocalStorage("mock_daytrading_history", []);
      setLocalStorage("mock_daytrading_signals", []);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("day_trading_users").upsert([resetUser]);
          await supabase.from("day_trading_portfolios").delete().neq("id", "none");
          await supabase.from("day_trading_history").delete().neq("id", "none");
          await supabase.from("day_trading_signals").delete().neq("id", "none");
        } catch (err) {
          console.warn("Supabase day trading reset fallback used:", err);
        }
      }
      return { error: null };
    },

    async getLogs(limit = 100) {
      if (!isSupabaseConfigured) {
        const logs = getLocalStorage("mock_day_trading_logs", []);
        return { data: logs.slice(0, limit), error: null };
      }
      try {
        const { data, error } = await supabase
          .from("day_trading_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        const logs = getLocalStorage("mock_day_trading_logs", []);
        return { data: logs.slice(0, limit), error: null };
      }
    },

    async addLogs(logEntries = []) {
      if (!logEntries || logEntries.length === 0) return { error: null };
      const rows = logEntries.map(msg => ({
        user_id: "day-trading-user-main",
        log_type: typeof msg === "string" && (msg.includes("🔴") || msg.includes("Stop")) ? "SELL" : typeof msg === "string" && (msg.includes("🚀") || msg.includes("Alındı")) ? "BUY" : typeof msg === "string" && msg.includes("🛡️") ? "RISK" : "INFO",
        message: typeof msg === "string" ? msg : JSON.stringify(msg)
      }));

      if (!isSupabaseConfigured) {
        const logs = getLocalStorage("mock_day_trading_logs", []);
        setLocalStorage("mock_day_trading_logs", [...rows, ...logs].slice(0, 500));
        return { error: null };
      }
      try {
        const { error } = await supabase.from("day_trading_logs").insert(rows);
        if (error) throw error;
        return { error: null };
      } catch (err) {
        const logs = getLocalStorage("mock_day_trading_logs", []);
        setLocalStorage("mock_day_trading_logs", [...rows, ...logs].slice(0, 500));
        return { error: null };
      }
    }
  },

  // Notes App services
  notes: {
    async fetchAll() {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        return { data: list, error: null };
      }
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return { data: data || [], error: null };
      } catch (err) {
        console.warn("Supabase notes fetch error, using local fallback:", err);
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        return { data: list, error: null };
      }
    },

    async create(note) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        const newNote = {
          id: "note-" + Date.now(),
          title: note.title || "",
          content: note.content || "",
          category: note.category || "Genel",
          tags: Array.isArray(note.tags) ? note.tags : [],
          color: note.color || "slate",
          is_pinned: !!note.is_pinned,
          is_favorite: !!note.is_favorite,
          is_archived: !!note.is_archived,
          is_trash: !!note.is_trash,
          type: note.type || "text",
          checklist: Array.isArray(note.checklist) ? note.checklist : [],
          priority: note.priority || "normal",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        list.unshift(newNote);
        setLocalStorage("mock_notes_v1", list);
        return { data: newNote, error: null };
      }
      try {
        const { data, error } = await supabase
          .from("notes")
          .insert([note])
          .select()
          .single();
        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.warn("Supabase notes create error, using local fallback:", err);
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        const newNote = {
          ...note,
          id: "note-" + Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        list.unshift(newNote);
        setLocalStorage("mock_notes_v1", list);
        return { data: newNote, error: null };
      }
    },

    async update(id, updates) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        const index = list.findIndex(n => n.id === id);
        if (index !== -1) {
          list[index] = {
            ...list[index],
            ...updates,
            updated_at: new Date().toISOString()
          };
          setLocalStorage("mock_notes_v1", list);
          return { data: list[index], error: null };
        }
        return { data: null, error: new Error("Note not found") };
      }
      try {
        const { data, error } = await supabase
          .from("notes")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.warn("Supabase notes update error, using local fallback:", err);
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        const index = list.findIndex(n => n.id === id);
        if (index !== -1) {
          list[index] = {
            ...list[index],
            ...updates,
            updated_at: new Date().toISOString()
          };
          setLocalStorage("mock_notes_v1", list);
          return { data: list[index], error: null };
        }
        return { data: null, error: err };
      }
    },

    async delete(id) {
      if (!isSupabaseConfigured) {
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        const filtered = list.filter(n => n.id !== id);
        setLocalStorage("mock_notes_v1", filtered);
        return { error: null };
      }
      try {
        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return { error: null };
      } catch (err) {
        console.warn("Supabase notes delete error, using local fallback:", err);
        const list = getLocalStorage("mock_notes_v1", DEFAULT_NOTES);
        const filtered = list.filter(n => n.id !== id);
        setLocalStorage("mock_notes_v1", filtered);
        return { error: null };
      }
    }
  }
};


