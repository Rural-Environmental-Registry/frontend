import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import GlobalLoading from '@/components/GlobalLoading.vue'

describe('GlobalLoading.vue', () => {
  it('renders the spinner', () => {
    const wrapper = mount(GlobalLoading)
    const spinner = wrapper.find('.spinner')
    expect(spinner.exists()).toBe(true)
    expect(spinner.attributes('aria-label')).toBe('Carregando')
  })
})
