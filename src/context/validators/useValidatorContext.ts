import { inject } from 'vue'
import type { ValidatorContextType } from './ValidatorContext.vue'

export const useValidatorContext = () => {
  const context = inject<ValidatorContextType>('validatorContext')
  if (!context) {
    throw new Error('useValidatorContext must be used within a ValidatorProvider')
  }
  return context
}
