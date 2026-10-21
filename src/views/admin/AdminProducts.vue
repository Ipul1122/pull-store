<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { supabase } from '../../lib/supabase'
import { useCatalog } from '../../composables/useCatalog'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import AdminPagination from '../../components/admin/AdminPagination.vue'
import type { ProductItem } from '../../types'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  RefreshCw,
  Save
} from 'lucide-vue-next'

const { products, isLoading, refetch } = useCatalog()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.badge && p.badge.toLowerCase().includes(q)) ||
    (p.accountType && p.accountType.toLowerCase().includes(q))
  )
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

watch(searchQuery, () => {
  currentPage.value = 1
})
const isModalOpen = ref(false)
const isSaving = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const successToast = ref('')
const errorToast = ref('')

const form = ref<Partial<ProductItem>>({
  id: '',
  name: '',
  category: 'ai',
  categoryLabel: 'AI Productivity',
  accountType: 'Shared',
  duration: '1 Bulan',
  price: 25000,
  originalPrice: 50000,
  stockStatus: 'ready',
  stockCount: 20,
  badge: '',
  popular: false,
  description: '',
  garansi: 'Full Garansi 30 Hari',
  notes: ''
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
    id: 'prod-' + Date.now().toString(36),
    name: '',
    category: 'ai',
    categoryLabel: 'AI Productivity',
    accountType: 'Shared',
    duration: '1 Bulan',
    price: 25000,
    originalPrice: 45000,
    stockStatus: 'ready',
    stockCount: 20,
    badge: '',
    popular: false,
    description: '',
    garansi: 'Garansi 30 Hari',
    notes: ''
  }
  isModalOpen.value = true
}

const openEditModal = (prod: ProductItem) => {
  modalMode.value = 'edit'
  form.value = JSON.parse(JSON.stringify(prod))
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

const saveProduct = async () => {
  if (!supabase) {
    showToast('Koneksi Supabase tidak aktif', true)
    return
  }

  if (!form.value.name || !form.value.price) {
    showToast('Nama dan harga wajib diisi', true)
    return
  }

  isSaving.value = true

  const dbRow = {
    id: form.value.id,
    name: form.value.name,
    category: form.value.category,
    category_label: form.value.categoryLabel || 'Produk Digital',
    account_type: form.value.accountType || 'Shared',
    duration: form.value.duration || '1 Bulan',
    price: Number(form.value.price),
    original_price: form.value.originalPrice ? Number(form.value.originalPrice) : null,
    stock_status: form.value.stockStatus || 'ready',
    stock_count: Number(form.value.stockCount || 10),
    badge: form.value.badge || null,
    popular: Boolean(form.value.popular),
    description: form.value.description || '',
    garansi: form.value.garansi || '',
    notes: form.value.notes || '',
    features: form.value.features || [],
    variants: form.value.variants || [],
    updated_at: new Date().toISOString()
  }

  try {
    const { error } = await supabase.from('products').upsert(dbRow, { onConflict: 'id' })
    if (error) throw error

    showToast(modalMode.value === 'create' ? 'Produk berhasil ditambahkan!' : 'Perubahan produk berhasil disimpan!')
    closeModal()
    await refetch()
  } catch (err: any) {
    showToast('Gagal menyimpan: ' + err.message, true)
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id: string, name: string) => {
  if (!confirm(`Yakin ingin menghapus produk "${name}" dari database Supabase?`)) {
    return
  }

  if (!supabase) return

  try {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    showToast(`Produk "${name}" berhasil dihapus`)
    await refetch()
  } catch (err: any) {
    showToast('Gagal menghapus: ' + err.message, true)
  }
}

const toggleStock = async (prod: ProductItem) => {
  if (!supabase) return
  const newStatus = prod.stockStatus === 'ready' ? 'empty' : 'ready'
  try {
    const { error } = await supabase.from('products').update({ stock_status: newStatus }).eq('id', prod.id)
    if (error) throw error
    prod.stockStatus = newStatus
    showToast(`Stok ${prod.name} diubah menjadi ${newStatus === 'ready' ? 'Ready' : 'Habis'}`)
  } catch (err: any) {
    showToast('Gagal update stok: ' + err.message, true)
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
          Kelola Produk Digital
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          Tambah produk baru, ganti harga, ubah stok habis/ready langsung ke Supabase
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari produk (ChatGPT, Netflix, Canva)..."
          class="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500 text-xs text-white outline-none font-mono"
        />
      </div>

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

    <!-- Products Table -->
    <div class="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono">
              <th class="py-3 px-4 font-medium">Nama Produk</th>
              <th class="py-3 px-4 font-medium">Kategori</th>
              <th class="py-3 px-4 font-medium">Harga Jual</th>
              <th class="py-3 px-4 font-medium">Stok Status</th>
              <th class="py-3 px-4 font-medium">Badge</th>
              <th class="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <TableSkeleton v-if="isLoading" :rows="5" :cols="6" />
          <tbody v-else class="divide-y divide-zinc-800/60">
            <tr 
              v-for="prod in paginatedProducts" 
              :key="prod.id"
              class="hover:bg-zinc-800/20 transition-colors"
            >
              <td class="py-3 px-4 font-medium text-white">
                <div>{{ prod.name }}</div>
                <div class="text-[10px] text-zinc-500 font-mono">{{ prod.accountType }} • {{ prod.duration }}</div>
              </td>
              <td class="py-3 px-4 font-mono text-[11px] text-zinc-400 uppercase">
                {{ prod.category }}
              </td>
              <td class="py-3 px-4 font-mono font-bold text-emerald-400">
                {{ formatRupiah(prod.price) }}
              </td>
              <td class="py-3 px-4">
                <button
                  type="button"
                  @click="toggleStock(prod)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-colors"
                  :class="prod.stockStatus === 'ready' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'"
                  :title="'Klik untuk ubah status ke ' + (prod.stockStatus === 'ready' ? 'Habis' : 'Ready')"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="prod.stockStatus === 'ready' ? 'bg-emerald-400' : 'bg-red-400'"></span>
                  <span>{{ prod.stockStatus === 'ready' ? `Ready (${prod.stockCount || 0})` : 'Habis' }}</span>
                </button>
              </td>
              <td class="py-3 px-4">
                <span v-if="prod.badge" class="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-800">
                  {{ prod.badge }}
                </span>
                <span v-else class="text-zinc-600 font-mono text-[10px]">-</span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    @click="openEditModal(prod)"
                    class="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Edit Produk"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    @click="deleteProduct(prod.id, prod.name)"
                    class="p-1.5 rounded-lg bg-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                    title="Hapus Produk"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="py-12 text-center text-zinc-500 font-mono text-xs">
                Tidak ada produk digital yang sesuai dengan pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Component -->
      <AdminPagination
        v-if="!isLoading && filteredProducts.length > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total-items="filteredProducts.length"
        :page-size-options="[10, 20, 50, 100]"
      />
    </div>

    <!-- Modal Form (Tambah / Edit Produk) -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <h2 class="text-base font-bold text-white tracking-tight">
            {{ modalMode === 'create' ? 'Tambah Produk Digital Baru' : 'Edit Produk: ' + form.name }}
          </h2>
          <button type="button" @click="closeModal" class="text-zinc-400 hover:text-white">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">ID Produk (Unik)</label>
              <input 
                v-model="form.id" 
                type="text" 
                :disabled="modalMode === 'edit'"
                required
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Nama Produk</label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Contoh: ChatGPT Plus (GPT-4o)"
                required
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Kategori</label>
              <select 
                v-model="form.category" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              >
                <option value="ai">AI Productivity</option>
                <option value="edit">Desain & Editing</option>
                <option value="rating">Rating & Review</option>
                <option value="streaming">Streaming & Musik</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Harga Jual (Rp)</label>
              <input 
                v-model="form.price" 
                type="number" 
                required
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Harga Asli (Coret)</label>
              <input 
                v-model="form.originalPrice" 
                type="number" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Tipe Akun</label>
              <input 
                v-model="form.accountType" 
                type="text" 
                placeholder="Shared / Private"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Durasi</label>
              <input 
                v-model="form.duration" 
                type="text" 
                placeholder="1 Bulan / 1 Tahun"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Stok Status</label>
              <select 
                v-model="form.stockStatus" 
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              >
                <option value="ready">Ready Stok</option>
                <option value="empty">Habis</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Badge Produk (Opsional)</label>
              <input 
                v-model="form.badge" 
                type="text" 
                placeholder="Contoh: Paling Populer / Diskon 50%"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-mono text-zinc-400 mb-1">Garansi</label>
              <input 
                v-model="form.garansi" 
                type="text" 
                placeholder="Contoh: Full Garansi 25 Hari"
                class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono text-zinc-400 mb-1">Deskripsi Singkat</label>
            <textarea 
              v-model="form.description" 
              rows="2"
              placeholder="Jelaskan ringkas benefit produk..."
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
            ></textarea>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input 
              v-model="form.popular" 
              type="checkbox" 
              id="is_popular"
              class="rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-0"
            />
            <label for="is_popular" class="text-xs text-zinc-300">Tandai sebagai Produk Terpopuler (Bintang Populer)</label>
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
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md disabled:opacity-50"
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
