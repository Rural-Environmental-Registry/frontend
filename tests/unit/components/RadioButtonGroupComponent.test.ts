import { mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import RadioButtonGroupComponent from '@/components/RadioButtonGroupComponent.vue'

let wrapper: VueWrapper

describe('RadioGroupComponent', () => {
  beforeAll(() => {
    wrapper = mount(RadioButtonGroupComponent, {
      props: {
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
        modelValue: 'option1',
        name: 'testRadioGroup',
        verticalAlignment: true,
        groupLabel: 'Test Group',
        tooltipText: 'Test Tooltip',
      },
    })
  })

  it('renders group label', () => {
    expect(wrapper.text()).toContain('Test Group')
  })

  it('renders tooltip', () => {
    expect(wrapper.find('svg[data-state="closed"]').classes().toString()).toContain(
      'fa-circle-info',
    )
  })

  it('renders radio options', () => {
    expect(wrapper.text()).toContain('Option 1')
    expect(wrapper.text()).toContain('Option 2')
  })

  it('updates modelValue when radio option is selected', () => {
    wrapper.setValue('option2')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('renders with vertical alignment', () => {
    expect(wrapper.find('div.mt-3').classes()).toContain('flex-col')
  })

  it('renders with horizontal alignment', async () => {
    await wrapper.setProps({ verticalAlignment: false })
    expect(wrapper.find('div.mt-3').classes()).toContain('flex-row')
  })
})
