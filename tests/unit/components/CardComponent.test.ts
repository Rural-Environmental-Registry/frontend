import { mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import CardComponent from '@/components/CardComponent.vue'

describe('CardComponent', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    wrapper = mount(CardComponent, {
      slots: {
        default: 'Slot content',
      },
    })
  })

  it('renders slot content', () => {
    expect(wrapper.text()).toEqual('Slot content')
  })

  it('div 1 has correct classes', () => {
    expect(wrapper.classes()).toContain('br-card')
    expect(wrapper.classes()).toContain('rounded')
  })

  it('div 2 has correct classes', () => {
    expect(wrapper.find('div.mb-2').exists()).toBeTruthy()
    expect(wrapper.find('div.mt-3').exists()).toBeTruthy()
    expect(wrapper.find('div.mr-2').exists()).toBeTruthy()
    expect(wrapper.find('div.ml-3').exists()).toBeTruthy()
  })
})
