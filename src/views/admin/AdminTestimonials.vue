<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { supabase } from '../../lib/supabase'
import { useTestimonials } from '../../composables/useTestimonials'
import { SPREADSHEET_TRANSPARENCY_URL, type TestimonialItem } from '../../data/testimonials'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import AdminPagination from '../../components/admin/AdminPagination.vue'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  FileSpreadsheet, 
  ExternalLink,
  CheckCircle2
} from 'lucide-vue-next'

interface FormState {
  id?: string
  clientName: string
  orderName: string
  orderDate: string
  price: number
  warranty: string
  notes: string
  imageUrl: string
  rating: number
  verified: boolean
}

const { testimonials, isLoading, isUsingRemote, refetch } = useTestimonials()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredTestimonials = computed(() => {
  if (!searchQuery.value) return testimonials.value
  const q = searchQuery.value.toLowerCase()
  return testimonials.value.filter(t => 
    t.clientName.toLowerCase().includes(q) || 
    t.orderName.toLowerCase().includes(q) ||
    (t.warranty && t.warranty.toLowerCase().includes(q)) ||
    (t.notes && t.notes.toLowerCase().includes(q))
  )
})

const paginatedTestimonials = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTestimonials.value.slice(start, start + pageSize.value)
})

watch(searchQuery, () => {
  currentPage.value = 1
})
const isModalOpen = ref(false)
const isSaving = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const successToast = ref('')
const errorToast = ref('')

const defaultForm: FormState = {
  clientName: '',
  orderName: '',
  orderDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
  price: 35000,
  warranty: 'Garansi 30 Hari Ganti Baru',
  notes: '',
  imageUrl: '',
  rating: 5,
  verified: true
}

const form = ref<FormState>({ ...defaultForm })

const showToast = (msg: string, isError = false) => {
  if (isError) {
    errorToast.value = msg
    setTimeout(() => { errorToast.value = '' }, 3500)
  } else {
    successToast.value = msg
    setTimeout(() => { successToast.value = '' }, 3000)
  }
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

const openCreateModal = () => {
  modalMode.value = 'create'
  form.value = { 
    ...defaultForm, 
    imageUrl: '',
    orderDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  isModalOpen.value = true
}

const openEditModal = (item: TestimonialItem) => {
  modalMode.value = 'edit'
  form.value = {
    id: item.id,
    clientName: item.clientName,
    orderName: item.orderName,
    orderDate: item.orderDate,
    price: item.price,
    warranty: item.warranty,
    notes: item.notes,
    imageUrl: item.imageUrl || '',
    rating: item.rating || 5,
    verified: item.verified !== false
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const setOrderSuggestion = (name: string, price: number, warranty: string) => {
  form.value.orderName = name
  form.value.price = price
  form.value.warranty = warranty
}

const handleSave = async () => {
  if (!form.value.clientName.trim() || !form.value.orderName.trim() || !form.value.notes.trim()) {
    showToast('Harap isi Nama Client, Nama Pesanan, dan Keterangan', true)
    return
  }

  isSaving.value = true
  try {
    if (!supabase) throw new Error('Supabase belum terkonfigurasi')

    const payload = {
      client_name: form.value.clientName,
      order_name: form.value.orderName,
      order_date: form.value.orderDate,
      price: Number(form.value.price),
      price_display: formatRupiah(Number(form.value.price)),
      warranty: form.value.warranty,
      notes: form.value.notes,
      image_url: form.value.imageUrl?.trim() || null,
      rating: Number(form.value.rating || 5),
      verified: form.value.verified
    }

    if (modalMode.value === 'create') {
      const { error } = await supabase.from('testimonials').insert([payload])
      if (error) throw error
      showToast('Testimonial baru berhasil ditambahkan!')
    } else {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', form.value.id)
      if (error) throw error
      showToast('Testimonial berhasil diperbarui!')
    }

    closeModal()
    await refetch()
  } catch (err: any) {
    showToast('Gagal menyimpan: ' + err.message, true)
  } finally {
    isSaving.value = false
  }
}

const deleteTestimonial = async (id: string, clientName: string) => {
  if (!confirm(`Hapus testimonial dari "${clientName}"?`)) return
  try {
    if (!supabase) throw new Error('Supabase belum terkonfigurasi')
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) throw error
    showToast(`Testimonial "${clientName}" berhasil dihapus`)
    await refetch()
  } catch (err: any) {
    showToast('Gagal menghapus: ' + err.message, true)
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Toasts -->
    <div v-if="successToast" class="fixed top-5 right-5 z-50 p-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn">
      <Check class="w-4 h-4" />
      <span>{{ successToast }}</span>
    </div>
    <div v-if="errorToast" class="fixed top-5 right-5 z-50 p-4 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn">
      <AlertCircle class="w-4 h-4" />
      <span>{{ errorToast }}</span>
    </div>

    <!-- Header & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Kelola Testimonial & Bukti Transaksi
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          Input dan edit testimoni pembeli, rincian pesanan, dan masa aktif garansi
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <a
          :href="SPREADSHEET_TRANSPARENCY_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-xs font-mono transition-colors"
          title="Buka Google Spreadsheet Transparansi"
        >
          <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-400" />
          <span>Lihat Google Sheets</span>
          <ExternalLink class="w-3 h-3 opacity-60" />
        </a>

        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Testimoni</span>
        </button>

        <button
          type="button"
          @click="refetch"
          :disabled="isLoading"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-400"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
          <span class="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>

    <!-- Notice if Supabase table is not yet created -->
    <div v-if="!isUsingRemote && !isLoading" class="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-3">
      <AlertCircle class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div class="space-y-1">
        <p class="font-bold text-amber-200">Database Supabase: Tabel "testimonials" Belum Dibuat</p>
        <p class="text-zinc-300 leading-relaxed">
          Web saat ini menampilkan data lokal fallback. Untuk mengaktifkan penyimpanan cloud & bisa input testimoni baru, buka <strong>SQL Editor</strong> di dashboard Supabase lalu jalankan query dari:
        </p>
        <p class="font-mono text-[11px] text-amber-300 bg-black/50 px-2.5 py-1.5 rounded border border-amber-900/50 inline-block">
          scripts/create-testimonials-table.sql
        </p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative w-full sm:w-80">
      <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Cari client, pesanan, garansi..." 
        class="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
      />
    </div>

    <!-- Testimonials Table -->
    <div class="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono">
              <th class="py-3 px-4 font-medium">Nama Client</th>
              <th class="py-3 px-4 font-medium">Pesanan</th>
              <th class="py-3 px-4 font-medium">Tanggal</th>
              <th class="py-3 px-4 font-medium">Harga</th>
              <th class="py-3 px-4 font-medium">Garansi</th>
              <th class="py-3 px-4 font-medium">Ulasan / Keterangan</th>
              <th class="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <TableSkeleton v-if="isLoading" :rows="5" :cols="7" />
          <tbody v-else class="divide-y divide-zinc-800/60">
            <tr 
              v-for="item in paginatedTestimonials" 
              :key="item.id"
              class="hover:bg-zinc-800/20 transition-colors"
            >
              <td class="py-3 px-4 font-medium text-white whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span>{{ item.clientName }}</span>
                  <CheckCircle2 v-if="item.verified" class="w-3.5 h-3.5 text-blue-400 shrink-0" />
                </div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {{ item.orderName }}
                </span>
              </td>
              <td class="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                {{ item.orderDate }}
              </td>
              <td class="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                {{ formatRupiah(item.price) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {{ item.warranty }}
                </span>
              </td>
              <td class="py-3 px-4 text-zinc-300 max-w-xs truncate" :title="item.notes">
                {{ item.notes }}
              </td>
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    @click="openEditModal(item)"
                    class="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Edit Testimonial"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="deleteTestimonial(item.id, item.clientName)"
                    class="p-1.5 rounded-lg bg-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                    title="Hapus Testimonial"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTestimonials.length === 0">
              <td colspan="7" class="py-12 text-center text-zinc-500 font-mono text-xs">
                Tidak ada testimonial yang sesuai dengan pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Component -->
      <AdminPagination
        v-if="!isLoading && filteredTestimonials.length > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total-items="filteredTestimonials.length"
        :page-size-options="[10, 20, 50, 100]"
      />
    </div>

    <!-- Modal Form (Tambah / Edit Testimonial) -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <h2 class="text-base font-bold text-white tracking-tight">
            {{ modalMode === 'create' ? 'Tambah Testimonial / Transaksi Baru' : 'Edit Testimonial: ' + form.clientName }}
          </h2>
          <button type="button" @click="closeModal" class="text-zinc-400 hover:text-white">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
          <!-- Quick Suggestions for Order Name -->
          <div class="space-y-1">
            <span class="text-[10px] font-mono text-zinc-500 uppercase">Pilihan Cepat Pesanan:</span>
            <div class="flex flex-wrap gap-1.5">
              <button 
                type="button" 
                @click="setOrderSuggestion('Aplikasi Tugas Akhir / Skripsi Mahasiswa (Logic + Source Code)', 500000, 'Garansi Revisi Minor Sampai Sidang')"
                class="px-2 py-1 rounded bg-blue-950/60 border border-blue-800/50 hover:bg-blue-900/60 text-[10px] text-blue-300 font-medium"
              >
                🎓 + Tugas Akhir (500K)
              </button>
              <button 
                type="button" 
                @click="setOrderSuggestion('Aplikasi Android Kasir & Stok (100% Offline)', 700000, 'Garansi 3 Bulan Free Maintenance')"
                class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
              >
                + APK Kasir (700K)
              </button>
              <button 
                type="button" 
                @click="setOrderSuggestion('Website Jualan Statis (Fast & Clean)', 850000, 'Garansi 3 Bulan Free Maintenance')"
                class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
              >
                + Web Statis (850K)
              </button>
              <button 
                type="button" 
                @click="setOrderSuggestion('Website Jualan Dinamis (Katalog, CMS & Admin)', 1500000, 'Garansi 3 Bulan Free Maintenance')"
                class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
              >
                + Web Dinamis (1.5Jt)
              </button>
              <button 
                type="button" 
                @click="setOrderSuggestion('ChatGPT Plus Shared (2 User Anti-Limit)', 35000, 'Garansi 30 Hari Ganti Baru')"
                class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
              >
                + ChatGPT Plus (35K)
              </button>
              <button 
                type="button" 
                @click="setOrderSuggestion('Canva Pro Member Team (1 Bulan)', 15000, 'Garansi 30 Hari')"
                class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
              >
                + Canva Pro (15K)
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 1.2 Nama Client / Anonim -->
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">
                1.2 Nama Client / Anonim *
              </label>
              <input 
                v-model="form.clientName" 
                type="text" 
                required 
                placeholder="Contoh: Reza Pratama (Surabaya) atau Anonim" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <!-- 1.3 Nama Pesanan -->
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">
                1.3 Nama Pesanan *
              </label>
              <input 
                v-model="form.orderName" 
                type="text" 
                required 
                placeholder="Contoh: Aplikasi Kasir Offline / ChatGPT Plus" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- 1.4 Tanggal Pesanan -->
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">
                1.4 Tanggal Pesanan *
              </label>
              <input 
                v-model="form.orderDate" 
                type="text" 
                required 
                placeholder="Contoh: 20 Okt 2026" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <!-- 1.5 Harga -->
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">
                1.5 Harga (Rp) *
              </label>
              <input 
                v-model.number="form.price" 
                type="number" 
                required 
                placeholder="700000" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <!-- 1.6 Garansi -->
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">
                1.6 Garansi *
              </label>
              <input 
                v-model="form.warranty" 
                type="text" 
                required 
                placeholder="Garansi 3 Bulan Free Maintenance" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- 1.1 Gambar (Opsional) -->
          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">
              1.1 URL Gambar Bukti Transfer / Screenshot Chat (Opsional)
            </label>
            <input 
              v-model="form.imageUrl" 
              type="url" 
              placeholder="https://i.imgur.com/... atau link gambar bukti" 
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <!-- 1.7 Keterangan -->
          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">
              1.7 Keterangan / Ulasan Pelanggan *
            </label>
            <textarea 
              v-model="form.notes" 
              rows="3" 
              required 
              placeholder="Tulis testimoni/feedback dari pembeli..." 
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white disabled:opacity-50"
            >
              <Save class="w-4 h-4" />
              <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Testimonial' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
