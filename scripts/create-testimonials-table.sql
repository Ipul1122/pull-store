-- ========================================================
-- TABEL TESTIMONIAL & BUKTI TRANSAKSI DI SUPABASE
-- Salin dan jalankan skrip ini di SQL Editor Dashboard Supabase Anda:
-- ========================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  client_name TEXT NOT NULL,
  order_name TEXT NOT NULL,
  order_date TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  price_display TEXT,
  warranty TEXT NOT NULL,
  notes TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  verified BOOLEAN DEFAULT true
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Izinkan publik membaca testimoni
DROP POLICY IF EXISTS "Allow public read on testimonials" ON public.testimonials;
CREATE POLICY "Allow public read on testimonials" 
ON public.testimonials FOR SELECT USING (true);

-- Izinkan admin/publik insert testimoni
DROP POLICY IF EXISTS "Allow public insert on testimonials" ON public.testimonials;
CREATE POLICY "Allow public insert on testimonials" 
ON public.testimonials FOR INSERT WITH CHECK (true);

-- Izinkan admin update testimoni
DROP POLICY IF EXISTS "Allow public update on testimonials" ON public.testimonials;
CREATE POLICY "Allow public update on testimonials" 
ON public.testimonials FOR UPDATE USING (true);

-- Izinkan admin delete testimoni
DROP POLICY IF EXISTS "Allow public delete on testimonials" ON public.testimonials;
CREATE POLICY "Allow public delete on testimonials" 
ON public.testimonials FOR DELETE USING (true);
