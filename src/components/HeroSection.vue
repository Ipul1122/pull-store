<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ExternalLink,
  Code2,
  BadgeCheck,
  CreditCard,
  Check,
  ArrowUpDown
} from 'lucide-vue-next'
import { STORE_INFO, PRODUCTS } from '../data/catalog'

// Real Brand SVG Assets
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
import fotoIpul from '../assets/foto-ipul.png'

const emit = defineEmits<{
  (e: 'select-tab', tab: 'digital' | 'services'): void
}>()

const scrollToSection = (id: string, tab?: 'digital' | 'services') => {
  if (tab) {
    emit('select-tab', tab)
  }
  history.replaceState(null, '', `#${id}`)
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// When user clicks an item in the right preview card:
// 1. Sets URL hash to category (e.g. #streaming) as requested
// 2. Switches tab to digital
// 3. Smoothly centers the specific product card with a highlight ring
const goToProduct = (category: 'ai' | 'edit' | 'rating' | 'streaming', productId: string) => {
  emit('select-tab', 'digital')
  window.location.hash = `#${category}`

  nextTick(() => {
    setTimeout(() => {
      const cardEl = document.getElementById('product-' + productId)
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        cardEl.classList.add('ring-4', 'ring-blue-500/70', 'transition-all')
        setTimeout(() => {
          cardEl.classList.remove('ring-4', 'ring-blue-500/70')
        }, 3000)
      } else {
        const el = document.getElementById('katalog-section')
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 180)
  })
}

// Rotating text every 3 seconds: Netflix, Gemini, Claude, Spotify, Vidio, ChatGPT
const servicesList = [
  'Netflix',
  'Gemini',
  'Claude',
  'Spotify',
  'Vidio',
  'ChatGPT'
]

const activeServiceIndex = ref(0)
let serviceInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  serviceInterval = setInterval(() => {
    activeServiceIndex.value = (activeServiceIndex.value + 1) % servicesList.length
  }, 3000)
})

onUnmounted(() => {
  if (serviceInterval) {
    clearInterval(serviceInterval)
  }
})

// Expanded list of real products for the scrollable preview card
const previewItems = [
  {
    name: 'Netflix Premium 4K UHD',
    categoryName: 'Streaming Entertainment',
    category: 'streaming' as const,
    price: 'Rp 30.000',
    strike: 'Rp 60.000',
    badge: 'Akun STRONG',
    logo: netflixSvg,
    productId: 'netflix-2u'
  },
  {
    name: 'ChatGPT Plus (GPT-4o)',
    categoryName: 'AI Productivity',
    category: 'ai' as const,
    price: 'Rp 40.000',
    strike: 'Rp 85.000',
    badge: 'Full Garansi 25 Hari',
    logo: chatgptSvg,
    productId: 'chatgpt-plus-shared'
  },
  {
    name: 'Claude AI Pro',
    categoryName: 'Coding & Artifacts',
    category: 'ai' as const,
    price: 'Rp 150.000',
    strike: 'Rp 250.000',
    badge: 'Favorit Coder',
    logo: claudeSvg,
    productId: 'claude-ai-pro'
  },
  {
    name: 'Gemini AI Pro + 5TB GDrive',
    categoryName: 'AI & Storage',
    category: 'ai' as const,
    price: 'Rp 25.000',
    strike: 'Rp 45.000',
    badge: 'Gmail Sendiri',
    logo: geminiSvg,
    productId: 'gemini-member-5tb'
  },
  {
    name: 'Canva Pro Member Team',
    categoryName: 'Desain Grafis',
    category: 'edit' as const,
    price: 'Rp 15.000',
    strike: 'Rp 45.000',
    badge: 'Mulai 5 Ribu',
    logo: canvaSvg,
    productId: 'canva-pro-member'
  },
  {
    name: 'CapCut Pro Private',
    categoryName: 'Video Editing',
    category: 'edit' as const,
    price: 'Rp 25.000',
    strike: 'Rp 65.000',
    badge: 'Private Account',
    logo: capcutSvg,
    productId: 'capcut-pro'
  },
  {
    name: 'Spotify Premium Famplan',
    categoryName: 'Streaming Musik',
    category: 'streaming' as const,
    price: 'Rp 20.000',
    strike: 'Rp 55.000',
    badge: 'Akun Seller',
    logo: spotifySvg,
    productId: 'spotify-premium'
  },
  {
    name: 'YouTube Premium + YT Music',
    categoryName: 'Streaming Video',
    category: 'streaming' as const,
    price: 'Rp 3.500',
    strike: 'Rp 15.000',
    badge: 'Include YT Music',
    logo: youtubeSvg,
    productId: 'youtube-premium'
  },
  {
    name: 'Vidio Platinum Mobile',
    categoryName: 'Sports & Series',
    category: 'streaming' as const,
    price: 'Rp 20.000',
    strike: 'Rp 40.000',
    badge: 'Mobile & Tab',
    logo: vidioSvg,
    productId: 'vidio-platinum-mobile'
  },
  {
    name: 'Jasa Rating Google Maps',
    categoryName: 'Review Toko / UMKM',
    category: 'rating' as const,
    price: 'Rp 3.000 / akun',
    strike: 'Rp 6.000',
    badge: 'Akun Riil Bergaransi',
    logo: googleMapsSvg,
    productId: 'gmaps-rating-bintang'
  },
  {
    name: 'Zoom Premium Private',
    categoryName: 'Meeting Online',
    category: 'streaming' as const,
    price: 'Rp 3.000',
    strike: 'Rp 15.000',
    badge: 'Private 14 Hari',
    logo: zoomSvg,
    productId: 'zoom-premium'
  }
]
</script>

<template>
  <section class="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-zinc-200 bg-gradient-to-b from-zinc-50/70 via-white to-zinc-50/30 overflow-hidden">
    <!-- Subtle Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- 2-Column Horizontal Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        <!-- ========================================== -->
        <!-- LEFT COLUMN: Headline, Trust, Value, CTAs -->
        <!-- ========================================== -->
        <div class="lg:col-span-7 flex flex-col items-start text-left">
          
          <!-- Top Founder & Verification Trust Pill -->
          <div class="mb-6 sm:mb-7 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/90 text-zinc-700 text-xs shadow-xs hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
            <span class="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
              <BadgeCheck class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified Seller</span>
            </span>
            <span class="h-3 w-px bg-zinc-200"></span>
            
            <div class="flex items-center gap-1.5">
              <img 
                :src="fotoIpul" 
                alt="Muhammad Syaifulloh" 
                class="w-4 h-4 rounded-full object-cover ring-1 ring-zinc-300"
              />
              <span class="text-zinc-600">Pull Store by</span>
              <a 
                :href="STORE_INFO.founderWebsite || 'https://msyaifulloh.my.id'" 
                target="_blank" 
                rel="noopener noreferrer"
                class="font-semibold text-zinc-950 hover:text-blue-600 underline decoration-zinc-300 hover:decoration-blue-600 underline-offset-2 transition-colors inline-flex items-center gap-1 group"
                title="Kunjungi website portofolio resmi Muhammad Syaifulloh"
              >
                <span>{{ STORE_INFO.founder }}</span>
                <ExternalLink class="w-3 h-3 text-zinc-400 group-hover:text-blue-600 transition-colors" />
              </a>
            </div>
          </div>

          <!-- Main Dynamic Rotating Headline with Clean Spacing & Breathing Room -->
          <h1 class="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-zinc-950 leading-[1.28] sm:leading-[1.3]">
            Ingin Langganan Murah atau <br class="hidden sm:inline" />
            Konsultasi Web/App
            <span class="inline-block relative min-w-[140px] sm:min-w-[210px] text-blue-600 font-extrabold ml-3 sm:ml-4">
              <Transition name="fade-slide" mode="out-in">
                <span 
                  :key="activeServiceIndex" 
                  class="inline-block underline decoration-blue-200 decoration-wavy decoration-2 underline-offset-6"
                >
                  {{ servicesList[activeServiceIndex] }}
                </span>
              </Transition>
            </span>
          </h1>

          <!-- Client-Oriented Subhead -->
          <p class="mt-6 sm:mt-7 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl font-normal">
            Hemat hingga <strong class="text-zinc-900 font-semibold">80%</strong> untuk akses resmi tools AI Pro, Canva, Streaming 4K, dan ulasan Google Maps, atau bangun sistem software & aplikasi kasir offline mandiri tanpa biaya sewa bulanan.
          </p>

          <!-- Action Buttons: Produk Digital & Konsultasi Web/App -->
          <div class="mt-8 sm:mt-9 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              @click="scrollToSection('semua-produk-pull-store', 'digital')"
              class="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold bg-zinc-950 text-white hover:bg-blue-600 hover:shadow-elevated transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer shadow-subtle shrink-0"
            >
              <Sparkles class="w-4 h-4 text-blue-300" :stroke-width="1.75" />
              <span>Produk Digital</span>
              <ArrowRight class="w-4 h-4 ml-0.5" :stroke-width="1.75" />
            </button>

            <button
              type="button"
              @click="scrollToSection('semua-jasa-pull-store', 'services')"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 cursor-pointer shadow-xs shrink-0"
            >
              <Code2 class="w-4 h-4 text-blue-600" :stroke-width="2" />
              <span>Konsultasi Web/App</span>
            </button>
          </div>

          <!-- Trust Guarantees Bar (Left Aligned with Generous Top Margin) -->
          <div class="mt-10 sm:mt-12 pt-6 border-t border-zinc-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full text-xs text-zinc-600 font-medium">
            <div class="flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" :stroke-width="2" />
              <span>100% Replacement Warranty</span>
            </div>
            <div class="flex items-center gap-2">
              <Zap class="w-4 h-4 text-amber-500 shrink-0" :stroke-width="2" />
              <span>Proses WhatsApp Kilat</span>
            </div>
            <div class="flex items-center gap-2">
              <CreditCard class="w-4 h-4 text-blue-600 shrink-0" :stroke-width="2" />
              <span>Bayar QRIS & Bank Resmi</span>
            </div>
          </div>

        </div>

        <!-- ========================================== -->
        <!-- RIGHT COLUMN: Scrollable Store Preview     -->
        <!-- ========================================== -->
        <div class="lg:col-span-5 w-full">
          <div class="bg-white rounded-2xl border border-zinc-200/90 shadow-elevated p-5 sm:p-6 transition-all duration-200">
            
            <!-- Card Header: Title, Scroll Hint & Stock Status -->
            <div class="flex items-center justify-between pb-3.5 border-b border-zinc-100 gap-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span class="text-xs font-bold text-zinc-900 tracking-wide uppercase font-mono truncate">
                  Katalog Unggulan Hari Ini
                </span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="hidden sm:inline-flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <ArrowUpDown class="w-3 h-3 text-zinc-400" />
                  <span>Scroll</span>
                </span>
                <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-semibold">
                  ● Ready Instant
                </span>
              </div>
            </div>

            <!-- Scrollable List of Featured Items (Scroll Up & Down) -->
            <div class="mt-3.5 space-y-2 max-h-[310px] sm:max-h-[350px] overflow-y-auto pr-1.5 scroll-smooth custom-scrollbar">
              <div 
                v-for="item in previewItems" 
                :key="item.name"
                @click="goToProduct(item.category, item.productId)"
                class="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-all duration-150 cursor-pointer group"
                :title="`Klik untuk langsung ke ${item.name} (#${item.category})`"
              >
                <!-- Left: Logo & Info -->
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center p-1.5 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <img :src="item.logo" :alt="item.name" class="w-full h-full object-contain" />
                  </div>
                  <div class="min-w-0 text-left">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold text-zinc-950 truncate group-hover:text-blue-600 transition-colors">
                        {{ item.name }}
                      </span>
                    </div>
                    <span class="text-[10px] font-mono text-zinc-500 block truncate">
                      {{ item.categoryName }}
                    </span>
                  </div>
                </div>

                <!-- Right: Price & Badge -->
                <div class="text-right shrink-0 pl-2">
                  <div class="flex items-center gap-1.5 justify-end">
                    <span class="text-xs font-bold font-mono text-zinc-950">
                      {{ item.price }}
                    </span>
                    <span class="text-[10px] font-mono text-zinc-400 line-through hidden sm:inline">
                      {{ item.strike }}
                    </span>
                  </div>
                  <span class="inline-block text-[9px] font-mono font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {{ item.badge }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Card Action: Direct Catalog Jump -->
            <div class="mt-4 pt-3.5 border-t border-zinc-100">
              <button
                type="button"
                @click="scrollToSection('semua-produk-pull-store', 'digital')"
                class="w-full py-2.5 px-3 rounded-xl bg-zinc-950 text-white hover:bg-blue-600 text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Jelajahi {{ PRODUCTS.length }} Produk Digital Pull Store</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>

              <div class="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                <Check class="w-3 h-3 text-emerald-600" :stroke-width="2.5" />
                <span>Klik item untuk lompat langsung ke paket di katalog</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Custom Sleek Scrollbar for the preview list */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f4f4f5;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d4d4d8;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1aa;
}
</style>
