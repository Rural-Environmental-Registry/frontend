import { mount, VueWrapper } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import BackBarComponent from '../../../src/components/BackBarComponent.vue'
import FormContext from '../../../src/context/FormContext.vue'

// Mocking vue-router
const routes = [
  { path: '/home', name: 'home', component: {} },
  { path: '/register', component: {} },
  { path: '/properties', name: 'properties', component: {} },
  { path: '/profile', component: {} },
  { path: '/properties/details/', component: {} },
  { path: '/unknown', component: {} },
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.route': 'Register property',
        'properties.route': 'Properties',
        'details.route': 'Property Details',
      }
      return translations[key] || key
    },
  }),
}))

describe('BackBarComponent', () => {
  let wrapper: VueWrapper

  beforeAll(() => {
    wrapper = mount(FormContext, {
      slots: {
        default: BackBarComponent,
      },
      global: {
        plugins: [router],
      },
    })
  })

  it('renders back bar with "Register property" text for /register route', async () => {
    await router.push('/register')
    expect(wrapper.find('span').text()).toContain('Register property')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders back bar with "Properties" text for /properties route', async () => {
    await router.push('/properties')
    expect(wrapper.find('span').text()).toContain('Properties')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders back bar with "Profile" text for /profile route', async () => {
    await router.push('/profile')
    expect(wrapper.find('span').text()).toContain('Profile')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders back bar with "Details" text for /property_details route', async () => {
    await router.push('/properties/details/')
    expect(wrapper.find('span').text()).toContain('Details')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('navigates back to property details from /properties using sessionStorage', async () => {
    sessionStorage.setItem('lastPropertyId', '456')

    await router.push('/properties')
    await router.isReady()

    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.find('button').trigger('click')

    expect(pushSpy).toHaveBeenCalledWith({ name: 'home' })
  })
})
