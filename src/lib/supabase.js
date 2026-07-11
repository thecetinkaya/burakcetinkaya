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
            return { data: JSON.parse(saved), error: null };
          } catch {
            // ignore
          }
        }
        return { data: { cografya: [], tarih: [] }, error: null };
      }
      try {
        const { data, error } = await supabase
          .from("video_tracker")
          .select("*")
          .order("no", { ascending: true });

        if (error) throw error;

        const grouped = {
          cografya: [],
          tarih: []
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
        let currentVideos = { cografya: [], tarih: [] };
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
          if (v.subject === "cografya") {
            currentVideos.cografya.push(v);
            currentVideos.cografya.sort((a, b) => a.no - b.no);
          } else {
            currentVideos.tarih.push(v);
            currentVideos.tarih.sort((a, b) => a.no - b.no);
          }
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
            ["cografya", "tarih"].forEach(sub => {
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
            ["cografya", "tarih"].forEach(sub => {
              currentVideos[sub] = currentVideos[sub].filter(v => !array.includes(v.id));
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
  }
};
