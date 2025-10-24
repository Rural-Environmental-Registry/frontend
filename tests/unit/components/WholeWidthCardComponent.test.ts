import { mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import WholeWidthCardComponent from '@/components/WholeWidthCardComponent.vue'

describe('WholeWidthCardComponent', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    wrapper = mount(WholeWidthCardComponent, {
      slots: {
        default: 'Slot Content',
      },
      props: {
        customClass: 'custom-class',
        bgColor: 'red',
      },
    })
  })

  it('renders slot content', async () => {
    expect(wrapper.text()).toContain('Slot Content')
  })

  it('renders whole width card with custom class', async () => {
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('renders whole width card with a background color', async () => {
    expect(wrapper.attributes('style')).toContain('background-color')
  })

  it('renders whole width card without custom class', async () => {
    await wrapper.setProps({ customClass: null })
    expect(wrapper.classes()).not.toContain('custom-class')
  })

  it('renders whole width card without a background color', async () => {
    await wrapper.setProps({ bgColor: null })
    expect(wrapper.attributes('style')).not.toContain('background-color')
  })
})
