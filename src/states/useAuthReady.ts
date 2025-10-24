import { ref } from 'vue'
import { checkAuth } from '../services/authService'

const authReady = ref(false)


function initAuth() {
  if (import.meta.env.MODE === 'production') {
    authReady.value = checkAuth()
  } else {
    authReady.value = true
  }
}

initAuth()

export function useAuthReady() {
  return { authReady }
}
