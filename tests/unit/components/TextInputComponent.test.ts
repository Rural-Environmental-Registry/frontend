import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import TextInputComponent from '@/components/TextInputComponent.vue'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.errors.isRequired': 'is required',
        'register.errors.dateFormat': 'must be at YYYY-MM-DD format',
        'register.errors.checkValue': 'Check the value',
      }
      return translations[key] || key
    },
  }),
}))

describe('TextInputComponent', () => {
  let wrapper: VueWrapper
  let input: DOMWrapper<HTMLInputElement>

  beforeAll(() => {
    wrapper = mount(TextInputComponent, {
      props: {
        label: 'Test Label',
        id: 'test-id',
        type: 'text',
        placeholder: 'Enter text',
        modelValue: '',
        classes: 'test-class',
        tooltipText: 'Tooltip info',
      },
    })
    input = wrapper.find('input')
  })

  it('renders the label correctly', () => {
    expect(wrapper.find('label').text()).toBe('Test Label')
  })

  it('applies id correctly', () => {
    expect(input.attributes('id')).toContain('test-id')
  })

  it('applies type correctly', () => {
    expect(input.attributes('type')).toContain('text')
  })

  it('render without passed type', async () => {
    await wrapper.setProps({ type: null })
    expect(input.attributes('type')).toContain('text')
  })

  it('applies placeholder correctly', () => {
    expect(input.attributes('placeholder')).toContain('Enter text')
  })

  it('updates modelValue on input', async () => {
    await input.setValue('new value')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new value'])
  })

  it('displays tooltip text when provided', async () => {
    expect(wrapper.find('svg[data-state="closed"]').classes().toString()).toContain(
      'fa-circle-info',
    )
  })

  it('displays required error messages correctly', async () => {
    //Without errors
    expect(wrapper.find('.text-red-600').exists()).toBeFalsy()

    //With Required errors
    await wrapper.setProps({ errors: [{ $uid: 1, $validator: 'required' }] })
    expect(wrapper.find('.text-red-600').text()).toBe('Test Label is required!')

    //With Date errors
    await wrapper.setProps({ errors: [{ $uid: 1, $validator: 'date' }] })
    expect(wrapper.find('.text-red-600').text()).toBe('Test Label must be at YYYY-MM-DD format!')

    //With Unhandled errors
    await wrapper.setProps({ errors: [{ $uid: 1, $validator: 'elseOne' }] })
    expect(wrapper.find('.text-red-600').text()).toBe('Check the value!')
  })

  it('applies custom classes when provided', () => {
    expect(input.classes()).toContain('test-class')
  })
})
