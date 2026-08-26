-- =========================================================================
-- SUPABASE KAYNAK & DENEME TAKİBİ TABLOLARI VE RLS GÜVENLİK KODLARI
-- =========================================================================
-- Bu script:
-- 1. Veritabanınızda eksik olan kpss_deneme_kaynaklari ve kpss_deneme_analiz
--    tablolarını otomatik OLUŞTURUR.
-- 2. Supabase'in "Table publicly accessible / rls_disabled_in_public"
--    güvenlik uyarısını çözmek için tüm tablolarda RLS aktif eder.
--
-- KULLANIM:
-- Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" butonuna basın.
-- =========================================================================

-- 1. EKSİK DENEME TABLOLARINI OLUŞTURMA
CREATE TABLE IF NOT EXISTS public.kpss_deneme_kaynaklari (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  publisher TEXT,
  total_deneme INT DEFAULT 10,
  questions_per_deneme INT DEFAULT 18,
  has_branches BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT 'emerald',
  icon TEXT DEFAULT '📚',
  denemes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kpss_deneme_analiz (
  id TEXT PRIMARY KEY DEFAULT 'analiz-main',
  analiz_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. TÜM TABLOLARDA ROW-LEVEL SECURITY (RLS) AKTİF ETME
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kpss_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kpss_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bes_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.video_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.important_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kpss_deneme_kaynaklari ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kpss_deneme_analiz ENABLE ROW LEVEL SECURITY;

-- Paper Trading & Day Trading Tabloları
ALTER TABLE IF EXISTS public.paper_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.paper_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.paper_trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.paper_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.paper_bot_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.day_trading_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.day_trading_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.day_trading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.day_trading_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.day_trading_logs ENABLE ROW LEVEL SECURITY;


-- 3. ERİŞİM POLİTİKALARI (POLICIES) TANIMLAMA
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'profiles', 'projects', 'stocks', 'kpss_tracker', 'kpss_tasks',
    'bes_portfolio', 'video_tracker', 'important_sites', 'notes',
    'kpss_deneme_kaynaklari', 'kpss_deneme_analiz',
    'paper_users', 'paper_portfolios', 'paper_trade_history', 'paper_signals', 'paper_bot_logs',
    'day_trading_users', 'day_trading_portfolios', 'day_trading_history', 'day_trading_signals', 'day_trading_logs'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
      EXECUTE format('DROP POLICY IF EXISTS "Allow select for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow insert for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow update for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow delete for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow full public access on %I" ON public.%I', tbl, tbl);

      EXECUTE format('
        CREATE POLICY "Allow full public access on %I" 
        ON public.%I 
        FOR ALL 
        USING (true) 
        WITH CHECK (true);
      ', tbl, tbl);
    END IF;
  END LOOP;
END $$;

SELECT 'Tüm Tablolar ve Deneme Kayıt Yapısı Başarıyla Oluşturuldu!' AS status;
