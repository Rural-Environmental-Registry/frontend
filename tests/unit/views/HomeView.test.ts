import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../../../src/views/HomeView.vue'

vi.mock('../../../src/context/language/useLanguageContext.ts', () => ({
  useLanguageContext: () => ({
    language: { value: 'pt-br' },
    setLanguage: vi.fn(),
    getLanguage: vi.fn(),
  }),
}))

describe('HomeView', () => {
  it('renders correctly', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
    })

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
