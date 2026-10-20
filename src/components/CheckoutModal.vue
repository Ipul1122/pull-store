<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { ProductItem, ServiceItem, CheckoutPayload } from '../types'
import { useWhatsAppOrder } from '../composables/useWhatsAppOrder'
import { STORE_INFO } from '../data/catalog'
import { 
  X, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  User, 
  FileText,
  ArrowRight,
  Lock
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  item: ProductItem | ServiceItem | null
  itemType: 'product' | 'service'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { formatRupiah, openWhatsApp } = useWhatsAppOrder()

const customerName = ref('')
const customerNotes = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)
const nameError = ref(false)

// Reset state when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nameError.value = false
    nextTick(() => {
      nameInputRef.value?.focus()
    })
  }
})

// Item details computed helpers
const isProduct = computed(() => props.itemType === 'product')
const productItem = computed(() => isProduct.value ? (props.item as ProductItem) : null)
const serviceItem = computed(() => !isProduct.value ? (props.item as ServiceItem) : null)

const itemName = computed(() => {
  return props.item?.name || ''
})

const itemCategoryOrVariant = computed(() => {
  if (isProduct.value && productItem.value) {
    if (productItem.value.category === 'rating') {
      return `${productItem.value.accountType} • Pengerjaan ${productItem.value.duration}`
    }
    return `Akun ${productItem.value.accountType} (${productItem.value.duration})`
  }
  if (serviceItem.value) {
    return `${serviceItem.value.categoryLabel} • Timeline: ${serviceItem.value.timeline}`
  }
  return ''
})

const priceFormatted = computed(() => {
  if (isProduct.value && productItem.value) {
    return formatRupiah(productItem.value.price)
  }
  if (serviceItem.value) {
    return serviceItem.value.priceDisplay || `Mulai ${formatRupiah(serviceItem.value.startingPrice)}`
  }
  return 'Rp 0'
})

const handleCheckout = () => {
  if (!customerName.value.trim()) {
    nameError.value = true
    nameInputRef.value?.focus()
    return
  }

  nameError.value = false

  const payload: CheckoutPayload = {
    itemType: props.itemType,
    itemId: props.item?.id || '',
    itemName: itemName.value,
    itemVariantOrCategory: itemCategoryOrVariant.value,
    priceDisplay: priceFormatted.value,
    customerName: customerName.value.trim(),
    notes: customerNotes.value.trim() || undefined,
  }

  openWhatsApp(payload)
  emit('close')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}
</script>

<template>
  <div
    v-if="isOpen && item"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fadeIn"
    @click.self="emit('close')"
    @keydown="handleKeydown"
  >
    <div 
      class="relative w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-slideUp"
      role="dialog"
      aria-modal="true"
    >
      <!-- Top Bar -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/70">
        <div class="flex items-center gap-2">
          <div 
            class="w-7 h-7 rounded-lg flex items-center justify-center"
            :class="isProduct ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'"
          >
            <Sparkles v-if="isProduct" class="w-4 h-4" :stroke-width="1.75" />
            <Code2 v-else class="w-4 h-4" :stroke-width="1.75" />
          </div>
          <div>
            <span class="text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider">
              {{ isProduct ? (productItem?.category === 'rating' ? 'Konfirmasi Order Jasa' : 'Konfirmasi Order Akun') : 'Permintaan Konsultasi' }}
            </span>
            <h3 class="text-sm font-bold text-zinc-950 leading-none mt-0.5">
              {{ STORE_INFO.brandName }} Direct Checkout
            </h3>
          </div>
        </div>

        <button
          type="button"
          @click="emit('close')"
          class="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          aria-label="Tutup modal"
        >
          <X class="w-4 h-4" :stroke-width="2" />
        </button>
      </div>

      <!-- Item Summary Box -->
      <div class="p-6 space-y-5">
        <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <div v-if="isProduct && productItem?.logo" class="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center p-2 shrink-0 shadow-subtle">
              <img :src="productItem.logo" :alt="itemName" class="w-6 h-6 object-contain" />
            </div>
            <div class="space-y-1">
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-200/80 text-zinc-700">
                {{ itemCategoryOrVariant }}
              </span>
              <h4 class="text-sm font-bold text-zinc-950">
                {{ itemName }}
              </h4>
              <div v-if="isProduct && productItem" class="flex items-center gap-2 text-xs text-zinc-500 pt-0.5">
                <span class="font-mono text-emerald-600 font-medium">
                  {{ productItem.garansi || (productItem.category === 'rating' ? 'Garansi Refill 30 Hari' : 'Garansi 100% Penggantian') }}
                </span>
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="text-[10px] font-mono text-zinc-400 uppercase block">Total / Mulai</span>
            <span class="text-base font-bold font-mono text-zinc-950">
              {{ priceFormatted }}
            </span>
          </div>
        </div>

        <!-- Form Inputs -->
        <form @submit.prevent="handleCheckout" class="space-y-4">
          <!-- Customer Name Input -->
          <div>
            <label for="customer-name" class="block text-xs font-semibold text-zinc-800 mb-1.5 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <User class="w-3.5 h-3.5 text-zinc-500" :stroke-width="1.75" />
                Nama Anda / Instansi <span class="text-red-500">*</span>
              </span>
              <span v-if="nameError" class="text-[11px] text-red-500 font-normal">Nama wajib diisi</span>
            </label>
            <input
              id="customer-name"
              ref="nameInputRef"
              v-model="customerName"
              type="text"
              placeholder="Contoh: Muhammad Budi / CV Maju Berkah"
              class="w-full px-3.5 py-2.5 rounded-lg text-xs bg-white border text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              :class="nameError ? 'border-red-400 focus:ring-red-500' : 'border-zinc-200'"
            />
          </div>

          <!-- Customer Notes Input -->
          <div>
            <label for="customer-notes" class="block text-xs font-semibold text-zinc-800 mb-1.5 flex items-center gap-1.5">
              <FileText class="w-3.5 h-3.5 text-zinc-500" :stroke-width="1.75" />
              <span>{{ isProduct ? 'Catatan / Request Email Khusus (Opsional)' : 'Deskripsi Kebutuhan Singkat' }}</span>
            </label>
            <textarea
              id="customer-notes"
              v-model="customerNotes"
              rows="2"
              :placeholder="isProduct ? 'Contoh: Mau pakai email pribadi saya / butuh aktivasi segera' : 'Contoh: Perlu aplikasi kasir untuk 2 cabang cafe di Bandung'"
              class="w-full px-3.5 py-2 rounded-lg text-xs bg-white border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
            ></textarea>
          </div>

          <!-- WhatsApp Routing Info Note -->
          <div class="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
            <Lock class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" :stroke-width="1.75" />
            <span class="leading-relaxed text-[11px]">
              Klik tombol di bawah akan langsung mengarahkan Anda ke WhatsApp resmi <strong class="font-medium">+62 856-9367-2730</strong> dengan pesan otomatis terformat rapi.
            </span>
          </div>

          <!-- Action Button -->
          <button
            type="submit"
            class="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-zinc-950 text-white hover:bg-blue-600 hover:shadow-elevated transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <MessageSquare class="w-4 h-4 text-emerald-400" :stroke-width="1.75" />
            <span>Lanjut ke WhatsApp (wa.me/{{ STORE_INFO.whatsappNumber }})</span>
            <ArrowRight class="w-4 h-4 ml-1" :stroke-width="1.75" />
          </button>
        </form>
      </div>

      <!-- Footer Guarantee Strip -->
      <div class="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
        <div class="flex items-center gap-1.5">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" :stroke-width="1.75" />
          <span>Transaksi Langsung & Terpercaya</span>
        </div>
        <span class="font-mono">Pull Store by {{ STORE_INFO.founder }}</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.15s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
