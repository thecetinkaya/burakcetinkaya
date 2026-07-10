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

// Initial Mock Projects (matching the ones in Projects.jsx)
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "Zeytinbahçem",
    description: "E-commerce platform for organic olives, olive oil and natural farm products.",
    link: "https://zeytinbahcem.com",
    category: "portfolio",
    created_at: new Date().toISOString()
  },
  {
    id: "proj-2",
    title: "Petty Online Veterinary",
    description: "TÜBİTAK 2209 approved project, AI-powered Online Veterinary Consultation and Appointment System",
    link: "https://github.com/thecetinkaya/pettyproject",
    category: "blog",
    created_at: new Date().toISOString()
  },
  {
    id: "proj-3",
    title: "Yöreselhane",
    description: "Premium e-commerce platform offering local, natural, and traditional gourmet delicacies.",
    link: "https://yoreselhane.com",
    category: "ecommerce",
    created_at: new Date().toISOString()
  }
];

// Initial mock stocks
const DEFAULT_STOCKS = [
  {
    id: "stock-1",
    portfolio_owner: "self",
    symbol: "THYAO",
    buy_date: "2026-06-01",
    buy_time: "10:30",
    sell_date: null,
    sell_time: null,
    buy_price: 310.50,
    sell_price: null,
    lots: 120,
    notes: "Uzun vadeli büyüme potansiyeli yüksek.",
    created_at: new Date().toISOString()
  },
  {
    id: "stock-2",
    portfolio_owner: "father",
    symbol: "EREGL",
    buy_date: "2026-05-15",
    buy_time: "14:15",
    sell_date: "2026-06-20",
    sell_time: "17:00",
    buy_price: 45.20,
    sell_price: 52.80,
    lots: 500,
    notes: "Kâr alımı yapıldı.",
    created_at: new Date().toISOString()
  }
];

// Initial mock KPSS items
const DEFAULT_KPSS = [
  {
    id: "kpss-1",
    date: "2026-07-07",
    subject: "Coğrafya",
    questions_solved: 80,
    target_questions: 100,
    trials_solved: 1,
    notes: "Türkiye fiziki coğrafyası tekrarı yapıldı.",
    created_at: new Date().toISOString()
  },
  {
    id: "kpss-2",
    date: "2026-07-08",
    subject: "Tarih",
    questions_solved: 120,
    target_questions: 100,
    trials_solved: 0,
    notes: "Osmanlı Devleti kuruluş dönemi soruları çözüldü.",
    created_at: new Date().toISOString()
  }
];

// Initial mock KPSS Tasks (Kanban board topics)
const DEFAULT_KPSS_TASKS = [
  {
    id: "task-1",
    subject: "Coğrafya",
    title: "Türkiye'nin Dağları, Ovaları ve Akarsuları harita çalışması",
    status: "todo",
    created_at: new Date().toISOString()
  },
  {
    id: "task-2",
    subject: "Tarih",
    title: "Osmanlı Devleti Kuruluş Dönemi konu tekrarı ve özet çıkarma",
    status: "in_progress",
    created_at: new Date().toISOString()
  },
  {
    id: "task-3",
    subject: "Matematik",
    title: "Rasyonel Sayılar çıkmış soruların çözümü",
    status: "done",
    created_at: new Date().toISOString()
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
        const newTask = {
          ...task,
          id: "task-" + Date.now(),
          created_at: new Date().toISOString()
        };
        list.push(newTask);
        setLocalStorage("mock_kpss_tasks", list);
        return { data: newTask, error: null };
      }
      const { data, error } = await supabase
        .from("kpss_tasks")
        .insert([task])
        .select()
        .single();
      return { data, error };
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
  }
};
