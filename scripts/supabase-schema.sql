-- ========================================================
-- SCHEMA DAN INITIAL DATA PULL STORE DI SUPABASE
-- Salin seluruh isi file ini, lalu buka Dashboard Supabase Anda:
-- 1. Klik menu "SQL Editor" di bilah kiri
-- 2. Klik tombol "New query"
-- 3. Paste seluruh skrip ini
-- 4. Klik tombol "Run" (atau tekan Ctrl + Enter)
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

-- 3. Aktifkan Row Level Security (RLS) & Hak Akses Publik
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on services" ON public.services;
CREATE POLICY "Allow public read access on services" ON public.services FOR SELECT USING (true);

-- Izinkan Insert/Update
DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on products" ON public.products;
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public insert on services" ON public.services;
CREATE POLICY "Allow public insert on services" ON public.services FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on services" ON public.services;
CREATE POLICY "Allow public update on services" ON public.services FOR UPDATE USING (true);

-- ========================================================
-- 4. INSERT DATA INITIAL SERVICES (4 LAYANAN SOFTWARE)
-- ========================================================
INSERT INTO public.services (
  id, name, category, category_label, starting_price, price_display, timeline, tagline,
  deliverables, advantages, maintenance_warranty, badge, icon_name, recommended, suitable_for
) VALUES
(
  'svc-tugas-akhir',
  'Jasa Pembuatan Aplikasi Tugas Akhir & Skripsi (Mahasiswa)',
  'tugas-akhir',
  'Tugas Akhir & Skripsi',
  500000,
  'Mulai Rp 500.000',
  '3 - 7 Hari Kerja (Sesuai Deadline)',
  'Bantuan pengerjaan coding aplikasi skripsi, tugas akhir (TA), & tugas kuliah pemrograman. Tarif biaya jasa koding saja, belum termasuk hosting atau domain (siap running di localhost).',
  '[
    "Hemat Mahasiswa: Tarif bersahabat mulai Rp 500Rb khusus pengerjaan jasa coding aplikasi, belum termasuk domain atau hosting jika ingin online.",
    "Full Source Code & Database: Source code 100% bersih, rapi, dan diserahkan penuh bersama skema database (MySQL/PostgreSQL/SQLite).",
    "Sesuai Bab 3 & 4: Fitur aplikasi disesuaikan dengan rancangan use case diagram, flowchart, ERD, dan batasan masalah skripsi Anda.",
    "Bimbingan Demo Sidang: Diajarkan cara running aplikasi di laptop sendiri (localhost) serta penjelasan logika alur program agar percaya diri di hadapan dosen penguji.",
    "Garansi Revisi & Bugfix: Bebas revisi minor dan perbaikan bug/error sampai sidang tugas akhir Anda selesai."
  ]'::jsonb,
  '[
    "Start 500Rb (Hanya Biaya Jasa Koding)",
    "Tanpa Wajib Beli Hosting/Domain (Localhost Ready)",
    "Full Source Code & Penjelasan Logika Program",
    "Garansi Pendampingan & Revisi Minor Sampai Sidang"
  ]'::jsonb,
  'Garansi Revisi Minor & Bugfix sampai sidang selesai (belum termasuk biaya sewa hosting/domain jika butuh online)',
  'Start 500Rb • Khusus Mahasiswa',
  'GraduationCap',
  true,
  'Mahasiswa D3/S1 Teknik Informatika, Sistem Informasi, Ilmu Komputer, Teknik Elektro, & Tugas Akhir Pemrograman'
),
(
  'svc-apk-kasir',
  'Aplikasi Android Kasir & Stok (100% Offline Tanpa Kuota)',
  'apk-offline',
  'Kasir Toko & Retail',
  700000,
  'Mulai Rp 700.000',
  '1 - 2 Minggu (7 - 14 Hari Kerja)',
  'Toko tetap bisa transaksi & cetak struk nota walau tanpa kuota atau mati wifi. Beli sekali seumur hidup, tanpa biaya sewa bulanan.',
  '[
    "Kasir Cepat & Struk: Transaksi kilat dengan printer thermal bluetooth & scan barcode via kamera HP.",
    "Tanpa Biaya Bulanan: Sistem 100% hak milik Anda seumur hidup, bebas biaya sewa vendor berkala.",
    "100% Kerja Offline: Operasional tetap lancar tanpa internet walau wifi mati atau mati lampu.",
    "Laporan Otomatis: Stok otomatis berkurang & rekap laba-rugi/omzet rapi siap ekspor Excel/PDF.",
    "Siap Pakai & Dipandu: Kami pasang langsung ke HP toko dan didampingi panduan sampai kasir mahir."
  ]'::jsonb,
  '[
    "Beli Sekali Hak Milik Seumur Hidup",
    "100% Offline Tanpa Kuota",
    "Support Printer Bluetooth & Barcode",
    "Termasuk Full Source Code"
  ]'::jsonb,
  NULL,
  'Mulai 700Rb • Terlaris UMKM',
  'Smartphone',
  true,
  'Toko Kelontong, Cafe / Resto, Toko Baju, Bengkel, Apotek, Counter HP, & Gudang Distributor'
),
(
  'svc-website-statis',
  'Website Jualan Statis & Company Profile (Fast & Clean)',
  'landing-page',
  'Website Statis & Landing Page',
  850000,
  'Mulai Rp 850.000',
  '1 - 2 Minggu (7 - 10 Hari Kerja)',
  'Website elegan berkecepatan tinggi untuk jualan & profil bisnis. Calon pembeli langsung yakin dan 1-klik terhubung ke WhatsApp Anda.',
  '[
    "Tampilan Mewah & Kredibel: Desain profesional yang langsung menaikkan kepercayaan calon pembeli Anda.",
    "Loading Kilat < 1 Detik: Calon pelanggan tidak kabur saat membuka link promo IG, TikTok, atau Google Ads.",
    "Domain & Hosting Gratis: Sudah include gratis domain resmi (.com / .my.id) & hosting 1 tahun penuh.",
    "Order WhatsApp Otomatis: Tombol pesan langsung terhubung ke chat WA Anda tanpa alur berbelit.",
    "Garansi Free Maintenance 3 Bulan: Bebas biaya perbaikan jika ada kendala di 3 bulan pertama."
  ]'::jsonb,
  '[
    "Sudah Termasuk Domain & Hosting 1 Tahun",
    "Garansi 3 Bulan Free Maintenance",
    "Loading Super Kilat < 1 Detik",
    "100% Akses & Source Code Milik Anda"
  ]'::jsonb,
  'Garansi 3 Bulan Free Maintenance (sesudahnya ada biaya tambahan jika ada perubahan/update)',
  'Start 850Rb • Include Domain & Hosting',
  'Globe',
  false,
  'Pemilik Produk, UMKM Jasa & Barang, Toko Online, Kantor Notaris/Pengacara, Agen Properti, & Bisnis Kreatif'
),
(
  'svc-website-dinamis',
  'Website Jualan Dinamis (Katalog, CMS & Admin Panel)',
  'web-dinamis',
  'Website Dinamis & CMS',
  1500000,
  'Rp 1.500.000 - Rp 3.000.000',
  '2 - 3 Minggu (14 - 21 Hari Kerja)',
  'Website interaktif dengan Dashboard Admin. Anda bisa upload produk baru, ubah harga promo, dan kelola database kapan saja secara mandiri.',
  '[
    "Dashboard Admin (CMS): Upload produk baru, ganti harga promo, & kelola stok sendiri tanpa paham koding.",
    "Katalog & Form WhatsApp: Filter kategori interaktif, pencarian produk, & form checkout chat WA otomatis.",
    "Domain & Server Database: Sudah include domain resmi (.com) dan hosting server database 1 tahun penuh.",
    "Login & Keamanan Data: Fitur autentikasi aman untuk melindungi data pelanggan dan riwayat transaksi.",
    "Garansi Free Maintenance 3 Bulan: Bebas biaya penanganan bug & monitoring sistem di 3 bulan pertama."
  ]'::jsonb,
  '[
    "Termasuk Domain & Hosting Server 1 Tahun",
    "Garansi 3 Bulan Free Maintenance",
    "Full Akses Admin Panel (Bebas Input Produk)",
    "Full Database & Source Code Milik Anda"
  ]'::jsonb,
  'Garansi 3 Bulan Free Maintenance (sesudahnya ada biaya tambahan jika ada perubahan/update)',
  '1.5Jt - 3Jt • Admin Panel CMS',
  'Globe',
  true,
  'Brand Lokal, Toko Online dengan Banyak Produk, Bisnis F&B dengan Menu Dinamis, & Perusahaan Berkembang'
),
(
  'svc-custom-web',
  'Sistem Informasi & Manajemen Operasional Kustom',
  'custom-web',
  'Sistem Bisnis & Operasional',
  3850000,
  'Mulai Rp 3.850.000',
  '3 - 5 Minggu (21 - 35 Hari Kerja)',
  'Ubah alur kerja manual serba kertas & excel yang berantakan menjadi otomatis. Pantau absensi, data pelanggan, dan keuangan tim secara terpusat.',
  '[
    "Dibuat Sesuai SOP Anda: Fitur dirancang pas dengan alur bisnis Anda (absensi GPS, approval, stok multi-cabang).",
    "Cegah Kecurangan & Error: Hilangkan dokumen hilang dan hemat puluhan jam rekap manual tim per minggu.",
    "Dashboard Statistik Real-time: Pantau omzet & performa tim dengan hak akses bertingkat aman (Owner, Manager, Staf).",
    "Akses Fleksibel Multi-Device: Dapat dibuka aman dari browser HP, tablet, maupun laptop di mana saja.",
    "Garansi & Training Karyawan: Pendampingan intensif, training staf, & garansi bugfix 90 hari."
  ]'::jsonb,
  '[
    "Dirancang Khusus Sesuai Alur Bisnis Anda",
    "Bebas Biaya Lisensi Pengguna Bulanan",
    "Garansi 3 Bulan Free Maintenance & Bugfix",
    "Full Source Code & Database Milik Anda"
  ]'::jsonb,
  'Garansi 3 Bulan Free Maintenance & Bugfix (setelahnya ada opsi biaya tambahan/maintenance opsional)',
  'Solusi Operasional Kustom',
  'Layers',
  false,
  'Perusahaan Berkembang, Kantor Banyak Cabang, Pengelola Properti/Kos, Sekolah/Yayasan, & Organisasi'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  starting_price = EXCLUDED.starting_price,
  price_display = EXCLUDED.price_display,
  timeline = EXCLUDED.timeline,
  tagline = EXCLUDED.tagline,
  deliverables = EXCLUDED.deliverables,
  advantages = EXCLUDED.advantages,
  maintenance_warranty = EXCLUDED.maintenance_warranty,
  badge = EXCLUDED.badge,
  icon_name = EXCLUDED.icon_name,
  recommended = EXCLUDED.recommended,
  suitable_for = EXCLUDED.suitable_for;

-- ========================================================
-- 5. INSERT DATA INITIAL PRODUCTS (PRODUK DIGITAL UTAMA)
-- ========================================================
INSERT INTO public.products (
  id, name, category, category_label, account_type, duration, price, original_price,
  stock_status, stock_count, badge, popular, icon_name, description, features, variants, garansi, notes
) VALUES
(
  'chatgpt-plus-shared',
  'ChatGPT Plus (GPT-4o)',
  'ai',
  'AI Productivity • Plus',
  'Shared',
  '1 Bulan',
  40000,
  85000,
  'ready',
  18,
  'Paling Populer',
  true,
  'Bot',
  'Akses penuh GPT-4o, fitur Canvas, DALL-E 3, dan analisis file. Sharing account login 1 device by code.',
  '["Sharing account", "Login 1 device saja", "Login by code (praktis)", "Full garansi 25 hari", "Akses GPT-4o & GPT-4 Turbo", "Advanced Voice Mode, Canvas & DALL·E 3"]'::jsonb,
  '[]'::jsonb,
  'Full Garansi 25 Hari',
  'Sharing account • Login 1 device saja • By code • Full garansi 25 hari'
),
(
  'claude-ai-pro',
  'Claude AI Pro',
  'ai',
  'AI Productivity • Claude',
  'Shared',
  '1 Bulan',
  150000,
  250000,
  'ready',
  15,
  'Best for Coding',
  true,
  'Bot',
  'Akses Claude 3.5 Sonnet, batas chat 5x lebih tinggi, Artifacts interaktif, & analisis dokumen panjang.',
  '["Sharing account login 1 device", "Akses Claude 3.5 Sonnet & Claude 3 Opus", "Limit pesan 5x lebih banyak", "Fitur Artifacts & eksekusi kode interaktif", "Full garansi 25 hari"]'::jsonb,
  '[]'::jsonb,
  'Full Garansi 25 Hari',
  'Shared account • 1 device login • Garansi 25 hari'
),
(
  'netflix-1p-1u',
  'Netflix Premium Ultra HD (1P 1U)',
  'streaming',
  'Streaming • 1 Profile 1 User',
  'Private Profile',
  '1 Bulan',
  25000,
  45000,
  'ready',
  30,
  'Anti Screen Limit',
  true,
  'Tv',
  'Kualitas 4K Ultra HD + HDR. 1 profil khusus milik Anda sendiri lengkap dengan PIN profil pribadi.',
  '["1 Profil khusus milik Anda (1 Profile 1 User)", "Bebas pasang PIN Profile pribadi", "Resolusi 4K Ultra HD + Audio Spasial", "Bisa digunakan di HP, Tablet, Laptop, & Smart TV", "Full garansi 30 hari"]'::jsonb,
  '[]'::jsonb,
  'Full Garansi 30 Hari',
  '1 Profil 1 User • Bebas PIN • Kualitas 4K UHD'
),
(
  'spotify-individual',
  'Spotify Premium Individual',
  'streaming',
  'Streaming • Musik Bebas Iklan',
  'Private Account',
  '1 Bulan',
  20000,
  40000,
  'ready',
  25,
  'Akun Pribadi',
  true,
  'Headphones',
  'Dengarkan jutaan lagu & podcast tanpa jeda iklan, kualitas audio tertinggi (320kbps), bebas download offline.',
  '["Akun pribadi (Private Account)", "Bebas iklan audio & visual selamanya", "Download lagu & dengarkan offline", "Kualitas audio Very High 320 kbps", "Garansi akun 30 hari"]'::jsonb,
  '[]'::jsonb,
  'Full Garansi 30 Hari',
  'Private Account • Bebas Iklan • Audio 320kbps'
),
(
  'canva-pro-member',
  'Canva Pro Member Team',
  'edit',
  'Desain & Editing • Member',
  'Invite Link',
  '1 Bulan',
  15000,
  45000,
  'ready',
  50,
  'Diskon s/d 67%',
  true,
  'Palette',
  'Membuka seluruh fitur Canva Pro premium (jutaan template, remove background, SVG/PNG transparan). Desain pribadi 100% aman.',
  '["Aktivasi via email Canva pribadi (Invite Link)", "Desain 100% aman (tidak terlihat anggota tim lain)", "Akses 100M+ template, foto & elemen premium Pro", "Magic Studio AI & Background Remover 1-klik", "Download PNG transparan & SVG resolusi tinggi"]'::jsonb,
  '[]'::jsonb,
  'Garansi 30 Hari',
  'Aktivasi via Invite Link email pribadi'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  stock_status = EXCLUDED.stock_status,
  stock_count = EXCLUDED.stock_count;
