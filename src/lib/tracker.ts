import { supabase, isSupabaseConfigured } from './supabase'

export interface VisitorLog {
  id?: string
  created_at?: string
  page_url: string
  referrer: string
  device: string
  browser: string
  os: string
  city?: string
  region?: string
  country?: string
  isp?: string
  ip?: string
}

// Helper untuk deteksi device, OS, browser
function parseClientInfo() {
  const ua = navigator.userAgent
  let device = 'Desktop'
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'Tablet'
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua)) {
    device = 'Mobile'
  }

  let os = 'Unknown OS'
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Linux/i.test(ua)) os = 'Linux'

  let browser = 'Unknown Browser'
  if (/Chrome|CriOS/i.test(ua) && !/Edge|OPR|Edg/i.test(ua)) browser = 'Chrome'
  else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) browser = 'Safari'
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox'
  else if (/Edg/i.test(ua)) browser = 'Edge'
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera'

  // Bersihkan referrer
  let referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct / Langsung'
  if (referrer.includes('instagram.com') || referrer.includes('l.instagram.com')) referrer = 'Instagram'
  else if (referrer.includes('tiktok.com')) referrer = 'TikTok'
  else if (referrer.includes('facebook.com') || referrer.includes('fb.com')) referrer = 'Facebook'
  else if (referrer.includes('google.com')) referrer = 'Google Search'
  else if (referrer.includes('whatsapp.com')) referrer = 'WhatsApp'

  return { device, os, browser, referrer }
}

export async function trackVisitor() {
  if (!isSupabaseConfigured || !supabase) return

  // Jangan track kunjungan di halaman admin
  if (window.location.pathname.startsWith('/admin')) return

  // Throttle per sesi: Hindari spam jika user hanya refresh halaman yang sama
  const sessionKey = 'pull_store_last_track'
  const lastTrack = sessionStorage.getItem(sessionKey)
  const now = Date.now()
  if (lastTrack && now - Number(lastTrack) < 15 * 60 * 1000) {
    // Sudah dicatat dalam 15 menit terakhir di sesi ini
    return
  }

  const client = parseClientInfo()

  let geoData: { city?: string; region?: string; country?: string; isp?: string; ip?: string } = {}

  try {
    // Ambil info lokasi kota dari API gratis dengan timeout 2 detik (supaya tidak menghambat web)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)
    
    const res = await fetch('https://ipwho.is/', { signal: controller.signal })
    clearTimeout(timeoutId)
    if (res.ok) {
      const data = await res.json()
      if (data && data.success !== false) {
        geoData = {
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country || 'Indonesia',
          isp: data.connection?.isp || data.isp || '',
          ip: data.ip ? data.ip.replace(/\.\d+$/, '.xxx') : '' // sensor angka terakhir untuk privasi
        }
      }
    }
  } catch {
    // Abaikan jika IP lookup gagal/timeout, tetap catat device info
  }

  const logPayload: VisitorLog = {
    page_url: window.location.pathname + window.location.hash,
    referrer: client.referrer,
    device: client.device,
    browser: client.browser,
    os: client.os,
    city: geoData.city || 'Indonesia',
    region: geoData.region || '',
    country: geoData.country || 'Indonesia',
    isp: geoData.isp || '',
    ip: geoData.ip || ''
  }

  try {
    await supabase.from('visitors').insert([logPayload])
    sessionStorage.setItem(sessionKey, String(now))
  } catch (err) {
    console.debug('Visitor track error:', err)
  }
}
