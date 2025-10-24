import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import StepperComponent from '@/components/StepperComponent.vue'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.steps.propertyMap': 'Property map',
        'register.steps.registrarDetails': "Registrar's details",
        'register.steps.landholdersInformation': "Landholder's information",
        'register.steps.ruralProperties': 'Rural properties',
        'register.steps.propertyRights': 'Property rights',
        'register.step': 'Step',
      }
      return translations[key] || key
    },
    language: 'en-us', // pode ser necessário se usado no componente
  }),
}))

describe('StepperComponent', () => {
  let wrapper: VueWrapper

  const routes = [
    { path: '/property_map', component: {} },
    { path: '/registrars_details', component: {} },
    { path: '/landholders_information', component: {} },
    { path: '/rural_property', component: {} },
    { path: '/property_rights', component: {} },
  ]

  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  beforeEach(() => {
    wrapper = mount(StepperComponent, {
      global: {
        plugins: [router],
        provide: {
          formContext: {
            validateRegistrationForm: {
              isRegistrarDetailsValid: false,
              isLandHoldersInformationValid: false,
              isRuralPropertiesValid: false,
              isPropertyRightsValid: false,
            },
          },
        },
      },
    })
  })

  it('renders the steps correctly', () => {
    const steps = wrapper.findAll('.w-4.h-4.rounded-full')
    expect(steps.length).toBe(5)
  })

  it('updates currentStep based on route', async () => {
    let currentStep

    await router.push('/property_map')
    currentStep = await wrapper.vm.currentStep
    expect(currentStep).toBe(0)

    await router.push('/registrars_details')
    currentStep = await wrapper.vm.currentStep
    expect(currentStep).toBe(1)

    await router.push('/landholders_information')
    currentStep = await wrapper.vm.currentStep
    expect(currentStep).toBe(2)

    await router.push('/rural_property')
    currentStep = await wrapper.vm.currentStep
    expect(currentStep).toBe(3)

    await router.push('/property_rights')
    currentStep = await wrapper.vm.currentStep
    expect(currentStep).toBe(4)
  })

  it('displays step titles correctly', () => {
    const stepTitles = wrapper.findAll('span')
    expect(stepTitles.length).toBe(5)
    expect(stepTitles.at(0)?.text()).toBe('Property map')
    expect(stepTitles.at(1)?.text()).toBe("Registrar's details")
    expect(stepTitles.at(2)?.text()).toBe("Landholder's information")
    expect(stepTitles.at(3)?.text()).toBe('Rural properties')
    expect(stepTitles.at(4)?.text()).toBe('Property rights')
  })
})
