<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  cols?: number
}>(), {
  rows: 5,
  cols: 5
})
</script>

<template>
  <tbody class="divide-y divide-zinc-800/60 animate-pulse">
    <tr v-for="r in rows" :key="r" class="hover:bg-zinc-800/10">
      <td v-for="c in cols" :key="c" class="py-3.5 px-4">
        <div 
          class="h-3.5 bg-zinc-800/80 rounded" 
          :class="c === 1 ? 'w-3/4' : (c === cols ? 'w-12 ml-auto' : 'w-24')"
        ></div>
      </td>
    </tr>
  </tbody>
</template>
