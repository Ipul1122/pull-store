# PRD: Pull Store — Digital Store & Software Agency SPA

## 1. Tujuan Produk
Membangun Single Page Application (SPA) berbasis Vue 3 dengan nama brand **Pull Store**, yang menggabungkan dua lini penawaran dalam satu antarmuka bersih:
1. **Produk Digital & AI Pro (Fast Cashflow):** Katalog akun berlangganan (ChatGPT Plus, Claude Pro, Gemini Advanced, Netflix, Spotify).
2. **Jasa Software Development (High-Ticket):** Jasa pembuatan Web, Sistem Informasi, dan Aplikasi Android (APK Offline/Online).

Target konversi utama adalah mengarahkan pengguna ke **WhatsApp Direct Checkout** dengan pesan terformat otomatis ke nomor resmi Pull Store.

## 2. Fitur Utama (Core Features)
### A. Mode Katalog Dual-View (Tab/Filter)
- Pengguna dapat memfilter atau berpindah dengan mulus antara kategori:
  - **Produk Digital:** AI Productivity & Streaming Entertainment.
  - **Jasa Pembuatan Aplikasi:** Landing Page/Instansi, APK Kasir/Stok Offline, Custom Web System.

### B. Kartu Produk & Paket Layanan
- **Kartu Produk Digital:** Menampilkan nama layanan, tipe akun, durasi, indikator stok, harga, dan tombol "Pesan".
- **Kartu Jasa Dev:** Menampilkan nama paket, deliverables utama, estimasi waktu, harga mulai (*starting price*), dan tombol "Konsultasi".

### C. Modal Konfirmasi & WhatsApp Link Generator
- Klik tombol "Pesan" membuka modal ringkas berisi:
  - Ringkasan item yang dipilih.
  - Input Nama Pemesan & Catatan.
  - Tombol **"Lanjut ke WhatsApp"** yang memicu URL `wa.me/6285693672730` dengan template pesan otomatis atas nama Pull Store.

### D. Showcase Portofolio & FAQ
- Menampilkan portofolio proyek nyata (Aplikasi Stok APK, HRIS Geolocation, Portal Warga) dan bagian FAQ interaktif.