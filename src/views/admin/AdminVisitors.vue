<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '../../lib/supabase'
import type { VisitorLog } from '../../lib/tracker'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import AdminPagination from '../../components/admin/AdminPagination.vue'
import { 
  Users, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Clock, 
  Search,
  Trash2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-vue-next'

const visitors = ref<VisitorLog[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterDevice = ref('all')
const isTableMissing = ref(false)
const isSqlCopied = ref(false)
const isDeleteSqlCopied = ref(false)
const showDeleteHelp = ref(false)
const isDeleting = ref(false)

const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 4000)
}

const currentPage = ref(1)
const pageSize = ref(15)

watch([searchQuery, filterDevice], () => {
  currentPage.value = 1
})

const sqlSetupCode = `CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  page_url TEXT,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  isp TEXT,
  ip TEXT
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on visitors" ON public.visitors;
CREATE POLICY "Allow public insert on visitors" ON public.visitors FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on visitors" ON public.visitors;
CREATE POLICY "Allow public select on visitors" ON public.visitors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public delete on visitors" ON public.visitors;
CREATE POLICY "Allow public delete on visitors" ON public.visitors FOR DELETE USING (true);`

const sqlDeletePolicyCode = `DROP POLICY IF EXISTS "Allow public delete on visitors" ON public.visitors;
CREATE POLICY "Allow public delete on visitors" ON public.visitors FOR DELETE USING (true);`

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text)
  } else {
    const input = document.createElement('textarea')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
}

const copySqlCode = async () => {
  try {
    await copyToClipboard(sqlSetupCode)
    isSqlCopied.value = true
    setTimeout(() => { isSqlCopied.value = false }, 3000)
  } catch {
    isSqlCopied.value = true
    setTimeout(() => { isSqlCopied.value = false }, 3000)
  }
}

const copyDeleteSqlCode = async () => {
  try {
    await copyToClipboard(sqlDeletePolicyCode)
    isDeleteSqlCopied.value = true
    setTimeout(() => { isDeleteSqlCopied.value = false }, 3000)
  } catch {
    isDeleteSqlCopied.value = true
    setTimeout(() => { isDeleteSqlCopied.value = false }, 3000)
  }
}

const fetchVisitors = async () => {
  if (!supabase) return
  isLoading.value = true
  isTableMissing.value = false
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      if (error.code === 'PGRST204' || error.code === 'PGRST205' || error.message?.includes('Could not find') || error.message?.includes('does not exist')) {
        isTableMissing.value = true
      }
    } else if (data) {
      visitors.value = data
    }
  } catch (err: any) {
    if (err?.message?.includes('Could not find') || err?.message?.includes('does not exist') || err?.status === 404) {
      isTableMissing.value = true
    }
    console.warn('Gagal memuat log pengunjung:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchVisitors()
})

// Statistik
const totalVisitors = computed(() => visitors.value.length)

const todayVisitors = computed(() => {
  const todayStr = new Date().toISOString().slice(0, 10)
  return visitors.value.filter(v => v.created_at?.slice(0, 10) === todayStr).length
})

const mobileCount = computed(() => visitors.value.filter(v => v.device === 'Mobile').length)
const desktopCount = computed(() => visitors.value.filter(v => v.device === 'Desktop').length)

const topCities = computed(() => {
  const map: Record<string, number> = {}
  visitors.value.forEach(v => {
    const c = v.city || 'Lainnya'
    map[c] = (map[c] || 0) + 1
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 4)
})

const filteredList = computed(() => {
  return visitors.value.filter(v => {
    const matchSearch = !searchQuery.value || 
      (v.city && v.city.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (v.referrer && v.referrer.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (v.browser && v.browser.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (v.os && v.os.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchDevice = filterDevice.value === 'all' || v.device === filterDevice.value

    return matchSearch && matchDevice
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

const clearLogs = async () => {
  if (!confirm('Hapus SELURUH riwayat log pengunjung secara permanen dari database?')) return
  if (!supabase) return
  isDeleting.value = true
  try {
    const { data, error } = await supabase
      .from('visitors')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select()

    if (error) throw error

    // Cek apakah data benar-benar terhapus di Supabase
    if (!data || data.length === 0) {
      showToast('Izin DELETE belum aktif di Supabase! Salin & jalankan SQL Izin Hapus di bawah.', 'error')
      showDeleteHelp.value = true
      return
    }

    visitors.value = []
    showToast(`Berhasil menghapus ${data.length} log pengunjung permanen.`)
    showDeleteHelp.value = false
  } catch (err: any) {
    showToast('Gagal menghapus log: ' + err.message, 'error')
  } finally {
    isDeleting.value = false
  }
}

const deleteSingleVisitor = async (id?: string, info = '') => {
  if (!id) return
  if (!confirm(`Hapus log kunjungan ini (${info})?`)) return
  if (!supabase) return
  
  isDeleting.value = true
  try {
    const { data, error } = await supabase
      .from('visitors')
      .delete()
      .eq('id', id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      showToast('Izin DELETE belum aktif di Supabase! Salin & jalankan SQL Izin Hapus di bawah.', 'error')
      showDeleteHelp.value = true
      return
    }

    visitors.value = visitors.value.filter(v => v.id !== id)
    showToast('1 baris log pengunjung berhasil dihapus.')
    showDeleteHelp.value = false
  } catch (err: any) {
    showToast('Gagal menghapus: ' + err.message, 'error')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Toasts -->
    <div v-if="toastMessage" class="fixed top-5 right-5 z-50 p-4 rounded-xl text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn" :class="toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'">
      <Check v-if="toastType === 'success'" class="w-4 h-4" />
      <AlertTriangle v-else class="w-4 h-4" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
      <div>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Fitur Eksklusif Admin</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Pelacak Pengunjung Web (Visitor Analytics)
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          Pantau siapa saja yang mengunjungi website Anda secara real-time dari Supabase
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="fetchVisitors"
          :disabled="isLoading"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
          <span>{{ isLoading ? 'Memuat...' : 'Refresh' }}</span>
        </button>

        <button
          v-if="visitors.length > 0"
          type="button"
          @click="clearLogs"
          class="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
          title="Hapus riwayat log"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Setup Banner jika tabel visitors belum dibuat di Supabase -->
    <div v-if="isTableMissing" class="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div class="flex-1 text-xs leading-relaxed">
          <h3 class="font-bold text-sm text-amber-300">Tabel 'visitors' Belum Dibuat di Supabase (Error 404)</h3>
          <p class="text-zinc-300 mt-1">
            Status 404 muncul karena tabel <code class="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300">visitors</code> belum ada di database PostgreSQL Supabase Anda. Anda hanya perlu menyalin dan menjalankan query SQL di bawah ini <strong>sekali saja</strong> di SQL Editor Supabase.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          @click="copySqlCode"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors cursor-pointer"
        >
          <Check v-if="isSqlCopied" class="w-4 h-4" />
          <Copy v-else class="w-4 h-4" />
          <span>{{ isSqlCopied ? 'Query SQL Tersalin!' : 'Salin Query SQL (1-Klik)' }}</span>
        </button>

        <a
          href="https://supabase.com/dashboard/project/djqqfgumujtkpaqggqza/sql/new"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
        >
          <span>Buka SQL Editor Supabase</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

    <!-- Banner Bantuan jika Izin Hapus (RLS DELETE) Belum Aktif di Supabase -->
    <div v-if="showDeleteHelp" class="p-5 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 space-y-3 animate-fadeIn">
      <div class="flex items-start gap-3">
        <AlertTriangle class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div class="flex-1 text-xs leading-relaxed">
          <h3 class="font-bold text-sm text-red-300">Data Muncul Lagi Setelah Dihapus? (Izin DELETE RLS Supabase)</h3>
          <p class="text-zinc-300 mt-1">
            Data muncul lagi saat di-refresh karena di database Supabase PostgreSQL, <strong>Row Level Security (RLS)</strong> belum memiliki policy <code>DELETE</code>. Jalankan query SQL singkat di bawah ini di <strong>SQL Editor Supabase</strong> agar penghapusan data tersimpan permanen:
          </p>
          <div class="mt-2.5 p-3 rounded-xl bg-black/70 border border-red-900/50 font-mono text-[11px] text-red-200 select-all">
            {{ sqlDeletePolicyCode }}
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          @click="copyDeleteSqlCode"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
        >
          <Check v-if="isDeleteSqlCopied" class="w-4 h-4" />
          <Copy v-else class="w-4 h-4" />
          <span>{{ isDeleteSqlCopied ? 'Query Tersalin!' : 'Salin Query Izin Hapus (1-Klik)' }}</span>
        </button>

        <a
          href="https://supabase.com/dashboard/project/djqqfgumujtkpaqggqza/sql/new"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
        >
          <span>Buka SQL Editor Supabase</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          @click="showDeleteHelp = false"
          class="text-xs text-zinc-400 hover:text-white ml-auto"
        >
          Tutup Bantuan
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div class="flex items-center justify-between text-zinc-400 mb-2">
          <span class="text-xs font-mono">Total Kunjungan</span>
          <Users class="w-4 h-4 text-blue-400" />
        </div>
        <div class="text-2xl font-bold font-mono text-white">{{ totalVisitors }}</div>
        <span class="text-[11px] text-zinc-500">Tercatat di Database</span>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div class="flex items-center justify-between text-zinc-400 mb-2">
          <span class="text-xs font-mono">Hari Ini</span>
          <Clock class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="text-2xl font-bold font-mono text-emerald-400">{{ todayVisitors }}</div>
        <span class="text-[11px] text-zinc-500">Kunjungan Hari Ini</span>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div class="flex items-center justify-between text-zinc-400 mb-2">
          <span class="text-xs font-mono">Perangkat</span>
          <Smartphone class="w-4 h-4 text-purple-400" />
        </div>
        <div class="text-base font-bold font-mono text-white flex items-center gap-3">
          <span>📱 {{ mobileCount }} HP</span>
          <span class="text-zinc-600">|</span>
          <span>💻 {{ desktopCount }} PC</span>
        </div>
        <span class="text-[11px] text-zinc-500">Mayoritas Pengguna</span>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div class="flex items-center justify-between text-zinc-400 mb-2">
          <span class="text-xs font-mono">Kota Terbanyak</span>
          <MapPin class="w-4 h-4 text-amber-400" />
        </div>
        <div class="text-xs font-semibold text-zinc-200 truncate">
          {{ topCities.length > 0 ? topCities.map(c => `${c[0]} (${c[1]})`).join(', ') : 'Belum ada data' }}
        </div>
        <span class="text-[11px] text-zinc-500">Sebaran Lokasi</span>
      </div>
    </div>

    <!-- Search & Device Filter -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari kota, Instagram, Chrome..." 
          class="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
        />
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="filterDevice = 'all'"
          class="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
          :class="filterDevice === 'all' ? 'bg-blue-600 text-white font-semibold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'"
        >
          Semua
        </button>
        <button
          type="button"
          @click="filterDevice = 'Mobile'"
          class="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
          :class="filterDevice === 'Mobile' ? 'bg-blue-600 text-white font-semibold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'"
        >
          HP / Mobile
        </button>
        <button
          type="button"
          @click="filterDevice = 'Desktop'"
          class="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
          :class="filterDevice === 'Desktop' ? 'bg-blue-600 text-white font-semibold' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'"
        >
          Laptop / PC
        </button>
      </div>
    </div>

    <!-- Visitor Logs Table -->
    <div class="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
      <div v-if="filteredList.length > 0 || isLoading" class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono">
              <th class="py-3 px-4 font-medium">Waktu</th>
              <th class="py-3 px-4 font-medium">Lokasi Pengunjung</th>
              <th class="py-3 px-4 font-medium">Perangkat & OS</th>
              <th class="py-3 px-4 font-medium">Sumber / Referrer</th>
              <th class="py-3 px-4 font-medium">Halaman</th>
              <th class="py-3 px-4 font-medium">Provider / ISP</th>
              <th class="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <TableSkeleton v-if="isLoading" :rows="6" :cols="7" />
          <tbody v-else class="divide-y divide-zinc-800/60 font-sans">
            <tr v-for="log in paginatedList" :key="log.id" class="hover:bg-zinc-800/20 transition-colors">
              <td class="py-3 px-4 font-mono text-zinc-300 whitespace-nowrap">
                {{ formatDate(log.created_at) }}
              </td>
              <td class="py-3 px-4 font-medium text-white">
                <div class="flex items-center gap-1.5">
                  <MapPin class="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{{ log.city || 'Indonesia' }}</span>
                  <span v-if="log.region" class="text-zinc-500 font-normal">({{ log.region }})</span>
                </div>
                <div class="text-[10px] text-zinc-500 font-mono">{{ log.country }} • {{ log.ip || '-' }}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5 text-zinc-200">
                  <Smartphone v-if="log.device === 'Mobile'" class="w-3.5 h-3.5 text-blue-400" />
                  <Monitor v-else class="w-3.5 h-3.5 text-emerald-400" />
                  <span>{{ log.os }} ({{ log.browser }})</span>
                </div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                  :class="{
                    'bg-pink-950 text-pink-300 border border-pink-800': log.referrer === 'Instagram',
                    'bg-cyan-950 text-cyan-300 border border-cyan-800': log.referrer === 'TikTok',
                    'bg-emerald-950 text-emerald-300 border border-emerald-800': log.referrer === 'WhatsApp',
                    'bg-blue-950 text-blue-300 border border-blue-800': log.referrer === 'Google Search',
                    'bg-zinc-800 text-zinc-300 border border-zinc-700': log.referrer === 'Direct / Langsung'
                  }"
                >
                  {{ log.referrer }}
                </span>
              </td>
              <td class="py-3 px-4 font-mono text-[11px] text-blue-400 truncate max-w-[150px]">
                {{ log.page_url || '/' }}
              </td>
              <td class="py-3 px-4 text-zinc-400 text-[11px] truncate max-w-[150px]">
                {{ log.isp || '-' }}
              </td>
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  @click="deleteSingleVisitor(log.id, `${log.city || 'Pengunjung'} (${log.ip || '-'})`)"
                  :disabled="isDeleting"
                  class="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-40"
                  title="Hapus baris log ini"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Component -->
      <AdminPagination
        v-if="filteredList.length > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total-items="filteredList.length"
        :page-size-options="[10, 15, 25, 50, 100]"
      />

      <!-- Empty State -->
      <div v-else class="text-center py-16 p-6">
        <Users class="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h3 class="text-sm font-semibold text-zinc-300">Belum ada data kunjungan yang tercatat</h3>
        <p class="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
          Pastikan Anda telah menjalankan skrip SQL <code class="text-blue-400">scripts/create-visitors-table.sql</code> di Supabase. Data akan otomatis masuk begitu ada pengunjung yang membuka website Anda.
        </p>
      </div>
    </div>
  </div>
</template>
