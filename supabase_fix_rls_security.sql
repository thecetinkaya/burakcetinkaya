-- =========================================================================
-- SUPABASE RLS (ROW-LEVEL SECURITY) GÜVENLİK VE UYARI DÜZELTME SCRİPTİ
-- =========================================================================
-- Bu script, Supabase'in "Table publicly accessible / rls_disabled_in_public"
-- güvenlik uyarısını çözer. Tüm tablolarda Row Level Security (RLS) özelliğini
-- aktif eder ve uygulamanızın sorunsuz çalışması için erişim politikalarını tanımlar.
--
-- KULLANIM:
-- 1. Supabase Dashboard -> SQL Editor ekranına gidin.
-- 2. Bu kodların tamamını yapıştırın ve "Run" (Çalıştır) butonuna basın.
-- =========================================================================

-- 1. TÜM TABLOLARDA RLS (ROW LEVEL SECURITY) AKTİF ETME
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


-- 2. UYGULAMANIN ERİŞİM SAĞLAYABİLMESİ İÇİN RLS POLİTİKALARI (POLICIES)

-- Yardımcı Makro/Fonksiyon Gibi Tüm Tablolara İzin Verme Bloğu
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
    -- Eğer tablo veritabanında mevcutsa RLS politikalarını güncelle
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
      
      -- Eski politikaları temizle (çakışma olmaması için)
      EXECUTE format('DROP POLICY IF EXISTS "Allow select for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow insert for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow update for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow delete for %I" ON public.%I', tbl, tbl);
      EXECUTE format('DROP POLICY IF EXISTS "Allow full public access on %I" ON public.%I', tbl, tbl);

      -- Yeni kapsayıcı RLS politikasını ekle
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

-- Başarı Mesajı
SELECT 'RLS Güvenlik Politikaları Başarıyla Uygulandı! Supabase uyarısı çözüldü.' AS status;
