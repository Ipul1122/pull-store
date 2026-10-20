<script setup lang="ts">
import { ref, computed } from 'vue'
import { FAQ_ITEMS, STORE_INFO } from '../data/catalog'
import { Plus, Minus, MessageSquare, HelpCircle, Sparkles, ArrowRight } from 'lucide-vue-next'

const selectedCategory = ref<'all' | 'digital' | 'dev' | 'payment'>('all')
const openItemIds = ref<Set<string>>(new Set(['faq-1', 'faq-4'])) // Open default items

const toggleItem = (id: string) => {
  if (openItemIds.value.has(id)) {
    openItemIds.value.delete(id)
  } else {
    openItemIds.value.add(id)
  }
}

const filteredFaqs = computed(() => {
  if (selectedCategory.value === 'all') {
    return FAQ_ITEMS
  }
  return FAQ_ITEMS.filter(f => f.category === selectedCategory.value)
})
</script>

<template>
  <section id="faq" class="py-20 md:py-28 bg-zinc-950 text-white relative overflow-hidden border-b border-zinc-800/80">
    <!-- Ambient Radial Glows (Luxury Depth) -->
    <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute -bottom-32 right-10 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
          <Sparkles class="w-3.5 h-3.5 text-blue-400" />
          <span>Knowledge Base & Transparansi</span>
        </div>
        
        <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p class="mt-3 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Semua hal yang perlu Anda ketahui mengenai jaminan 100% garansi akun, keamanan lisensi, kepemilikan source code, dan alur pengerjaan.
        </p>

        <!-- Modern Segmented Category Pills -->
        <div class="mt-8 flex justify-center">
          <div class="inline-flex p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md shadow-inner gap-1 flex-wrap justify-center">
            <button
              type="button"
              @click="selectedCategory = 'all'"
              class="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none"
              :class="selectedCategory === 'all' 
                ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'"
            >
              Semua Topik
            </button>
            <button
              type="button"
              @click="selectedCategory = 'digital'"
              class="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none"
              :class="selectedCategory === 'digital' 
                ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'"
            >
              Akun Digital & Garansi
            </button>
            <button
              type="button"
              @click="selectedCategory = 'dev'"
              class="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none"
              :class="selectedCategory === 'dev' 
                ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'"
            >
              Software & APK Kasir
            </button>
            <button
              type="button"
              @click="selectedCategory = 'payment'"
              class="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none"
              :class="selectedCategory === 'payment' 
                ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'"
            >
              Metode Pembayaran
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Accordion List (Dark Glass Architecture) -->
      <div class="space-y-3.5">
        <div
          v-for="faq in filteredFaqs"
          :key="faq.id"
          class="rounded-2xl border transition-all duration-300 overflow-hidden"
          :class="openItemIds.has(faq.id) 
            ? 'bg-zinc-900/90 border-zinc-700/80 shadow-[0_4px_25px_rgba(0,0,0,0.4)]' 
            : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/60 hover:bg-zinc-900/60'"
        >
          <button
            type="button"
            @click="toggleItem(faq.id)"
            class="w-full flex items-center justify-between p-5 sm:p-6 text-left group focus:outline-none"
          >
            <div class="flex items-center gap-3 pr-4">
              <span 
                class="w-2 h-2 rounded-full shrink-0 transition-colors"
                :class="openItemIds.has(faq.id) ? 'bg-blue-400' : 'bg-zinc-600'"
              ></span>
              <span 
                class="text-sm sm:text-base font-semibold leading-snug transition-colors"
                :class="openItemIds.has(faq.id) ? 'text-white' : 'text-zinc-300 group-hover:text-white'"
              >
                {{ faq.question }}
              </span>
            </div>

            <!-- Modern Expand Toggle Icon -->
            <div 
              class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
              :class="openItemIds.has(faq.id) 
                ? 'bg-blue-600 text-white rotate-90 shadow-sm' 
                : 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700'"
            >
              <Minus v-if="openItemIds.has(faq.id)" class="w-3.5 h-3.5" :stroke-width="2.25" />
              <Plus v-else class="w-3.5 h-3.5" :stroke-width="2.25" />
            </div>
          </button>

          <!-- Accordion Answer -->
          <div
            v-if="openItemIds.has(faq.id)"
            class="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80"
          >
            <div class="pl-5 border-l-2 border-blue-500/40">
              <p class="text-zinc-300 leading-relaxed font-normal">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- High-End Consultation Footer Banner -->
      <div class="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-indigo-950/40 border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div class="text-left space-y-1">
          <div class="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold">
            <HelpCircle class="w-4 h-4" />
            <span>Diskusi Langsung dengan Tim Engineer</span>
          </div>
          <h4 class="text-base font-bold text-white">Ada kebutuhan spesifik yang belum terjawab?</h4>
          <p class="text-xs text-zinc-400">
            Founder & tim pengembang kami siap membalas pesan Anda dalam 5-15 menit di WhatsApp.
          </p>
        </div>

        <a
          :href="`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Pull%20Store%2C%20saya%20ingin%20tanya%20detail%20seputar%20produk%20dan%20jasa.`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 shadow-md shadow-blue-600/30 shrink-0 hover:scale-105"
        >
          <MessageSquare class="w-4 h-4" :stroke-width="1.75" />
          <span>Tanya Admin Sekarang</span>
          <ArrowRight class="w-3.5 h-3.5 ml-0.5 opacity-80" />
        </a>
      </div>

    </div>
  </section>
</template>
