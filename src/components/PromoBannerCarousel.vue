<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight, 
  Play, 
  Pause 
} from 'lucide-vue-next'

interface BannerSlide {
  id: string
  title: string
  tag: string
  image: string
  targetHash: string
  accentColor: string
  category: 'ai' | 'streaming' | 'edit' | 'rating' | 'services' | 'all'
}

const banners: BannerSlide[] = [
  {
    id: 'banner-pull-store',
    title: 'Pusat Langganan AI Pro & Software Dev',
    tag: 'OFFICIAL STORE',
    image: '/og/og-pull-store.png',
    targetHash: '#semua-produk-pull-store',
    accentColor: '#2563eb',
    category: 'all'
  },
  {
    id: 'banner-software',
    title: 'Jasa Software & Aplikasi Tugas Akhir Mahasiswa',
    tag: 'START 500RB',
    image: '/og/og-software.png',
    targetHash: '#tugas-akhir',
    accentColor: '#06b6d4',
    category: 'services'
  },
  {
    id: 'banner-chatgpt',
    title: 'ChatGPT Plus GPT-4o Anti Limit',
    tag: 'BEST SELLER AI',
    image: '/og/og-chatgpt.png',
    targetHash: '#ai',
    accentColor: '#10a37f',
    category: 'ai'
  },
  {
    id: 'banner-netflix',
    title: 'Netflix Premium 4K UHD Anti-On Hold',
    tag: 'STREAMING 4K',
    image: '/og/og-netflix.png',
    targetHash: '#streaming',
    accentColor: '#e50914',
    category: 'streaming'
  },
  {
    id: 'banner-claude',
    title: 'Claude 3.5 Sonnet Coding & Artifacts',
    tag: 'CODER CHOICE',
    image: '/og/og-claude.png',
    targetHash: '#ai',
    accentColor: '#d97706',
    category: 'ai'
  },
  {
    id: 'banner-canva',
    title: 'Canva Pro Member & Designer Team',
    tag: 'DESAIN GRAFIS',
    image: '/og/og-canva.png',
    targetHash: '#edit',
    accentColor: '#00c4cc',
    category: 'edit'
  },
  {
    id: 'banner-gemini',
    title: 'Gemini Advanced + Cloud GDrive 5TB',
    tag: 'CLOUD JUMBO',
    image: '/og/og-gemini.png',
    targetHash: '#ai',
    accentColor: '#2563eb',
    category: 'ai'
  },
  {
    id: 'banner-spotify',
    title: 'Spotify Premium Bebas Iklan',
    tag: 'MUSIK OFFLINE',
    image: '/og/og-spotify.png',
    targetHash: '#streaming',
    accentColor: '#1db954',
    category: 'streaming'
  },
  {
    id: 'banner-capcut',
    title: 'CapCut Pro Video Editor PC & HP',
    tag: 'KONTEN KREATOR',
    image: '/og/og-capcut.png',
    targetHash: '#edit',
    accentColor: '#8b5cf6',
    category: 'edit'
  },
  {
    id: 'banner-gmaps',
    title: 'Jasa Rating & Review Google Maps Real',
    tag: 'LOCAL SEO',
    image: '/og/og-google-maps.png',
    targetHash: '#rating',
    accentColor: '#ea4335',
    category: 'rating'
  }
]

const currentIndex = ref(0)
const isAutoPlay = ref(true)
const isHovered = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.length) % banners.length
}

const goToSlide = (idx: number) => {
  currentIndex.value = idx
}

const startAutoPlay = () => {
  stopAutoPlay()
  timer = setInterval(() => {
    if (isAutoPlay.value && !isHovered.value) {
      nextSlide()
    }
  }, 4500)
}

const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const togglePlay = () => {
  isAutoPlay.value = !isAutoPlay.value
}

// Click banner: Smoothly scroll to target hash in catalog
const handleBannerClick = (slide: BannerSlide) => {
  history.replaceState(null, '', slide.targetHash)
  const hash = slide.targetHash.replace('#', '')
  const el = document.getElementById(hash) || document.getElementById('katalog-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Touch swipe gestures for mobile
let touchStartX = 0
let touchEndX = 0

const onTouchStart = (e: TouchEvent) => {
  isHovered.value = true
  if (e.touches[0]) {
    touchStartX = e.touches[0].clientX
  }
}

const onTouchEnd = (e: TouchEvent) => {
  isHovered.value = false
  if (e.changedTouches[0]) {
    touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <section class="py-6 md:py-10 bg-zinc-950 relative overflow-hidden border-b border-zinc-800">
    <!-- Ambient Blur Glows in Background -->
    <div class="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Top Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Sparkles class="w-3 h-3 text-blue-400" />
            Promo & Spesifikasi Resmi
          </span>
          <span class="text-xs text-zinc-400 font-mono hidden sm:inline">
            Slide {{ currentIndex + 1 }} dari {{ banners.length }}
          </span>
        </div>

        <!-- Controls: Play/Pause & Arrows -->
        <div class="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            @click="togglePlay"
            class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            :title="isAutoPlay ? 'Jeda Otomatis' : 'Putar Otomatis'"
          >
            <span 
              class="w-1.5 h-1.5 rounded-full" 
              :class="isAutoPlay && !isHovered ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'"
            ></span>
            <Pause v-if="isAutoPlay" class="w-3 h-3" />
            <Play v-else class="w-3 h-3" />
            <span class="text-[11px]">{{ isAutoPlay ? 'Auto' : 'Paused' }}</span>
          </button>

          <button
            type="button"
            @click="prevSlide"
            class="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            aria-label="Slide sebelumnya"
            title="Slide sebelumnya"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <button
            type="button"
            @click="nextSlide"
            class="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            aria-label="Slide selanjutnya"
            title="Slide selanjutnya"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- MAIN CAROUSEL CONTAINER (100% RESPONSIVE - NEVER CROPPED ON MOBILE) -->
      <div 
        class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl group select-none"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <!-- Slides Track: aspect-[1200/630] matches generated OG banner dimensions perfectly -->
        <div class="relative w-full aspect-[1200/630] overflow-hidden bg-black flex items-center justify-center">
          <transition-group name="slide-fade">
            <div
              v-for="(banner, idx) in banners"
              :key="banner.id"
              v-show="idx === currentIndex"
              class="absolute inset-0 w-full h-full cursor-pointer"
              @click="handleBannerClick(banner)"
            >
              <!-- 
                RESPONSIVE IMAGE: 
                w-full h-full object-contain or object-cover with aspect-[1200/630].
                Because the container aspect ratio matches the image aspect ratio (1200/630 = 1.905),
                the image scales proportionally on every mobile phone screen without ANY pixel cut off!
              -->
              <img
                :src="banner.image"
                :alt="banner.title"
                class="w-full h-full object-contain block"
                loading="eager"
              />

              <!-- Subtle Gradient Overlay & Bottom CTA Pill -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-between p-4 sm:p-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg">
                  <span>Lihat Paket & Pesan</span>
                  <ArrowUpRight class="w-3.5 h-3.5" />
                </span>
                <span class="text-[11px] font-mono text-zinc-300 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 hidden sm:inline">
                  Klik banner untuk lompat ke katalog
                </span>
              </div>
            </div>
          </transition-group>

          <!-- Floating Side Navigation Arrows on Desktop Hover -->
          <button
            type="button"
            @click.stop="prevSlide"
            class="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none cursor-pointer"
            aria-label="Previous Banner"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>

          <button
            type="button"
            @click.stop="nextSlide"
            class="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none cursor-pointer"
            aria-label="Next Banner"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Bottom Dot & Progress Indicators -->
        <div class="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <button
            v-for="(banner, idx) in banners"
            :key="'dot-' + banner.id"
            type="button"
            @click.stop="goToSlide(idx)"
            class="transition-all duration-300 rounded-full focus:outline-none cursor-pointer"
            :class="idx === currentIndex 
              ? 'w-6 h-1.5 bg-blue-500' 
              : 'w-1.5 h-1.5 bg-zinc-500/70 hover:bg-zinc-300'"
            :aria-label="`Pindah ke slide ${idx + 1}`"
          ></button>
        </div>
      </div>

      <!-- Quick Thumbnail Category Chips Below Banner -->
      <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
        <button
          v-for="(banner, idx) in banners"
          :key="'chip-' + banner.id"
          type="button"
          @click="goToSlide(idx)"
          class="px-2.5 py-1 rounded-lg shrink-0 transition-all border text-[11px] cursor-pointer"
          :class="idx === currentIndex 
            ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-xs' 
            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'"
        >
          {{ banner.tag }}
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
