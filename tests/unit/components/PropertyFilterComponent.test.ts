import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PropertyFilterComponent from '@/components/PropertyFilterComponent.vue'
import SelectInputComponent from '@/components/SelectInputComponent.vue'
import TextInputComponent from '@/components/TextInputComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => key, // Just return the key for simplicity
  }),
}))

describe('PropertyFilterComponent.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(PropertyFilterComponent, {
      global: {
        components: {
          SelectInputComponent,
          TextInputComponent,
          FontAwesomeIcon,
        },
      },
    })
  })

  it('should open the modal when the filter button is clicked', async () => {
    expect(wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50').exists()).toBe(false)
    await wrapper.find('button.primary').trigger('click')
    expect(wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50').exists()).toBe(true)
  })

  it('should close the modal when the close button is clicked', async () => {
    await wrapper.find('button.primary').trigger('click') // Open modal
    expect(wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50').exists()).toBe(true)
    await wrapper.find('div.bg-white button').trigger('click') // Click close button
    expect(wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50').exists()).toBe(false)
  })

  it('should update form data on input', async () => {
    await wrapper.find('button.primary').trigger('click') // Open modal
    const propertyNameInput = wrapper.find('#property-name')
    await propertyNameInput.setValue('My Farm')
    expect(wrapper.vm.form.propertyName).toBe('My Farm')
  })

  it('should add and remove property numbers', async () => {
    await wrapper.find('button.primary').trigger('click') // Open modal
    await wrapper.find('#property-number').setValue('12345')
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('properties.filter.add'))!
      .trigger('click')
    expect(wrapper.vm.code).toContain('12345')
    expect(wrapper.find('.bg-gray-50').text()).toContain('12345')

    await wrapper.find('.bg-gray-50 button').trigger('click')
    expect(wrapper.vm.code).not.toContain('12345')
  })

  it('should clean the form', async () => {
    await wrapper.find('button.primary').trigger('click') // Open modal
    await wrapper.find('#property-name').setValue('My Farm')
    await wrapper.find('#property-number').setValue('12345')
    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('properties.filter.add'))!
      .trigger('click')

    await wrapper
      .findAll('button')
      .find((b) => b.text().includes('properties.filter.clean'))!
      .trigger('click')

    expect(wrapper.vm.form.propertyName).toBe('')
    expect(wrapper.vm.code).toEqual([])
  })

  it('should apply filters and emit updateFilters event', async () => {
    await wrapper.find('button.primary').trigger('click') // Open modal
    await wrapper.find('#property-name').setValue('My Farm')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted().updateFilters).toBeTruthy()
    expect(wrapper.emitted().updateFilters[0][0]).toEqual({
      stateDistrict: '',
      municipality: '',
      propertyName: 'My Farm',
      ownersName: '',
      ownersIdentifier: '',
      code: '',
    })
    expect(wrapper.vm.isModalOpen).toBe(false)
    expect(wrapper.find('.flex.flex-wrap.gap-2').exists()).toBe(true)
    expect(wrapper.find('.flex.flex-wrap.gap-2').text()).toContain('My Farm')
  })

  it('should remove a filter chip and re-apply filters', async () => {
    await wrapper.find('button.primary').trigger('click') // Open modal
    await wrapper.find('#property-name').setValue('My Farm')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.flex.flex-wrap.gap-2').text()).toContain('My Farm')

    await wrapper.find('.flex.flex-wrap.gap-2 button').trigger('click')

    expect(wrapper.emitted().updateFilters).toHaveLength(2)
    expect(wrapper.emitted().updateFilters[1][0]).toEqual({
      stateDistrict: '',
      municipality: '',
      propertyName: '',
      ownersName: '',
      ownersIdentifier: '',
      code: '',
    })
    expect(wrapper.find('.flex.flex-wrap.gap-2').exists()).toBe(false)
  })
})
