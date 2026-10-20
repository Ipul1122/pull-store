<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginWithPasscode } from '../../lib/auth'
import logoSyaiful from '../../assets/logo-syaiful.png'
import { ShieldCheck, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const passcode = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = () => {
  if (!passcode.value.trim()) {
    errorMsg.value = 'Silakan masukkan password admin'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  setTimeout(() => {
    const success = loginWithPasscode(passcode.value)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      errorMsg.value = 'Password admin salah. Coba: pulladmin2026'
    }
    isLoading.value = false
  }, 400)
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white">
    <!-- Back to store button -->
    <router-link 
      to="/" 
      class="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-8 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
    >
      <ArrowLeft class="w-3.5 h-3.5" />
      <span>Kembali ke Toko</span>
    </router-link>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div class="text-center mb-6">
        <div class="w-14 h-14 rounded-2xl bg-white border border-zinc-700/80 p-1 flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden">
          <img :src="logoSyaiful" alt="Pull Store Logo" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-xl font-bold tracking-tight text-white">
          Pull Store Admin
        </h1>
        <p class="text-xs text-zinc-400 mt-1">
          Akses panel kontrol produk & layanan software langsung ke Supabase
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMsg" class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-mono text-zinc-400 mb-1.5">
            Password Admin
          </label>
          <div class="relative">
            <input 
              v-model="passcode"
              type="password" 
              placeholder="Masukkan password admin..."
              autofocus
              class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm outline-none transition-all placeholder:text-zinc-600 font-mono"
            />
          </div>
          <p class="text-[11px] text-zinc-500 mt-1.5 font-mono">
            <!-- Default password: <code class="text-blue-400 bg-blue-950/40 px-1 py-0.5 rounded">pulladmin2026</code> -->
          </p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          <span>{{ isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard' }}</span>
          <ArrowRight v-if="!isLoading" class="w-4 h-4" />
        </button>
      </form>
    </div>

    <!-- Security Note -->
    <div class="mt-8 text-center text-[11px] text-zinc-600 font-mono flex items-center gap-1.5">
      <ShieldCheck class="w-3.5 h-3.5 text-zinc-500" />
      <span>Protected Session • Direct Supabase Integration</span>
    </div>
  </div>
</template>
