<template>
  <div class="flex flex-col justify-between bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-subtle animate-pulse h-full min-h-[460px]">
    <div>
      <!-- Top Meta Bar Skeleton -->
      <div class="flex items-center justify-between gap-2 mb-4">
        <div class="h-3 w-28 bg-zinc-200 rounded-md"></div>
        <div class="h-4 w-20 bg-zinc-200 rounded-full"></div>
      </div>

      <!-- Brand Header Skeleton -->
      <div class="flex items-start gap-3.5 mb-4">
        <div class="w-12 h-12 rounded-2xl bg-zinc-200 shrink-0"></div>
        <div class="flex-1 space-y-1.5 pt-0.5">
          <div class="h-4 w-3/4 bg-zinc-200 rounded"></div>
          <div class="h-3 w-1/2 bg-zinc-100 rounded"></div>
        </div>
      </div>

      <!-- Duration & Stock Pills Skeleton -->
      <div class="flex items-center gap-2 mb-3">
        <div class="h-5 w-20 bg-zinc-100 rounded-md"></div>
        <div class="h-5 w-24 bg-zinc-100 rounded-md"></div>
      </div>

      <!-- Description Skeleton -->
      <div class="space-y-1.5 mb-4">
        <div class="h-3 w-full bg-zinc-100 rounded"></div>
        <div class="h-3 w-4/5 bg-zinc-100 rounded"></div>
      </div>

      <!-- Features List Skeleton -->
      <div class="space-y-2 py-3 border-t border-zinc-100">
        <div v-for="i in 4" :key="i" class="flex items-center gap-2">
          <div class="w-3.5 h-3.5 rounded-full bg-zinc-200 shrink-0"></div>
          <div class="h-3 bg-zinc-100 rounded" :style="{ width: `${60 + (i * 8)}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Bottom Price & Order Button Skeleton -->
    <div class="pt-4 border-t border-zinc-100 mt-4 space-y-3">
      <div class="flex items-baseline justify-between">
        <div class="space-y-1">
          <div class="h-2.5 w-12 bg-zinc-100 rounded"></div>
          <div class="h-6 w-28 bg-zinc-200 rounded"></div>
        </div>
        <div class="h-4 w-16 bg-zinc-100 rounded"></div>
      </div>
      <div class="h-10 w-full bg-zinc-200 rounded-xl"></div>
    </div>
  </div>
</template>
