import { mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import CalendarComponent from '@/components/CalendarComponent.vue'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.errors.isRequired': 'is required',
        'register.registrarDetails.form.required': '(Required)',
      }
      return translations[key] || key
    },
  }),
}))

describe('CalendarComponent', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    wrapper = mount(CalendarComponent, {
      props: {
        label: 'Date Picker (Required)',
        id: 'date-picker',
        modelValue: '',
        errors: [{ $uid: 1, $validator: 'required' }],
      },
    })
  })

  it('renders label', () => {
    expect(wrapper.find('label').text()).toBe('Date Picker (Required)')
  })

  it('opens date picker on label click', () => {
    wrapper.find('label').trigger('click')
    expect(wrapper.find('.dp__input').isVisible()).toBe(true)
  })

  it('updates modelValue when date is selected', () => {
    wrapper.setValue('2023-10-01')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['2023-10-01'])
  })

  it('shows error message when required field is empty', async () => {
    expect(wrapper.find('.text-red-600').text()).toBe('Date Picker is required!')
  })
})
