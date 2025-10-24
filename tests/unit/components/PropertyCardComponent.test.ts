import { mount, VueWrapper } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import PropertyCardComponent from '@/components/PropertyCardComponent.vue'
import ApiService from '@/services/axios.ts'

// Mocking vue-router
const routes = [{ path: '/property_details', component: {} }]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

let wrapper: VueWrapper

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'properties.propertyCard.code': 'Code',
        'properties.propertyCard.state': 'State',
        'properties.propertyCard.city': 'City',
        'properties.propertyCard.details': 'Details',
        'properties.propertyCard.registration': 'Registry',
      }
      return translations[key] || key
    },
  }),
}))

global.URL.createObjectURL = vi.fn(() => 'mock-object-url')

describe('PropertyCardComponent', () => {
  let mockAxios: MockAdapter

  afterEach(() => {
    mockAxios.restore()
  })

  beforeAll(() => {
    mockAxios = new MockAdapter(ApiService['axiosInstance'], { delayResponse: 0 })
    const mockBlob = new Blob(['conteúdo fictício'], { type: 'image/png' })
    const mockResponse = {
      data: mockBlob,
      status: 200,
      statusText: 'OK',
    }
    mockAxios.onGet('12345/image').reply(200, mockResponse)
    wrapper = mount(PropertyCardComponent, {
      global: {
        plugins: [router],
      },
      props: {
        propertyName: 'Test Property',
        id: '12345',
        code: 'BR-12345',
        stateDistrict: 'Test State',
        municipality: 'Test City',
        imageUrl: '12345/image',
      },
    })
  })

  it('renders property name', async () => {
    expect(wrapper.find('h1').text()).toBe('Test Property')
  })

  it('renders property code', async () => {
    expect(wrapper.find('p.break-all').text()).toBe('BR-12345')
  })

  // TODO: should be replaced with property image
  it('renders property image', async () => {
    expect(wrapper.find('img').attributes('alt')).toBe('Property Map')
    expect(wrapper.vm.imageUrl).toBe('12345/image')
  })

  it('renders property state', async () => {
    expect(wrapper.text()).toContain('Test State')
  })

  it('renders property city', async () => {
    expect(wrapper.text()).toContain('Test City')
  })

  it('calls router.push when details button is clicked', async () => {
    const push = vi.spyOn(router, 'push')
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Details'))
      ?.trigger('click')
    expect(push).toHaveBeenCalledWith('/properties/details/12345')
  })

  it('renders registry button', async () => {
    expect(
      wrapper
        .findAll('button')
        .find((button) => button.text().includes('Registry'))
        ?.exists(),
    ).toBeTruthy()
  })
})
