<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalItems: number
    pageSize: number
    pageSizeOptions?: number[]
  }>(),
  {
    pageSizeOptions: () => [10, 20, 50]
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
}>()

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / props.pageSize))
})

const fromIndex = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const toIndex = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

const visiblePages = computed(() => {
  const current = props.currentPage
  const total = totalPages.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
}

const onPageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = Number(target.value)
  emit('update:pageSize', newSize)
  emit('update:currentPage', 1)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-zinc-900/90 border-t border-zinc-800 text-xs text-zinc-400 font-mono">
    <!-- Info Data & Page Size Selector -->
    <div class="flex items-center gap-3">
      <span>
        Menampilkan <strong class="text-white">{{ fromIndex }}</strong> - <strong class="text-white">{{ toIndex }}</strong> dari <strong class="text-white">{{ totalItems }}</strong> data
      </span>

      <div class="hidden sm:flex items-center gap-1.5 pl-3 border-l border-zinc-800">
        <label for="pageSizeSelect" class="text-zinc-500">Per hal:</label>
        <select
          id="pageSizeSelect"
          :value="pageSize"
          @change="onPageSizeChange"
          class="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center gap-1 self-center sm:self-auto">
      <!-- Previous Button -->
      <button
        type="button"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
        <span class="hidden md:inline">Sebelumnya</span>
      </button>

      <!-- Page Numbers -->
      <template v-for="(p, idx) in visiblePages" :key="idx">
        <span 
          v-if="p === '...'" 
          class="px-2 py-1 text-zinc-600 select-none"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          @click="goToPage(Number(p))"
          class="min-w-[28px] h-7 px-2 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
          :class="p === currentPage
            ? 'bg-blue-600 text-white font-bold shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'"
        >
          {{ p }}
        </button>
      </template>

      <!-- Next Button -->
      <button
        type="button"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Halaman Selanjutnya"
      >
        <span class="hidden md:inline">Selanjutnya</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
