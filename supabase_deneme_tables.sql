-- =========================================================================
-- KPSS Kaynak ve Deneme Takip Modülü Supabase SQL Şeması
-- Bu kodları Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" edebilirsiniz.
-- =========================================================================

-- 1. KPSS Deneme Kaynakları ve Kitapları Tablosu
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

-- 2. KPSS Deneme Konu Analiz Çizelgesi Tablosu
CREATE TABLE IF NOT EXISTS public.kpss_deneme_analiz (
  id TEXT PRIMARY KEY DEFAULT 'analiz-main',
  analiz_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Politikaları (Herkese Açık Okunabilir & Yazılabilir)
ALTER TABLE public.kpss_deneme_kaynaklari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpss_deneme_analiz ENABLE ROW LEVEL SECURITY;

-- kpss_deneme_kaynaklari RLS Politikaları
DROP POLICY IF EXISTS "Allow public select kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari;
CREATE POLICY "Allow public select kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari;
CREATE POLICY "Allow public insert kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari;
CREATE POLICY "Allow public update kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari;
CREATE POLICY "Allow public delete kpss_deneme_kaynaklari" ON public.kpss_deneme_kaynaklari FOR DELETE USING (true);

-- kpss_deneme_analiz RLS Politikaları
DROP POLICY IF EXISTS "Allow public select kpss_deneme_analiz" ON public.kpss_deneme_analiz;
CREATE POLICY "Allow public select kpss_deneme_analiz" ON public.kpss_deneme_analiz FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert kpss_deneme_analiz" ON public.kpss_deneme_analiz;
CREATE POLICY "Allow public insert kpss_deneme_analiz" ON public.kpss_deneme_analiz FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update kpss_deneme_analiz" ON public.kpss_deneme_analiz;
CREATE POLICY "Allow public update kpss_deneme_analiz" ON public.kpss_deneme_analiz FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete kpss_deneme_analiz" ON public.kpss_deneme_analiz;
CREATE POLICY "Allow public delete kpss_deneme_analiz" ON public.kpss_deneme_analiz FOR DELETE USING (true);
