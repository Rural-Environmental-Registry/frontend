import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import LandDocumentsTableComponent from '@/components/LandDocumentsTableComponent.vue'

describe('LandDocumentsTableComponent', () => {
  const mockData = [
    {
      propertyLandholding: 'Residential',
      titleDeedLandDocument: 'Deed123',
      cityOfTheNotaryOffice: 'New York',
      stateOfTheNotaryOffice: 'NY',
    },
    {
      propertyLandholding: 'Commercial',
      titleDeedLandDocument: 'Deed456',
      cityOfTheNotaryOffice: 'Los Angeles',
      stateOfTheNotaryOffice: 'CA',
    },
  ]

  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(LandDocumentsTableComponent, {
      props: {
        propertyRightsData: mockData,
      },
      global: {
        provide: {
          languageContext: {
            getLanguage: (key: string) => {
              const translations: Record<string, string> = {
                'register.propertyRights.list.type.title': 'Type',
                'register.propertyRights.list.titleDeedOrLandDocument': 'Title deed/ Land Document',
                'register.propertyRights.list.stateAndCityOfTheNotaryOffice':
                  'State and City of the Notary Office',
                'register.propertyRights.list.actions': 'Actions',
                'register.propertyRights.list.noDataToShow': 'There is no data to show.',
              }
              return translations[key] || key
            },
          },
        },
        components: {
          FontAwesomeIcon,
        },
      },
    })
  })

  it('renders correctly with data', () => {
    // Check table headers
    expect(wrapper.text()).toContain('Type')
    expect(wrapper.text()).toContain('Title deed/ Land Document')
    expect(wrapper.text()).toContain('State and City of the Notary Office')
    expect(wrapper.text()).toContain('Actions')

    // Check data rows
    expect(wrapper.text()).toContain('Residential')
    expect(wrapper.text()).toContain('Deed123')
    expect(wrapper.text()).toContain('New York-NY')

    expect(wrapper.text()).toContain('Commercial')
    expect(wrapper.text()).toContain('Deed456')
    expect(wrapper.text()).toContain('Los Angeles-CA')

    // Check action icons are rendered
    const icons = wrapper.findAllComponents(FontAwesomeIcon)
    expect(icons.length).toBe(6) // 3 actions per row × 2 rows
  })

  it('formats city and state correctly', () => {
    const formattedCities = wrapper.vm.cityState(mockData[0])
    expect(formattedCities).toBe('New York-NY')

    // Test with missing city or state
    const partialData = { ...mockData[0], cityOfTheNotaryOffice: '' }

    // @ts-expect-error - testing internal function directly
    const result = wrapper.vm.cityState(partialData)
    expect(result).toBe('NY')
  })

  it('emits remove event when trash icon clicked', async () => {
    await wrapper
      .findAllComponents(FontAwesomeIcon)
      .filter((i) => i.props().icon === faTrash)[1]
      .trigger('click')

    expect(wrapper.emitted().removePropertyInformation).toBeTruthy()
    expect(wrapper.emitted().removePropertyInformation[0]).toEqual([1]) // Second item index is 1
  })

  it('shows empty state when no data', async () => {
    await wrapper.setProps({ propertyRightsData: [] })
    expect(wrapper.text()).toContain('There is no data to show.')
  })

  it('exposes clearEditing method ', () => {
    expect(typeof wrapper.vm.clearEditing).toBe('function')

    // Call the exposed method and verify internal state changes
    wrapper.vm.clearEditing()

    expect((wrapper.vm as any).editingIndex).toBeNull()
  })
})
