import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import TextAreaComponent from '@/components/TextAreaComponent.vue'

describe('TextAreaComponent', () => {
  let wrapper: VueWrapper
  let textarea: DOMWrapper<HTMLTextAreaElement>

  beforeAll(() => {
    wrapper = mount(TextAreaComponent, {
      props: {
        label: 'Test Label',
        id: 'test-id',
        placeholder: 'Enter text',
        modelValue: '',
        tooltipText: 'Tooltip info',
      },
    })
    textarea = wrapper.find('textarea')
  })

  it('renders the label correctly', () => {
    expect(wrapper.find('label').text()).toBe('Test Label')
  })

  it('applies id correctly', () => {
    expect(textarea.attributes('id')).toContain('test-id')
  })

  it('applies placeholder correctly', () => {
    expect(textarea.attributes('placeholder')).toContain('Enter text')
  })

  it('updates modelValue on textarea', async () => {
    await textarea.setValue('new value')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new value'])
  })

  it('displays tooltip text when provided', async () => {
    expect(wrapper.find('svg[data-state="closed"]').classes().toString()).toContain(
      'fa-circle-info',
    )
  })
})
