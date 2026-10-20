<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTestimonials } from '../composables/useTestimonials'
import { SPREADSHEET_TRANSPARENCY_URL } from '../data/testimonials'
import { 
  ShieldCheck, 
  ExternalLink, 
  Star, 
  Search, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet,
  Image as ImageIcon,
  X
} from 'lucide-vue-next'

const { testimonials } = useTestimonials()

const searchQuery = ref('')
const selectedImageModal = ref<string | null>(null)

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

const filteredTestimonials = computed(() => {
  if (!searchQuery.value.trim()) return testimonials.value
  const q = searchQuery.value.toLowerCase()
  return testimonials.value.filter(t => 
    t.clientName.toLowerCase().includes(q) ||
    t.orderName.toLowerCase().includes(q) ||
    t.notes.toLowerCase().includes(q) ||
    t.warranty.toLowerCase().includes(q)
  )
})
</script>

<template>
  <section id="testimonial" class="py-16 md:py-24 bg-white border-b border-zinc-200 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-10">
        <span class="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          Bukti Nyata & Transparansi 100%
        </span>
        <h2 class="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
          Testimonial & Catatan Transaksi Klien
        </h2>
        <p class="mt-2 text-sm text-zinc-600">
          Bukan sekadar klaim sepihak. Kami mencatat riwayat pesanan, tanggal transaksi, nominal, dan masa aktif garansi secara terbuka agar Anda bertransaksi dengan tenang.
        </p>
      </div>

      <!-- KREDIBEL: Google Spreadsheet Live Transparency Banner -->
      <div class="mb-12 max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-emerald-900 to-zinc-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <!-- Background subtle glow -->
        <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-xl">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold">
              <FileSpreadsheet class="w-4 h-4 text-emerald-400" />
              <span>Google Spreadsheet Transparansi Publik</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold tracking-tight text-white">
              Rekap Transparansi Pembelian Pelanggan (Live)
            </h3>
            <p class="text-xs text-zinc-300 leading-relaxed">
              Anda berhak tahu kredibilitas toko sebelum membeli. Buka tautan spreadsheet resmi kami untuk mengecek rekap tanggal order, layanan yang dibeli, harga, serta pembuktian klaim garansi.
            </p>
          </div>

          <div class="shrink-0">
            <a
              :href="SPREADSHEET_TRANSPARENCY_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
            >
              <FileSpreadsheet class="w-4 h-4" />
              <span>Buka Google Spreadsheet</span>
              <ExternalLink class="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="max-w-md mx-auto mb-8 relative">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama klien, ChatGPT, Kasir, garansi..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-zinc-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
        />
      </div>

      <!-- Testimonials Grid -->
      <div 
        v-if="filteredTestimonials.length > 0" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="item in filteredTestimonials"
          :key="item.id"
          class="bg-white rounded-2xl border border-zinc-200/90 p-6 flex flex-col justify-between shadow-subtle hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-zinc-300 transition-all duration-300"
        >
          <div>
            <!-- Client Header -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <div class="flex items-center gap-1.5">
                  <h4 class="text-sm font-bold text-zinc-950 tracking-tight">
                    {{ item.clientName }}
                  </h4>
                  <span 
                    v-if="item.verified" 
                    class="inline-flex items-center text-blue-600" 
                    title="Pembeli Terverifikasi"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" />
                  </span>
                </div>
                <div class="flex items-center gap-1 text-[11px] text-zinc-400 font-mono mt-0.5">
                  <Calendar class="w-3 h-3" />
                  <span>{{ item.orderDate }}</span>
                </div>
              </div>

              <!-- Rating Stars -->
              <div class="flex items-center gap-0.5 text-amber-400">
                <Star 
                  v-for="s in (item.rating || 5)" 
                  :key="s" 
                  class="w-3.5 h-3.5 fill-amber-400" 
                />
              </div>
            </div>

            <!-- Order Name Chip -->
            <div class="mb-3.5">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200/80">
                📦 {{ item.orderName }}
              </span>
            </div>

            <!-- Review / Notes Text -->
            <p class="text-xs text-zinc-600 leading-relaxed italic mb-4">
              "{{ item.notes }}"
            </p>

            <!-- Optional Image Thumbnail -->
            <div v-if="item.imageUrl" class="mb-4">
              <button
                type="button"
                @click="selectedImageModal = item.imageUrl || null"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <ImageIcon class="w-3.5 h-3.5" />
                <span>Lihat Bukti Foto / Chat</span>
              </button>
            </div>
          </div>

          <!-- Transaction Meta Footer -->
          <div class="pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
            <div>
              <span class="text-[10px] font-mono text-zinc-400 block uppercase">Nominal:</span>
              <span class="font-bold font-mono text-zinc-950 text-sm">
                {{ item.priceDisplay || formatRupiah(item.price) }}
              </span>
            </div>

            <div class="text-right">
              <span class="text-[10px] font-mono text-zinc-400 block uppercase">Jaminan:</span>
              <span class="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck class="w-3 h-3 text-emerald-600" />
                <span>{{ item.warranty }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-2xl border border-zinc-200 shadow-subtle">
        <p v-if="searchQuery" class="text-xs text-zinc-500">Tidak ada testimonial yang cocok dengan pencarian "{{ searchQuery }}".</p>
        <div v-else class="max-w-md mx-auto text-center px-4">
          <p class="text-xs font-semibold text-zinc-800">Belum Ada Testimonial Publik</p>
          <p class="text-[11px] text-zinc-500 mt-1">Seluruh riwayat pesanan & garansi terekap transparan secara real-time pada Google Spreadsheet resmi.</p>
          <a
            :href="SPREADSHEET_TRANSPARENCY_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-all shadow-xs"
          >
            <FileSpreadsheet class="w-4 h-4 text-emerald-600" />
            <span>Lihat Spreadsheet Transparansi</span>
            <ExternalLink class="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
          </a>
        </div>
      </div>

    </div>

    <!-- Image Modal Zoom -->
    <div 
      v-if="selectedImageModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click="selectedImageModal = null"
    >
      <div class="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
        <button 
          type="button" 
          @click="selectedImageModal = null"
          class="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
        >
          <X class="w-5 h-5" />
        </button>
        <img :src="selectedImageModal" alt="Bukti Transaksi" class="max-w-full max-h-[80vh] object-contain rounded-xl" />
      </div>
    </div>
  </section>
</template>
