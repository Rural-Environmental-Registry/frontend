import { inject } from 'vue'
import type { FormContextType } from './FormContext.vue'

export const useFormContext = () => {
  const context = inject<FormContextType>('formContext')
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}
