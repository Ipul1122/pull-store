const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://djqqfgumujtkpaqggqza.supabase.co'
const supabaseKey = 'sb_publishable_QfPUNg7oBEpQEuRkF_5zaQ_WR51dpVC'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('1. Memeriksa produk category=rating di Supabase...')
  const { data: existing, error: fetchErr } = await supabase
    .from('products')
    .select('id, name, category')
    .eq('category', 'rating')
  
  if (fetchErr) {
    console.error('Error fetch:', fetchErr)
    return
  }
  console.log('Ditemukan produk rating saat ini:', existing)

  // Hapus produk lama jika ada gmaps-rating-review
  const deleteOld = existing.filter(p => p.id === 'gmaps-rating-review')
  for (const p of deleteOld) {
    console.log(`Menghapus produk lama yang salah id: ${p.id}...`)
    const { error: delErr } = await supabase.from('products').delete().eq('id', p.id)
    if (delErr) console.error('Gagal hapus:', delErr.message)
    else console.log(`Berhasil hapus ${p.id}`)
  }

  // Masukkan 2 produk resmi Google Maps: Bintang Only dan Bintang + Komen
  const gmapsProducts = [
    {
      id: 'gmaps-rating-bintang',
      name: 'Rating Google Maps (Bintang Only)',
      category: 'rating',
      category_label: 'Jasa Rating Maps • Bintang Only',
      account_type: 'Rp 3.000 / Akun',
      duration: '1 Akun',
      price: 30000,
      original_price: 60000,
      stock_status: 'ready',
      stock_count: 100,
      badge: '3.000 / Akun',
      popular: false,
      icon_name: 'Star',
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
        { id: 'gmaps-star-1', duration: '1 Akun', price: 3000, originalPrice: 6000, garansi: 'Garansi Refill 30 Hari' },
        { id: 'gmaps-star-5', duration: '5 Akun', price: 15000, originalPrice: 30000, garansi: 'Garansi Refill 30 Hari' },
        { id: 'gmaps-star-10', duration: '10 Akun', price: 30000, originalPrice: 60000, garansi: 'Garansi Refill 30 Hari', popular: true },
        { id: 'gmaps-star-25', duration: '25 Akun', price: 75000, originalPrice: 150000, garansi: 'Garansi Refill 30 Hari' },
        { id: 'gmaps-star-50', duration: '50 Akun', price: 150000, originalPrice: 300000, garansi: 'Garansi Refill 30 Hari' },
        { id: 'gmaps-star-100', duration: '100 Akun', price: 300000, originalPrice: 600000, garansi: 'Garansi Refill 30 Hari' }
      ],
      garansi: 'Garansi Refill 30 Hari',
      notes: 'Bintang only tanpa komen Rp 3.000/akun • Bebas pilih jumlah akun yang diinginkan'
    },
    {
      id: 'gmaps-review-komen',
      name: 'Rating & Review Maps (Bintang + Komen)',
      category: 'rating',
      category_label: 'Jasa Review Maps • Bintang + Komen',
      account_type: 'Rp 5.000 / Akun',
      duration: '1 Akun',
      price: 50000,
      original_price: 100000,
      stock_status: 'ready',
      stock_count: 100,
      badge: 'Rekomendasi UMKM',
      popular: true,
      icon_name: 'Star',
      description: 'Jasa rating bintang 5 lengkap dengan kalimat komentar ulasan positif. Bebas request isi review & lampiran foto. Tingkatkan kepercayaan & SEO lokal.',
      features: [
        'Rating Bintang 5 + Kalimat Komentar Ulasan',
        'Bebas request teks review & lampiran foto lokasi',
        'Akun Google riil, aktif & berfoto profil lokal',
        'Meningkatkan peringkat ranking SEO lokal Google Maps',
        'Garansi refill & replace review jika terhapus filter'
      ],
      variants: [
        { id: 'gmaps-rev-1', duration: '1 Akun', price: 5000, originalPrice: 10000, garansi: 'Garansi Review Menempel' },
        { id: 'gmaps-rev-5', duration: '5 Akun', price: 25000, originalPrice: 50000, garansi: 'Garansi Review Menempel' },
        { id: 'gmaps-rev-10', duration: '10 Akun', price: 50000, originalPrice: 100000, garansi: 'Garansi Review Menempel', popular: true },
        { id: 'gmaps-rev-20', duration: '20 Akun', price: 100000, originalPrice: 200000, garansi: 'Garansi Review Menempel' },
        { id: 'gmaps-rev-50', duration: '50 Akun', price: 250000, originalPrice: 500000, garansi: 'Garansi Review Menempel' },
        { id: 'gmaps-rev-100', duration: '100 Akun', price: 500000, originalPrice: 1000000, garansi: 'Garansi Review Menempel' }
      ],
      garansi: 'Garansi Review Menempel Permanen',
      notes: 'Bebas request kalimat ulasan & foto toko • Pengerjaan bertahap 1-3 hari'
    }
  ]

  console.log('2. Mengupsert 2 produk Google Maps ke Supabase...')
  const { data: upsertData, error: upsertErr } = await supabase
    .from('products')
    .upsert(gmapsProducts, { onConflict: 'id' })

  if (upsertErr) {
    console.error('Gagal upsert:', upsertErr.message)
  } else {
    console.log('SUKSES! 2 produk Google Maps (Bintang Only & Bintang + Komen) berhasil dimasukkan ke Supabase!')
  }
}

run()
