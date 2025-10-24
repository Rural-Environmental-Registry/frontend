import { faPenToSquare, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import LandHoldersTable from '@/components/LandHoldersTableComponent.vue'
import type { LandHoldersData } from '@/context/LandHoldersInformation'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => {
      const translations: Record<string, string> = {
        'register.landholdersInformation.table.header.legalPersonality': 'Legal personality',
        'register.landholdersInformation.table.header.taxpayer': 'Taxpayer ID/Company ID',
        'register.landholdersInformation.table.header.nameCompany': 'Name/Company',
        'register.landholdersInformation.table.header.actions': 'Actions',
        'register.landholdersInformation.table.emptyData': 'There is no data to show.',
        'register.landholdersInformation.table.naturalPerson': 'Natural Person',
      }
      return translations[key] || key
    },
  }),
}))

describe('LandHoldersTable', () => {
  const mockData: LandHoldersData[] = [
    {
      legalPersonality: 'natural_person',
      id: '123456789',
      name: 'John Doe',
      wayToAddLandholdersInformation: 'fill',
      mothersName: 'Jane Doe',
      dateOfBirth: '1990-01-01',
    },
    {
      legalPersonality: 'natural_person',
      id: '987654321',
      name: 'Acme Inc',
      wayToAddLandholdersInformation: 'fill',
      mothersName: 'Jane Doe',
      dateOfBirth: '1990-01-01',
    },
  ]
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(LandHoldersTable, {
      props: {
        landHoldersData: mockData,
      },
      global: {
        stubs: {
          FontAwesomeIcon: true, // Substitui o componente por um stub
        },
      },
    })
  })

  it('renders correctly with data', () => {
    // Check table headers
    expect(wrapper.find('th:nth-child(1)').text()).toBe('Legal personality')
    expect(wrapper.find('th:nth-child(2)').text()).toBe('Taxpayer ID/Company ID')
    expect(wrapper.find('th:nth-child(3)').text()).toBe('Name/Company')
    expect(wrapper.find('th:nth-child(4)').text()).toBe('Actions')

    // Check data rows
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(mockData.length)

    // Check first row data
    expect(rows[0].find('td:nth-child(1)').text()).toBe('Natural Person')
    expect(rows[0].find('td:nth-child(2)').text()).toBe(mockData[0].id)
    expect(rows[0].find('td:nth-child(3)').text()).toBe(mockData[0].name)

    // Check action icons exist
    expect(wrapper.findAllComponents(FontAwesomeIcon).length).toBe(mockData.length * 3)
  })

  it('shows empty state when no data', () => {
    const wrapper = mount(LandHoldersTable, {
      props: {
        landHoldersData: [],
      },
    })

    const emptyRow = wrapper.find('tbody tr')
    expect(emptyRow.text()).toBe('There is no data to show.')
  })

  it('emits removeOwnerHolder event when delete button clicked', async () => {
    const trashIcons = wrapper
      .findAllComponents(FontAwesomeIcon)
      .filter((i) => i.props().icon === faTrash)

    await trashIcons[0].trigger('click')

    expect(wrapper.emitted().removeOwnerHolder).toBeTruthy()
    expect(wrapper.emitted().removeOwnerHolder[0]).toEqual([0]) // First item index

    await trashIcons[1].trigger('click')

    expect(wrapper.emitted().removeOwnerHolder[1]).toEqual([1]) // Second item index becomes first after deletion
  })

  it('toggles edit mode and emits events correctly', async () => {
    const editButtons = wrapper
      .findAllComponents(FontAwesomeIcon)
      .filter((i) => [faPenToSquare.iconName, faTimes.iconName].includes(i.props().icon.iconName))

    // First click - should enter edit mode and emit edit event
    await editButtons[0].trigger('click')

    expect(wrapper.emitted().editOwnerHolder).toBeTruthy()
    expect(wrapper.emitted().editOwnerHolder[0]).toEqual([mockData[0], 0])

    // Row should have highlight class in edit mode
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow.classes()).toContainEqual(expect.stringContaining('[#EEF6FD]'))

    // Icon should change to times (cancel)
    const updatedEditButton = wrapper
      .findAllComponents(FontAwesomeIcon)
      .filter((i) =>
        [faPenToSquare.iconName, faTimes.iconName].includes(i.props().icon.iconName),
      )[0]

    expect(updatedEditButton.props().icon).toEqual(faTimes)

    // Second click - should exit edit mode and emit clear event
    await updatedEditButton.trigger('click')

    expect(wrapper.emitted().clearEditing).toBeTruthy()

    await nextTick()
    // Row should not have highlight class anymore
    expect(firstRow.classes()).not.toContainEqual(expect.stringContaining('[#EEF6FD]'))

    // Icon should change back to pen
    const resetEditButton = wrapper
      .findAllComponents(FontAwesomeIcon)
      .filter((i) =>
        [faPenToSquare.iconName, faTimes.iconName].includes(i.props().icon.iconName),
      )[0]

    expect(resetEditButton.props().icon).toEqual(faPenToSquare)
  })
})
