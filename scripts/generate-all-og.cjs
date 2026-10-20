const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicOgDir = path.resolve('public/og');
const publicPDir = path.resolve('public/p');

if (!fs.existsSync(publicOgDir)) fs.mkdirSync(publicOgDir, { recursive: true });
if (!fs.existsSync(publicPDir)) fs.mkdirSync(publicPDir, { recursive: true });

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const ITEMS = [
  {
    slug: 'netflix',
    aliases: ['netflix-2u', 'netflix-1u', 'streaming-netflix'],
    title: 'Netflix Premium 4K UHD',
    subtitle: 'Nonton film & series sepuasnya tanpa batas. Akun resmi & bergaransi penuh.',
    priceText: 'Mulai Rp 6.000 / bln',
    accentColor: '#e50914',
    logoPath: 'src/assets/streaming/netflix.svg',
    badges: ['100% Garansi Penuh', 'Akun Resmi & Aman', 'Support Smart TV & HP'],
    targetHash: '#netflix',
  },
  {
    slug: 'spotify',
    aliases: ['spotify-premium', 'streaming-spotify'],
    title: 'Spotify Premium Famplan',
    subtitle: 'Musik tanpa jeda iklan, download offline, & audio kualitas ultra jernih.',
    priceText: 'Rp 20.000 / Bulan',
    accentColor: '#1db954',
    logoPath: 'src/assets/streaming/spotify.svg',
    badges: ['Garansi 20 Hari', 'Akun Seller Resmi', 'Support Semua Device'],
    targetHash: '#spotify',
  },
  {
    slug: 'chatgpt',
    aliases: ['chatgpt-plus-shared', 'chatgpt-go', 'ai-chatgpt'],
    title: 'ChatGPT Plus (GPT-4o)',
    subtitle: 'Akses penuh OpenAI GPT-4o, DALL-E 3, analisa data & browsing instan.',
    priceText: 'Mulai Rp 20.000 / bln',
    accentColor: '#10a37f',
    logoPath: 'src/assets/AI/chatgpt.svg',
    badges: ['Garansi Replace Penuh', 'Model GPT-4o Terbaru', 'Anti Limit & Cepat'],
    targetHash: '#ai',
  },
  {
    slug: 'claude',
    aliases: ['claude-ai-pro', 'ai-claude'],
    title: 'Claude Pro 3.5 Sonnet',
    subtitle: 'AI coding dan reasoning terunggul di dunia dengan context 200K token.',
    priceText: 'Rp 150.000 / Bulan',
    accentColor: '#d97706',
    logoPath: 'src/assets/AI/claude.svg',
    badges: ['Model 3.5 Sonnet', 'Garansi Penuh 30 Hari', 'Private & Aman'],
    targetHash: '#ai',
  },
  {
    slug: 'gemini',
    aliases: ['gemini-ai-5tb', 'head-gemini-5tb', 'ai-gemini'],
    title: 'Gemini Advanced + 5TB Cloud',
    subtitle: 'Google One AI Premium + Penyimpanan Google Drive super lega 5.000 GB.',
    priceText: 'Mulai Rp 25.000',
    accentColor: '#2563eb',
    logoPath: 'src/assets/AI/gemini.svg',
    badges: ['Cloud Jumbo 5TB', 'Gemini Advanced 2.0', 'Invite Email Sendiri'],
    targetHash: '#ai',
  },
  {
    slug: 'canva',
    aliases: ['canva-pro-member', 'canva-pro-designer', 'canva-head-team', 'edit-canva'],
    title: 'Canva Pro Premium',
    subtitle: 'Bebas pakai 100jt+ elemen grafis premium, hapus background & brand kit.',
    priceText: 'Mulai Rp 5.000',
    accentColor: '#00c4cc',
    logoPath: 'src/assets/edit/canva.svg',
    badges: ['Garansi Sesuai Durasi', 'Email Pribadi Pembeli', 'Unlock Semua Fitur Pro'],
    targetHash: '#edit',
  },
  {
    slug: 'capcut',
    aliases: ['capcut-pro', 'edit-capcut'],
    title: 'CapCut Pro Video Editor',
    subtitle: 'Bikin video viral TikTok & IG Reels dengan efek pro, caption & render 4K.',
    priceText: 'Mulai Rp 15.000',
    accentColor: '#8b5cf6',
    logoPath: 'src/assets/edit/capcut.svg',
    badges: ['Garansi Replace 1x', 'Support PC & HP', 'Cloud Space 100GB'],
    targetHash: '#edit',
  },
  {
    slug: 'google-maps',
    aliases: ['gmaps-rating-bintang', 'gmaps-review-komen', 'rating-google-maps'],
    title: 'Jasa Rating & Review Google Maps',
    subtitle: 'Dongkrak reputasi & peringkat bisnis lokal Anda dengan akun asli berperingkat.',
    priceText: 'Mulai Rp 3.000 / Ulasan',
    accentColor: '#ea4335',
    logoPath: 'src/assets/rating/google-maps.svg',
    badges: ['Akun Real & Lokal', 'Anti Drop & Permanen', 'Garansi Re-review'],
    targetHash: '#rating',
  },
  {
    slug: 'zoom',
    aliases: ['zoom-premium', 'streaming-zoom'],
    title: 'Zoom Premium Pro',
    subtitle: 'Meeting online tanpa batas 40 menit, tampung hingga 300 peserta & recording.',
    priceText: 'Rp 3.000 / 14 Hari',
    accentColor: '#0284c7',
    logoPath: 'src/assets/streaming/zoom.svg',
    badges: ['Garansi 10 Hari', 'Support Android & iOS', 'Akun Private Aman'],
    targetHash: '#streaming',
  },
  {
    slug: 'youtube',
    aliases: ['youtube-premium', 'streaming-youtube'],
    title: 'YouTube Premium & Music',
    subtitle: 'Bebas iklan di Smart TV, HP, & laptop. Termasuk YouTube Music streaming.',
    priceText: 'Mulai Rp 2.500',
    accentColor: '#ef4444',
    logoPath: 'src/assets/streaming/youtube.svg',
    badges: ['Include YT Music', 'Garansi 1x Replace', 'Invite Email Pembeli'],
    targetHash: '#streaming',
  },
  {
    slug: 'vidio',
    aliases: ['vidio-platinum-mobile', 'vidio-platinum-tv', 'streaming-vidio'],
    title: 'Vidio Platinum Mobile & TV',
    subtitle: 'Nonton tayangan olahraga langsung, BRI Liga 1, Premier League & serial favorit.',
    priceText: 'Mulai Rp 20.000',
    accentColor: '#e11d48',
    logoPath: 'src/assets/streaming/vidio.svg',
    badges: ['Support HP, Tab & TV', 'Garansi Backfee Penuh', 'Akun Resmi'],
    targetHash: '#streaming',
  },
  {
    slug: 'software',
    aliases: ['semua-jasa-pull-store', 'jasa-software', 'tugas-akhir', 'skripsi', 'svc-tugas-akhir', 'svc-landing-page', 'svc-apk-kasir', 'svc-custom-web'],
    title: 'Jasa Rekayasa Software & Tugas Akhir',
    subtitle: 'Jasa pembuatan Aplikasi Tugas Akhir Mahasiswa (Start 500Rb), Web Kustom, & Kasir Android.',
    priceText: 'Mulai Rp 500.000',
    accentColor: '#06b6d4',
    logoPath: 'src/assets/logo-syaiful.png',
    badges: ['Full Source Code', 'Bimbingan Sidang & Revisi', 'Engineer: Syaifulloh'],
    targetHash: '#tugas-akhir',
  },
  {
    slug: 'pull-store',
    aliases: ['default', 'home', 'semua-produk-pull-store'],
    title: 'Pull Store by Muhammad Syaifulloh',
    subtitle: 'Pusat Langganan Akun AI Pro & Digital Bergaransi Resmi, serta Konsultasi Software.',
    priceText: 'Mulai Rp 2.500',
    accentColor: '#2563eb',
    logoPath: 'src/assets/logo-syaiful.png',
    badges: ['100% Bergaransi', 'Fast Response WhatsApp', 'Verified Store Resmi'],
    targetHash: '#semua-produk-pull-store',
  }
];

async function generateOGImagesAndPages() {
  console.log(`Starting generation for ${ITEMS.length} items...`);

  for (const item of ITEMS) {
    const ogFileName = `og-${item.slug}.png`;
    const ogOutputPath = path.join(publicOgDir, ogFileName);

    console.log(`Generating OG image for [${item.slug}] -> ${ogFileName}`);

    // Read and resize logo
    const fullLogoPath = path.resolve(item.logoPath);
    let logoBuffer;
    if (item.logoPath.endsWith('.svg')) {
      const svgRaw = fs.readFileSync(fullLogoPath);
      logoBuffer = await sharp(svgRaw)
        .resize(170, 170, { fit: 'inside' })
        .png()
        .toBuffer();
    } else {
      logoBuffer = await sharp(fullLogoPath)
        .resize(170, 170, { fit: 'inside' })
        .png()
        .toBuffer();
    }

    // Build SVG Background
    const svgContent = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#09090b" />
          <stop offset="60%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>
        <radialGradient id="glow" cx="80%" cy="30%" r="55%">
          <stop offset="0%" stop-color="${item.accentColor}" stop-opacity="0.32" />
          <stop offset="100%" stop-color="${item.accentColor}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#27272a" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#18181b" stop-opacity="0.95" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGrad)" />
      <rect width="1200" height="630" fill="url(#glow)" />

      <!-- Top Header Row -->
      <g transform="translate(80, 65)">
        <rect x="0" y="0" width="160" height="34" rx="17" fill="#18181b" stroke="#3f3f46" stroke-width="1"/>
        <text x="20" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#10b981">● RESMI &amp; GARANSI</text>
        <text x="180" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#a1a1aa" letter-spacing="1">PULL STORE • BY MUHAMMAD SYAIFULLOH</text>
      </g>

      <!-- Main Title -->
      <text x="80" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-1">
        ${escapeXml(item.title)}
      </text>
      
      <!-- Subtitle -->
      <text x="80" y="258" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#a1a1aa">
        ${escapeXml(item.subtitle)}
      </text>

      <!-- Price Pill -->
      <g transform="translate(80, 305)">
        <rect x="0" y="0" width="300" height="60" rx="16" fill="${item.accentColor}" />
        <text x="24" y="39" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#ffffff">
          ${escapeXml(item.priceText)}
        </text>
      </g>

      <!-- Badges -->
      <g transform="translate(80, 425)">
        <rect x="0" y="0" width="180" height="42" rx="10" fill="#18181b" stroke="#27272a"/>
        <text x="18" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#34d399">
          ✓ ${escapeXml(item.badges[0])}
        </text>

        <rect x="195" y="0" width="180" height="42" rx="10" fill="#18181b" stroke="#27272a"/>
        <text x="213" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#60a5fa">
          ✓ ${escapeXml(item.badges[1])}
        </text>

        <rect x="390" y="0" width="200" height="42" rx="10" fill="#18181b" stroke="#27272a"/>
        <text x="408" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#fbbf24">
          ✓ ${escapeXml(item.badges[2])}
        </text>
      </g>

      <!-- Footer Info -->
      <g transform="translate(80, 560)">
        <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" fill="#71717a">
          Order Instan WhatsApp: +62 856-9367-2730 • msyaifulloh.my.id
        </text>
      </g>

      <!-- Right Logo Container Box -->
      <g transform="translate(860, 160)">
        <rect x="0" y="0" width="260" height="260" rx="36" fill="url(#cardGrad)" stroke="#3f3f46" stroke-width="2" />
      </g>
    </svg>
    `;

    const bgBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

    await sharp(bgBuffer)
      .composite([
        {
          input: logoBuffer,
          top: 205,
          left: 905
        }
      ])
      .png()
      .toFile(ogOutputPath);

    // Now generate HTML redirect pages with specific Open Graph tags
    const allSlugs = [item.slug, ...(item.aliases || [])];
    for (const s of allSlugs) {
      const htmlPath = path.join(publicPDir, `${s}.html`);
      const ogImageUrl = `/og/${ogFileName}`;

      const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(item.title)} — Pull Store</title>
  <meta name="description" content="${escapeXml(item.subtitle)} Harga: ${escapeXml(item.priceText)}. Bergaransi resmi di Pull Store by Muhammad Syaifulloh.">

  <!-- Open Graph / Facebook / WhatsApp / Instagram -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeXml(item.title)} — Pull Store">
  <meta property="og:description" content="${escapeXml(item.subtitle)} ${escapeXml(item.priceText)}. 100% Bergaransi Resmi.">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeXml(item.title)} — Pull Store">
  <meta name="twitter:description" content="${escapeXml(item.subtitle)} ${escapeXml(item.priceText)}. 100% Bergaransi Resmi.">
  <meta name="twitter:image" content="${ogImageUrl}">

  <!-- Instant Browser Redirect -->
  <meta http-equiv="refresh" content="0; url=/${item.targetHash}">
  <script>
    window.location.replace('/${item.targetHash}');
  </script>
</head>
<body style="font-family: system-ui, sans-serif; background: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
  <div>
    <h2>Membuka ${escapeXml(item.title)} di Pull Store...</h2>
    <p style="color: #a1a1aa;">Jika halaman tidak berpindah otomatis, <a href="/${item.targetHash}" style="color: #3b82f6;">klik di sini</a>.</p>
  </div>
</body>
</html>`;

      fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    }
  }

  // Also copy default og to public/og/og-main.png for root index.html
  fs.copyFileSync(path.join(publicOgDir, 'og-pull-store.png'), path.join(publicOgDir, 'og-main.png'));

  console.log('Finished generating all OG images and HTML redirect pages!');
}

generateOGImagesAndPages().catch(console.error);
