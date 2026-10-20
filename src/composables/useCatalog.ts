import { ref, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { PRODUCTS as initialProducts, SERVICES as initialServices } from '../data/catalog'
import type { ProductItem, ServiceItem } from '../types'
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

// Resolve official SVG logo for brands based on product ID, name, or category
export const resolveBrandLogo = (id = '', name = '', category = ''): string => {
  const normId = (id || '').toLowerCase()
  const normName = (name || '').toLowerCase()
  const normCat = (category || '').toLowerCase()

  if (normId.includes('netflix') || normName.includes('netflix')) return netflixSvg
  if (normId.includes('spotify') || normName.includes('spotify')) return spotifySvg
  if (normId.includes('chatgpt') || normName.includes('chatgpt') || normId.includes('gpt')) return chatgptSvg
  if (normId.includes('claude') || normName.includes('claude')) return claudeSvg
  if (normId.includes('gemini') || normName.includes('gemini')) return geminiSvg
  if (normId.includes('canva') || normName.includes('canva')) return canvaSvg
  if (normId.includes('capcut') || normName.includes('capcut')) return capcutSvg
  if (normId.includes('youtube') || normName.includes('youtube') || normId.includes('yt')) return youtubeSvg
  if (normId.includes('vidio') || normName.includes('vidio')) return vidioSvg
  if (normId.includes('zoom') || normName.includes('zoom')) return zoomSvg
  if (normId.includes('gmaps') || normId.includes('maps') || normCat === 'rating' || normName.includes('rating') || normName.includes('maps')) return googleMapsSvg

  return ''
}

// Module-level shared singleton cache (instant zero-delay memory cache)
const products = ref<ProductItem[]>([...initialProducts])
const services = ref<ServiceItem[]>([...initialServices])
const isLoading = ref(false)
const isInitialLoading = ref(!isSupabaseConfigured ? false : true)
const isUsingRemote = ref(false)
const error = ref<string | null>(null)
let hasFetchedOnce = false

// Map database row snake_case ke ProductItem camelCase
const mapProductRow = (row: any): ProductItem => {
  const local = initialProducts.find(p => p.id === row.id)
  const brandLogo = resolveBrandLogo(row.id, row.name, row.category)
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    accountType: row.account_type,
    duration: row.duration,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    stockStatus: row.stock_status || 'ready',
    stockCount: row.stock_count !== undefined ? Number(row.stock_count) : undefined,
    badge: row.badge || undefined,
    popular: Boolean(row.popular),
    logo: row.logo_url || brandLogo || local?.logo || '',
    iconName: row.icon_name || local?.iconName || 'Sparkles',
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : (local?.features || []),
    variants: Array.isArray(row.variants) ? row.variants : (local?.variants || []),
    garansi: row.garansi || local?.garansi || '',
    notes: row.notes || local?.notes || ''
  }
}

// Map database row snake_case ke ServiceItem camelCase
const mapServiceRow = (row: any): ServiceItem => {
  const local = initialServices.find(s => s.id === row.id)
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    startingPrice: Number(row.starting_price),
    priceDisplay: row.price_display || undefined,
    timeline: row.timeline,
    tagline: row.tagline || '',
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : (local?.deliverables || []),
    advantages: Array.isArray(row.advantages) ? row.advantages : (local?.advantages || []),
    maintenanceWarranty: row.maintenance_warranty || local?.maintenanceWarranty || undefined,
    badge: row.badge || undefined,
    iconName: row.icon_name || local?.iconName || 'Wrench',
    recommended: Boolean(row.recommended),
    suitableFor: row.suitable_for || local?.suitableFor || ''
  }
}

const fetchCatalog = async (forceSpinner = false) => {
  if (!isSupabaseConfigured || !supabase) {
    isInitialLoading.value = false
    return
  }

  try {
    isLoading.value = true
    if (forceSpinner || !hasFetchedOnce) {
      isInitialLoading.value = true
    }
    error.value = null

    const [productsRes, servicesRes] = await Promise.all([
      supabase.from('products').select('*').order('name', { ascending: true }),
      supabase.from('services').select('*').order('starting_price', { ascending: true })
    ])

    if (!productsRes.error && productsRes.data && productsRes.data.length > 0) {
      products.value = productsRes.data.map(mapProductRow)
      isUsingRemote.value = true
    }

    if (!servicesRes.error && servicesRes.data && servicesRes.data.length > 0) {
      services.value = servicesRes.data.map(mapServiceRow)
      isUsingRemote.value = true
    }

    hasFetchedOnce = true
  } catch (err: any) {
    console.warn('Gagal memuat katalog dari Supabase, beralih ke data lokal:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
    isInitialLoading.value = false
  }
}

export function useCatalog() {
  onMounted(() => {
    if (!hasFetchedOnce) {
      fetchCatalog()
    }
  })

  return {
    products,
    services,
    isLoading,
    isInitialLoading,
    isUsingRemote,
    error,
    refetch: () => fetchCatalog(true)
  }
}
