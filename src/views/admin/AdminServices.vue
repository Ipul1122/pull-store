<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../lib/supabase'
import { useCatalog } from '../../composables/useCatalog'
import type { ServiceItem } from '../../types'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  Clock, 
  ShieldCheck 
} from 'lucide-vue-next'

const { services, isLoading, refetch } = useCatalog()

const isModalOpen = ref(false)
const isSaving = ref(false)
const modalMode = ref<'create' | 'edit'>('edit')
const successToast = ref('')
const errorToast = ref('')

const form = ref<Partial<ServiceItem>>({
  id: '',
  name: '',
  category: 'landing-page',
  categoryLabel: 'Website & Profil',
  startingPrice: 850000,
  priceDisplay: 'Mulai Rp 850.000',
  timeline: '1 - 2 Minggu (7 - 10 Hari Kerja)',
  tagline: '',
  maintenanceWarranty: 'Garansi 3 Bulan Free Maintenance',
  badge: '',
  recommended: false,
  suitableFor: ''
})

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
    id: 'svc-' + Date.now().toString(36),
    name: '',
    category: 'landing-page',
    categoryLabel: 'Website & Profil',
    startingPrice: 850000,
    priceDisplay: 'Mulai Rp 850.000',
    timeline: '1 - 2 Minggu (7 - 14 Hari Kerja)',
    tagline: '',
    maintenanceWarranty: 'Garansi 3 Bulan Free Maintenance',
    badge: '',
    recommended: false,
    suitableFor: '',
    deliverables: [],
    advantages: []
  }
  isModalOpen.value = true
}

const openEditModal = (svc: ServiceItem) => {
  modalMode.value = 'edit'
  form.value = JSON.parse(JSON.stringify(svc))
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const showToast = (msg: string, isError = false) => {
  if (isError) {
    errorToast.value = msg
    setTimeout(() => { errorToast.value = '' }, 4000)
  } else {
    successToast.value = msg
    setTimeout(() => { successToast.value = '' }, 4000)
  }
}

const saveService = async () => {
  if (!supabase) {
    showToast('Koneksi Supabase tidak aktif', true)
    return
  }

  if (!form.value.name || !form.value.startingPrice) {
    showToast('Nama dan harga mulai wajib diisi', true)
    return
  }

  isSaving.value = true

  const dbRow = {
    id: form.value.id,
    name: form.value.name,
    category: form.value.category,
    category_label: form.value.categoryLabel || 'Layanan Software',
    starting_price: Number(form.value.startingPrice),
    price_display: form.value.priceDisplay || `Mulai ${formatRupiah(Number(form.value.startingPrice))}`,
    timeline: form.value.timeline || '1 - 2 Minggu',
    tagline: form.value.tagline || '',
    maintenance_warranty: form.value.maintenanceWarranty || null,
    badge: form.value.badge || null,
    icon_name: form.value.iconName || 'Wrench',
    recommended: Boolean(form.value.recommended),
    suitable_for: form.value.suitableFor || '',
    deliverables: form.value.deliverables || [],
    advantages: form.value.advantages || [],
    updated_at: new Date().toISOString()
  }

  try {
    const { error } = await supabase.from('services').upsert(dbRow, { onConflict: 'id' })
    if (error) throw error

    showToast('Data layanan software berhasil disimpan ke Supabase!')
    closeModal()
    await refetch()
  } catch (err: any) {
    showToast('Gagal menyimpan: ' + err.message, true)
  } finally {
    isSaving.value = false
  }
}

const deleteService = async (id: string, name: string) => {
  if (!confirm(`Yakin ingin menghapus layanan "${name}" dari database Supabase?`)) {
    return
  }

  if (!supabase) return

  try {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) throw error
    showToast(`Layanan "${name}" berhasil dihapus`)
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
          Kelola Layanan Jasa Software
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          Atur harga mulai paket (APK Kasir, Web Statis, Dinamis CMS, Sistem Kustom) dan timeline
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow-md"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
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

    <!-- Skeleton Loading Cards -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="i in 4" :key="i" class="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse space-y-4">
        <div class="flex justify-between">
          <div class="h-3 w-28 bg-zinc-800 rounded"></div>
          <div class="h-4 w-20 bg-zinc-800 rounded-full"></div>
        </div>
        <div class="h-5 w-3/4 bg-zinc-800 rounded"></div>
        <div class="h-3 w-full bg-zinc-800/60 rounded"></div>
        <div class="h-12 bg-zinc-950/70 rounded-xl border border-zinc-800/50"></div>
        <div class="flex justify-end gap-2 pt-2">
          <div class="h-8 w-20 bg-zinc-800 rounded-xl"></div>
          <div class="h-8 w-20 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Services Grid Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div 
        v-for="svc in services" 
        :key="svc.id"
        class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-2">
            <span class="text-[11px] font-mono text-blue-400 uppercase font-semibold">
              {{ svc.categoryLabel }}
            </span>
            <span v-if="svc.badge" class="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
              {{ svc.badge }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-white tracking-tight">
            {{ svc.name }}
          </h3>
          <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
            {{ svc.tagline }}
          </p>

          <!-- Price & Timeline Box -->
          <div class="mt-4 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
            <div>
              <span class="text-[10px] font-mono text-zinc-500 uppercase block">Investasi:</span>
              <span class="text-base font-bold font-mono text-emerald-400">
                {{ svc.priceDisplay || formatRupiah(svc.startingPrice) }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-mono text-zinc-500 uppercase block">Timeline:</span>
              <span class="text-xs font-mono text-zinc-300 flex items-center gap-1">
                <Clock class="w-3 h-3 text-zinc-400" />
                {{ svc.timeline }}
              </span>
            </div>
          </div>

          <!-- Warranty Pill -->
          <div v-if="svc.maintenanceWarranty" class="mt-3 p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-1.5">
            <ShieldCheck class="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span class="truncate">{{ svc.maintenanceWarranty }}</span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <span class="text-[11px] text-zinc-500 truncate max-w-[200px]">
            {{ svc.suitableFor }}
          </span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openEditModal(svc)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
            >
              <Edit3 class="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              @click="deleteService(svc.id, svc.name)"
              class="p-1.5 rounded-lg bg-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
              title="Hapus Layanan"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit Layanan) -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <h2 class="text-base font-bold text-white tracking-tight">
            {{ modalMode === 'create' ? 'Tambah Layanan Baru' : 'Edit Layanan: ' + form.name }}
          </h2>
          <button type="button" @click="closeModal" class="text-zinc-400 hover:text-white">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveService" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">ID Layanan (Unik)</label>
              <input 
                v-model="form.id" 
                type="text" 
                :disabled="modalMode === 'edit'"
                required
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Kategori Internal</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="tugas-akhir">Tugas Akhir / Skripsi (Mahasiswa)</option>
                <option value="apk-offline">Aplikasi Kasir (Offline POS)</option>
                <option value="landing-page">Website Statis & Landing Page</option>
                <option value="web-dinamis">Website Dinamis & CMS</option>
                <option value="custom-web">Sistem Kustom & Bisnis</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Nama Layanan</label>
              <input 
                v-model="form.name" 
                type="text" 
                required
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Ikon Tampilan</label>
              <select
                v-model="form.iconName"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="GraduationCap">Topi Wisuda / Tugas Akhir (GraduationCap)</option>
                <option value="Smartphone">Smartphone / HP Android</option>
                <option value="Globe">Globe / Website</option>
                <option value="Layers">Layers / Sistem Kustom</option>
                <option value="Wrench">Wrench / Tool</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Harga Mulai (Angka)</label>
              <input 
                v-model="form.startingPrice" 
                type="number" 
                required
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Label Tampilan Harga</label>
              <input 
                v-model="form.priceDisplay" 
                type="text" 
                placeholder="Contoh: Mulai Rp 700.000 / Rp 1.5Jt - 3Jt"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Timeline Pengerjaan</label>
              <input 
                v-model="form.timeline" 
                type="text" 
                placeholder="Contoh: 1 - 2 Minggu (7 - 14 Hari)"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Label Kategori</label>
              <input 
                v-model="form.categoryLabel" 
                type="text" 
                placeholder="Contoh: Kasir Toko & Retail / Website Dinamis CMS"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Badge Highlight (Opsional)</label>
              <input 
                v-model="form.badge" 
                type="text" 
                placeholder="Contoh: Mulai 700Rb • Terlaris UMKM"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">Garansi Maintenance</label>
            <input 
              v-model="form.maintenanceWarranty" 
              type="text" 
              placeholder="Contoh: Garansi 3 Bulan Free Maintenance"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">Tagline Ringkas</label>
            <textarea 
              v-model="form.tagline" 
              rows="2"
              placeholder="Penjelasan ringkas solusi..."
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">Cocok Untuk</label>
            <input 
              v-model="form.suitableFor" 
              type="text" 
              placeholder="Contoh: Toko Kelontong, Cafe, Bengkel, Apotek"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
            />
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input 
              v-model="form.recommended" 
              type="checkbox" 
              id="is_recommended"
              class="rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-0"
            />
            <label for="is_recommended" class="text-xs text-zinc-300">Tandai sebagai Paket Rekomendasi Unggulan (Biru)</label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-5 border-t border-zinc-800">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
            >
              Batal
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md disabled:opacity-50"
            >
              <Save class="w-4 h-4" />
              <span>{{ isSaving ? 'Menyimpan...' : 'Simpan ke Supabase' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
