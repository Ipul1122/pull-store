<script setup lang="ts">
import { useCatalog } from '../../composables/useCatalog'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { 
  Package, 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Users,
  Star
} from 'lucide-vue-next'

const { products, services, isLoading, refetch } = useCatalog()

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          Kelola katalog produk digital & jasa software langsung ke database Supabase
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="refetch"
          :disabled="isLoading"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
          <span>{{ isLoading ? 'Sinkronisasi...' : 'Refresh Data' }}</span>
        </button>

        <router-link
          to="/"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>Buka Toko</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono text-zinc-400">Total Produk Digital</span>
          <div class="text-2xl font-bold font-mono text-white mt-1">{{ products.length }}</div>
          <span class="text-[11px] text-emerald-400">Tersinkron di Supabase</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <Package class="w-5 h-5" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono text-zinc-400">Total Layanan Jasa</span>
          <div class="text-2xl font-bold font-mono text-white mt-1">{{ services.length }}</div>
          <span class="text-[11px] text-blue-400">Termasuk Web & Kasir</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <Wrench class="w-5 h-5" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono text-zinc-400">Produk Siap Jual</span>
          <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {{ products.filter(p => p.stockStatus === 'ready').length }}
          </div>
          <span class="text-[11px] text-zinc-500">Status Ready Stok</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 class="w-5 h-5" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono text-zinc-400">Produk Terpopuler</span>
          <div class="text-2xl font-bold font-mono text-amber-400 mt-1">
            {{ products.filter(p => p.popular).length }}
          </div>
          <span class="text-[11px] text-zinc-500">Badge Populer</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <Sparkles class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Quick Navigation Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-950/30 to-zinc-900 border border-blue-900/40 flex flex-col justify-between">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-mono font-medium mb-3">
            <Package class="w-3.5 h-3.5" />
            <span>Katalog Akun Digital</span>
          </div>
          <h2 class="text-base font-bold text-white tracking-tight">Kelola Produk Digital</h2>
          <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
            Tambah akun baru, ubah harga, update stok, dan ganti badge diskon secara live.
          </p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/product"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md"
          >
            <span>Manajemen Produk</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-zinc-900 border border-emerald-900/40 flex flex-col justify-between">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium mb-3">
            <Wrench class="w-3.5 h-3.5" />
            <span>Katalog Jasa Software</span>
          </div>
          <h2 class="text-base font-bold text-white tracking-tight">Kelola Jasa Software</h2>
          <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
            Ubah harga mulai (APK Kasir 700K, Web Statis 850K, Dinamis 1.5Jt) & timeline.
          </p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/service"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow-md"
          >
            <span>Manajemen Layanan</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-zinc-900 border border-amber-900/40 flex flex-col justify-between">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-medium mb-3">
            <Star class="w-3.5 h-3.5" />
            <span>Transparansi Klien</span>
          </div>
          <h2 class="text-base font-bold text-white tracking-tight">Kelola Testimonial</h2>
          <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
            Input bukti transaksi, nama client, ulasan, harga, dan garansi untuk kepercayaan pembeli.
          </p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/testimonials"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow-md"
          >
            <span>Input Testimonial</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 to-zinc-900 border border-purple-900/40 flex flex-col justify-between">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-mono font-medium mb-3">
            <Users class="w-3.5 h-3.5" />
            <span>Fitur Eksklusif Admin</span>
          </div>
          <h2 class="text-base font-bold text-white tracking-tight">Pengunjung Web</h2>
          <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
            Pantau siapa yang datang ke web: kota asal, HP/PC, dari Instagram/TikTok/Direct.
          </p>
        </div>
        <div class="mt-4">
          <router-link
            to="/admin/visitors"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-all shadow-md"
          >
            <span>Lihat Log Pengunjung</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Preview List: 5 Produk Teratas -->
    <div class="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-white tracking-tight">
          Preview 5 Produk Digital Teratas
        </h3>
        <router-link to="/admin/product" class="text-xs text-blue-400 hover:underline">
          Lihat Semua Produk →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-zinc-800 text-zinc-400 font-mono">
              <th class="pb-3 font-medium">Nama Produk</th>
              <th class="pb-3 font-medium">Kategori</th>
              <th class="pb-3 font-medium">Harga</th>
              <th class="pb-3 font-medium">Stok</th>
              <th class="pb-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <TableSkeleton v-if="isLoading" :rows="5" :cols="5" />
          <tbody v-else class="divide-y divide-zinc-800/60 font-sans">
            <tr v-for="prod in products.slice(0, 5)" :key="prod.id" class="hover:bg-zinc-800/20">
              <td class="py-3 font-medium text-white">{{ prod.name }}</td>
              <td class="py-3 text-zinc-400 font-mono uppercase text-[11px]">{{ prod.category }}</td>
              <td class="py-3 font-mono font-bold text-emerald-400">{{ formatRupiah(prod.price) }}</td>
              <td class="py-3">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-mono"
                  :class="prod.stockStatus === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'"
                >
                  {{ prod.stockStatus === 'ready' ? `Ready (${prod.stockCount || 0})` : 'Habis' }}
                </span>
              </td>
              <td class="py-3 text-right">
                <router-link 
                  to="/admin/product" 
                  class="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Edit
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
