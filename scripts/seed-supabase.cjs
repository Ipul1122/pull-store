const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Baca .env secara manual tanpa butuh package dotenv
const envPath = path.join(__dirname, '../.env')
let supabaseUrl = 'https://djqqfgumujtkpaqggqza.supabase.co'
let supabaseKey = 'sb_publishable_QfPUNg7oBEpQEuRkF_5zaQ_WR51dpVC'

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [k, v] = line.split('=')
    if (k && v) {
      if (k.trim() === 'VITE_SUPABASE_URL') supabaseUrl = v.trim()
      if (k.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseKey = v.trim()
    }
  })
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log(`Menghubungkan ke Supabase: ${supabaseUrl}`)
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1)
    if (error) {
      console.log('Tabel products belum ada di Supabase. Keterangan:', error.message)
      console.log('\n--> Buka menu "SQL Editor" di Dashboard Supabase dan jalankan isi scripts/supabase-schema.sql')
    } else {
      console.log('Koneksi berhasil! Baris terdeteksi:', data ? data.length : 0)
    }
  } catch (err) {
    console.error('Error koneksi:', err.message)
  }
}

testConnection()
