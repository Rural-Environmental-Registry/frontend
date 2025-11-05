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
    language: 'en-us',
  }),
}))

vi.mock('@/context/useFormContext', () => ({
  useFormContext: () => ({
    validateRegistrationForm: {
      isMapValid: false,
      isRegistrarDetailsValid: false,
      isLandHoldersInformationValid: false,
      isRuralPropertiesValid: false,
      isPropertyRightsValid: false,
    },
  }),
}))

describe('StepperComponent', () => {
  let wrapper: VueWrapper
  let router: any

  const routes = [
    { path: '/property_map', component: { template: '<div></div>' } },
    { path: '/registrars_details', component: { template: '<div></div>' } },
    { path: '/landholders_information', component: { template: '<div></div>' } },
    { path: '/rural_property', component: { template: '<div></div>' } },
    { path: '/property_rights', component: { template: '<div></div>' } },
  ]

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })
  })

  describe('Component Rendering', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await wrapper.vm.$nextTick()
    })

    it('renders the steps correctly', () => {
      const circles = wrapper.findAll('.w-4.h-4.rounded-full')
      expect(circles.length).toBeGreaterThan(0)
    })

    it('displays step titles correctly', async () => {
      const spanElements = wrapper.findAll('span')
      expect(spanElements.length).toBeGreaterThan(0)

      const titleText = spanElements
        .map((s) => s.text())
        .filter(
          (t) =>
            t.includes('Property') ||
            t.includes('details') ||
            t.includes('information') ||
            t.includes('properties') ||
            t.includes('rights'),
        )

      expect(titleText.length).toBeGreaterThan(0)
    })

    it('displays the Step header', () => {
      const h1 = wrapper.find('h1')
      expect(h1.text()).toBe('Step')
    })
  })

  describe('Step Navigation', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await router.isReady()
      await wrapper.vm.$nextTick()
    })

    it('updates currentStep when route changes to property_map', async () => {
      await router.push('/property_map')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentStep).toBe(0)
    })

    it('updates currentStep when route changes to registrars_details', async () => {
      await router.push('/registrars_details')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentStep).toBe(1)
    })

    it('updates currentStep when route changes to landholders_information', async () => {
      await router.push('/landholders_information')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentStep).toBe(2)
    })

    it('updates currentStep when route changes to rural_property', async () => {
      await router.push('/rural_property')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentStep).toBe(3)
    })

    it('updates currentStep when route changes to property_rights', async () => {
      await router.push('/property_rights')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentStep).toBe(4)
    })
  })

  describe('activeColor Method', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await wrapper.vm.$nextTick()
    })

    it('returns green color when step is completed', async () => {
      await router.push('/property_rights')
      await wrapper.vm.$nextTick()
      const color = wrapper.vm.activeColor(0)
      expect(color).toBe('#42916e')
    })

    it('returns white color when step is not completed', async () => {
      await router.push('/property_map')
      await wrapper.vm.$nextTick()
      const color = wrapper.vm.activeColor(2)
      expect(color).toBe('#ffffff')
    })

    it('returns green for current step', async () => {
      await router.push('/registrars_details')
      await wrapper.vm.$nextTick()
      const color = wrapper.vm.activeColor(1)
      expect(color).toBe('#42916e')
    })
  })

  describe('handleStepClick Method', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await wrapper.vm.$nextTick()
    })

    it('handles backward step click', async () => {
      await router.push('/property_rights')
      await wrapper.vm.$nextTick()

      const routerPushSpy = vi.spyOn(router, 'push')
      wrapper.vm.handleStepClick('property_map')

      expect(routerPushSpy).toHaveBeenCalled()
    })

    it('calls handleNextAndSave when stepping forward with routeComponent available', async () => {
      await router.push('/property_map')
      await wrapper.vm.$nextTick()

      const handleNextAndSave = vi.fn()
      wrapper.vm.$el.parentElement?.parentElement?.dispatchEvent(new Event('test'))

      // Remounting with mock routeComponent
      wrapper.unmount()
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: { handleNextAndSave } },
          },
        },
      })
      await wrapper.vm.$nextTick()

      wrapper.vm.handleStepClick('registrars_details')
      await wrapper.vm.$nextTick()

      expect(handleNextAndSave).toHaveBeenCalled()
    })

    it('calls handleNextButton as fallback when handleNextAndSave not available', async () => {
      await router.push('/property_map')
      await wrapper.vm.$nextTick()

      const handleNextButton = vi.fn()
      wrapper.unmount()
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: { handleNextButton } },
          },
        },
      })
      await wrapper.vm.$nextTick()

      wrapper.vm.handleStepClick('registrars_details')
      await wrapper.vm.$nextTick()

      expect(handleNextButton).toHaveBeenCalled()
    })
  })

  describe('isStepValid Computed', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await wrapper.vm.$nextTick()
    })

    it('returns array of validation states', () => {
      const isStepValid = wrapper.vm.isStepValid
      expect(Array.isArray(isStepValid)).toBe(true)
      expect(isStepValid.length).toBe(5)
    })

    it('all steps are initially invalid', () => {
      const isStepValid = wrapper.vm.isStepValid
      isStepValid.forEach((valid: boolean) => {
        expect(valid).toBe(false)
      })
    })
  })

  describe('Steps Array', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await wrapper.vm.$nextTick()
    })

    it('has 5 steps', () => {
      expect(wrapper.vm.steps.length).toBe(5)
    })

    it('has correct step keys', () => {
      const keys = wrapper.vm.steps.map((s: any) => s.key)
      expect(keys).toContain('property_map')
      expect(keys).toContain('registrars_details')
      expect(keys).toContain('landholders_information')
      expect(keys).toContain('rural_property')
      expect(keys).toContain('property_rights')
    })

    it('has translated titles for each step', () => {
      wrapper.vm.steps.forEach((step: any) => {
        expect(step.Title).toBeTruthy()
        expect(typeof step.Title).toBe('string')
      })
    })
  })

  describe('pathName and pathArray Computed', () => {
    beforeEach(async () => {
      wrapper = mount(StepperComponent, {
        global: {
          plugins: [router],
          stubs: {
            WholeWidthCardComponent: { template: '<div><slot /></div>' },
            TooltipProvider: { template: '<div><slot /></div>' },
            Tooltip: { template: '<div><slot /></div>' },
            TooltipTrigger: { template: '<div><slot /></div>' },
            TooltipContent: { template: '<div></div>' },
            FontAwesomeIcon: { template: '<div></div>' },
          },
          provide: {
            routeComponent: { value: null },
          },
        },
      })
      await wrapper.vm.$nextTick()
    })

    it('computes pathName from route', async () => {
      await router.push('/property_map')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.pathName).toContain('property_map')
    })

    it('computes pathArray by splitting pathName', async () => {
      await router.push('/property_map')
      await wrapper.vm.$nextTick()
      expect(Array.isArray(wrapper.vm.pathArray)).toBe(true)
    })

    it('computes lastPath correctly', async () => {
      await router.push('/registrars_details')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.lastPath).toBe('registrars_details')
    })
  })
})
