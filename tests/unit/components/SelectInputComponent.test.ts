import { mount, VueWrapper } from '@vue/test-utils'
import { SelectItem, SelectValue } from 'radix-vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import SelectInputComponent from '@/components/SelectInputComponent.vue'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.errors.isRequired': 'is required',
      }
      return translations[key] || key
    },
  }),
}))

describe('SelectComponent', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    wrapper = mount(SelectInputComponent, {
      props: {
        placeholder: 'Select an option',
        label: 'Test Label (Required)',
        id: 'test-id',
        width: '100%',
        items: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        modelValue: '',
        errors: [{ $uid: 1, $validator: 'required' }],
      },
    })
  })

  it('renders the label correctly', () => {
    expect(wrapper.find('label').text()).toBe('Test Label (Required)')
  })

  it('updates modelValue on select', async () => {
    wrapper.setValue('option2')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['option2'])
  })

  it('displays placeholder correctly', () => {
    expect(wrapper.find('span').text()).toBe('Select an option')
  })

  it('displays error messages correctly', () => {
    expect(wrapper.find('.text-red-600').text()).toBe('Test Label is required!')
  })

  // Edge case: No items provided
  it('handles no items gracefully', async () => {
    await wrapper.setProps({ items: [] })
    expect(wrapper.findAllComponents(SelectItem).length).toBe(0)
  })

  // Edge case: Invalid modelValue
  it('handles invalid modelValue gracefully', async () => {
    await wrapper.setProps({ modelValue: 'invalid-value' })
    expect(wrapper.findComponent(SelectValue).text()).toBe('')
  })

  // Edge case: No placeholder provided
  it('handles no placeholder gracefully', async () => {
    await wrapper.setProps({ placeholder: '' })
    expect(wrapper.findComponent(SelectValue).props('placeholder')).toBe('')
  })

  // Edge case: No label provided
  it('handles no label gracefully', async () => {
    await wrapper.setProps({ label: '' })
    expect(wrapper.find('label').text()).toBe('')
  })

  // Edge case: Multiple errors
  it('displays multiple error messages correctly', async () => {
    await wrapper.setProps({
      errors: [{ $uid: 1, $validator: 'required' }],
    })
    const errorMessages = wrapper.findAll('.text-red-600')
    expect(errorMessages.length).toBe(1)
    expect(errorMessages.at(0)?.text()).toBe('Test Label is required!')
  })
})
