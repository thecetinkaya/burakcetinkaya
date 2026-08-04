-- =========================================================================
-- Borsa Sinyal ve Sanal Portföy Botu (Paper Trading) Supabase SQL Şeması
-- Bu kodları Supabase Dashboard -> SQL Editor alanına yapıştırıp "Run" edebilirsiniz.
-- =========================================================================

-- 1. Kullanıcılar ve Sanal Bakiye Tablosu
CREATE TABLE IF NOT EXISTS public.paper_users (
  id TEXT PRIMARY KEY DEFAULT 'paper-user-main',
  email TEXT UNIQUE NOT NULL DEFAULT 'burak@cetinkaya.dev',
  virtual_balance DECIMAL(15, 2) NOT NULL DEFAULT 100000.00,
  initial_balance DECIMAL(15, 2) NOT NULL DEFAULT 100000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Açık Sanal Pozisyonlar Tablosu
CREATE TABLE IF NOT EXISTS public.paper_portfolios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'paper-user-main',
  symbol TEXT NOT NULL,
  average_cost DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_spent DECIMAL(15, 2) NOT NULL,
  take_profit_price DECIMAL(12, 2),
  stop_loss_price DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_symbol UNIQUE (user_id, symbol)
);

-- 3. Geçmiş Al/Sat / Stop-Loss / Take-Profit İşlemleri Log Tablosu
CREATE TABLE IF NOT EXISTS public.paper_trade_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'paper-user-main',
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL', 'STOP_LOSS', 'TAKE_PROFIT', 'TRAILING_STOP', 'PARTIAL_TP')),
  price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  profit_loss DECIMAL(15, 2) DEFAULT 0.00,
  profit_loss_pct DECIMAL(8, 2) DEFAULT 0.00,
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tarama Sinyalleri Tablosu (STRONG_BUY, BUY, SELL, HOLD)
CREATE TABLE IF NOT EXISTS public.paper_signals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('STRONG_BUY', 'BUY', 'SELL', 'HOLD')),
  price DECIMAL(12, 2) NOT NULL,
  metadata JSONB,
  status TEXT DEFAULT 'EXECUTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Politikaları (Herkese Açık/Okunabilir & Yazılabilir)
ALTER TABLE public.paper_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all paper_users" ON public.paper_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all paper_portfolios" ON public.paper_portfolios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all paper_trade_history" ON public.paper_trade_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all paper_signals" ON public.paper_signals FOR ALL USING (true) WITH CHECK (true);

-- İlk Başlangıç Sanal Kullanıcı Profilini Ekle (100.000 TL Bakiye ile)
INSERT INTO public.paper_users (id, email, virtual_balance, initial_balance)
VALUES ('paper-user-main', 'burak@cetinkaya.dev', 100000.00, 100000.00)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 5. GÜNLÜK HACİM & HALKA ARZ SCALPER BOTU TABLOLARI (AYRI SEKMEYE ÖZEL)
-- =========================================================================

-- A. Day Trading Users Table (50.000 TL Ayrı Kasa)
CREATE TABLE IF NOT EXISTS public.day_trading_users (
  id TEXT PRIMARY KEY DEFAULT 'day-trading-user-main',
  email TEXT UNIQUE NOT NULL DEFAULT 'burak@cetinkaya.dev',
  virtual_balance DECIMAL(15, 2) NOT NULL DEFAULT 50000.00,
  initial_balance DECIMAL(15, 2) NOT NULL DEFAULT 50000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Day Trading Active Portfolios Table
CREATE TABLE IF NOT EXISTS public.day_trading_portfolios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'day-trading-user-main',
  symbol TEXT NOT NULL,
  average_cost DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_spent DECIMAL(15, 2) NOT NULL,
  take_profit_price DECIMAL(12, 2),
  stop_loss_price DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_day_user_symbol UNIQUE (user_id, symbol)
);

-- C. Day Trading Trade History Table (Scalp Logs)
CREATE TABLE IF NOT EXISTS public.day_trading_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'day-trading-user-main',
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL', 'STOP_LOSS', 'TAKE_PROFIT', 'TRAILING_STOP', 'PARTIAL_TP')),
  price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  profit_loss DECIMAL(15, 2) DEFAULT 0.00,
  profit_loss_pct DECIMAL(8, 2) DEFAULT 0.00,
  reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- D. Day Trading High Volume Signals Table
CREATE TABLE IF NOT EXISTS public.day_trading_signals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('STRONG_BUY', 'BUY', 'SELL', 'HOLD')),
  price DECIMAL(12, 2) NOT NULL,
  metadata JSONB,
  status TEXT DEFAULT 'EXECUTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.day_trading_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_trading_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_trading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_trading_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all day_trading_users" ON public.day_trading_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all day_trading_portfolios" ON public.day_trading_portfolios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all day_trading_history" ON public.day_trading_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all day_trading_signals" ON public.day_trading_signals FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.day_trading_users (id, email, virtual_balance, initial_balance)
VALUES ('day-trading-user-main', 'burak@cetinkaya.dev', 50000.00, 50000.00)
ON CONFLICT (id) DO NOTHING;


-- =========================================================================
-- 6. BOT TARAMA VE İŞLEM LOGLARI TABLOLARI (7/24 KAYIT)
-- =========================================================================

-- Paper Trading Bot Logları Tablosu
CREATE TABLE IF NOT EXISTS public.paper_bot_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'paper-user-main',
  log_type TEXT DEFAULT 'INFO',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Day Trading / Scalper Bot Logları Tablosu
CREATE TABLE IF NOT EXISTS public.day_trading_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT DEFAULT 'day-trading-user-main',
  log_type TEXT DEFAULT 'INFO',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.paper_bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_trading_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all paper_bot_logs" ON public.paper_bot_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all day_trading_logs" ON public.day_trading_logs FOR ALL USING (true) WITH CHECK (true);


-- =========================================================================
-- 7. İŞLEM TİPİ KONTROL KISITLAMASI VE YENİ SÜTUNLAR (KADEMELİ KÂR AL İÇİN)
-- =========================================================================
ALTER TABLE public.paper_trade_history DROP CONSTRAINT IF EXISTS paper_trade_history_type_check;
ALTER TABLE public.paper_trade_history ADD CONSTRAINT paper_trade_history_type_check CHECK (type IN ('BUY', 'SELL', 'STOP_LOSS', 'TAKE_PROFIT', 'TRAILING_STOP', 'PARTIAL_TP'));

ALTER TABLE public.day_trading_history DROP CONSTRAINT IF EXISTS day_trading_history_type_check;
ALTER TABLE public.day_trading_history ADD CONSTRAINT day_trading_history_type_check CHECK (type IN ('BUY', 'SELL', 'STOP_LOSS', 'TAKE_PROFIT', 'TRAILING_STOP', 'PARTIAL_TP'));

-- Portföy tablolarına zirve fiyat ve kademeli satış takibi sütunlarını ekleme
ALTER TABLE public.paper_portfolios ADD COLUMN IF NOT EXISTS highest_price DECIMAL(12, 2);
ALTER TABLE public.paper_portfolios ADD COLUMN IF NOT EXISTS is_partially_closed BOOLEAN DEFAULT false;

ALTER TABLE public.day_trading_portfolios ADD COLUMN IF NOT EXISTS highest_price DECIMAL(12, 2);
ALTER TABLE public.day_trading_portfolios ADD COLUMN IF NOT EXISTS is_partially_closed BOOLEAN DEFAULT false;




