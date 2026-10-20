const fs = require('fs')
const path = require('path')

// Membaca catalog.ts
const catalogPath = path.join(__dirname, '../src/data/catalog.ts')
const content = fs.readFileSync(catalogPath, 'utf-8')

// Format SQL Export
let sqlOutput = `-- ========================================================
-- SCHEMA DAN INITIAL DATA PULL STORE DI SUPABASE
-- Salin seluruh isi file ini, lalu buka Dashboard Supabase Anda:
-- Menu "SQL Editor" -> "New query" -> Paste -> Klik "RUN"
-- ========================================================

-- 1. Buat Tabel Products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  account_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock_status TEXT DEFAULT 'ready',
  stock_count INTEGER DEFAULT 10,
  badge TEXT,
  popular BOOLEAN DEFAULT false,
  logo_url TEXT,
  icon_name TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  garansi TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Buat Tabel Services
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  starting_price NUMERIC NOT NULL,
  price_display TEXT,
  timeline TEXT NOT NULL,
  tagline TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  advantages JSONB DEFAULT '[]'::jsonb,
  maintenance_warranty TEXT,
  badge TEXT,
  icon_name TEXT,
  recommended BOOLEAN DEFAULT false,
  suitable_for TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Aktifkan Row Level Security (RLS) & Izinkan Publik Melihat Data
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on services" ON public.services;
CREATE POLICY "Allow public read access on services"
ON public.services FOR SELECT USING (true);

-- Izinkan update dan insert (untuk admin/pengelolaan)
DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on products" ON public.products;
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public insert on services" ON public.services;
CREATE POLICY "Allow public insert on services" ON public.services FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on services" ON public.services;
CREATE POLICY "Allow public update on services" ON public.services FOR UPDATE USING (true);

`

console.log('SQL schema ready')
