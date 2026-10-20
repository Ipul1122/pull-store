<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { ProductItem, ServiceItem } from '../types'
import { useCatalog } from '../composables/useCatalog'
import ProductCard from './ProductCard.vue'
import ServiceCard from './ServiceCard.vue'
import ProductCardSkeleton from './skeletons/ProductCardSkeleton.vue'
import ServiceCardSkeleton from './skeletons/ServiceCardSkeleton.vue'
import { Sparkles, Code2 } from 'lucide-vue-next'

const props = defineProps<{
  activeMainTab?: 'digital' | 'services'
}>()

const emit = defineEmits<{
  (e: 'select-product', product: ProductItem): void
  (e: 'select-service', service: ServiceItem): void
}>()

// Active Main Tab: 'digital' or 'services'
const currentTab = ref<'digital' | 'services'>(props.activeMainTab || 'digital')

// Watch prop if changed from external (e.g., hero button click)
watch(() => props.activeMainTab, (newVal) => {
  if (newVal) {
    currentTab.value = newVal
  }
})

// Dynamic Catalog from Supabase (with fallback to local catalog)
const { products, services, isInitialLoading } = useCatalog()

// Sub-filters
const digitalFilter = ref<'all' | 'ai' | 'edit' | 'rating' | 'streaming'>('all')
const serviceFilter = ref<'all' | 'tugas-akhir' | 'apk-offline' | 'landing-page' | 'web-dinamis' | 'custom-web'>('all')

// Category Counts
const productCounts = computed(() => {
  return {
    all: products.value.length,
    ai: products.value.filter(p => p.category === 'ai').length,
    edit: products.value.filter(p => p.category === 'edit').length,
    rating: products.value.filter(p => p.category === 'rating').length,
    streaming: products.value.filter(p => p.category === 'streaming').length,
  }
})

const serviceCounts = computed(() => {
  return {
    all: services.value.length,
    'tugas-akhir': services.value.filter(s => s.category === 'tugas-akhir').length,
    'apk-offline': services.value.filter(s => s.category === 'apk-offline').length,
    'landing-page': services.value.filter(s => s.category === 'landing-page').length,
    'web-dinamis': services.value.filter(s => s.category === 'web-dinamis').length,
    'custom-web': services.value.filter(s => s.category === 'custom-web').length,
  }
})

// Filtered Products (Clean list without infinite duplicates)
const filteredProducts = computed(() => {
  if (digitalFilter.value === 'all') return products.value
  return products.value.filter(item => item.category === digitalFilter.value)
})

// Filtered Services (Clean list without infinite duplicates)
const filteredServices = computed(() => {
  if (serviceFilter.value === 'all') return services.value
  return services.value.filter(item => item.category === serviceFilter.value)
})

// Target card locking for direct links
const activeTargetCardId = ref<string | null>(null)
const activeTargetServiceId = ref<string | null>(null)

// Smooth scroll & highlight targeted product card
const scrollToProductCard = (productId: string) => {
  activeTargetCardId.value = productId

  // Strip query parameters (?product=...) from address bar so state remains clean
  if (window.location.search) {
    history.replaceState(null, '', window.location.pathname + `#${productId}`)
  }

  nextTick(() => {
    setTimeout(() => {
      const cardEl = document.getElementById('product-' + productId)
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        cardEl.classList.add('ring-4', 'ring-blue-500', 'shadow-2xl', 'scale-[1.02]', 'transition-all', 'duration-300')
        setTimeout(() => {
          cardEl.classList.remove('ring-4', 'ring-blue-500', 'shadow-2xl', 'scale-[1.02]')
        }, 4000)
      } else {
        document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 200)
  })
}

// Smooth scroll & highlight targeted service card
const scrollToServiceCard = (serviceId: string) => {
  activeTargetServiceId.value = serviceId

  if (window.location.search) {
    history.replaceState(null, '', window.location.pathname + `#${serviceId}`)
  }

  nextTick(() => {
    setTimeout(() => {
      const cardEl = document.getElementById('service-' + serviceId)
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        cardEl.classList.add('ring-4', 'ring-blue-500', 'shadow-2xl', 'scale-[1.02]', 'transition-all', 'duration-300')
        setTimeout(() => {
          cardEl.classList.remove('ring-4', 'ring-blue-500', 'shadow-2xl', 'scale-[1.02]')
        }, 4000)
      } else {
        document.getElementById('semua-jasa-pull-store')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 200)
  })
}

// Set digital filter and update URL
const setDigitalFilter = (filter: 'all' | 'ai' | 'edit' | 'rating' | 'streaming') => {
  activeTargetCardId.value = null
  digitalFilter.value = filter
  const targetHash = filter === 'all' ? '#semua-produk-pull-store' : `#${filter}`
  history.replaceState(null, '', window.location.pathname + targetHash)
}

// Service Filter URL Mapping & Setter
const serviceHashMap: Record<'all' | 'tugas-akhir' | 'apk-offline' | 'landing-page' | 'web-dinamis' | 'custom-web', string> = {
  'all': '#semua-jasa-pull-store',
  'tugas-akhir': '#tugas-akhir',
  'apk-offline': '#aplikasi-kasir',
  'landing-page': '#website-statis',
  'web-dinamis': '#website-dinamis',
  'custom-web': '#sistem-kustom'
}

const setServiceFilter = (filter: 'all' | 'tugas-akhir' | 'landing-page' | 'web-dinamis' | 'apk-offline' | 'custom-web') => {
  activeTargetServiceId.value = null
  serviceFilter.value = filter
  const targetHash = serviceHashMap[filter] || '#semua-jasa-pull-store'
  history.replaceState(null, '', window.location.pathname + targetHash)
}

// Switch between Digital Products & Website / App
const setMainTab = (tab: 'digital' | 'services') => {
  currentTab.value = tab
  activeTargetCardId.value = null
  activeTargetServiceId.value = null
  if (tab === 'digital') {
    const targetHash = digitalFilter.value === 'all' ? '#semua-produk-pull-store' : `#${digitalFilter.value}`
    history.replaceState(null, '', window.location.pathname + targetHash)
  } else {
    const targetHash = serviceHashMap[serviceFilter.value] || '#semua-jasa-pull-store'
    history.replaceState(null, '', window.location.pathname + targetHash)
  }
}

// Universal product finder supporting exact IDs, shortcuts, and fuzzy names
const findProductByShortcutOrId = (token: string): ProductItem | undefined => {
  if (!token) return undefined
  const clean = token.toLowerCase().replace(/^(product-|#)/, '').replace(/\.html$/, '').trim()

  // 1. Exact ID
  let found = products.value.find((p: ProductItem) => p.id.toLowerCase() === clean)
  if (found) return found

  // 2. Keyword mapping
  const keywordMap: Record<string, string> = {
    'netflix': 'netflix',
    'spotify': 'spotify',
    'chatgpt': 'chatgpt',
    'claude': 'claude',
    'gemini': 'gemini',
    'canva': 'canva',
    'capcut': 'capcut',
    'google-maps': 'gmaps',
    'maps': 'gmaps',
    'rating': 'gmaps',
    'zoom': 'zoom',
    'youtube': 'youtube',
    'vidio': 'vidio'
  }
  const kw = keywordMap[clean] || clean

  // 3. Substring match
  found = products.value.find((p: ProductItem) => {
    return p.id.toLowerCase().includes(kw) || p.name.toLowerCase().includes(kw)
  })
  return found
}

// Universal service finder
const findServiceByShortcutOrId = (token: string): ServiceItem | undefined => {
  if (!token) return undefined
  const clean = token.toLowerCase().replace(/^(service-|#)/, '').replace(/\.html$/, '').trim()

  let found = services.value.find((s: ServiceItem) => s.id.toLowerCase() === clean)
  if (found) return found

  const serviceKeywords: Record<string, string> = {
    'tugas-akhir': 'tugas-akhir',
    'skripsi': 'tugas-akhir',
    'ta': 'tugas-akhir',
    'mahasiswa': 'tugas-akhir',
    'software': 'tugas-akhir',
    'apk-kasir': 'apk-kasir',
    'kasir': 'apk-kasir',
    'kasir-offline': 'apk-kasir',
    'apk-offline': 'apk-kasir',
    'landing-page': 'website-statis',
    'statis': 'website-statis',
    'website-statis': 'website-statis',
    'web-dinamis': 'website-dinamis',
    'dinamis': 'website-dinamis',
    'cms': 'website-dinamis',
    'custom': 'custom-web',
    'custom-web': 'custom-web',
    'sistem-kustom': 'custom-web'
  }
  const kw = serviceKeywords[clean] || clean

  found = services.value.find((s: ServiceItem) => {
    return s.id.toLowerCase().includes(kw) || s.name.toLowerCase().includes(kw)
  })
  return found
}

// Handle Direct URL hash, query parameters, and /p/:slug paths
const handleUrlHashOrQuery = () => {
  const hash = window.location.hash.toLowerCase()
  const rawHash = hash.replace(/^#/, '').trim()
  const searchParams = new URLSearchParams(window.location.search)
  const catParam = (searchParams.get('category') || searchParams.get('cat') || '').toLowerCase().trim()
  const prodParam = (searchParams.get('product') || searchParams.get('p') || '').toLowerCase().trim()
  const serviceParam = (searchParams.get('service') || searchParams.get('s') || '').toLowerCase().trim()

  const pathname = window.location.pathname.toLowerCase()
  let pathSlug = ''
  if (pathname.includes('/p/')) {
    pathSlug = pathname.split('/p/')[1]?.replace(/\.html$/, '')?.trim() || ''
  }

  const KNOWN_CATEGORY_HASHES = new Set([
    'semua-produk-pull-store', 'semua', 'katalog-produk', 'all',
    'ai', 'edit', 'rating', 'streaming',
    'semua-jasa-pull-store', 'semua-jasa', 'jasa-software', 'jasa', 'software',
    'tugas-akhir', 'skripsi', 'ta', 'mahasiswa',
    'aplikasi-kasir', 'kasir', 'apk-offline', 'kasir-offline',
    'website-statis', 'web-statis', 'landing-page',
    'website-dinamis', 'web-dinamis', 'cms',
    'sistem-kustom', 'custom-web', 'sistem'
  ])

  // If user clicked/navigated to a category hash directly
  if (KNOWN_CATEGORY_HASHES.has(rawHash)) {
    activeTargetCardId.value = null
    activeTargetServiceId.value = null

    if (window.location.search) {
      history.replaceState(null, '', window.location.pathname + hash)
    }

    if (['streaming'].includes(rawHash)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'streaming'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['rating'].includes(rawHash)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'rating'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['edit'].includes(rawHash)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'edit'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['ai'].includes(rawHash)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'ai'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['semua-produk-pull-store', 'semua', 'katalog-produk', 'all'].includes(rawHash)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'all'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }

    if (['tugas-akhir', 'skripsi', 'ta', 'mahasiswa'].includes(rawHash)) {
      currentTab.value = 'services'
      serviceFilter.value = 'tugas-akhir'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['aplikasi-kasir', 'kasir', 'apk-offline', 'kasir-offline'].includes(rawHash)) {
      currentTab.value = 'services'
      serviceFilter.value = 'apk-offline'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['website-statis', 'web-statis', 'landing-page'].includes(rawHash)) {
      currentTab.value = 'services'
      serviceFilter.value = 'landing-page'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['website-dinamis', 'web-dinamis', 'cms'].includes(rawHash)) {
      currentTab.value = 'services'
      serviceFilter.value = 'web-dinamis'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['sistem-kustom', 'custom-web', 'sistem'].includes(rawHash)) {
      currentTab.value = 'services'
      serviceFilter.value = 'custom-web'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['semua-jasa-pull-store', 'semua-jasa', 'jasa-software', 'jasa', 'software'].includes(rawHash)) {
      currentTab.value = 'services'
      serviceFilter.value = 'all'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
  }

  // Priority 1: Check if target is a Product
  const productCandidate = prodParam || (hash.startsWith('#product-') ? rawHash : (pathSlug || rawHash))
  if (productCandidate && !KNOWN_CATEGORY_HASHES.has(productCandidate)) {
    const targetProd = findProductByShortcutOrId(productCandidate)
    if (targetProd) {
      currentTab.value = 'digital'
      digitalFilter.value = targetProd.category
      scrollToProductCard(targetProd.id)
      return
    }
  }

  // Priority 2: Check if target is a Service
  const serviceCandidate = serviceParam || (hash.startsWith('#service-') ? rawHash : (pathSlug || rawHash))
  if (serviceCandidate && !KNOWN_CATEGORY_HASHES.has(serviceCandidate)) {
    const targetSvc = findServiceByShortcutOrId(serviceCandidate)
    if (targetSvc) {
      currentTab.value = 'services'
      serviceFilter.value = targetSvc.category
      scrollToServiceCard(targetSvc.id)
      return
    }
  }

  // Priority 3: Fallback query param categories
  if (catParam) {
    activeTargetCardId.value = null
    activeTargetServiceId.value = null
    if (['tugas-akhir', 'skripsi'].includes(catParam)) {
      currentTab.value = 'services'
      serviceFilter.value = 'tugas-akhir'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['aplikasi-kasir', 'apk-offline'].includes(catParam)) {
      currentTab.value = 'services'
      serviceFilter.value = 'apk-offline'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['website-statis', 'landing-page'].includes(catParam)) {
      currentTab.value = 'services'
      serviceFilter.value = 'landing-page'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['website-dinamis', 'web-dinamis'].includes(catParam)) {
      currentTab.value = 'services'
      serviceFilter.value = 'web-dinamis'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['sistem-kustom', 'custom-web'].includes(catParam)) {
      currentTab.value = 'services'
      serviceFilter.value = 'custom-web'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['semua-jasa-pull-store', 'services'].includes(catParam)) {
      currentTab.value = 'services'
      serviceFilter.value = 'all'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['ai'].includes(catParam)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'ai'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['edit'].includes(catParam)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'edit'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['rating'].includes(catParam)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'rating'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
    if (['streaming'].includes(catParam)) {
      currentTab.value = 'digital'
      digitalFilter.value = 'streaming'
      nextTick(() => { document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' }) })
      return
    }
  }
}

// Watch live products/services changes from Supabase
watch(() => products.value, () => {
  nextTick(() => {
    if (activeTargetCardId.value) {
      scrollToProductCard(activeTargetCardId.value)
    } else {
      handleUrlHashOrQuery()
    }
  })
})

watch(() => services.value, () => {
  nextTick(() => {
    if (activeTargetServiceId.value) {
      scrollToServiceCard(activeTargetServiceId.value)
    } else {
      handleUrlHashOrQuery()
    }
  })
})

onMounted(() => {
  handleUrlHashOrQuery()
  window.addEventListener('hashchange', handleUrlHashOrQuery)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleUrlHashOrQuery)
})
</script>

<template>
  <section id="katalog-section" class="py-16 md:py-24 bg-zinc-50 border-b border-zinc-200 relative">
    <div id="semua-produk-pull-store" class="scroll-mt-24"></div>
    <div id="semua-jasa-pull-store" class="scroll-mt-24"></div>
    <div id="tugas-akhir" class="scroll-mt-24"></div>
    <div id="aplikasi-kasir" class="scroll-mt-24"></div>
    <div id="website-statis" class="scroll-mt-24"></div>
    <div id="website-dinamis" class="scroll-mt-24"></div>
    <div id="sistem-kustom" class="scroll-mt-24"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header (Clean & Minimalist) -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
          Pilih Kebutuhan Digital Anda
        </h2>
        <p class="mt-2 text-sm text-zinc-600">
          Transparan, tanpa biaya tersembunyi, langsung terhubung ke WhatsApp resmi untuk checkout & konsultasi.
        </p>
      </div>

      <!-- Main Tab Switcher: Produk Digital vs Website / App -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex p-1 rounded-xl bg-zinc-200/80 border border-zinc-200 shadow-inner">
          <button
            type="button"
            @click="setMainTab('digital')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none"
            :class="currentTab === 'digital'
              ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-950'"
          >
            <Sparkles class="w-4 h-4 text-blue-600" :stroke-width="2" />
            <span>Produk Digital</span>
            <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 text-zinc-700 font-bold">
              {{ products.length }}
            </span>
          </button>

          <button
            type="button"
            @click="setMainTab('services')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none"
            :class="currentTab === 'services'
              ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-950'"
          >
            <Code2 class="w-4 h-4 text-blue-600" :stroke-width="2" />
            <span>Website / App</span>
            <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 text-zinc-700 font-bold">
              {{ services.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Sub-category Filter Pills (Clean, Centered, No AI Slop Banners) -->
      <div class="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        
        <!-- Digital Product Categories -->
        <template v-if="currentTab === 'digital'">
          <button
            type="button"
            @click="setDigitalFilter('all')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="digitalFilter === 'all' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Semua</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'all' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.all }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('ai')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="digitalFilter === 'ai' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>AI</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'ai' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.ai }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('edit')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="digitalFilter === 'edit' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Desain & Edit</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'edit' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.edit }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('rating')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="digitalFilter === 'rating' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Jasa Rating Maps</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'rating' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.rating }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('streaming')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="digitalFilter === 'streaming' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Streaming & Meeting</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'streaming' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.streaming }}
            </span>
          </button>
        </template>

        <!-- Service / App Categories -->
        <template v-else>
          <button
            type="button"
            @click="setServiceFilter('all')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="serviceFilter === 'all' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Semua Solusi</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="serviceFilter === 'all' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ serviceCounts.all }}
            </span>
          </button>

          <button
            type="button"
            @click="setServiceFilter('tugas-akhir')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="serviceFilter === 'tugas-akhir' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Tugas Akhir / Skripsi (Start 500Rb)</span>
            <span class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="serviceFilter === 'tugas-akhir' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ serviceCounts['tugas-akhir'] }}
            </span>
          </button>

          <button
            type="button"
            @click="setServiceFilter('apk-offline')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="serviceFilter === 'apk-offline' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Aplikasi Kasir (Start 700Rb)</span>
          </button>

          <button
            type="button"
            @click="setServiceFilter('landing-page')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="serviceFilter === 'landing-page' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Web Statis (Start 850Rb)</span>
          </button>

          <button
            type="button"
            @click="setServiceFilter('web-dinamis')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="serviceFilter === 'web-dinamis' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Web Dinamis & CMS (1.5 - 3Jt)</span>
          </button>

          <button
            type="button"
            @click="setServiceFilter('custom-web')"
            class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer"
            :class="serviceFilter === 'custom-web' 
              ? 'bg-zinc-950 text-white shadow-sm' 
              : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'"
          >
            <span>Sistem Kustom</span>
          </button>
        </template>
      </div>

      <!-- VIEW 1: DIGITAL PRODUCTS - CLEAN RESPONSIVE GRID (NO INFINITY LOOP) -->
      <div v-if="currentTab === 'digital'" id="katalog-produk">
        
        <!-- Loading Skeleton State -->
        <div v-if="isInitialLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <!-- Clean Product Grid -->
        <div 
          v-else-if="filteredProducts.length > 0" 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="flex flex-col"
          >
            <ProductCard
              :product="product"
              @select-product="(p) => emit('select-product', p)"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white rounded-2xl border border-zinc-200 shadow-sm">
          <p class="text-sm text-zinc-600">Tidak ada produk dalam kategori ini.</p>
          <button 
            type="button"
            @click="digitalFilter = 'all'"
            class="mt-3 text-xs text-blue-600 font-semibold hover:underline"
          >
            Tampilkan Semua Produk
          </button>
        </div>
      </div>

      <!-- VIEW 2: WEBSITE & APPS - CLEAN RESPONSIVE GRID (NO INFINITY LOOP) -->
      <div v-else id="jasa-software">
        
        <!-- Loading Skeleton State -->
        <div v-if="isInitialLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCardSkeleton v-for="i in 3" :key="i" />
        </div>

        <!-- Clean Services Grid -->
        <div 
          v-else-if="filteredServices.length > 0" 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="service in filteredServices"
            :key="service.id"
            class="flex flex-col"
          >
            <ServiceCard
              :card-id="'service-' + service.id"
              :service="service"
              @select-service="(s) => emit('select-service', s)"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white rounded-2xl border border-zinc-200 shadow-sm">
          <p class="text-sm text-zinc-600">Tidak ada layanan dalam kategori ini.</p>
          <button 
            type="button"
            @click="serviceFilter = 'all'"
            class="mt-3 text-xs text-blue-600 font-semibold hover:underline"
          >
            Tampilkan Semua Layanan
          </button>
        </div>
      </div>

    </div>
  </section>
</template>
