<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { ProductItem, ServiceItem } from '../types'
import { useCatalog } from '../composables/useCatalog'
import ProductCard from './ProductCard.vue'
import ServiceCard from './ServiceCard.vue'
import ProductCardSkeleton from './skeletons/ProductCardSkeleton.vue'
import ServiceCardSkeleton from './skeletons/ServiceCardSkeleton.vue'
import { 
  Sparkles, 
  Code2, 
  Search, 
  Bot,
  Tv,
  Palette,
  Star,
  Link2,
  CheckCheck,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Infinity as InfinityIcon
} from 'lucide-vue-next'

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
    nextTick(() => {
      if (newVal === 'services') {
        initInfiniteServicePosition()
      } else {
        initInfinitePosition()
      }
    })
  }
})

// Dynamic Catalog from Supabase (with fallback to local catalog)
const { products, services, isUsingRemote, isInitialLoading } = useCatalog()

// Sub-filters
const digitalFilter = ref<'all' | 'ai' | 'edit' | 'rating' | 'streaming'>('all')
const serviceFilter = ref<'all' | 'tugas-akhir' | 'apk-offline' | 'landing-page' | 'web-dinamis' | 'custom-web'>('all')
const searchQuery = ref('')
const isAiLinkCopied = ref(false)

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

// Filtered Products
const filteredProducts = computed(() => {
  return products.value.filter((item) => {
    const matchesFilter = digitalFilter.value === 'all' || item.category === digitalFilter.value
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.features.some(f => f.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesFilter && matchesSearch
  })
})

// Filtered Services
const filteredServices = computed(() => {
  return services.value.filter((item) => {
    const matchesFilter = serviceFilter.value === 'all' || item.category === serviceFilter.value
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.deliverables.some(d => d.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesFilter && matchesSearch
  })
})

// --- Infinite Marquee Carousel State & Logic ---
const productCarouselRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isMarqueePlaying = ref(true)
let marqueeRafId: number | null = null
let resumeTimeout: ReturnType<typeof setTimeout> | null = null

interface InfiniteProductItem {
  product: ProductItem
  uniqueKey: string
  isPrimarySet: boolean
}

// Generate repeated array for seamless infinite looping without gaps
const infiniteProductList = computed<InfiniteProductItem[]>(() => {
  const items = filteredProducts.value
  if (items.length === 0) return []

  // Multiplier ensures the track is always at least 3x the viewport width
  let multiplier = 3
  if (items.length <= 2) multiplier = 8
  else if (items.length <= 4) multiplier = 5
  else if (items.length <= 8) multiplier = 4

  const repeated: InfiniteProductItem[] = []
  for (let m = 0; m < multiplier; m++) {
    items.forEach((p, idx) => {
      repeated.push({
        product: p,
        uniqueKey: `${p.id}-m${m}-${idx}`,
        isPrimarySet: m === 1
      })
    })
  }
  return repeated
})

// Calculate exact pixel width of 1 complete set of products (including gaps)
const getSingleSetWidth = (): number => {
  if (!productCarouselRef.value) return 0
  const cards = productCarouselRef.value.querySelectorAll<HTMLElement>('.product-card-wrapper')
  const count = filteredProducts.value.length
  if (cards.length <= count || count === 0) return 0

  const firstCard = cards[0]
  const targetCard = cards[count]
  if (firstCard && targetCard) {
    const diff = targetCard.offsetLeft - firstCard.offsetLeft
    return diff > 0 ? diff : 0
  }
  return 0
}

// Initialize scroll position to center set (so users can scroll left or right immediately)
const initInfinitePosition = () => {
  nextTick(() => {
    if (!productCarouselRef.value) return
    const singleSet = getSingleSetWidth()
    if (singleSet > 0) {
      productCarouselRef.value.scrollLeft = singleSet
    }
  })
}

// Continuous smooth Marquee runner (using requestAnimationFrame)
const stepMarquee = () => {
  // Digital Products marquee
  if (currentTab.value === 'digital' && productCarouselRef.value) {
    if (isMarqueePlaying.value && !isHovered.value) {
      const container = productCarouselRef.value
      const singleSet = getSingleSetWidth()

      if (singleSet > 0) {
        container.scrollLeft += 0.7

        // Seamless wrap-around
        if (container.scrollLeft >= singleSet * 2) {
          container.scrollLeft -= singleSet
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSet
        }
      }
    }
  }

  // Services marquee
  if (currentTab.value === 'services' && serviceCarouselRef.value) {
    if (isServiceMarqueePlaying.value && !isServiceHovered.value) {
      const container = serviceCarouselRef.value
      const singleSet = getSingleServiceSetWidth()

      if (singleSet > 0) {
        container.scrollLeft += 0.7

        // Seamless wrap-around
        if (container.scrollLeft >= singleSet * 2) {
          container.scrollLeft -= singleSet
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSet
        }
      }
    }
  }

  marqueeRafId = requestAnimationFrame(stepMarquee)
}

// Pause marquee temporarily when user interacts
const pauseMarqueeTemporarily = (durationMs = 4000) => {
  isHovered.value = true
  if (resumeTimeout) clearTimeout(resumeTimeout)
  resumeTimeout = setTimeout(() => {
    isHovered.value = false
  }, durationMs)
}

// Toggle marquee play / pause
const toggleMarquee = () => {
  isMarqueePlaying.value = !isMarqueePlaying.value
  if (isMarqueePlaying.value) {
    isHovered.value = false
  }
}

// Next / Previous buttons with infinite wrap-around (Never disabled)
const scrollProductCarousel = (direction: 'left' | 'right') => {
  if (!productCarouselRef.value) return
  const container = productCarouselRef.value
  const singleSet = getSingleSetWidth()

  const firstCard = container.querySelector<HTMLElement>('.product-card-wrapper')
  const cardWidthWithGap = firstCard ? firstCard.offsetWidth + 24 : 380

  pauseMarqueeTemporarily(4000)

  if (direction === 'right') {
    if (singleSet > 0 && container.scrollLeft >= singleSet * 2 - cardWidthWithGap) {
      container.scrollLeft -= singleSet
    }
    container.scrollBy({ left: cardWidthWithGap, behavior: 'smooth' })
  } else {
    if (singleSet > 0 && container.scrollLeft <= cardWidthWithGap) {
      container.scrollLeft += singleSet
    }
    container.scrollBy({ left: -cardWidthWithGap, behavior: 'smooth' })
  }
}

const handleMouseEnter = () => {
  isHovered.value = true
  if (resumeTimeout) clearTimeout(resumeTimeout)
}

const handleMouseLeave = () => {
  if (resumeTimeout) clearTimeout(resumeTimeout)
  resumeTimeout = setTimeout(() => {
    isHovered.value = false
  }, 1200)
}

const handleTouchStart = () => {
  isHovered.value = true
  if (resumeTimeout) clearTimeout(resumeTimeout)
}

const handleTouchEnd = () => {
  if (resumeTimeout) clearTimeout(resumeTimeout)
  resumeTimeout = setTimeout(() => {
    isHovered.value = false
  }, 2500)
}

// Watch filtered products and reset carousel scroll to center set
watch(() => filteredProducts.value, () => {
  nextTick(() => {
    initInfinitePosition()
  })
})

// Set digital filter and sync to URL hash
const setDigitalFilter = (filter: 'all' | 'ai' | 'edit' | 'rating' | 'streaming') => {
  digitalFilter.value = filter
  if (filter === 'all') {
    history.replaceState(null, '', '#semua-produk-pull-store')
  } else {
    history.replaceState(null, '', `#${filter}`)
  }
  nextTick(() => {
    initInfinitePosition()
  })
}

// --- Infinite Marquee Carousel State & Logic for Services ---
const serviceCarouselRef = ref<HTMLElement | null>(null)
const isServiceHovered = ref(false)
const isServiceMarqueePlaying = ref(true)
let serviceResumeTimeout: ReturnType<typeof setTimeout> | null = null

interface InfiniteServiceItem {
  service: ServiceItem
  uniqueKey: string
  isPrimarySet: boolean
}

// Generate repeated array for seamless infinite looping without gaps
const infiniteServiceList = computed<InfiniteServiceItem[]>(() => {
  const items = filteredServices.value
  if (items.length === 0) return []

  let multiplier = 3
  if (items.length <= 1) multiplier = 10
  else if (items.length <= 2) multiplier = 8
  else if (items.length <= 4) multiplier = 6
  else if (items.length <= 8) multiplier = 4

  const repeated: InfiniteServiceItem[] = []
  for (let m = 0; m < multiplier; m++) {
    items.forEach((s, idx) => {
      repeated.push({
        service: s,
        uniqueKey: `${s.id}-m${m}-${idx}`,
        isPrimarySet: m === 1
      })
    })
  }
  return repeated
})

// Calculate exact pixel width of 1 complete set of services (including gaps)
const getSingleServiceSetWidth = (): number => {
  if (!serviceCarouselRef.value) return 0
  const cards = serviceCarouselRef.value.querySelectorAll<HTMLElement>('.service-card-wrapper')
  const count = filteredServices.value.length
  if (cards.length <= count || count === 0) return 0

  const firstCard = cards[0]
  const targetCard = cards[count]
  if (firstCard && targetCard) {
    const diff = targetCard.offsetLeft - firstCard.offsetLeft
    return diff > 0 ? diff : 0
  }
  return 0
}

// Initialize scroll position to center set
const initInfiniteServicePosition = () => {
  nextTick(() => {
    if (!serviceCarouselRef.value) return
    const singleSet = getSingleServiceSetWidth()
    if (singleSet > 0) {
      serviceCarouselRef.value.scrollLeft = singleSet
    }
  })
}

// Pause service marquee temporarily when user interacts
const pauseServiceMarqueeTemporarily = (durationMs = 4000) => {
  isServiceHovered.value = true
  if (serviceResumeTimeout) clearTimeout(serviceResumeTimeout)
  serviceResumeTimeout = setTimeout(() => {
    isServiceHovered.value = false
  }, durationMs)
}

// Toggle service marquee play / pause
const toggleServiceMarquee = () => {
  isServiceMarqueePlaying.value = !isServiceMarqueePlaying.value
  if (isServiceMarqueePlaying.value) {
    isServiceHovered.value = false
  }
}

// Next / Previous buttons with infinite wrap-around (Never disabled)
const scrollServiceCarousel = (direction: 'left' | 'right') => {
  if (!serviceCarouselRef.value) return
  const container = serviceCarouselRef.value
  const singleSet = getSingleServiceSetWidth()

  const firstCard = container.querySelector<HTMLElement>('.service-card-wrapper')
  const cardWidthWithGap = firstCard ? firstCard.offsetWidth + 24 : 450

  pauseServiceMarqueeTemporarily(4000)

  if (direction === 'right') {
    if (singleSet > 0 && container.scrollLeft >= singleSet * 2 - cardWidthWithGap) {
      container.scrollLeft -= singleSet
    }
    container.scrollBy({ left: cardWidthWithGap, behavior: 'smooth' })
  } else {
    if (singleSet > 0 && container.scrollLeft <= cardWidthWithGap) {
      container.scrollLeft += singleSet
    }
    container.scrollBy({ left: -cardWidthWithGap, behavior: 'smooth' })
  }
}

const handleServiceMouseEnter = () => {
  isServiceHovered.value = true
  if (serviceResumeTimeout) clearTimeout(serviceResumeTimeout)
}

const handleServiceMouseLeave = () => {
  if (serviceResumeTimeout) clearTimeout(serviceResumeTimeout)
  serviceResumeTimeout = setTimeout(() => {
    isServiceHovered.value = false
  }, 1200)
}

const handleServiceTouchStart = () => {
  isServiceHovered.value = true
  if (serviceResumeTimeout) clearTimeout(serviceResumeTimeout)
}

const handleServiceTouchEnd = () => {
  if (serviceResumeTimeout) clearTimeout(serviceResumeTimeout)
  serviceResumeTimeout = setTimeout(() => {
    isServiceHovered.value = false
  }, 2500)
}

// Watch filtered services and reset carousel scroll to center set
watch(() => filteredServices.value, () => {
  nextTick(() => {
    initInfiniteServicePosition()
  })
})

// Service Filter URL Mapping & Setter
const serviceHashMap: Record<'all' | 'tugas-akhir' | 'apk-offline' | 'landing-page' | 'web-dinamis' | 'custom-web', string> = {
  'all': '#semua-jasa-pull-store',
  'tugas-akhir': '#tugas-akhir',
  'apk-offline': '#aplikasi-kasir',
  'landing-page': '#website-statis',
  'web-dinamis': '#website-dinamis',
  'custom-web': '#sistem-kustom'
}

const isServiceLinkCopied = ref(false)

const setServiceFilter = (filter: 'all' | 'tugas-akhir' | 'landing-page' | 'web-dinamis' | 'apk-offline' | 'custom-web') => {
  serviceFilter.value = filter
  const targetHash = serviceHashMap[filter] || '#semua-jasa-pull-store'
  history.replaceState(null, '', targetHash)
  nextTick(() => {
    initInfiniteServicePosition()
  })
}

const copyServiceCategoryLink = async () => {
  const currentHash = serviceHashMap[serviceFilter.value] || '#semua-jasa-pull-store'
  const url = `${window.location.origin}/${currentHash}`
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
    } else {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    isServiceLinkCopied.value = true
    setTimeout(() => {
      isServiceLinkCopied.value = false
    }, 2500)
  } catch {
    isServiceLinkCopied.value = true
    setTimeout(() => {
      isServiceLinkCopied.value = false
    }, 2500)
  }
}

// Copy All Products direct link (points to dedicated OG preview page)
const isAllLinkCopied = ref(false)
const copyAllCategoryLink = async () => {
  const url = `${window.location.origin}/p/pull-store.html`
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
    } else {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    isAllLinkCopied.value = true
    setTimeout(() => {
      isAllLinkCopied.value = false
    }, 2500)
  } catch {
    isAllLinkCopied.value = true
    setTimeout(() => {
      isAllLinkCopied.value = false
    }, 2500)
  }
}

// Copy AI Productivity direct link (points to dedicated ChatGPT OG preview page)
const copyAiCategoryLink = async () => {
  const url = `${window.location.origin}/p/chatgpt.html`
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
    } else {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    isAiLinkCopied.value = true
    setTimeout(() => {
      isAiLinkCopied.value = false
    }, 2500)
  } catch {
    isAiLinkCopied.value = true
    setTimeout(() => {
      isAiLinkCopied.value = false
    }, 2500)
  }
}

// Handle Direct URL hash or query parameters (e.g. #aplikasi-kasir, #website-statis, #website-dinamis, #ai, ?category=...)
const handleUrlHashOrQuery = () => {
  const hash = window.location.hash.toLowerCase()
  const searchParams = new URLSearchParams(window.location.search)
  const catParam = searchParams.get('category') || searchParams.get('cat')
  const prodParam = searchParams.get('product')
  const serviceParam = searchParams.get('service')

  // Direct product shortcut mapping (e.g. #netflix, #spotify, #chatgpt)
  const productShortcutMap: Record<string, string> = {
    'netflix': 'netflix-2u',
    'spotify': 'spotify-premium',
    'chatgpt': 'chatgpt-plus-shared',
    'claude': 'claude-ai-pro',
    'gemini': 'gemini-ai-5tb',
    'canva': 'canva-pro-member',
    'capcut': 'capcut-pro',
    'google-maps': 'gmaps-rating-bintang',
    'zoom': 'zoom-premium',
    'youtube': 'youtube-premium',
    'vidio': 'vidio-platinum-mobile'
  }

  const rawHash = hash.replace(/^#/, '')
  const resolvedTargetId = prodParam || (hash.startsWith('#product-') ? hash.replace('#product-', '') : productShortcutMap[rawHash])

  if (resolvedTargetId) {
    const targetProd = products.value.find((p: ProductItem) => p.id === resolvedTargetId)
    if (targetProd) {
      currentTab.value = 'digital'
      digitalFilter.value = targetProd.category
      nextTick(() => {
        setTimeout(() => {
          const cardEl = document.getElementById('product-' + targetProd.id)
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
            cardEl.classList.add('ring-4', 'ring-blue-500/60', 'transition-all')
            setTimeout(() => {
              cardEl.classList.remove('ring-4', 'ring-blue-500/60')
            }, 3000)
          }
        }, 200)
      })
      return
    }
  }

  // Direct Service Target / Shortcut
  const serviceShortcutMap: Record<string, { id: string; filter: typeof serviceFilter.value }> = {
    'svc-apk-kasir-offline': { id: 'svc-apk-kasir-offline', filter: 'apk-offline' },
    'svc-website-statis': { id: 'svc-website-statis', filter: 'landing-page' },
    'svc-website-dinamis': { id: 'svc-website-dinamis', filter: 'web-dinamis' },
    'svc-custom-web': { id: 'svc-custom-web', filter: 'custom-web' }
  }

  const resolvedServiceId = serviceParam || (hash.startsWith('#service-') ? hash.replace('#service-', '') : '')
  if (resolvedServiceId && serviceShortcutMap[resolvedServiceId]) {
    const conf = serviceShortcutMap[resolvedServiceId]
    currentTab.value = 'services'
    serviceFilter.value = conf.filter
    nextTick(() => {
      setTimeout(() => {
        const cardEl = document.getElementById('service-' + conf.id)
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          cardEl.classList.add('ring-4', 'ring-blue-500/60', 'transition-all')
          setTimeout(() => {
            cardEl.classList.remove('ring-4', 'ring-blue-500/60')
          }, 3000)
        }
      }, 200)
    })
    return
  }

  // --- Filter Jasa Software Dev ---
  if (
    hash === '#tugas-akhir' ||
    hash === '#skripsi' ||
    hash === '#ta' ||
    hash === '#mahasiswa' ||
    hash === '#jasa-skripsi' ||
    catParam === 'tugas-akhir' ||
    catParam === 'skripsi'
  ) {
    currentTab.value = 'services'
    serviceFilter.value = 'tugas-akhir'
    nextTick(() => {
      const el = document.getElementById('tugas-akhir') || document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (
    hash === '#aplikasi-kasir' ||
    hash === '#kasir' ||
    hash === '#apk-offline' ||
    hash === '#kasir-offline' ||
    hash === '#apk-kasir' ||
    hash === '#aplikasi-kasir-offline' ||
    catParam === 'aplikasi-kasir' ||
    catParam === 'apk-offline'
  ) {
    currentTab.value = 'services'
    serviceFilter.value = 'apk-offline'
    nextTick(() => {
      const el = document.getElementById('aplikasi-kasir') || document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (
    hash === '#website-statis' ||
    hash === '#web-statis' ||
    hash === '#landing-page' ||
    hash === '#statis' ||
    catParam === 'website-statis' ||
    catParam === 'landing-page'
  ) {
    currentTab.value = 'services'
    serviceFilter.value = 'landing-page'
    nextTick(() => {
      const el = document.getElementById('website-statis') || document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (
    hash === '#website-dinamis' ||
    hash === '#web-dinamis' ||
    hash === '#dinamis' ||
    hash === '#cms' ||
    catParam === 'website-dinamis' ||
    catParam === 'web-dinamis'
  ) {
    currentTab.value = 'services'
    serviceFilter.value = 'web-dinamis'
    nextTick(() => {
      const el = document.getElementById('website-dinamis') || document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (
    hash === '#sistem-kustom' ||
    hash === '#custom-web' ||
    hash === '#sistem' ||
    hash === '#custom' ||
    catParam === 'sistem-kustom' ||
    catParam === 'custom-web'
  ) {
    currentTab.value = 'services'
    serviceFilter.value = 'custom-web'
    nextTick(() => {
      const el = document.getElementById('sistem-kustom') || document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (
    hash === '#semua-jasa-pull-store' ||
    hash === '#semua-jasa' ||
    hash === '#jasa-software' ||
    hash === '#jasa' ||
    hash === '#software' ||
    catParam === 'semua-jasa-pull-store' ||
    catParam === 'services'
  ) {
    currentTab.value = 'services'
    serviceFilter.value = 'all'
    nextTick(() => {
      const el = document.getElementById('semua-jasa-pull-store') || document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  // --- Filter Produk Digital ---
  if (
    hash === '#semua-produk-pull-store' || 
    hash === '#semua' || 
    hash === '#katalog-produk' || 
    catParam === 'semua-produk-pull-store' || 
    catParam === 'all'
  ) {
    currentTab.value = 'digital'
    digitalFilter.value = 'all'
    nextTick(() => {
      const el = document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (hash === '#ai' || catParam === 'ai') {
    currentTab.value = 'digital'
    digitalFilter.value = 'ai'
    nextTick(() => {
      const el = document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (hash === '#edit' || catParam === 'edit') {
    currentTab.value = 'digital'
    digitalFilter.value = 'edit'
    nextTick(() => {
      const el = document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (hash === '#rating' || catParam === 'rating') {
    currentTab.value = 'digital'
    digitalFilter.value = 'rating'
    nextTick(() => {
      const el = document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }

  if (hash === '#streaming' || catParam === 'streaming') {
    currentTab.value = 'digital'
    digitalFilter.value = 'streaming'
    nextTick(() => {
      const el = document.getElementById('katalog-section')
      el?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }
}

const handleWindowResize = () => {
  initInfinitePosition()
  initInfiniteServicePosition()
}

onMounted(() => {
  handleUrlHashOrQuery()
  window.addEventListener('hashchange', handleUrlHashOrQuery)
  window.addEventListener('resize', handleWindowResize)
  nextTick(() => {
    initInfinitePosition()
    initInfiniteServicePosition()
  })
  marqueeRafId = requestAnimationFrame(stepMarquee)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleUrlHashOrQuery)
  window.removeEventListener('resize', handleWindowResize)
  if (marqueeRafId) cancelAnimationFrame(marqueeRafId)
  if (resumeTimeout) clearTimeout(resumeTimeout)
  if (serviceResumeTimeout) clearTimeout(serviceResumeTimeout)
})

const setMainTab = (tab: 'digital' | 'services') => {
  currentTab.value = tab
  searchQuery.value = ''
  if (tab === 'digital') {
    if (digitalFilter.value === 'all') {
      history.replaceState(null, '', '#semua-produk-pull-store')
    } else {
      history.replaceState(null, '', `#${digitalFilter.value}`)
    }
    nextTick(() => {
      initInfinitePosition()
    })
  } else {
    const targetHash = serviceHashMap[serviceFilter.value] || '#semua-jasa-pull-store'
    history.replaceState(null, '', targetHash)
    nextTick(() => {
      initInfiniteServicePosition()
    })
  }
}
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
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto">
        <div class="inline-flex items-center gap-2">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Dual-Catalog Engine
          </span>
          <span v-if="isUsingRemote" class="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs" title="Katalog terhubung secara dinamis ke Supabase Database">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Database Dinamis
          </span>
        </div>
        <h2 class="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
          Pilih Kebutuhan Digital Anda
        </h2>
        <p class="mt-2 text-sm text-zinc-600">
          Transparan, tanpa biaya tersembunyi, langsung terhubung ke WhatsApp resmi untuk checkout & konsultasi.
        </p>
      </div>

      <!-- Main Dual-View Tab Selector -->
      <div class="mt-8 flex justify-center">
        <div class="inline-flex p-1.5 rounded-xl bg-zinc-200/80 border border-zinc-200 shadow-inner">
          <button
            type="button"
            @click="setMainTab('digital')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none"
            :class="currentTab === 'digital'
              ? 'bg-white text-zinc-950 shadow-subtle border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-950'"
          >
            <Sparkles class="w-4 h-4 text-blue-600" :stroke-width="1.75" />
            <span>1. Akun Digital & AI Pro</span>
            <span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-100 text-zinc-700">
              {{ products.length }}
            </span>
          </button>

          <button
            type="button"
            @click="setMainTab('services')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none"
            :class="currentTab === 'services'
              ? 'bg-white text-zinc-950 shadow-subtle border border-zinc-200/80'
              : 'text-zinc-600 hover:text-zinc-950'"
          >
            <Code2 class="w-4 h-4 text-blue-600" :stroke-width="1.75" />
            <span>2. Jasa Software Dev</span>
            <span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-100 text-zinc-700">
              {{ services.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search & Sub-category Bar -->
      <div class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
        
        <!-- Category Filter Pills -->
        <div v-if="currentTab === 'digital'" class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            type="button"
            @click="setDigitalFilter('all')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="digitalFilter === 'all' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            <span>Semua</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'all' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.all }}
            </span>
          </button>
          
          <button
            type="button"
            @click="setDigitalFilter('ai')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="digitalFilter === 'ai' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            <Bot class="w-3.5 h-3.5" :stroke-width="1.75" />
            <span>AI Productivity</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'ai' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.ai }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('edit')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="digitalFilter === 'edit' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            <Palette class="w-3.5 h-3.5" :stroke-width="1.75" />
            <span>Desain & Edit</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'edit' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.edit }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('rating')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="digitalFilter === 'rating' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            <Star class="w-3.5 h-3.5" :stroke-width="1.75" />
            <span>Jasa Rating Maps</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'rating' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.rating }}
            </span>
          </button>

          <button
            type="button"
            @click="setDigitalFilter('streaming')"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="digitalFilter === 'streaming' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            <Tv class="w-3.5 h-3.5" :stroke-width="1.75" />
            <span>Streaming & Meeting</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="digitalFilter === 'streaming' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'">
              {{ productCounts.streaming }}
            </span>
          </button>

          <!-- Copy Direct Link Button for AI -->
          <button
            v-if="digitalFilter === 'ai'"
            type="button"
            @click="copyAiCategoryLink"
            class="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ml-1"
            :class="isAiLinkCopied 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold' 
              : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'"
            title="Salin Direct Link URL AI Productivity"
          >
            <CheckCheck v-if="isAiLinkCopied" class="w-3.5 h-3.5 text-emerald-600" />
            <Link2 v-else class="w-3.5 h-3.5 text-blue-600" />
            <span>{{ isAiLinkCopied ? 'Link AI Tersalin!' : 'Salin Link AI' }}</span>
          </button>

          <!-- Copy Direct Link Button for Semua Produk -->
          <button
            v-if="digitalFilter === 'all'"
            type="button"
            @click="copyAllCategoryLink"
            class="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ml-1"
            :class="isAllLinkCopied 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold' 
              : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'"
            title="Salin Direct Link Semua Produk (#semua-produk-pull-store)"
          >
            <CheckCheck v-if="isAllLinkCopied" class="w-3.5 h-3.5 text-emerald-600" />
            <Link2 v-else class="w-3.5 h-3.5 text-zinc-600" />
            <span>{{ isAllLinkCopied ? 'Link Semua Tersalin!' : 'Salin Link Semua' }}</span>
          </button>
        </div>

        <div v-else class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            type="button"
            @click="setServiceFilter('all')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="serviceFilter === 'all' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            Semua Solusi Bisnis
          </button>
          <button
            type="button"
            @click="setServiceFilter('tugas-akhir')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="serviceFilter === 'tugas-akhir' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            Tugas Akhir / Skripsi (Start 500Rb)
          </button>
          <button
            type="button"
            @click="setServiceFilter('apk-offline')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="serviceFilter === 'apk-offline' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            Aplikasi Kasir (Start 700Rb)
          </button>
          <button
            type="button"
            @click="setServiceFilter('landing-page')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="serviceFilter === 'landing-page' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            Web Statis (Start 850Rb)
          </button>
          <button
            type="button"
            @click="setServiceFilter('web-dinamis')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="serviceFilter === 'web-dinamis' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            Web Dinamis & CMS (1.5 - 3Jt)
          </button>
          <button
            type="button"
            @click="setServiceFilter('custom-web')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
            :class="serviceFilter === 'custom-web' 
              ? 'bg-zinc-950 text-white shadow-xs' 
              : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'"
          >
            Sistem Kustom
          </button>

          <!-- Copy Direct Link Button for Service -->
          <button
            v-if="serviceFilter !== 'all'"
            type="button"
            @click="copyServiceCategoryLink"
            class="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ml-1"
            :class="isServiceLinkCopied 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold' 
              : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'"
            title="Salin Direct Link Filter Jasa Ini"
          >
            <CheckCheck v-if="isServiceLinkCopied" class="w-3.5 h-3.5 text-emerald-600" />
            <Link2 v-else class="w-3.5 h-3.5 text-blue-600" />
            <span>{{ isServiceLinkCopied ? 'Link Jasa Tersalin!' : 'Salin Link' }}</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" :stroke-width="1.75" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentTab === 'digital' ? 'Cari ChatGPT, Netflix...' : 'Cari Kasir Offline, Website, Sistem...'"
            class="w-full pl-9 pr-4 py-1.5 rounded-lg text-xs bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-zinc-950 placeholder:text-zinc-400 transition-all shadow-subtle"
          />
        </div>
      </div>

      <!-- Direct Share Info Banner for AI Productivity -->
      <div 
        v-if="digitalFilter === 'ai' && currentTab === 'digital'" 
        class="mt-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-subtle max-w-5xl mx-auto"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bot class="w-5 h-5" :stroke-width="1.75" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-zinc-950">
                Direct Link Aktif: AI Productivity
              </span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-100 text-blue-800">
                #ai
              </span>
            </div>
            <p class="text-xs text-zinc-600 mt-0.5">
              Tersedia Gemini AI 5TB, ChatGPT Plus, dan Claude 3.5 Sonnet. Salin link ini untuk langsung terarah ke katalog AI saat dibagikan.
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="copyAiCategoryLink"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="isAiLinkCopied 
            ? 'bg-emerald-600 text-white font-bold' 
            : 'bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-300'"
        >
          <CheckCheck v-if="isAiLinkCopied" class="w-4 h-4" />
          <Share2 v-else class="w-4 h-4" />
          <span>{{ isAiLinkCopied ? 'Link AI Berhasil Disalin!' : 'Salin Link Katalog AI' }}</span>
        </button>
      </div>

      <!-- VIEW 1: DIGITAL PRODUCTS INFINITE MARQUEE CAROUSEL -->
      <div v-if="currentTab === 'digital'" id="katalog-produk" class="mt-8">
        
        <!-- Navigation Controls & Marquee Header -->
        <div v-if="filteredProducts.length > 0" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
          <div class="flex items-center gap-2 text-xs font-mono flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">
              {{ filteredProducts.length }} Produk
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              <InfinityIcon class="w-3.5 h-3.5 text-blue-600" />
              <span>Infinite Marquee Carousel</span>
            </span>
            <span class="hidden md:inline-flex items-center gap-1 text-[11px] text-zinc-400">
              • Arahkan kursor ke kartu untuk jeda
            </span>
          </div>

          <!-- Marquee Toggle & Navigation Arrow Buttons -->
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <!-- Marquee Play/Pause Toggle -->
            <button
              type="button"
              @click="toggleMarquee"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition-colors cursor-pointer"
              :title="isMarqueePlaying ? 'Jeda marquee otomatis' : 'Jalankan marquee otomatis'"
            >
              <span 
                class="w-2 h-2 rounded-full"
                :class="isMarqueePlaying && !isHovered ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'"
              ></span>
              <Pause v-if="isMarqueePlaying" class="w-3.5 h-3.5 text-zinc-600" />
              <Play v-else class="w-3.5 h-3.5 text-zinc-600" />
              <span class="text-xs">{{ isMarqueePlaying ? (isHovered ? 'Dijeda' : 'Marquee Aktif') : 'Putar Marquee' }}</span>
            </button>

            <!-- Arrow Navigation Buttons (Never disabled, infinite loop) -->
            <button
              type="button"
              @click="scrollProductCarousel('left')"
              class="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 transition-all duration-150 shadow-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 cursor-pointer"
              aria-label="Geser produk ke kiri"
              title="Geser ke kiri (Loop)"
            >
              <ChevronLeft class="w-4 h-4" :stroke-width="2.25" />
            </button>

            <button
              type="button"
              @click="scrollProductCarousel('right')"
              class="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 transition-all duration-150 shadow-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 cursor-pointer"
              aria-label="Geser produk ke kanan"
              title="Geser ke kanan (Loop)"
            >
              <ChevronRight class="w-4 h-4" :stroke-width="2.25" />
            </button>
          </div>
        </div>

        <!-- Loading Skeleton State for Digital Products -->
        <div v-if="isInitialLoading" class="flex gap-6 overflow-x-auto py-3 px-1" style="scrollbar-width: none;">
          <div 
            v-for="i in 3" 
            :key="i"
            class="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 flex flex-col"
          >
            <ProductCardSkeleton />
          </div>
        </div>

        <!-- Carousel Track with Side Floating Arrows & Native Touch / Swipe Drag -->
        <div 
          v-else-if="filteredProducts.length > 0" 
          class="relative group/carousel"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- Floating Left Arrow for Extra Large Desktop Screens -->
          <button
            type="button"
            @click="scrollProductCarousel('left')"
            class="hidden 2xl:flex absolute -left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-elevated items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all focus:outline-none active:scale-95 cursor-pointer"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft class="w-5 h-5" :stroke-width="2.25" />
          </button>

          <!-- Floating Right Arrow for Extra Large Desktop Screens -->
          <button
            type="button"
            @click="scrollProductCarousel('right')"
            class="hidden 2xl:flex absolute -right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-elevated items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all focus:outline-none active:scale-95 cursor-pointer"
            aria-label="Geser ke kanan"
          >
            <ChevronRight class="w-5 h-5" :stroke-width="2.25" />
          </button>

          <!-- Scrollable Infinite Container (py-3 px-1 ensures shadow/border never clips) -->
          <div
            ref="productCarouselRef"
            class="flex gap-6 overflow-x-auto py-3 px-1"
            style="scrollbar-width: none; -ms-overflow-style: none;"
          >
            <div
              v-for="item in infiniteProductList"
              :key="item.uniqueKey"
              class="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] shrink-0 flex flex-col product-card-wrapper"
            >
              <ProductCard
                :id="item.isPrimarySet ? 'product-' + item.product.id : undefined"
                :product="item.product"
                @select-product="(p) => emit('select-product', p)"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white rounded-2xl border border-zinc-200 shadow-subtle">
          <p class="text-sm text-zinc-600">Tidak ada produk yang cocok dengan kata kunci "{{ searchQuery }}".</p>
          <button 
            type="button"
            @click="searchQuery = ''; digitalFilter = 'all'"
            class="mt-3 text-xs text-blue-600 font-semibold hover:underline"
          >
            Reset Filter Pencarian
          </button>
        </div>
      </div>

      <!-- VIEW 2: SERVICES INFINITE MARQUEE CAROUSEL -->
      <div v-else id="jasa-software" class="mt-8">
        
        <!-- Navigation Controls & Marquee Header for Services -->
        <div v-if="filteredServices.length > 0" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
          <div class="flex items-center gap-2 text-xs font-mono flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">
              {{ filteredServices.length }} Jasa Software
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              <InfinityIcon class="w-3.5 h-3.5 text-blue-600" />
              <span>Infinite Marquee Carousel</span>
            </span>
            <span class="hidden md:inline-flex items-center gap-1 text-[11px] text-zinc-400">
              • Arahkan kursor ke kartu untuk jeda
            </span>
          </div>

          <!-- Marquee Toggle & Navigation Arrow Buttons -->
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <!-- Marquee Play/Pause Toggle -->
            <button
              type="button"
              @click="toggleServiceMarquee"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs transition-colors cursor-pointer"
              :title="isServiceMarqueePlaying ? 'Jeda marquee otomatis' : 'Jalankan marquee otomatis'"
            >
              <span 
                class="w-2 h-2 rounded-full"
                :class="isServiceMarqueePlaying && !isServiceHovered ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'"
              ></span>
              <Pause v-if="isServiceMarqueePlaying" class="w-3.5 h-3.5 text-zinc-600" />
              <Play v-else class="w-3.5 h-3.5 text-zinc-600" />
              <span class="text-xs">{{ isServiceMarqueePlaying ? (isServiceHovered ? 'Dijeda' : 'Marquee Aktif') : 'Putar Marquee' }}</span>
            </button>

            <!-- Arrow Navigation Buttons (Never disabled, infinite loop) -->
            <button
              type="button"
              @click="scrollServiceCarousel('left')"
              class="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 transition-all duration-150 shadow-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 cursor-pointer"
              aria-label="Geser jasa ke kiri"
              title="Geser ke kiri (Loop)"
            >
              <ChevronLeft class="w-4 h-4" :stroke-width="2.25" />
            </button>

            <button
              type="button"
              @click="scrollServiceCarousel('right')"
              class="w-9 h-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 transition-all duration-150 shadow-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 cursor-pointer"
              aria-label="Geser jasa ke kanan"
              title="Geser ke kanan (Loop)"
            >
              <ChevronRight class="w-4 h-4" :stroke-width="2.25" />
            </button>
          </div>
        </div>

        <!-- Loading Skeleton State for Services -->
        <div v-if="isInitialLoading" class="flex gap-6 overflow-x-auto py-3 px-1" style="scrollbar-width: none;">
          <div 
            v-for="i in 2" 
            :key="i"
            class="w-full sm:w-[500px] lg:w-[calc((100%-1.5rem)/2)] shrink-0 flex flex-col"
          >
            <ServiceCardSkeleton />
          </div>
        </div>

        <!-- Carousel Track with Side Floating Arrows & Native Touch / Swipe Drag -->
        <div 
          v-else-if="filteredServices.length > 0" 
          class="relative group/service-carousel"
          @mouseenter="handleServiceMouseEnter"
          @mouseleave="handleServiceMouseLeave"
          @touchstart="handleServiceTouchStart"
          @touchend="handleServiceTouchEnd"
        >
          <!-- Floating Left Arrow for Extra Large Desktop Screens -->
          <button
            type="button"
            @click="scrollServiceCarousel('left')"
            class="hidden 2xl:flex absolute -left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-elevated items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all focus:outline-none active:scale-95 cursor-pointer"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft class="w-5 h-5" :stroke-width="2.25" />
          </button>

          <!-- Floating Right Arrow for Extra Large Desktop Screens -->
          <button
            type="button"
            @click="scrollServiceCarousel('right')"
            class="hidden 2xl:flex absolute -right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-elevated items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all focus:outline-none active:scale-95 cursor-pointer"
            aria-label="Geser ke kanan"
          >
            <ChevronRight class="w-5 h-5" :stroke-width="2.25" />
          </button>

          <!-- Scrollable Infinite Container -->
          <div
            ref="serviceCarouselRef"
            class="flex gap-6 overflow-x-auto py-3 px-1"
            style="scrollbar-width: none; -ms-overflow-style: none;"
          >
            <div
              v-for="item in infiniteServiceList"
              :key="item.uniqueKey"
              class="w-full sm:w-[500px] lg:w-[calc((100%-1.5rem)/2)] shrink-0 flex flex-col service-card-wrapper"
            >
              <ServiceCard
                :card-id="item.isPrimarySet ? 'service-' + item.service.id : undefined"
                :service="item.service"
                @select-service="(s) => emit('select-service', s)"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <p class="text-sm text-zinc-500">Tidak ada layanan yang cocok dengan pencarian Anda.</p>
          <button 
            type="button"
            @click="searchQuery = ''; serviceFilter = 'all'"
            class="mt-3 text-xs text-blue-600 font-semibold hover:underline"
          >
            Reset Filter Pencarian
          </button>
        </div>
      </div>

    </div>
  </section>
</template>
