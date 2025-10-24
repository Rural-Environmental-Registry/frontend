import { mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import LoadingComponent from '@/components/LoadingComponent.vue'

describe('LoadingComponent', () => {
  let wrapper: VueWrapper
  beforeAll(() => {
    wrapper = mount(LoadingComponent)
  })

  it('renders correctly', () => {
    expect(wrapper.text()).toContain('Loading...')
  })

  it('has correct classes', async () => {
    expect(wrapper.classes().toLocaleString()).toBe(
      'min-h-screen,flex,flex-col,items-center,justify-center',
    )
  })
})
