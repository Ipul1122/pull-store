<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProductItem, ProductVariant } from '../types'
import { useWhatsAppOrder } from '../composables/useWhatsAppOrder'
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Terminal, 
  Tv, 
  Headphones, 
  PlayCircle, 
  Palette, 
  Video, 
  Star, 
  Check, 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  Link2, 
  CheckCheck, 
  ChevronDown 
} from 'lucide-vue-next'
import { resolveBrandLogo } from '../composables/useCatalog'

const props = defineProps<{
  product: ProductItem
}>()

const emit = defineEmits<{
  (e: 'select-product', product: ProductItem): void
}>()

const { formatRupiah } = useWhatsAppOrder()

// Selected variant (default to popular variant if exists, else first variant)
const selectedVariant = ref<ProductVariant | null>(
  props.product.variants?.find(v => v.popular) || props.product.variants?.[0] || null
)

// Computed values based on active variant or base product
const currentPrice = computed(() => selectedVariant.value?.price ?? props.product.price)
const currentOriginalPrice = computed(() => selectedVariant.value?.originalPrice ?? props.product.originalPrice)
const currentDuration = computed(() => selectedVariant.value?.duration ?? props.product.duration)
const currentGaransi = computed(() => selectedVariant.value?.garansi ?? props.product.garansi ?? 'Garansi Penggantian Penuh')

const resolvedLogo = computed(() => {
  return props.product.logo || resolveBrandLogo(props.product.id, props.product.name, props.product.category)
})

// Features expand/collapse state
const isExpandedFeatures = ref(false)

const displayedFeatures = computed(() => {
  if (isExpandedFeatures.value || props.product.features.length <= 4) {
    return props.product.features
  }
  return props.product.features.slice(0, 4)
})

// Helper to get share slug
const getProductShareSlug = (id: string): string => {
  if (id.startsWith('netflix')) return 'netflix'
  if (id.startsWith('spotify')) return 'spotify'
  if (id.startsWith('chatgpt')) return 'chatgpt'
  if (id.startsWith('claude')) return 'claude'
  if (id.includes('gemini')) return 'gemini'
  if (id.startsWith('canva')) return 'canva'
  if (id.startsWith('capcut')) return 'capcut'
  if (id.startsWith('gmaps')) return 'google-maps'
  if (id.startsWith('zoom')) return 'zoom'
  if (id.startsWith('youtube') || id.startsWith('yt')) return 'youtube'
  if (id.startsWith('vidio')) return 'vidio'
  return id
}

// Copy direct product preview link
const isCopied = ref(false)

const copyProductLink = async () => {
  const slug = getProductShareSlug(props.product.id)
  const url = `${window.location.origin}/p/${slug}.html`
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
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  }
}

// Map icon name to Lucide component
const iconComponent = computed(() => {
  switch (props.product.iconName) {
    case 'Bot': return Bot
    case 'Cpu': return Cpu
    case 'Sparkles': return Sparkles
    case 'Terminal': return Terminal
    case 'Tv': return Tv
    case 'Headphones': return Headphones
    case 'PlayCircle': return PlayCircle
    case 'Palette': return Palette
    case 'Video': return Video
    case 'Star': return Star
    default: return Layers
  }
})

const onOrderClick = () => {
  emit('select-product', {
    ...props.product,
    price: currentPrice.value,
    originalPrice: currentOriginalPrice.value,
    duration: currentDuration.value,
    garansi: currentGaransi.value
  })
}
</script>

<template>
  <div 
    :id="'product-' + product.id"
    class="relative flex flex-col justify-between bg-white rounded-2xl p-6 border transition-all duration-300 group scroll-mt-24 h-full"
    :class="product.popular 
      ? 'border-blue-500/80 shadow-[0_4px_20px_rgba(37,99,235,0.08)] ring-1 ring-blue-500/20' 
      : 'border-zinc-200/90 hover:border-zinc-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'"
  >
    <!-- Card Body -->
    <div>
      <!-- Top Meta Row -->
      <div class="flex items-center justify-between gap-2 mb-4">
        <!-- Stock / Account Type Indicator -->
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
            <span 
              class="w-1.5 h-1.5 rounded-full"
              :class="product.stockStatus === 'ready' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
            ></span>
            <span>{{ product.stockStatus === 'ready' ? 'Ready Stock' : `Sisa ${product.stockCount || 1} Akun` }}</span>
          </span>
          <span class="text-zinc-300">•</span>
          <span class="text-[11px] text-zinc-500 font-mono">
            {{ product.category === 'rating' ? product.accountType : product.accountType }}
          </span>
        </div>

        <!-- Badge -->
        <span 
          v-if="product.popular || product.badge" 
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide shrink-0"
          :class="product.popular 
            ? 'bg-blue-600 text-white shadow-xs' 
            : 'bg-zinc-100 text-zinc-700 border border-zinc-200/80'"
        >
          {{ product.popular ? '★ Paling Laris' : product.badge }}
        </span>
      </div>

      <!-- App Header: Icon + Title + Share Button -->
      <div class="flex items-start gap-3.5 mb-3.5">
        <!-- App Tile Icon -->
        <div class="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 p-2 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:scale-105 group-hover:border-blue-200 transition-all">
          <img 
            v-if="resolvedLogo" 
            :src="resolvedLogo" 
            :alt="product.name" 
            class="w-full h-full object-contain" 
            loading="lazy" 
          />
          <component v-else :is="iconComponent" class="w-6 h-6 text-zinc-700 group-hover:text-blue-600" :stroke-width="1.75" />
        </div>

        <!-- Title & Category -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-1">
            <h3 
              class="text-base font-bold text-zinc-950 tracking-tight leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
              :title="product.name"
            >
              {{ product.name }}
            </h3>
            
            <!-- Discreet Share Button -->
            <button
              type="button"
              @click.stop="copyProductLink"
              class="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
              :title="isCopied ? 'Link disalin!' : 'Salin link ' + product.name"
            >
              <CheckCheck v-if="isCopied" class="w-3.5 h-3.5 text-emerald-600" />
              <Link2 v-else class="w-3.5 h-3.5" />
            </button>
          </div>
          <span class="text-[11px] font-mono text-zinc-400 block mt-0.5 uppercase tracking-wide">
            {{ product.categoryLabel }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-xs text-zinc-600 leading-relaxed line-clamp-2 mb-4 min-h-[32px]">
        {{ product.description }}
      </p>

      <!-- Segmented Variant Pills -->
      <div v-if="product.variants && product.variants.length > 0" class="mb-4">
        <div class="p-1 bg-zinc-100/80 rounded-xl flex items-center gap-1">
          <button
            v-for="variant in product.variants"
            :key="variant.id"
            type="button"
            @click="selectedVariant = variant"
            class="flex-1 py-1.5 px-2 rounded-lg text-center transition-all duration-150 focus:outline-none"
            :class="selectedVariant?.id === variant.id 
              ? 'bg-white text-zinc-950 shadow-xs font-semibold' 
              : 'text-zinc-500 hover:text-zinc-800 font-medium'"
          >
            <span class="text-[11px] block leading-tight">{{ variant.duration }}</span>
          </button>
        </div>
      </div>

      <!-- Feature Checklist (Clean & Subtle) -->
      <div class="pt-3 border-t border-zinc-100/90">
        <ul class="space-y-2 text-xs text-zinc-600">
          <li 
            v-for="(feature, idx) in displayedFeatures" 
            :key="idx"
            class="flex items-start gap-2"
          >
            <Check class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" :stroke-width="2.25" />
            <span class="leading-relaxed flex-1 break-words">{{ feature }}</span>
          </li>
        </ul>

        <!-- Expand / Collapse -->
        <button 
          v-if="product.features.length > 4" 
          type="button"
          @click="isExpandedFeatures = !isExpandedFeatures"
          class="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>{{ isExpandedFeatures ? 'Tutup rincian' : `+${product.features.length - 4} fitur lainnya` }}</span>
          <ChevronDown class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': isExpandedFeatures }" />
        </button>
      </div>
    </div>

    <!-- Pricing & Action Footer -->
    <div class="mt-5 pt-4 border-t border-zinc-100">
      <!-- Price & Warranty Line -->
      <div class="flex items-baseline justify-between gap-2 mb-3">
        <div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold font-mono text-zinc-950 tracking-tight">
              {{ formatRupiah(currentPrice) }}
            </span>
            <span 
              v-if="currentOriginalPrice && currentOriginalPrice > currentPrice" 
              class="text-xs font-mono text-zinc-400 line-through"
            >
              {{ formatRupiah(currentOriginalPrice) }}
            </span>
          </div>
          <span class="text-[10px] text-zinc-400 font-mono block mt-0.5">
            Durasi {{ currentDuration }}
          </span>
        </div>

        <div class="text-right">
          <span class="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck class="w-3 h-3 text-emerald-600" />
            <span>{{ currentGaransi }}</span>
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <button
        type="button"
        @click="onOrderClick"
        class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.99]"
        :class="product.popular 
          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' 
          : 'bg-zinc-950 hover:bg-zinc-800'"
      >
        <span>Pesan via WhatsApp</span>
        <ArrowUpRight class="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
