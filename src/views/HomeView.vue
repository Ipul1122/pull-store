<script setup lang="ts">
import { ref } from 'vue'
import type { ProductItem, ServiceItem } from '../types'
import { STORE_INFO } from '../data/catalog'

// Components
import AppNavbar from '../components/AppNavbar.vue'
import HeroSection from '../components/HeroSection.vue'
import PromoBannerCarousel from '../components/PromoBannerCarousel.vue'
import CatalogSection from '../components/CatalogSection.vue'
import TestimonialSection from '../components/TestimonialSection.vue'
import FaqSection from '../components/FaqSection.vue'
import CheckoutModal from '../components/CheckoutModal.vue'
import AppFooter from '../components/AppFooter.vue'

import { MessageSquare } from 'lucide-vue-next'

// State for checkout modal
const isCheckoutModalOpen = ref(false)
const selectedItem = ref<ProductItem | ServiceItem | null>(null)
const selectedItemType = ref<'product' | 'service'>('product')
const activeMainTab = ref<'digital' | 'services'>('digital')

const handleSelectProduct = (product: ProductItem) => {
  selectedItem.value = product
  selectedItemType.value = 'product'
  isCheckoutModalOpen.value = true
}

const handleSelectService = (service: ServiceItem) => {
  selectedItem.value = service
  selectedItemType.value = 'service'
  isCheckoutModalOpen.value = true
}

const handleHeroSelectTab = (tab: 'digital' | 'services') => {
  activeMainTab.value = tab
}

const handleCloseModal = () => {
  isCheckoutModalOpen.value = false
}

// Track visitor silent background
import { onMounted } from 'vue'
import { trackVisitor } from '../lib/tracker'

onMounted(() => {
  trackVisitor()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-50 text-zinc-950 font-sans selection:bg-blue-100 selection:text-blue-700">
    <!-- Navbar -->
    <AppNavbar />

    <!-- Main Content -->
    <main class="flex-grow">
      <!-- Hero Section -->
      <HeroSection @select-tab="handleHeroSelectTab" />

      <!-- Promo & Official Specification Banners Carousel -->
      <PromoBannerCarousel />

      <!-- Dual Catalog Section (Digital Products & Software Dev) -->
      <CatalogSection 
        :active-main-tab="activeMainTab"
        @select-product="handleSelectProduct"
        @select-service="handleSelectService"
      />

      <!-- Testimonial & Transparansi Rekap Penjualan -->
      <TestimonialSection />

      <!-- FAQ Section -->
      <FaqSection />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Checkout / Consultation Modal -->
    <CheckoutModal
      :is-open="isCheckoutModalOpen"
      :item="selectedItem"
      :item-type="selectedItemType"
      @close="handleCloseModal"
    />

    <!-- Floating WhatsApp Quick Button -->
    <div class="fixed bottom-6 right-6 z-40">
      <a
        :href="`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Pull%20Store%2C%20saya%20ingin%20tanya%20produk%2Fjasa.`"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-elevated transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Chat WhatsApp Admin"
      >
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <MessageSquare class="w-5 h-5" :stroke-width="1.75" />
        <span class="text-xs font-semibold tracking-wide pr-1 hidden sm:inline-block">
          Chat Admin (Fast Response)
        </span>
      </a>
    </div>
  </div>
</template>
