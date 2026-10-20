import { ref } from 'vue'

const AUTH_KEY = 'pull_store_admin_session'
const DEFAULT_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'pulladmin2026'

export const isAuthenticated = ref(localStorage.getItem(AUTH_KEY) === 'true')

export function loginWithPasscode(passcode: string): boolean {
  if (passcode.trim() === DEFAULT_PASSCODE) {
    localStorage.setItem(AUTH_KEY, 'true')
    isAuthenticated.value = true
    return true
  }
  return false
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY)
  isAuthenticated.value = false
}
