<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ServiceItem } from '../types'
import { useWhatsAppOrder } from '../composables/useWhatsAppOrder'
import { 
  Globe, 
  Smartphone, 
  Layers, 
  Clock, 
  Check,
  CheckCircle2, 
  MessageSquare, 
  Wrench, 
  Link2, 
  CheckCheck, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap
} from 'lucide-vue-next'

const props = defineProps<{
  service: ServiceItem
  cardId?: string
}>()

const emit = defineEmits<{
  (e: 'select-service', service: ServiceItem): void
}>()

const { formatRupiah } = useWhatsAppOrder()

const isCopied = ref(false)

const copyServiceLink = async () => {
  const url = `${window.location.origin}/p/software.html`
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

const splitItem = (text: string) => {
  const idx = text.indexOf(':')
  if (idx !== -1) {
    return {
      title: text.slice(0, idx).trim(),
      desc: text.slice(idx + 1).trim()
    }
  }
  return { title: '', desc: text }
}

const iconComponent = computed(() => {
  switch (props.service.iconName) {
    case 'Globe': return Globe
    case 'Smartphone': return Smartphone
    case 'Layers': return Layers
    case 'GraduationCap': return GraduationCap
    default: return Wrench
  }
})

const onConsultClick = () => {
  emit('select-service', props.service)
}
</script>

<template>
  <div 
    :id="cardId || undefined"
    class="relative flex flex-col justify-between bg-white rounded-2xl p-7 border transition-all duration-300 group scroll-mt-24 h-full"
    :class="service.recommended 
      ? 'border-blue-500/80 shadow-[0_4px_25px_rgba(37,99,235,0.08)] ring-1 ring-blue-500/20' 
      : 'border-zinc-200/90 hover:border-zinc-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'"
  >
    <div>
      <!-- Header Row: Category, Icon & Share -->
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
            <component :is="iconComponent" class="w-4 h-4" :stroke-width="2" />
          </div>
          <span class="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600">
            {{ service.categoryLabel }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Recommended Badge -->
          <span 
            v-if="service.recommended || service.badge" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
            :class="service.recommended 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'"
          >
            {{ service.recommended ? 'Pilihan Populer' : service.badge }}
          </span>

          <!-- Copy Link Button -->
          <button
            type="button"
            @click.stop="copyServiceLink"
            class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            :title="isCopied ? 'Link tersalin!' : 'Salin tautan layanan ini'"
          >
            <CheckCheck v-if="isCopied" class="w-3.5 h-3.5 text-emerald-600" />
            <Link2 v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Service Title -->
      <h3 class="text-xl font-bold text-zinc-950 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
        {{ service.name }}
      </h3>
      
      <!-- Tagline -->
      <p class="mt-2 text-xs text-zinc-600 leading-relaxed">
        {{ service.tagline }}
      </p>

      <!-- Clean Pricing & Specs Card -->
      <div class="mt-5 p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Estimasi Investasi
          </span>
          <div class="text-2xl font-bold font-mono text-zinc-950 tracking-tight mt-0.5">
            {{ service.priceDisplay || formatRupiah(service.startingPrice) }}
          </div>
        </div>

        <div class="sm:text-right space-y-1">
          <div class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Full Source Code & Database</span>
          </div>
          <div class="flex items-center sm:justify-end gap-1.5 text-[11px] font-mono text-zinc-500">
            <Clock class="w-3 h-3 text-zinc-400" />
            <span>Pengerjaan: {{ service.timeline }}</span>
          </div>
        </div>
      </div>

      <!-- Value Props (Clean Horizontal Pills) -->
      <div v-if="service.advantages && service.advantages.length > 0" class="mt-4 flex flex-wrap gap-1.5">
        <span 
          v-for="adv in service.advantages" 
          :key="adv"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100/80 text-zinc-700 border border-zinc-200/60"
        >
          <Check class="w-3 h-3 text-emerald-600 shrink-0" :stroke-width="2.25" />
          <span>{{ adv }}</span>
        </span>
      </div>

      <!-- Deliverables List -->
      <div class="mt-5 pt-4 border-t border-zinc-100">
        <span class="text-[10px] font-mono uppercase font-semibold tracking-wider text-zinc-400 block mb-3">
          Paket yang Anda Terima:
        </span>
        <ul class="space-y-2.5 text-xs">
          <li 
            v-for="(item, idx) in service.deliverables" 
            :key="idx"
            class="flex items-start gap-2.5"
          >
            <div class="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/80">
              <CheckCircle2 class="w-2.5 h-2.5" :stroke-width="2.5" />
            </div>
            <div class="leading-relaxed text-zinc-700">
              <strong v-if="splitItem(item).title" class="font-semibold text-zinc-950">
                {{ splitItem(item).title }}:
              </strong>
              <span class="ml-1 text-zinc-600 font-normal">
                {{ splitItem(item).desc }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Footer: Warranty & CTA -->
    <div class="mt-6 pt-4 border-t border-zinc-100 space-y-3">
      <!-- Maintenance Note -->
      <div 
        v-if="service.maintenanceWarranty"
        class="text-[11px] text-zinc-500 flex items-center gap-1.5"
      >
        <ShieldCheck class="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span class="truncate">{{ service.maintenanceWarranty }}</span>
      </div>

      <!-- CTA Button -->
      <button
        type="button"
        @click="onConsultClick"
        class="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.99] shadow-sm"
        :class="service.recommended 
          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' 
          : 'bg-zinc-950 hover:bg-zinc-800'"
      >
        <MessageSquare class="w-4 h-4" :stroke-width="1.75" />
        <span>Konsultasi & Pesan via WhatsApp</span>
        <ArrowRight class="w-3.5 h-3.5 ml-0.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
