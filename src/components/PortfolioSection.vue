<script setup lang="ts">
import { PORTFOLIO_ITEMS, STORE_INFO } from '../data/catalog'
import { 
  CheckCircle, 
  ArrowUpRight,
  Zap
} from 'lucide-vue-next'
</script>

<template>
  <section id="portofolio" class="py-16 md:py-24 bg-white border-b border-zinc-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div class="max-w-2xl">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Real-World Showcase
          </span>
          <h2 class="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Portofolio Rekayasa Software
          </h2>
          <p class="mt-2 text-sm text-zinc-600">
            Sistem nyata yang telah dibangun dan beroperasi dengan stabilitas tinggi, mulai dari aplikasi Android offline tanpa internet hingga sistem enterprise skala desa & korporasi.
          </p>
        </div>

        <a
          :href="`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Mas%20Syaifulloh%2C%20saya%20ingin%20melihat%20demo%20portofolio%20software%20Pull%20Store.`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100 transition-colors shrink-0"
        >
          <span>Minta Demo / Video Showcase</span>
          <ArrowUpRight class="w-3.5 h-3.5 text-zinc-500" :stroke-width="1.75" />
        </a>
      </div>

      <!-- Portfolio Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          v-for="item in PORTFOLIO_ITEMS"
          :key="item.id"
          class="flex flex-col justify-between bg-zinc-50 rounded-xl border border-zinc-200 p-6 sm:p-7 hover:border-zinc-300 transition-all duration-200 group"
        >
          <div>
            <!-- Visual Device/System Header Simulation -->
            <div class="h-36 rounded-lg bg-zinc-900 text-zinc-200 p-4 border border-zinc-800 flex flex-col justify-between relative overflow-hidden mb-6">
              <!-- Background Grid Accents -->
              <div class="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
              
              <div class="flex items-center justify-between z-10">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {{ item.type }}
                </span>
                <span class="text-[10px] font-mono text-zinc-400">Production Ready</span>
              </div>

              <div class="z-10">
                <div class="text-[11px] font-mono text-blue-400 flex items-center gap-1">
                  <Zap class="w-3 h-3" :stroke-width="1.75" />
                  <span>Key Result:</span>
                </div>
                <div class="text-xs font-semibold font-mono text-white mt-0.5">
                  {{ item.metrics }}
                </div>
              </div>
            </div>

            <!-- Client & Title -->
            <span class="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              {{ item.clientType }}
            </span>
            <h3 class="text-base font-bold text-zinc-950 mt-1 group-hover:text-blue-600 transition-colors">
              {{ item.title }}
            </h3>
            <p class="mt-2.5 text-xs text-zinc-600 leading-relaxed">
              {{ item.description }}
            </p>

            <!-- Case Study Key Points -->
            <div class="mt-4 pt-4 border-t border-zinc-200/80">
              <span class="text-[11px] font-semibold text-zinc-900 block mb-2">Keunggulan Arsitektur:</span>
              <ul class="space-y-1.5 text-xs text-zinc-600">
                <li
                  v-for="(point, idx) in item.caseStudyKeyPoints"
                  :key="idx"
                  class="flex items-start gap-2"
                >
                  <CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" :stroke-width="2" />
                  <span class="leading-tight">{{ point }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom: Tech Stack & CTA -->
          <div class="mt-6 pt-4 border-t border-zinc-200">
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="tech in item.techStack"
                :key="tech"
                class="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-zinc-700 border border-zinc-200 shadow-subtle"
              >
                {{ tech }}
              </span>
            </div>

            <a
              :href="`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Mas%20Syaifulloh%2C%20saya%20tertarik%20dengan%20proyek%20portofolio%20*${encodeURIComponent(item.title)}*%20dan%20ingin%20membuat%20sistem%20serupa.`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100 hover:text-blue-600 transition-colors"
            >
              <span>Bangun Solusi Serupa</span>
              <ArrowUpRight class="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" :stroke-width="1.75" />
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
