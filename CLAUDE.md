# CLAUDE.md — Pull Store Master Architecture

## 1. Konteks Proyek
Proyek ini adalah Single Page Application (SPA) **Pull Store** milik Muhammad Syaifulloh. Aplikasi memuat katalog jasa software development dan produk digital dengan fokus konversi instan via WhatsApp.

## 2. Tech Stack Wajib
- **Framework:** Vue 3 (`<script setup lang="ts">` Composition API).
- **Build Tool:** Vite + TypeScript.
- **Styling:** Tailwind CSS.
- **Icons:** `lucide-vue-next` (`stroke-width="1.75"`).

## 3. Struktur Direktori
```text
src/
├── assets/main.css
├── components/
│   ├── AppNavbar.vue
│   ├── HeroSection.vue
│   ├── CatalogSection.vue
│   ├── ProductCard.vue
│   ├── ServiceCard.vue
│   ├── PortfolioSection.vue
│   ├── FaqSection.vue
│   ├── CheckoutModal.vue
│   └── AppFooter.vue
├── composables/useWhatsAppOrder.ts
├── data/catalog.ts              # Menyimpan konstanta STORE_INFO & data statis
├── types/index.ts               # Interface TypeScript strict
└── App.vue