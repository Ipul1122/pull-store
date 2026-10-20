-- ==============================================================================
-- PULL STORE: Tambah Jasa Pembuatan Aplikasi Tugas Akhir Mahasiswa (Start 500Rb)
-- Jalankan query ini di SQL Editor Supabase untuk memasukkan layanan ini ke database.
-- ==============================================================================

INSERT INTO public.services (
  id,
  name,
  category,
  category_label,
  starting_price,
  price_display,
  timeline,
  tagline,
  deliverables,
  advantages,
  maintenance_warranty,
  badge,
  icon_name,
  recommended,
  suitable_for
) VALUES (
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
