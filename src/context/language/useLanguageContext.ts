import { inject } from 'vue'
import type { LanguageContextType } from './LanguageContext.vue'

export const useLanguageContext = () => {
  const languageContext = inject<LanguageContextType>('languageContext')
  if (!languageContext) {
    throw new Error('languageContext is not provided')
  }
  return languageContext
}
