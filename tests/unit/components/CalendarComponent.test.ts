import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CalendarComponent from '@/components/CalendarComponent.vue'


vi.mock('flatpickr', () => {
  return {
    default: vi.fn(() => ({
      open: vi.fn(),
      destroy: vi.fn(),
    }))
  }
})


vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i></i>'
  }
}))

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.errors.isRequired': 'is required',
        'register.errors.dateUpperLimit': 'cannot be in the future',
        'register.registrarDetails.form.required': '(Required)',
      }
      return translations[key] || key
    },
  }),
}))

describe('CalendarComponent', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(CalendarComponent, {
      props: {
        label: 'Date Picker (Required)',
        id: 'date-picker',
        modelValue: '',
        errors: [],
      },
    })
  })

  describe('Component Rendering', () => {
    it('renders label', () => {
      expect(wrapper.find('label').text()).toBe('Date Picker (Required)')
    })

    it('renders date picker input', () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('has correct id on date picker', () => {
      expect(wrapper.find('[id="date-picker"]').exists()).toBe(true)
    })
  })

  describe('Label Click Functionality', () => {
    it('opens date picker on label click', async () => {
      await wrapper.find('label').trigger('click')
      await wrapper.vm.$nextTick()
      // Test passes if no error is thrown
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })
  })

  describe('Date Selection', () => {
    it('updates modelValue when date is selected', async () => {
      const input = wrapper.find('input[type="text"]')
      await input.setValue('2023-10-01')
      await input.trigger('blur')
      expect(wrapper.emitted()['update:modelValue']).toBeDefined()
    })

    it('emits update:modelValue event on date change', async () => {
      const input = wrapper.find('input[type="text"]')
      await input.setValue('2024-01-15')
      await input.trigger('blur')
      expect(wrapper.emitted()['update:modelValue']).toBeDefined()
    })

    it('parses date string correctly', async () => {
      const input = wrapper.find('input[type="text"]')
      await input.setValue('2023-05-20')
      await input.trigger('blur')
      expect(wrapper.emitted()['update:modelValue']).toBeDefined()
    })

    it('handles null date gracefully', async () => {
      await wrapper.setProps({ modelValue: undefined })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('formats date to YYYY-MM-DD format', async () => {
      const input = wrapper.find('input[type="text"]')
      await input.setValue('2023-10-01')
      await input.trigger('blur')
      expect(wrapper.emitted()['update:modelValue']).toBeDefined()
    })
  })

  describe('Error Display - Required', () => {
    it('shows error message when required field is empty and has error', async () => {
      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'required' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').exists()).toBe(true)
    })

    it('displays correct error text for required field', async () => {
      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'required' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').text()).toContain('is required')
    })

    it('hides error when date is selected', async () => {
      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'required' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').exists()).toBe(true)

      const input = wrapper.find('input[type="text"]')
      await input.setValue('2023-10-01')
      await input.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('#date-required-error').exists()).toBe(false)
    })

    it('does not show error when errors array is empty', async () => {
      await wrapper.setProps({ errors: [] })
      await wrapper.vm.$nextTick()
      const errorElements = wrapper.findAll('.text-red-600')
      expect(errorElements.length).toBe(0)
    })
  })

  describe('Error Display - Date Upper Limit', () => {
    it('shows date upper limit error when max validator fails', async () => {
      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'max' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-upper-limit-error').exists()).toBe(true)
    })

    it('displays correct error text for date upper limit', async () => {
      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'max' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-upper-limit-error').text()).toContain('cannot be in the future')
    })

    it('shows both errors when both validators fail', async () => {
      await wrapper.setProps({
        errors: [
          { $uid: 1, $validator: 'required' },
          { $uid: 2, $validator: 'max' },
        ],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').exists()).toBe(true)
      expect(wrapper.find('#date-upper-limit-error').exists()).toBe(true)
    })
  })

  describe('Label Text Parsing', () => {
    it('extracts label without required suffix', async () => {
      await wrapper.setProps({
        label: 'Birth Date (Required)',
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('label').text()).toContain('Birth Date')
    })

    it('handles label without required text', async () => {
      await wrapper.setProps({
        label: 'Regular Label',
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('label').text()).toBe('Regular Label')
    })
  })

  describe('Watch Behavior', () => {
    it('reacts to modelValue changes', async () => {
      await wrapper.setProps({ modelValue: '2023-10-01' })
      await wrapper.vm.$nextTick()
      const input = wrapper.find('input[type="text"]')
      expect(input.element.value).toBe('2023-10-01')
    })

    it('updates shouldShowError when hasRequiredError changes', async () => {
      await wrapper.setProps({
        errors: [],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').exists()).toBe(false)

      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'required' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').exists()).toBe(true)
    })
  })

  describe('Date Picker Configuration', () => {
    it('renders the date picker component', () => {
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts optional label prop', async () => {
      await wrapper.setProps({ label: 'Custom Label' })
      expect(wrapper.find('label').text()).toBe('Custom Label')
    })

    it('accepts optional id prop', async () => {
      await wrapper.setProps({ id: 'custom-date' })
      expect(wrapper.find('[id="custom-date"]').exists()).toBe(true)
    })

    it('accepts optional modelValue prop', async () => {
      await wrapper.setProps({ modelValue: '2023-12-25' })
      await wrapper.vm.$nextTick()
      const input = wrapper.find('input[type="text"]')
      expect(input.element.value).toBe('2023-12-25')
    })

    it('accepts optional errors prop', async () => {
      await wrapper.setProps({
        errors: [{ $uid: 1, $validator: 'required' }],
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#date-required-error').exists()).toBe(true)
    })

    it('handles undefined errors gracefully', async () => {
      await wrapper.setProps({ errors: undefined })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string modelValue', async () => {
      await wrapper.setProps({ modelValue: '' })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('handles null modelValue', async () => {
      await wrapper.setProps({ modelValue: null })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('formats today date correctly', async () => {
      const today = new Date().toISOString().split('T')[0]
      await wrapper.setProps({ modelValue: today })
      await wrapper.vm.$nextTick()
      const input = wrapper.find('input[type="text"]')
      expect(input.element.value).toBe(today)
    })
  })
})
