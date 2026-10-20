<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabase'
import type { VisitorLog } from '../../lib/tracker'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { 
  Users, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Clock, 
  Search,
  Trash2
} from 'lucide-vue-next'

const visitors = ref<VisitorLog[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterDevice = ref('all')

const fetchVisitors = async () => {
  if (!supabase) return
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error && data) {
      visitors.value = data
    }
  } catch (err) {
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
  if (!confirm('Hapus seluruh riwayat log pengunjung?')) return
  if (!supabase) return
  try {
    await supabase.from('visitors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    visitors.value = []
  } catch (err: any) {
    alert('Gagal menghapus log: ' + err.message)
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
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
            </tr>
          </thead>
          <TableSkeleton v-if="isLoading" :rows="6" :cols="6" />
          <tbody v-else class="divide-y divide-zinc-800/60 font-sans">
            <tr v-for="log in filteredList" :key="log.id" class="hover:bg-zinc-800/20 transition-colors">
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
            </tr>
          </tbody>
        </table>
      </div>

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
