<template>
  <div class="flex flex-col justify-between bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 shadow-subtle animate-pulse h-full min-h-[480px]">
    <div>
      <!-- Top Header Row Skeleton -->
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-zinc-200 shrink-0"></div>
          <div class="h-3.5 w-36 bg-zinc-200 rounded"></div>
        </div>
        <div class="h-6 w-20 bg-zinc-100 rounded-md"></div>
      </div>

      <!-- Title & Timeline Skeleton -->
      <div class="space-y-2 mb-3">
        <div class="h-5 w-4/5 bg-zinc-200 rounded"></div>
        <div class="h-4 w-40 bg-zinc-100 rounded-md"></div>
      </div>

      <!-- Tagline Skeleton -->
      <div class="space-y-1.5 mb-6">
        <div class="h-3 w-full bg-zinc-100 rounded"></div>
        <div class="h-3 w-5/6 bg-zinc-100 rounded"></div>
      </div>

      <!-- Deliverables List Skeleton -->
      <div class="space-y-2.5 mb-6">
        <div v-for="i in 4" :key="i" class="flex items-start gap-2.5">
          <div class="w-4 h-4 rounded-full bg-zinc-200 shrink-0 mt-0.5"></div>
          <div class="flex-1 space-y-1">
            <div class="h-3 bg-zinc-200 rounded" :style="{ width: `${70 + (i * 6)}%` }"></div>
            <div class="h-2.5 w-3/4 bg-zinc-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Price Box & Button Skeleton -->
    <div class="pt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="h-3 w-16 bg-zinc-100 rounded"></div>
        <div class="h-6 w-36 bg-zinc-200 rounded"></div>
      </div>
      <div class="h-10 w-full sm:w-40 bg-zinc-200 rounded-xl"></div>
    </div>
  </div>
</template>
