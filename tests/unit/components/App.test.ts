import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../../../src/App.vue'

vi.mock('../../../src/components/BackBarComponent.vue', () => ({
  default: {
    name: 'BackBarComponent',
    template: '<div data-testid="back-bar">Back Bar</div>',
  },
}))

vi.mock('../../../src/components/FooterComponent.vue', () => ({
  default: {
    name: 'FooterComponent',
    template: '<div data-testid="footer">Footer</div>',
  },
}))

vi.mock('../../../src/components/NavBarComponent.vue', () => ({
  default: {
    name: 'NavBarComponent',
    template: '<div data-testid="navbar">Nav Bar</div>',
  },
}))

vi.mock('../../../src/context/FormContext.vue', () => ({
  default: {
    name: 'FormContext',
    template: '<div data-testid="form-context"><slot /></div>',
  },
}))

vi.mock('../../../src/context/language/LanguageContext.vue', () => ({
  default: {
    name: 'LanguageContext',
    template: '<div data-testid="language-context"><slot /></div>',
  },
}))

vi.mock('../../../src/context/validators/ValidatorContext.vue', () => ({
  default: {
    name: 'ValidatorContext',
    template: '<div data-testid="validator-context"><slot /></div>',
  },
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    RouterView: {
      name: 'RouterView',
      template: '<div data-testid="router-view">Router View</div>',
    },
  }
})

describe('App', () => {
  it('renders the main app structure', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('[data-testid="navbar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="back-bar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="footer"]').exists()).toBe(true)
  })

  it('renders all context providers in correct order', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.find('[data-testid="form-context"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="validator-context"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="language-context"]').exists()).toBe(true)
  })

  it('has correct CSS classes for layout', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    const mainDiv = wrapper.find('div.flex.flex-col.min-h-screen')
    expect(mainDiv.exists()).toBe(true)

    const contentDiv = wrapper.find('div.flex-grow.w-full')
    expect(contentDiv.exists()).toBe(true)
  })
})
