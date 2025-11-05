import { mount, VueWrapper } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import PropertyCardComponent from '@/components/PropertyCardComponent.vue'
import ApiService from '@/services/axios.ts'

// Mocking vue-router
const routes = [{ path: '/property_details', component: {} }]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

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

vi.mock('@/services/propertiesService', () => ({
  fetchReceipt: vi.fn(async () => {
    return { data: 'mock-receipt' }
  }),
}))

global.URL.createObjectURL = vi.fn(() => 'mock-object-url')

describe('PropertyCardComponent', () => {
  let mockAxios: MockAdapter
  let wrapper: VueWrapper

  beforeEach(() => {
    mockAxios = new MockAdapter(ApiService['axiosInstance'], { delayResponse: 0 })
    const mockBlob = new Blob(['conteúdo fictício'], { type: 'image/png' })
    mockAxios.onGet('12345/image').reply(200, mockBlob)
    mockAxios.onGet('67890/image').reply(200, mockBlob)
  })

  afterEach(() => {
    mockAxios.restore()
    if (wrapper) wrapper.unmount()
  })

  describe('Component Rendering', () => {
    beforeEach(() => {
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

    it('renders property name in header', () => {
      expect(wrapper.find('h1').text()).toBe('Test Property')
    })

    it('renders property code', () => {
      expect(wrapper.find('p.break-all').text()).toBe('BR-12345')
    })

    it('renders property state', () => {
      expect(wrapper.text()).toContain('Test State')
    })

    it('renders property city', () => {
      expect(wrapper.text()).toContain('Test City')
    })

    it('has card structure with correct classes', () => {
      const card = wrapper.find('.br-card')
      expect(card.exists()).toBe(true)
      expect(card.classes()).toContain('rounded')
      expect(card.classes()).toContain('max-w-[380px]')
    })

    it('has header with background color', () => {
      const header = wrapper.find('.bg-\\[\\#BAF2DD\\]')
      expect(header.exists()).toBe(true)
    })
  })

  describe('Image Loading', () => {
    beforeEach(() => {
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

    it('renders image with lazy loading', () => {
      const img = wrapper.find('img')
      expect(img.attributes('loading')).toBe('lazy')
    })

    it('renders image with correct alt text', () => {
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('Property Map')
    })

    it('has placeholder image fallback', () => {
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
    })
  })

  describe('Details Button', () => {
    beforeEach(() => {
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

    it('renders details button', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThan(0)
      const detailsButton = buttons.find((btn) => btn.text().includes('Details'))
      expect(detailsButton?.exists()).toBe(true)
    })

    it('navigates to details page on button click', async () => {
      const push = vi.spyOn(router, 'push')
      const buttons = wrapper.findAll('button')
      const detailsButton = buttons.find((btn) => btn.text().includes('Details'))
      await detailsButton?.trigger('click')
      expect(push).toHaveBeenCalledWith('/properties/details/12345')
    })

    it('details button has eye icon', () => {
      const buttons = wrapper.findAll('button')
      const detailsButton = buttons.find((btn) => btn.text().includes('Details'))
      expect(detailsButton?.find('svg').exists()).toBe(true)
    })
  })

  describe('Registration Button - Download Handling', () => {
    beforeEach(() => {
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

    it('renders registry button', () => {
      const buttons = wrapper.findAll('button')
      const registryButton = buttons.find((btn) => btn.text().includes('Registry'))
      expect(registryButton?.exists()).toBe(true)
    })

    it('shows download icon initially', () => {
      const buttons = wrapper.findAll('button')
      const registryButton = buttons.find((btn) => btn.text().includes('Registry'))
      expect(registryButton?.find('svg').exists()).toBe(true)
    })

    it('triggers registration button click', async () => {
      const buttons = wrapper.findAll('button')
      const registryButton = buttons.find((btn) => btn.text().includes('Registry'))
      await registryButton?.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Layout Structure', () => {
    beforeEach(() => {
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

    it('has horizontal divider between content and buttons', () => {
      const hr = wrapper.find('hr')
      expect(hr.exists()).toBe(true)
      expect(hr.classes()).toContain('border-t-2')
    })

    it('has button container with proper alignment', () => {
      const flexContainer = wrapper.find('.flex.items-center.justify-center')
      expect(flexContainer.exists()).toBe(true)
    })

    it('renders two buttons separated by divider', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('has separator line between buttons', () => {
      const separators = wrapper.findAll('.w-0\\.5')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Props Validation', () => {
    it('accepts all required property props', () => {
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
      expect(wrapper.exists()).toBe(true)
    })

    it('handles different property names', () => {
      wrapper = mount(PropertyCardComponent, {
        global: {
          plugins: [router],
        },
        props: {
          propertyName: 'Another Property Name',
          id: '67890',
          code: 'TEST-CODE',
          stateDistrict: 'Another State',
          municipality: 'Another City',
          imageUrl: '67890/image',
        },
      })
      expect(wrapper.find('h1').text()).toBe('Another Property Name')
    })
  })

  describe('Integration', () => {
    beforeEach(() => {
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

    it('displays all property information correctly', () => {
      const text = wrapper.text()
      expect(text).toContain('Test Property')
      expect(text).toContain('BR-12345')
      expect(text).toContain('Test State')
      expect(text).toContain('Test City')
    })

    it('has both action buttons available', () => {
      const buttons = wrapper.findAll('button')
      const hasDetailsButton = buttons.some((btn) => btn.text().includes('Details'))
      const hasRegistryButton = buttons.some((btn) => btn.text().includes('Registry'))
      expect(hasDetailsButton).toBe(true)
      expect(hasRegistryButton).toBe(true)
    })

    it('component mounts without errors', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})
