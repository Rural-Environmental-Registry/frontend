import { ref } from 'vue'

const isLoading = ref(false)

export function useGlobalLoading() {
  return {
    isLoading,
    showLoading: () => (isLoading.value = true),
    hideLoading: () => (isLoading.value = false),
  }
}
