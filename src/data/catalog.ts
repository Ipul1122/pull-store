import type { StoreInfo, ProductItem, ServiceItem, PortfolioItem, FaqItem } from '../types'

// Category Asset Imports
import chatgptSvg from '../assets/AI/chatgpt.svg'
import claudeSvg from '../assets/AI/claude.svg'
import geminiSvg from '../assets/AI/gemini.svg'

import canvaSvg from '../assets/edit/canva.svg'
import capcutSvg from '../assets/edit/capcut.svg'

import googleMapsSvg from '../assets/rating/google-maps.svg'

import netflixSvg from '../assets/streaming/netflix.svg'
import spotifySvg from '../assets/streaming/spotify.svg'
import vidioSvg from '../assets/streaming/vidio.svg'
import youtubeSvg from '../assets/streaming/youtube.svg'
import zoomSvg from '../assets/streaming/zoom.svg'

export const STORE_INFO: StoreInfo = {
  brandName: 'Pull Store',
  tagline: 'Digital Subscriptions & High-Ticket Software Development',
  founder: 'Muhammad Syaifulloh',
  founderWebsite: 'https://msyaifulloh.my.id',
  whatsappNumber: '6285693672730',
  whatsappDisplay: '+62 856-9367-2730',
  email: 'syaifulloh.dev@gmail.com',
  githubUrl: 'https://github.com',
  operationalHours: '08:00 - 23:00 WIB (Fast Response)',
  garansiDescription: '100% Replacement Warranty untuk produk digital & Masa Garansi Bugfix 30-90 hari untuk proyek software.',
}

export const PRODUCTS: ProductItem[] = [
  // ==========================================
  // KATEGORI 1: AI (AI Productivity)
  // ==========================================
  {
    id: 'chatgpt-plus-shared',
    name: 'ChatGPT Plus (GPT-4o)',
    category: 'ai',
    categoryLabel: 'AI Productivity • Plus',
    accountType: 'Shared',
    duration: '1 Bulan',
    price: 40000,
    originalPrice: 85000,
    stockStatus: 'ready',
    stockCount: 18,
    badge: 'Paling Populer',
    popular: true,
    logo: chatgptSvg,
    iconName: 'Bot',
    description: 'Akses penuh GPT-4o, fitur Canvas, DALL-E 3, dan analisis file. Sharing account login 1 device by code.',
    features: [
      'Sharing account',
      'Login 1 device saja',
      'Login by code (praktis)',
      'Full garansi 25 hari',
      'Akses GPT-4o & GPT-4 Turbo',
      'Advanced Voice Mode, Canvas & DALL·E 3'
    ],
    garansi: 'Full Garansi 25 Hari',
    notes: 'Sharing account • Login 1 device saja • By code • Full garansi 25 hari'
  },
  {
    id: 'chatgpt-go',
    name: 'ChatGPT Go',
    category: 'ai',
    categoryLabel: 'AI Productivity • Go',
    accountType: 'Shared',
    duration: '1 Bulan',
    price: 20000,
    originalPrice: 40000,
    stockStatus: 'ready',
    stockCount: 25,
    badge: 'Super Hemat (20K)',
    popular: false,
    logo: chatgptSvg,
    iconName: 'Bot',
    description: 'Pilihan paling hemat untuk penulisan tugas, riset, dan asisten AI harian. Sharing account login 1 device by code.',
    features: [
      'Sharing account',
      'Login 1 device saja',
      'Login by code (praktis)',
      'Full garansi 25 hari',
      'Asisten riset, coding & buat naskah',
      'Hemat dan siap pakai instan'
    ],
    garansi: 'Full Garansi 25 Hari',
    notes: 'Sharing account • Login 1 device saja • By code • Full garansi 25 hari'
  },
  {
    id: 'claude-ai-pro',
    name: 'Claude AI Pro',
    category: 'ai',
    categoryLabel: 'AI Productivity • Claude',
    accountType: 'Shared',
    duration: '1 Bulan',
    price: 150000,
    originalPrice: 250000,
    stockStatus: 'ready',
    stockCount: 15,
    badge: 'Favorit Coder',
    popular: true,
    logo: claudeSvg,
    iconName: 'Cpu',
    description: 'Akses kecerdasan coding Claude 3.5 Sonnet & Artifacts untuk programming dan naskah. Sharing 5 user via akun seller.',
    features: [
      'Sharing 5u (5 user)',
      'Akun seller (langsung siap pakai)',
      'Akses Claude 3.5 Sonnet & Haiku',
      'Interactive UI preview dengan Artifacts',
      'Projects Workspace & dokumen panjang',
      'Garansi penggantian penuh'
    ],
    garansi: 'Garansi Penggantian',
    notes: 'Sharing 5u • Akun seller • Garansi penggantian'
  },
  {
    id: 'head-gemini-5tb',
    name: 'HEAD GEMINI AI + GDRIVE 5TB + INVITE 5 AKUN',
    category: 'ai',
    categoryLabel: 'AI Productivity • Head Gemini',
    accountType: 'Family Head',
    duration: '1 Tahun',
    price: 250000,
    originalPrice: 500000,
    stockStatus: 'ready',
    stockCount: 8,
    badge: 'Hemat 50% (500K -> 250K)',
    popular: true,
    logo: geminiSvg,
    iconName: 'Sparkles',
    description: 'Head Gemini langsung 1 tahun siap pakai dengan 5TB Google Drive dan hak invite 5 akun pribadi sekaligus.',
    features: [
      'Dapat invite 5 orang sekaligus',
      'Sistem bukan berbagi layaknya Netflix, tapi punya pribadi masing masing',
      'Chat ke Gemini unlimited',
      'Buat gambar/video lebih banyak kuotanya',
      'Terintegrasi kayak spreadsheet, G-docs bisa pakai AI nya untuk bantu kerja',
      'Bisa pakai AI studio',
      'Bisa buat coding Antigravity lebih lama limitnya',
      '5TB penyimpanan G-Drive'
    ],
    garansi: 'Garansi 6 Bulan',
    notes: 'Garansi 6 Bulan'
  },
  {
    id: 'gemini-ai-5tb',
    name: 'GEMINI AI + GDRIVE 5TB',
    category: 'ai',
    categoryLabel: 'AI Productivity • Gmail Sendiri',
    accountType: 'Invite Link',
    duration: '1 Bulan',
    price: 25000,
    originalPrice: 45000,
    stockStatus: 'ready',
    stockCount: 20,
    badge: 'Tinggal Kirim Gmail',
    popular: true,
    logo: geminiSvg,
    iconName: 'Sparkles',
    description: 'Gmail SENDIRI tinggal kirim alamat Gmail Anda tanpa password. Termasuk Gemini AI Pro & G-Drive 5TB.',
    features: [
      'Chat ke Gemini unlimited',
      'Buat gambar/video lebih banyak kuotanya',
      'Terintegrasi kayak spreadsheet, G-docs bisa pakai AI nya untuk bantu kerja',
      'Bisa pakai AI studio',
      'Bisa buat coding Antigravity lebih lama limitnya',
      '5TB penyimpanan G-Drive'
    ],
    variants: [
      {
        id: 'gemini-5tb-1m',
        duration: '1 Bulan',
        price: 25000,
        originalPrice: 45000,
        garansi: 'Garansi 2 Minggu'
      },
      {
        id: 'gemini-5tb-3m',
        duration: '3 Bulan',
        price: 50000,
        originalPrice: 95000,
        garansi: 'Garansi 2 Bulan',
        popular: true
      },
      {
        id: 'gemini-5tb-1y',
        duration: '1 Tahun',
        price: 150000,
        originalPrice: 300000,
        garansi: 'Garansi 6 Bulan'
      }
    ],
    garansi: 'Garansi 2 Minggu - 6 Bulan',
    notes: 'Garansi 2 Minggu (1 bln) | Garansi 2 Bulan (3 bln) | Garansi 6 Bulan (1 thn)'
  },

  // ==========================================
  // KATEGORI 2: EDIT (Desain & Video Editing)
  // ==========================================
  {
    id: 'canva-pro-member',
    name: 'Canva Pro Member Team',
    category: 'edit',
    categoryLabel: 'Desain & Editing • Member',
    accountType: 'Invite Link',
    duration: '1 Bulan',
    price: 15000,
    originalPrice: 45000,
    stockStatus: 'ready',
    stockCount: 50,
    badge: 'Diskon s/d 67%',
    popular: true,
    logo: canvaSvg,
    iconName: 'Palette',
    description: 'Membuka seluruh fitur Canva Pro premium (jutaan template, remove background, SVG/PNG transparan). Desain pribadi 100% aman & tidak terlihat anggota tim lain.',
    features: [
      'Aktivasi via email Canva pribadi (Invite Link)',
      'Desain 100% aman (tidak terlihat anggota tim lain)',
      'Akses 100M+ template, foto & elemen premium Pro',
      'Magic Studio AI & Background Remover 1-klik',
      'Download PNG transparan & SVG resolusi tinggi',
      'Bisa dipakai di Web, Android, iOS & iPad'
    ],
    variants: [
      {
        id: 'canva-member-1w',
        duration: '1 Minggu',
        price: 5000,
        originalPrice: 15000,
        garansi: 'Garansi 1 Minggu'
      },
      {
        id: 'canva-member-2w',
        duration: '2 Minggu',
        price: 10000,
        originalPrice: 25000,
        garansi: 'Garansi 2 Minggu'
      },
      {
        id: 'canva-member-1m',
        duration: '1 Bulan',
        price: 15000,
        originalPrice: 45000,
        garansi: 'Garansi 30 Hari',
        popular: true
      },
      {
        id: 'canva-member-3m',
        duration: '3 Bulan',
        price: 30000,
        originalPrice: 90000,
        garansi: 'Garansi 3 Bulan'
      },
      {
        id: 'canva-member-6m',
        duration: '6 Bulan',
        price: 50000,
        originalPrice: 150000,
        garansi: 'Garansi 6 Bulan'
      },
      {
        id: 'canva-member-1y',
        duration: '1 Tahun',
        price: 80000,
        originalPrice: 240000,
        garansi: 'Garansi 1 Tahun'
      }
    ],
    garansi: 'Garansi Sesuai Durasi',
    notes: 'Member Team Invite Link • Desain 100% private tidak terlihat anggota lain • 1 Mgg: 5K, 2 Mgg: 10K, 1 Bln: 15K, 3 Bln: 30K, 6 Bln: 50K, 1 Thn: 80K'
  },
  {
    id: 'canva-pro-designer',
    name: 'Canva Pro Designer Plan',
    category: 'edit',
    categoryLabel: 'Desain & Editing • Designer',
    accountType: 'Invite Link',
    duration: '1 Bulan',
    price: 20000,
    originalPrice: 60000,
    stockStatus: 'ready',
    stockCount: 40,
    badge: 'Brand Kit & Upload Font',
    popular: false,
    logo: canvaSvg,
    iconName: 'Palette',
    description: 'Membuka seluruh fitur Canva Pro DITAMBAH Designer Plan (upload font kustom, color palette, brand kit). Desain 100% private tidak terlihat anggota tim lain.',
    features: [
      'Semua fitur Canva Pro aktif penuh',
      'Fitur Designer Plan: Bisa upload font kustom',
      'Color Palette & Brand Kit bisnis aktif',
      'Desain pribadi 100% aman & tidak terlihat anggota tim lain',
      'Aktivasi via email Canva pribadi (Invite Link)',
      'Magic Studio, AI tools & Resize otomatis'
    ],
    variants: [
      {
        id: 'canva-designer-1m',
        duration: '1 Bulan',
        price: 20000,
        originalPrice: 60000,
        garansi: 'Garansi 30 Hari',
        popular: true
      },
      {
        id: 'canva-designer-1y',
        duration: '1 Tahun',
        price: 100000,
        originalPrice: 300000,
        garansi: 'Garansi 1 Tahun'
      }
    ],
    garansi: 'Garansi Sesuai Durasi',
    notes: 'Designer Plan: Upload font + Color palette + Brand Kit • Desain 100% private tidak terlihat anggota lain'
  },
  {
    id: 'canva-head-team',
    name: 'Canva Pro Head Team (Owner)',
    category: 'edit',
    categoryLabel: 'Desain & Editing • Head Team',
    accountType: 'Owner / Kepala Akun',
    duration: '1 Bulan',
    price: 50000,
    originalPrice: 150000,
    stockStatus: 'ready',
    stockCount: 10,
    badge: 'Owner 100 Member',
    popular: true,
    logo: canvaSvg,
    iconName: 'Palette',
    description: 'Owner atau kepala akun tim Canva. Kendali penuh untuk mengundang hingga 100 member, designer, atau admin. Solusi terbaik untuk agency atau reseller.',
    features: [
      'Owner / Kepala akun tim utama',
      'Bisa invite hingga 100 member / designer / admin',
      'Cocok untuk buka jasa invite tim & agency',
      'Akses penuh semua fitur Canva Pro',
      'Kontrol penuh manajemen anggota tim',
      'Garansi aktif 1 bulan penuh'
    ],
    garansi: 'Full Garansi 1 Bulan',
    notes: 'HEAD : Owner / kepala akun yang bisa invite 100 member / designer / admin. Renewal per 1 bulan.'
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro Private',
    category: 'edit',
    categoryLabel: 'Desain & Editing • CapCut',
    accountType: 'Private',
    duration: '1 Bulan',
    price: 25000,
    originalPrice: 65000,
    stockStatus: 'ready',
    stockCount: 20,
    badge: 'Private Account',
    popular: true,
    logo: capcutSvg,
    iconName: 'Video',
    description: 'Akses penuh CapCut Pro private untuk editing video konten TikTok, Reels & YouTube. Bebas watermark, auto-caption AI, dan render 4K 60FPS.',
    features: [
      'Akun Private (Bukan shared akun)',
      'Maksimal 2 device (Khusus iOS max 1 device)',
      'Hitungan durasi: 5-7 hari (1 Minggu) & 25-30 hari (1 Bulan)',
      'Render 4K 60FPS jernih tanpa watermark',
      'Auto caption AI bahasa Indonesia akurat',
      'S&K: No garansi jika melanggar batas device (maximum of number)'
    ],
    variants: [
      {
        id: 'capcut-pro-1w',
        duration: '1 Minggu',
        price: 15000,
        originalPrice: 35000,
        garansi: 'Garansi 5 - 7 Hari'
      },
      {
        id: 'capcut-pro-1m',
        duration: '1 Bulan',
        price: 25000,
        originalPrice: 65000,
        garansi: 'Garansi 25 - 30 Hari',
        popular: true
      }
    ],
    garansi: 'Garansi 25 - 30 Hari',
    notes: 'Max 2 device (iOS only 1 device) • 5-7 hari terhitung seminggu • 25-30 hari terhitung sebulan • No garansi jika maximum of number'
  },

  // ==========================================
  // KATEGORI 3: RATING (Jasa Review Google Maps)
  // ==========================================
  {
    id: 'gmaps-rating-bintang',
    name: 'Rating Google Maps (Bintang Only)',
    category: 'rating',
    categoryLabel: 'Jasa Rating Maps • Bintang Only',
    accountType: 'Rp 3.000 / Akun',
    duration: '1 Akun',
    price: 30000,
    originalPrice: 60000,
    stockStatus: 'ready',
    stockCount: 100,
    badge: '3.000 / Akun',
    popular: false,
    logo: googleMapsSvg,
    iconName: 'Star',
    description: 'Jasa rating Google Maps bintang 5 murni tanpa komentar. Akun Google riil & aktif dengan proses drip-feed alami aman algoritma.',
    features: [
      'Rating Bintang 5 murni (tanpa teks komentar)',
      'Tarif hemat Rp 3.000 per akun',
      'Akun Google riil & aktif',
      'Drip-feed alami (aman filter anti-spam Google)',
      'Menaikkan skor rating toko / resto / UMKM',
      'Garansi refill 30 hari jika rating drop'
    ],
    variants: [
      {
        id: 'gmaps-star-1',
        duration: '1 Akun',
        price: 3000,
        originalPrice: 6000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-star-5',
        duration: '5 Akun',
        price: 15000,
        originalPrice: 30000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-star-10',
        duration: '10 Akun',
        price: 30000,
        originalPrice: 60000,
        garansi: 'Garansi Refill 30 Hari',
        popular: true
      },
      {
        id: 'gmaps-star-25',
        duration: '25 Akun',
        price: 75000,
        originalPrice: 150000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-star-50',
        duration: '50 Akun',
        price: 150000,
        originalPrice: 300000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-star-100',
        duration: '100 Akun',
        price: 300000,
        originalPrice: 600000,
        garansi: 'Garansi Refill 30 Hari'
      }
    ],
    garansi: 'Garansi Refill 30 Hari',
    notes: 'Bintang only tanpa komen Rp 3.000/akun • Bebas pilih jumlah akun yang diinginkan'
  },
  {
    id: 'gmaps-review-komen',
    name: 'Rating & Review Maps (Bintang + Komen)',
    category: 'rating',
    categoryLabel: 'Jasa Review Maps • Bintang + Komen',
    accountType: 'Rp 5.000 / Akun',
    duration: '1 Akun',
    price: 50000,
    originalPrice: 100000,
    stockStatus: 'ready',
    stockCount: 100,
    badge: 'Rekomendasi UMKM',
    popular: true,
    logo: googleMapsSvg,
    iconName: 'Star',
    description: 'Jasa rating bintang 5 lengkap dengan kalimat komentar ulasan positif. Bebas request isi review & lampiran foto. Tingkatkan kepercayaan & SEO lokal.',
    features: [
      'Rating Bintang 5 + Ulasan komentar positif',
      'Tarif Rp 5.000 per akun',
      'Bebas request materi teks review & foto produk',
      'Akun riil ber-Local Guide aktif',
      'Drip-feed berkala teratur (aman 100%)',
      'Garansi refill 30 hari'
    ],
    variants: [
      {
        id: 'gmaps-rev-1',
        duration: '1 Akun',
        price: 5000,
        originalPrice: 10000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-rev-5',
        duration: '5 Akun',
        price: 25000,
        originalPrice: 50000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-rev-10',
        duration: '10 Akun',
        price: 50000,
        originalPrice: 100000,
        garansi: 'Garansi Refill 30 Hari',
        popular: true
      },
      {
        id: 'gmaps-rev-25',
        duration: '25 Akun',
        price: 125000,
        originalPrice: 250000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-rev-50',
        duration: '50 Akun',
        price: 250000,
        originalPrice: 500000,
        garansi: 'Garansi Refill 30 Hari'
      },
      {
        id: 'gmaps-rev-100',
        duration: '100 Akun',
        price: 500000,
        originalPrice: 1000000,
        garansi: 'Garansi Refill 30 Hari'
      }
    ],
    garansi: 'Garansi Refill 30 Hari',
    notes: 'Bintang + Komen Rp 5.000/akun • Bisa request teks kalimat & lampiran foto'
  },

  // ==========================================
  // KATEGORI 4: STREAMING (Streaming & Meeting)
  // ==========================================
  {
    id: 'netflix-2u',
    name: 'Netflix Premium 2U (Sharing)',
    category: 'streaming',
    categoryLabel: 'Streaming • 2 User',
    accountType: 'Shared 2U',
    duration: '1 Bulan',
    price: 30000,
    originalPrice: 60000,
    stockStatus: 'ready',
    stockCount: 30,
    badge: 'Mulai 6 Ribu',
    popular: false,
    logo: netflixSvg,
    iconName: 'Tv',
    description: 'Streaming film & serial 4K Ultra HD Netflix paket sharing 2 user. Pilihan hemat untuk nonton maraton harian hingga sebulan penuh.',
    features: [
      'Kualitas 4K Ultra HD + HDR Audio Jernih',
      'Tipe 2U (Sharing 2 user per profile)',
      'Paket Harian (3, 5, 7 Hari): Login by link (Android, Laptop, TV via QR code)',
      'Paket Bulanan: All device, login by code (STRONG)',
      'Subtitle Indonesia & download film offline',
      'Garansi penuh sesuai durasi langganan'
    ],
    variants: [
      {
        id: 'netflix-2u-3d',
        duration: '3 Hari',
        price: 6000,
        originalPrice: 12000,
        garansi: 'Garansi 3 Hari'
      },
      {
        id: 'netflix-2u-5d',
        duration: '5 Hari',
        price: 10000,
        originalPrice: 20000,
        garansi: 'Garansi 5 Hari'
      },
      {
        id: 'netflix-2u-7d',
        duration: '7 Hari',
        price: 15000,
        originalPrice: 30000,
        garansi: 'Garansi 7 Hari'
      },
      {
        id: 'netflix-2u-1m',
        duration: '1 Bulan',
        price: 30000,
        originalPrice: 60000,
        garansi: 'Garansi 30 Hari',
        popular: true
      }
    ],
    garansi: 'Garansi Sesuai Durasi',
    notes: '2U Harian: login by link (Android, Laptop, TV via QR code) • 2U Bulanan: all device, login by code (STRONG)'
  },
  {
    id: 'netflix-1u',
    name: 'Netflix Premium 1U (Private Profile)',
    category: 'streaming',
    categoryLabel: 'Streaming • 1 User',
    accountType: 'Private Profile (1U)',
    duration: '1 Bulan',
    price: 40000,
    originalPrice: 80000,
    stockStatus: 'ready',
    stockCount: 25,
    badge: '1 Profile 1 User (STRONG)',
    popular: true,
    logo: netflixSvg,
    iconName: 'Tv',
    description: 'Akses 1 Profil khusus 1 User dengan kunci PIN personal. All device, login by code praktis, tanpa bentrok & akun STRONG.',
    features: [
      '1 Profil khusus 1 User (Tanpa sharing, anti bentrok)',
      'Dilengkapi kunci PIN profil pribadi',
      'All Device: Android, iPhone/iPad, Laptop & Smart TV',
      'Login by code praktis & akun STRONG',
      'Kualitas 4K Ultra HD + Dolby Atmos',
      'Full Garansi 30 Hari'
    ],
    garansi: 'Full Garansi 30 Hari',
    notes: 'Netflix bulanan 1U: all device, login by code (STRONG) • 1 Profil khusus 1 user ber-PIN'
  },
  {
    id: 'spotify-premium',
    name: 'Spotify Premium Famplan',
    category: 'streaming',
    categoryLabel: 'Streaming Musik • Spotify',
    accountType: 'Akun Seller',
    duration: '1 Bulan',
    price: 20000,
    originalPrice: 55000,
    stockStatus: 'ready',
    stockCount: 25,
    badge: 'Akun Seller',
    popular: true,
    logo: spotifySvg,
    iconName: 'Headphones',
    description: 'Dengarkan jutaan lagu & podcast tanpa jeda iklan. Download musik offline kualitas Very High 320kbps via akun seller siap pakai.',
    features: [
      'Akses Spotify Premium Famplan',
      'Akun seller (langsung siap pakai)',
      'Bebas iklan & unlimited skip lagu',
      'Download lagu kualitas 320kbps offline',
      'Bisa dipakai di Android, iOS, Laptop & TV',
      'Garansi aktif 20 hari'
    ],
    garansi: 'Garansi 20 Hari',
    notes: 'Akun seller • Garansi 20 hari • Famplan 1 bulan'
  },
  {
    id: 'zoom-premium',
    name: 'Zoom Premium Private',
    category: 'streaming',
    categoryLabel: 'Meeting • Zoom',
    accountType: 'Private',
    duration: '14 Hari',
    price: 3000,
    originalPrice: 15000,
    stockStatus: 'ready',
    stockCount: 30,
    badge: 'Private 14 Hari',
    popular: false,
    logo: zoomSvg,
    iconName: 'Tv',
    description: 'Meeting online tanpa batasan 40 menit (unlimited time duration) untuk webinar, kuliah, atau rapat tim. Akun private support iOS & Android.',
    features: [
      'Akun Private (Bukan shared akun)',
      'Meeting tanpa batasan 40 menit (Unlimited)',
      'Support iOS & Android serta Laptop/PC',
      'Kapasitas hingga 100 peserta & breakout room',
      'Durasi 14 hari (2 minggu)',
      'Garansi aktif 10 hari'
    ],
    garansi: 'Garansi 10 Hari',
    notes: 'Support iOS & Android • 2 minggu garansi 10 hari'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium + YT Music',
    category: 'streaming',
    categoryLabel: 'Streaming • YouTube',
    accountType: 'Invite Link / Jaspay',
    duration: '1 Bulan',
    price: 3500,
    originalPrice: 15000,
    stockStatus: 'ready',
    stockCount: 50,
    badge: 'Include YT Music',
    popular: true,
    logo: youtubeSvg,
    iconName: 'PlayCircle',
    description: 'Nonton video YouTube bebas iklan di semua device, pemutaran latar belakang (background play), dan sudah include YouTube Music Premium.',
    features: [
      'Bebas iklan di YouTube & YouTube Music',
      'Sudah include YouTube Music Premium',
      'Putar di latar belakang / saat layar mati',
      'Download video & audio offline',
      'Pilihan aktivasi: Famplan Invite Email atau Jaspay',
      'Garansi 1x replace jaspay (pakai email fresh)'
    ],
    variants: [
      {
        id: 'yt-famplan-1m',
        duration: 'Famplan 1 Bulan',
        price: 3500,
        originalPrice: 15000,
        garansi: 'Garansi 30 Hari',
        popular: true
      },
      {
        id: 'yt-jaspay-1m',
        duration: 'Jaspay 1 Bulan',
        price: 2500,
        originalPrice: 12000,
        garansi: 'Garansi 1x Replace'
      }
    ],
    garansi: 'Garansi Sesuai Paket',
    notes: 'Sudah include YouTube Music • Garansi 1x replace jaspay, pakai email fresh'
  },
  {
    id: 'vidio-platinum-mobile',
    name: 'Vidio Platinum Mobile (HP & Tab)',
    category: 'streaming',
    categoryLabel: 'Streaming • Vidio Mobile',
    accountType: 'Mobile (HP & Tab)',
    duration: '1 Bulan',
    price: 20000,
    originalPrice: 45000,
    stockStatus: 'ready',
    stockCount: 30,
    badge: 'Mobile & Tab',
    popular: true,
    logo: vidioSvg,
    iconName: 'PlayCircle',
    description: 'Nonton streaming sepakbola BRI Liga 1, Sports, dan Vidio Original Series tanpa jeda iklan khusus perangkat mobile (smartphone & tablet).',
    features: [
      'Live streaming BRI Liga 1 & tayangan Sports',
      'Vidio Original Series & film bebas iklan',
      'Khusus perangkat Mobile (HP & Tablet)',
      'Tersedia opsi 2U (Sharing) dan Private',
      'Kualitas Full HD 1080p jernih',
      'Garansi aktif 30 hari'
    ],
    variants: [
      {
        id: 'vidio-mob-2u',
        duration: '2U 1 Bulan',
        price: 20000,
        originalPrice: 40000,
        garansi: 'Garansi 30 Hari',
        popular: true
      },
      {
        id: 'vidio-mob-priv',
        duration: 'Private 1 Bulan',
        price: 30000,
        originalPrice: 60000,
        garansi: 'Garansi 30 Hari'
      }
    ],
    garansi: 'Garansi 30 Hari',
    notes: 'Plan Platinum Mobile (HP, Tab) • 2U 1 Bulan: 20.000 | Private 1 Bulan: 30.000'
  },
  {
    id: 'vidio-platinum-tv',
    name: 'Vidio Platinum TV (Private 1 Tahun)',
    category: 'streaming',
    categoryLabel: 'Streaming • Vidio Smart TV',
    accountType: 'Private TV',
    duration: '1 Tahun',
    price: 25000,
    originalPrice: 65000,
    stockStatus: 'ready',
    stockCount: 20,
    badge: 'Plan Smart TV (1 Thn)',
    popular: false,
    logo: vidioSvg,
    iconName: 'PlayCircle',
    description: 'Akses Vidio Platinum khusus di Smart TV Anda selama 1 tahun. Nonton film, drama, dan olahraga favorit di layar lebar tanpa jeda iklan.',
    features: [
      'Khusus Plan Platinum Smart TV',
      'Durasi 1 Tahun (Private)',
      'Semua film, serial & sports Full HD',
      'Garansi 30 hari (garansi backfee)',
      'S&K: Akun dicuri & deactivated tidak ikut garansi',
      'Harga promo super hemat'
    ],
    garansi: 'Garansi 30 Hari (Backfee)',
    notes: 'Plan TV 1 tahun garansi 30 hari • Hanya garansi backfee, akun dicuri dan deactivated tidak ikut garansi'
  }
]

export const SERVICES: ServiceItem[] = [
  {
    id: 'svc-tugas-akhir',
    name: 'Jasa Pembuatan Aplikasi Tugas Akhir & Skripsi (Mahasiswa)',
    category: 'tugas-akhir',
    categoryLabel: 'Tugas Akhir & Skripsi',
    startingPrice: 500000,
    priceDisplay: 'Mulai Rp 500.000',
    timeline: '3 - 7 Hari Kerja (Sesuai Deadline)',
    tagline: 'Bantuan pengerjaan coding aplikasi skripsi, tugas akhir (TA), & tugas kuliah pemrograman. Tarif biaya jasa koding saja, belum termasuk hosting atau domain (siap running di localhost).',
    deliverables: [
      'Hemat Mahasiswa: Tarif bersahabat mulai Rp 500Rb khusus pengerjaan jasa coding aplikasi, belum termasuk domain atau hosting jika ingin online.',
      'Full Source Code & Database: Source code 100% bersih, rapi, dan diserahkan penuh bersama skema database (MySQL/PostgreSQL/SQLite).',
      'Sesuai Bab 3 & 4: Fitur aplikasi disesuaikan dengan rancangan use case diagram, flowchart, ERD, dan batasan masalah skripsi Anda.',
      'Bimbingan Demo Sidang: Diajarkan cara running aplikasi di laptop sendiri (localhost) serta penjelasan logika alur program agar percaya diri di hadapan dosen penguji.',
      'Garansi Revisi & Bugfix: Bebas revisi minor dan perbaikan bug/error sampai sidang tugas akhir Anda selesai.'
    ],
    advantages: [
      'Start 500Rb (Hanya Biaya Jasa Koding)',
      'Tanpa Wajib Beli Hosting/Domain (Localhost Ready)',
      'Full Source Code & Penjelasan Logika Program',
      'Garansi Pendampingan & Revisi Minor Sampai Sidang'
    ],
    maintenanceWarranty: 'Garansi Revisi Minor & Bugfix sampai sidang selesai (belum termasuk biaya sewa hosting/domain jika butuh online)',
    badge: 'Start 500Rb • Khusus Mahasiswa',
    iconName: 'GraduationCap',
    recommended: true,
    suitableFor: 'Mahasiswa D3/S1 Teknik Informatika, Sistem Informasi, Ilmu Komputer, Teknik Elektro, & Tugas Akhir Pemrograman'
  },
  {
    id: 'svc-apk-kasir',
    name: 'Aplikasi Kasir & Stok Android (100% Offline Tanpa Kuota)',
    category: 'apk-offline',
    categoryLabel: 'Kasir Toko & Retail',
    startingPrice: 700000,
    priceDisplay: 'Mulai Rp 700.000',
    timeline: '1 - 2 Minggu (7 - 14 Hari Kerja)',
    tagline: 'Toko tetap bisa transaksi & cetak struk nota walau tanpa kuota atau mati wifi. Beli sekali seumur hidup, tanpa biaya sewa bulanan.',
    deliverables: [
      'Kasir Cepat & Struk: Transaksi kilat dengan printer thermal bluetooth & scan barcode via kamera HP.',
      'Tanpa Biaya Bulanan: Sistem 100% hak milik Anda seumur hidup, bebas biaya sewa vendor berkala.',
      '100% Kerja Offline: Operasional tetap lancar tanpa internet walau wifi mati atau mati lampu.',
      'Laporan Otomatis: Stok otomatis berkurang & rekap laba-rugi/omzet rapi siap ekspor Excel/PDF.',
      'Siap Pakai & Dipandu: Kami pasang langsung ke HP toko dan didampingi panduan sampai kasir mahir.'
    ],
    advantages: [
      'Beli Sekali Hak Milik Seumur Hidup',
      '100% Offline Tanpa Kuota',
      'Support Printer Bluetooth & Barcode',
      'Termasuk Full Source Code'
    ],
    badge: 'Mulai 700Rb • Terlaris UMKM',
    iconName: 'Smartphone',
    recommended: true,
    suitableFor: 'Toko Kelontong, Cafe / Resto, Toko Baju, Bengkel, Apotek, Counter HP, Retail UMKM, dll.'
  },
  {
    id: 'svc-website-statis',
    name: 'Website Jualan Statis (Fast & Clean)',
    category: 'landing-page',
    categoryLabel: 'Website Statis & Landing Page',
    startingPrice: 850000,
    priceDisplay: 'Mulai Rp 850.000',
    timeline: '1 - 2 Minggu (7 - 10 Hari Kerja)',
    tagline: 'Website elegan berkecepatan tinggi untuk jualan & profil bisnis. Calon pembeli langsung yakin dan 1-klik terhubung ke WhatsApp Anda.',
    deliverables: [
      'Tampilan Mewah & Kredibel: Desain profesional yang langsung menaikkan kepercayaan calon pembeli Anda.',
      'Loading Kilat < 1 Detik: Calon pelanggan tidak kabur saat membuka link promo IG, TikTok, atau Google Ads.',
      'Domain & Hosting Gratis: Sudah include gratis domain resmi (.com / .my.id) & hosting 1 tahun penuh.',
      'Order WhatsApp Otomatis: Tombol pesan langsung terhubung ke chat WA Anda tanpa alur berbelit.',
      'Garansi Free Maintenance 3 Bulan: Bebas biaya perbaikan jika ada kendala di 3 bulan pertama.'
    ],
    advantages: [
      'Sudah Termasuk Domain & Hosting 1 Tahun',
      'Garansi 3 Bulan Free Maintenance',
      'Loading Super Kilat < 1 Detik',
      '100% Akses & Source Code Milik Anda'
    ],
    maintenanceWarranty: 'Garansi 3 Bulan Free Maintenance (sesudahnya ada biaya tambahan jika ada perubahan/update)',
    badge: 'Start 850Rb • Include Domain & Hosting',
    iconName: 'Globe',
    recommended: false,
    suitableFor: 'Company Profile, Portofolio, Landing Page Produk, Web Promosi UMKM, dll.'
  },
  {
    id: 'svc-website-dinamis',
    name: 'Website Jualan Dinamis (Katalog, CMS & Admin Panel)',
    category: 'web-dinamis',
    categoryLabel: 'Website Dinamis & CMS',
    startingPrice: 1500000,
    priceDisplay: 'Rp 1.500.000 - Rp 3.000.000',
    timeline: '2 - 3 Minggu (14 - 21 Hari Kerja)',
    tagline: 'Website interaktif dengan Dashboard Admin. Anda bisa upload produk baru, ubah harga promo, dan kelola database kapan saja secara mandiri.',
    deliverables: [
      'Dashboard Admin (CMS): Upload produk baru, ganti harga promo, & kelola stok sendiri tanpa paham koding.',
      'Katalog & Form WhatsApp: Filter kategori interaktif, pencarian produk, & form checkout chat WA otomatis.',
      'Domain & Server Database: Sudah include domain resmi (.com) dan hosting server database 1 tahun penuh.',
      'Login & Keamanan Data: Fitur autentikasi aman untuk melindungi data pelanggan dan riwayat transaksi.',
      'Garansi Free Maintenance 3 Bulan: Bebas biaya penanganan bug & monitoring sistem di 3 bulan pertama.'
    ],
    advantages: [
      'Termasuk Domain & Hosting Server 1 Tahun',
      'Garansi 3 Bulan Free Maintenance',
      'Full Akses Admin Panel (Bebas Input Produk)',
      'Full Database & Source Code Milik Anda'
    ],
    maintenanceWarranty: 'Garansi 3 Bulan Free Maintenance (sesudahnya ada biaya tambahan jika ada perubahan/update)',
    badge: '1.5Jt - 3Jt • Admin Panel CMS',
    iconName: 'Globe',
    recommended: true,
    suitableFor: 'Brand Lokal, Toko Online dengan Banyak Produk, Bisnis F&B dengan Menu Dinamis, & Perusahaan Berkembang'
  },
  {
    id: 'svc-custom-web',
    name: 'Sistem Informasi & Manajemen Operasional Kustom',
    category: 'custom-web',
    categoryLabel: 'Sistem Bisnis & Operasional',
    startingPrice: 0,
    priceDisplay: 'Sesuai dengan yang Anda Butuhkan (Konsultasi Free)',
    timeline: 'Fleksibel (Sesuai Skala Fitur)',
    tagline: 'Ubah alur kerja manual serba kertas & excel yang berantakan menjadi otomatis. Sistem dibuat khusus sesuai kebutuhan spesifik bisnis Anda.',
    deliverables: [
      'Dibuat Sesuai SOP Anda: Fitur dirancang pas dengan alur bisnis Anda (absensi GPS, approval, stok multi-cabang).',
      'Cegah Kecurangan & Error: Hilangkan dokumen hilang dan hemat puluhan jam rekap manual tim per minggu.',
      'Dashboard Statistik Real-time: Pantau omzet & performa tim dengan hak akses bertingkat aman (Owner, Manager, Staf).',
      'Akses Fleksibel Multi-Device: Dapat dibuka aman dari browser HP, tablet, maupun laptop di mana saja.',
      'Garansi & Training Karyawan: Pendampingan intensif, training staf, & garansi bugfix 90 hari.'
    ],
    advantages: [
      'Dirancang Khusus Sesuai Alur Bisnis Anda',
      'Bebas Biaya Lisensi Pengguna Bulanan',
      'Garansi 3 Bulan Free Maintenance & Bugfix',
      'Full Source Code & Database Milik Anda'
    ],
    maintenanceWarranty: 'Garansi 3 Bulan Free Maintenance & Bugfix (setelahnya ada opsi biaya tambahan/maintenance opsional)',
    badge: 'Konsultasi Free • Solusi Kustom',
    iconName: 'Layers',
    recommended: false,
    suitableFor: 'Perusahaan Berkembang, Kantor Multi-Cabang, Pengelola Properti/Kos, Sekolah/Yayasan, & Organisasi'
  }
]

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Aplikasi Kasir & Stok Gudang Offline (Android)',
    type: 'Android POS & Inventory App',
    category: 'mobile',
    description: 'Aplikasi kasir retail mandiri yang dirancang khusus untuk operasional daerah minim sinyal. Mendukung cetak struk via bluetooth printer dan pembacaan barcode cepat menggunakan kamera HP.',
    metrics: '850+ Transaksi Harian Tanpa Internet • 0 Biaya Server Bulanan',
    techStack: ['Android APK', 'SQLite Embedded', 'Bluetooth ESC/POS', 'Zxing Barcode'],
    clientType: 'Retail Toko Grosir Sembako & Bahan Bangunan',
    caseStudyKeyPoints: [
      'Database lokal ultra-cepat tanpa risiko server down atau lemot.',
      'Dukungan printer thermal 58mm & 80mm secara plug-and-play.',
      'Fitur backup & restore data ke Google Drive hanya dengan 1-klik.'
    ]
  },
  {
    id: 'port-2',
    title: 'HRIS Geolocation & Presensi Selfie Anti-Fake GPS',
    type: 'Web Enterprise & Mobile Responsive',
    category: 'system',
    description: 'Sistem absensi karyawan digital berbasis titik koordinat radius kantor (geofencing) dilengkapi verifikasi kamera langsung. Mengeliminasi manipulasi jam kerja dan mempermudah perhitungan gaji bulanan.',
    metrics: '350+ Karyawan Terdata • Penghematan Rekap Absensi 90%',
    techStack: ['Vue 3', 'Tailwind CSS', 'Laravel REST API', 'MySQL', 'Leaflet Maps'],
    clientType: 'Perusahaan Logistik & Outsourcing 4 Cabang',
    caseStudyKeyPoints: [
      'Deteksi anti-mock location (Fake GPS) dengan validasi timestamp server.',
      'Perhitungan otomatis lembur, cuti tahunan, dan denda keterlambatan.',
      'Dashboard manajemen visual dengan grafik kehadiran real-time.'
    ]
  },
  {
    id: 'port-3',
    title: 'Portal Desa & Pelayanan Surat Digital Warga',
    type: 'Gov Public Portal & E-Governance',
    category: 'web',
    description: 'Portal satu pintu layanan administrasi kependudukan tingkat RT/RW dan Desa. Warga dapat mengajukan permohonan surat pengantar secara mandiri dan menerima notifikasi via WhatsApp.',
    metrics: '1.200+ Kepala Keluarga Terlayani • Waktu Buat Surat < 5 Menit',
    techStack: ['Vue 3 SPA', 'TypeScript', 'Node.js Express', 'WhatsApp Webhook API'],
    clientType: 'Aparatur Desa & Paguyuban Lingkungan Perumahan',
    caseStudyKeyPoints: [
      'Pembuatan berkas surat otomatis format PDF dengan QR-Code verifikasi resmi.',
      'Kanal aduan warga terintegrasi dengan status penanganan transparan.',
      'Aksesibilitas mobile yang ramah untuk semua kalangan usia pengguna.'
    ]
  }
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'digital',
    question: 'Bagaimana sistem garansi untuk produk akun digital (ChatGPT, Claude, Netflix)?',
    answer: 'Semua produk digital di Pull Store memiliki 100% Replacement Warranty. Jika akun mengalami kendala sebelum masa durasi berakhir, Anda cukup mengirim tangkapan layar via WhatsApp resmi kami, dan tim kami akan memberikan penanganan atau akun pengganti dalam waktu maksimal 15-30 menit pada jam kerja.'
  },
  {
    id: 'faq-2',
    category: 'digital',
    question: 'Apakah akun ChatGPT Plus dan Claude Pro legal dan aman dari pemblokiran?',
    answer: 'Ya, seluruh akun diproses melalui metode pembayaran resmi (Subscription API/Virtual Credit Card verified). Varian Private menggunakan kredensial khusus untuk Anda sendiri, sementara varian Shared kami batasi hanya 2 pengguna agar bebas antrean kuota dan tidak memicu deteksi anomali login.'
  },
  {
    id: 'faq-canva',
    category: 'digital',
    question: 'Apa perbedaan Canva Member, Designer, dan Head Team? Apakah desain saya bisa dilihat orang lain?',
    answer: 'Desain yang Anda buat 100% AMAN & PRIVAT (tidak akan terlihat oleh anggota tim lain). Member Plan membuka seluruh fitur Canva Pro. Designer Plan menambahkan akses upload font kustom, color palette, dan Brand Kit. Sedangkan Head Team adalah akun owner yang bisa mengundang hingga 100 member/designer.'
  },
  {
    id: 'faq-3',
    category: 'dev',
    question: 'Bagaimana tahapan alur pengerjaan jasa software development di Pull Store?',
    answer: 'Alur kami sangat transparan dan terstruktur: (1) Konsultasi kebutuhan awal via WhatsApp/Google Meet gratis, (2) Penyusunan proposal rincian fitur & estimasi harga, (3) Pembayaran DP 50% & pengerjaan bertahap dengan update demo berkala, (4) Pengujian bersama (UAT), dan (5) Serah terima source code / instalasi APK serta pelunasan sisa.'
  },
  {
    id: 'faq-4',
    category: 'dev',
    question: 'Apakah Aplikasi Kasir Offline Android benar-benar tidak butuh internet sama sekali?',
    answer: 'Tepat sekali! Seluruh database tersimpan di penyimpanan internal perangkat Anda (SQLite). Anda dapat menginput barang, melakukan transaksi kasir, mencetak struk thermal, dan melihat laporan harian tanpa perlu kartu SIM, WiFi, atau kuota data. Internet hanya dibutuhkan jika Anda ingin mencadangkan (backup) berkas ke Google Drive.'
  },
  {
    id: 'faq-5',
    category: 'payment',
    question: 'Metode pembayaran apa saja yang didukung oleh Pull Store?',
    answer: 'Kami menerima pembayaran instan via QRIS (Bebas biaya dari BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay) serta transfer bank langsung ke rekening resmi atas nama pendiri (Muhammad Syaifulloh).'
  },
  {
    id: 'faq-6',
    category: 'dev',
    question: 'Apakah saya mendapatkan source code penuh dan bantuan instalasi?',
    answer: 'Ya! Untuk proyek jasa software development, seluruh hak cipta dan source code diserahkan kepada Anda. Kami juga menyertakan dokumentasi instalasi lengkap serta pendampingan langsung hingga sistem berjalan normal di server atau smartphone Anda.'
  },
  {
    id: 'faq-tugas-akhir',
    category: 'dev',
    question: 'Bagaimana ketentuan Jasa Pembuatan Aplikasi Tugas Akhir Mahasiswa? Apakah sudah termasuk hosting & domain?',
    answer: 'Biaya mulai Rp 500.000 adalah KHUSUS BIAYA JASA KODING logika aplikasi, penyesuaian alur bab 3 & 4 skripsi, serta bimbingan demonstrasi program di localhost (laptop Anda). Biaya ini BELUM TERMASUK sewa hosting atau domain. Namun untuk kebutuhan sidang kampus, aplikasi di localhost sudah 100% cukup dan siap dipresentasikan. Jika dosen pembimbing mewajibkan aplikasi online di internet, kami dapat membantu setup hosting/domain dengan biaya tambahan yang terjangkau.'
  }
]
