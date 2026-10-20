<script setup lang="ts">
import { STORE_INFO } from '../data/catalog'
import logoSyaiful from '../assets/logo-syaiful.png'
import { MessageSquare, ShieldCheck, ArrowUp, CheckCircle2, ExternalLink } from 'lucide-vue-next'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="bg-white border-t border-zinc-200 pt-16 pb-12 text-zinc-600 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Top Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-200">
        
        <!-- Column 1: Brand Info -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-white border border-zinc-200 p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
              <img :src="logoSyaiful" alt="Pull Store Logo" class="w-full h-full object-contain" />
            </div>
            <span class="font-bold text-base text-zinc-950 tracking-tight">
              {{ STORE_INFO.brandName }}
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 class="w-2.5 h-2.5 text-emerald-600" />
              Resmi & Bergaransi
            </span>
          </div>

          <p class="text-zinc-600 text-xs leading-relaxed max-w-md">
            Single platform terpadu untuk kebutuhan lisensi akun AI produktivitas, tools desain & editing (Canva, CapCut), jasa rating Google Maps, akun streaming, serta rekayasa software (Aplikasi Kasir Android Offline & Web Sistem).
          </p>

          <div class="pt-1 flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Founder & Engineer: 
              <a 
                :href="STORE_INFO.founderWebsite || 'https://msyaifulloh.my.id'" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-zinc-900 font-semibold hover:text-blue-600 inline-flex items-center gap-0.5 ml-1 transition-colors"
              >
                <span>{{ STORE_INFO.founder }}</span>
                <ExternalLink class="w-2.5 h-2.5 opacity-60" />
              </a>
            </span>
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-950">
            Navigasi Solusi
          </h4>
          <ul class="space-y-2">
            <li>
              <a href="#katalog-section" class="hover:text-blue-600 transition-colors">
                Akun AI Pro & Productivity
              </a>
            </li>
            <li>
              <a href="#katalog-section" class="hover:text-blue-600 transition-colors">
                Desain & Editing (Canva & CapCut)
              </a>
            </li>
            <li>
              <a href="#katalog-section" class="hover:text-blue-600 transition-colors">
                Jasa Rating & Review Google Maps
              </a>
            </li>
            <li>
              <a href="#katalog-section" class="hover:text-blue-600 transition-colors">
                Streaming & Meeting (Netflix, Zoom)
              </a>
            </li>
            <li>
              <a href="#aplikasi-kasir" class="hover:text-blue-600 transition-colors">
                APK Kasir Android Offline (Start 700Rb)
              </a>
            </li>
            <li>
              <a href="#website-statis" class="hover:text-blue-600 transition-colors">
                Website Statis & Landing Page (Start 850Rb)
              </a>
            </li>
            <li>
              <a href="#website-dinamis" class="hover:text-blue-600 transition-colors">
                Website Dinamis & CMS (1.5 - 3Jt)
              </a>
            </li>
            <li class="pt-1">
              <a href="#testimonial" class="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                <span>Testimonial Klien & Bukti</span>
              </a>
            </li>
            <li>
              <a 
                href="https://docs.google.com/spreadsheets/d/1v-adlXEhohFwqVToSvS36gH5eEeUwoaHSjuC6fEnV1M/edit?gid=0#gid=0" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Rekap Live Google Sheets ↗</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 3: Contact & Hours -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-950">
            Layanan Pelanggan
          </h4>
          <ul class="space-y-2">
            <li class="flex items-center gap-2">
              <MessageSquare class="w-3.5 h-3.5 text-zinc-400" :stroke-width="1.75" />
              <a 
                :href="`https://wa.me/${STORE_INFO.whatsappNumber}`" 
                target="_blank" 
                rel="noopener noreferrer"
                class="hover:text-blue-600 font-mono"
              >
                {{ STORE_INFO.whatsappDisplay }}
              </a>
            </li>
            <li class="text-zinc-500">
              Jam Operasional: <br />
              <span class="text-zinc-800 font-medium">{{ STORE_INFO.operationalHours }}</span>
            </li>
            <li class="flex items-center gap-1.5 text-emerald-600 pt-1">
              <ShieldCheck class="w-3.5 h-3.5" :stroke-width="1.75" />
              <span>Garansi 100% Penggantian</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Payment Gateways & Methods strip -->
      <div class="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-100 text-zinc-500 text-[11px]">
        <div class="flex items-center gap-2">
          <span>Metode Pembayaran Resmi:</span>
          <div class="flex flex-wrap items-center gap-1.5 font-mono">
            <span class="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold">QRIS</span>
            <span class="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">BCA</span>
            <span class="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">Mandiri</span>
            <span class="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">BRI</span>
            <span class="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">GoPay/OVO/DANA</span>
          </div>
        </div>

        <button
          type="button"
          @click="scrollToTop"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp class="w-3 h-3 text-zinc-400" :stroke-width="1.75" />
        </button>
      </div>

      <!-- Bottom Copyright & Credits -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-500 text-[11px]">
        <p>
          &copy; 2026 <strong>{{ STORE_INFO.brandName }}</strong>. All rights reserved. Handcrafted with high standards.
        </p>
        <div class="flex items-center gap-3 font-mono text-[11px]">
          <router-link to="/admin" class="text-zinc-400 hover:text-zinc-900 transition-colors">
            Portal Admin
          </router-link>
          <span class="text-zinc-300">•</span>
          <span>Engineered with Vue 3, Vite & Supabase</span>
        </div>
      </div>

    </div>
  </footer>
</template>
