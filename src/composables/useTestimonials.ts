import { ref, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { INITIAL_TESTIMONIALS, type TestimonialItem } from '../data/testimonials'

const testimonials = ref<TestimonialItem[]>([...INITIAL_TESTIMONIALS])
const isLoading = ref(false)
const isUsingRemote = ref(false)
const error = ref<string | null>(null)
let hasFetchedOnce = false

const mapRow = (row: any): TestimonialItem => ({
  id: row.id,
  created_at: row.created_at,
  clientName: row.client_name,
  orderName: row.order_name,
  orderDate: row.order_date,
  price: Number(row.price),
  priceDisplay: row.price_display || undefined,
  warranty: row.warranty,
  notes: row.notes,
  imageUrl: row.image_url || undefined,
  rating: row.rating ? Number(row.rating) : 5,
  verified: row.verified !== undefined ? Boolean(row.verified) : true
})

const fetchTestimonials = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return
  }

  try {
    isLoading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      if (err.code === '42P01' || err.message?.includes('not found') || err.message?.includes('does not exist')) {
        console.info('[useTestimonials] Tabel "testimonials" belum ada di Supabase. Menampilkan data lokal (Jalankan scripts/create-testimonials-table.sql di SQL Editor Supabase untuk mengaktifkannya).')
      } else {
        console.warn('[useTestimonials] Gagal membaca data dari Supabase:', err.message)
      }
      return
    }

    if (data) {
      testimonials.value = data.map(mapRow)
      isUsingRemote.value = true
    }
    hasFetchedOnce = true
  } catch (err: any) {
    console.warn('[useTestimonials] Fallback ke data lokal:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

export function useTestimonials() {
  onMounted(() => {
    if (!hasFetchedOnce) {
      fetchTestimonials()
    }
  })

  return {
    testimonials,
    isLoading,
    isUsingRemote,
    error,
    refetch: fetchTestimonials
  }
}
