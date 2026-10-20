<script setup lang="ts">
import { ref } from 'vue'
import { STORE_INFO } from '../data/catalog'
import logoSyaiful from '../assets/logo-syaiful.png'
import { 
  MessageSquare, 
  Menu, 
  X, 
  Sparkles, 
  Code2, 
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Star
} from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const navLinks = [
  { name: 'Produk Digital', href: '#semua-produk-pull-store', icon: Sparkles },
  { name: 'Jasa Software', href: '#semua-jasa-pull-store', icon: Code2 },
  { name: 'Testimonial', href: '#testimonial', icon: Star },
  { name: 'FAQ', href: '#faq', icon: HelpCircle },
]
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Brand / Logo -->
        <div class="flex items-center gap-3">
          <a 
            href="#" 
            class="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-xl p-1"
            title="Pull Store Homepage"
          >
            <div class="w-9 h-9 rounded-xl bg-white border border-zinc-200/90 p-1 flex items-center justify-center shadow-sm group-hover:border-blue-500 group-hover:shadow-md transition-all duration-200 overflow-hidden">
              <img :src="logoSyaiful" alt="Pull Store Logo" class="w-full h-full object-contain" />
            </div>
            
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="font-bold text-base tracking-tight text-zinc-950 group-hover:text-blue-600 transition-colors">
                  Pull Store
                </span>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 class="w-2.5 h-2.5 text-emerald-600" />
                  Resmi
                </span>
              </div>
            </div>
          </a>

          <!-- Separator & Founder Clickable Link -->
          <div class="hidden sm:flex items-center pl-2 border-l border-zinc-200">
            <a 
              :href="STORE_INFO.founderWebsite || 'https://msyaifulloh.my.id'" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-blue-600 transition-colors font-medium group/founder py-0.5 px-1.5 rounded hover:bg-zinc-100"
              title="Kunjungi Website Founder Muhammad Syaifulloh"
            >
              <span>by <strong class="font-semibold text-zinc-700 group-hover/founder:text-blue-600">{{ STORE_INFO.founder }}</strong></span>
              <ExternalLink class="w-2.5 h-2.5 text-zinc-400 group-hover/founder:text-blue-600 transition-colors" />
            </a>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="px-3.5 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 rounded-lg transition-all"
          >
            {{ link.name }}
          </a>
        </nav>

        <!-- Right Side: Status Badge & WhatsApp CTA -->
        <div class="hidden sm:flex items-center gap-3">

          <a
            :href="`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Pull%20Store%2C%20saya%20ingin%20konsultasi%2Forder.`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-950 text-white hover:bg-blue-600 hover:shadow-sm active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <MessageSquare class="w-3.5 h-3.5" :stroke-width="2" />
            <span>Chat WhatsApp</span>
          </a>
        </div>

        <!-- Mobile Menu Hamburger Button -->
        <div class="flex sm:hidden">
          <button
            type="button"
            @click="toggleMobileMenu"
            class="p-2 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle navigation menu"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" :stroke-width="2" />
            <X v-else class="w-5 h-5" :stroke-width="2" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="sm:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-fadeIn shadow-lg"
    >
      <!-- Founder & Status for Mobile -->
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
        <a 
          :href="STORE_INFO.founderWebsite || 'https://msyaifulloh.my.id'" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="flex items-center gap-2 font-medium text-zinc-700 hover:text-blue-600"
        >
          <div class="w-6 h-6 rounded-md bg-white border border-zinc-200/80 p-0.5 flex items-center justify-center overflow-hidden">
            <img :src="logoSyaiful" alt="Logo Founder" class="w-full h-full object-contain" />
          </div>
          <span>Founder: <strong>{{ STORE_INFO.founder }}</strong></span>
          <ExternalLink class="w-3 h-3 text-zinc-400" />
        </a>
        <div class="flex items-center gap-1.5 text-emerald-700 font-medium">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Online</span>
        </div>
      </div>

      <!-- Nav Links -->
      <div class="space-y-1">
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          @click="closeMobileMenu"
          class="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-zinc-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-colors"
        >
          <component :is="link.icon" class="w-4 h-4 text-zinc-400" :stroke-width="2" />
          {{ link.name }}
        </a>
      </div>

      <!-- WhatsApp Mobile Button -->
      <div class="pt-2">
        <a
          :href="`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Pull%20Store%2C%20saya%20ingin%20konsultasi%2Forder.`"
          target="_blank"
          rel="noopener noreferrer"
          @click="closeMobileMenu"
          class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-blue-600 transition-colors shadow-sm"
        >
          <MessageSquare class="w-4 h-4" :stroke-width="2" />
          <span>Chat WhatsApp Sekarang</span>
        </a>
      </div>
    </div>
  </header>
</template>
