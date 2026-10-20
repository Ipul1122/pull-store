-- ========================================================
-- TABEL PELACAK PENGUNJUNG (VISITOR TRACKING) DI SUPABASE
-- Salin dan jalankan skrip ini di SQL Editor Dashboard Supabase Anda:
-- ========================================================

CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  page_url TEXT,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  isp TEXT,
  ip TEXT
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Izinkan pengunjung publik mencatat log kunjungan
DROP POLICY IF EXISTS "Allow public insert on visitors" ON public.visitors;
CREATE POLICY "Allow public insert on visitors" 
ON public.visitors FOR INSERT WITH CHECK (true);

-- Izinkan pembacaan log kunjungan
DROP POLICY IF EXISTS "Allow public select on visitors" ON public.visitors;
CREATE POLICY "Allow public select on visitors" 
ON public.visitors FOR SELECT USING (true);
