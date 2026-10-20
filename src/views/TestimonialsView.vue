<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
import TestimonialSection from '../components/TestimonialSection.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-50 text-zinc-950 font-sans">
    <AppNavbar />
    <main class="flex-grow pt-4">
      <TestimonialSection />
    </main>
    <AppFooter />
  </div>
</template>
