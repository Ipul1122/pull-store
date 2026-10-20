<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { logoutAdmin } from '../../lib/auth'
import logoSyaiful from '../../assets/logo-syaiful.png'
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  ExternalLink, 
  LogOut,
  Users,
  Star
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  logoutAdmin()
  router.push('/admin/login')
}

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Kelola Produk', path: '/admin/product', icon: Package },
  { name: 'Kelola Jasa Software', path: '/admin/service', icon: Wrench },
  { name: 'Kelola Testimonial', path: '/admin/testimonials', icon: Star },
  { name: 'Pengunjung Web', path: '/admin/visitors', icon: Users },
]
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-blue-600 selection:text-white">
    <!-- Desktop Sidebar -->
    <aside class="w-64 border-r border-zinc-800/80 bg-zinc-900/50 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-2.5 px-2 mb-8">
          <div class="w-8 h-8 rounded-lg bg-white border border-zinc-700/80 p-0.5 flex items-center justify-center shadow-md overflow-hidden">
            <img :src="logoSyaiful" alt="Pull Store Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-sm font-bold tracking-tight text-white block">Pull Store</span>
            <span class="text-[10px] font-mono text-blue-400 block -mt-0.5">Admin Management</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="route.path === item.path || route.path.startsWith(item.path + '/')
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" :stroke-width="2" />
            <span>{{ item.name }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Bottom System Status & Actions -->
      <div class="pt-4 border-t border-zinc-800/80 space-y-2">
        <div class="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-[10px] font-mono text-zinc-400">
          <div class="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Supabase Cloud Connected</span>
          </div>
          <span class="text-zinc-500 truncate block">djqqfgumujtkpaqggqza</span>
        </div>

        <router-link
          to="/"
          target="_blank"
          class="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
        >
          <span class="flex items-center gap-2">
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Lihat Website Toko</span>
          </span>
          <span class="text-[10px] font-mono text-zinc-500">Live</span>
        </router-link>

        <button
          type="button"
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile Top Navbar -->
      <header class="h-14 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-md px-4 flex items-center justify-between md:hidden">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-white border border-zinc-700/80 p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
            <img :src="logoSyaiful" alt="Pull Store Logo" class="w-full h-full object-contain" />
          </div>
          <span class="text-xs font-bold text-white">Pull Store Admin</span>
        </div>

        <div class="flex items-center gap-2">
          <router-link
            to="/"
            target="_blank"
            class="p-2 text-zinc-400 hover:text-white"
            title="Lihat Web"
          >
            <ExternalLink class="w-4 h-4" />
          </router-link>
          <button
            type="button"
            @click="handleLogout"
            class="p-2 text-red-400"
            title="Logout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- Mobile Tab Bar -->
      <div class="flex border-b border-zinc-800 md:hidden bg-zinc-900 overflow-x-auto">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex-1 py-2.5 px-3 text-center text-[11px] font-medium whitespace-nowrap border-b-2"
          :class="route.path === item.path 
            ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
            : 'border-transparent text-zinc-400 hover:text-white'"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- Routed Page Container -->
      <main class="flex-1 p-4 sm:p-7 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
