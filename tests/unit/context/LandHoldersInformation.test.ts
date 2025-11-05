import { describe, it, expect } from 'vitest'
import type {
  LandHoldersData,
  LandHoldersInformation,
} from '../../src/context/LandHoldersInformation'

describe('LandHoldersInformation', () => {
  it('should define LandHoldersData type correctly', () => {
    const landHolderData: LandHoldersData = {
      legalPersonality: 'natural_person',
      wayToAddLandholdersInformation: 'fill',
      id: '123456789',
      dateOfBirth: '1990-01-01',
      name: 'John Doe',
      mothersName: 'Jane Doe',
    }

    expect(landHolderData.legalPersonality).toBe('natural_person')
    expect(landHolderData.wayToAddLandholdersInformation).toBe('fill')
    expect(landHolderData.id).toBe('123456789')
    expect(landHolderData.dateOfBirth).toBe('1990-01-01')
    expect(landHolderData.name).toBe('John Doe')
    expect(landHolderData.mothersName).toBe('Jane Doe')
  })

  it('should define LandHoldersData with legal_entity', () => {
    const landHolderData: LandHoldersData = {
      legalPersonality: 'legal_entity',
      wayToAddLandholdersInformation: 'import',
      id: '987654321',
      dateOfBirth: '1985-05-15',
      name: 'Acme Corp',
      mothersName: 'Corporate Mother',
    }

    expect(landHolderData.legalPersonality).toBe('legal_entity')
    expect(landHolderData.wayToAddLandholdersInformation).toBe('import')
  })

  it('should define LandHoldersInformation type correctly', () => {
    const landHoldersInfo: LandHoldersInformation = {
      landHoldersData: [
        {
          legalPersonality: 'natural_person',
          wayToAddLandholdersInformation: 'fill',
          id: '123456789',
          dateOfBirth: '1990-01-01',
          name: 'John Doe',
          mothersName: 'Jane Doe',
        },
      ],
    }

    expect(landHoldersInfo.landHoldersData).toBeDefined()
    expect(landHoldersInfo.landHoldersData).toHaveLength(1)
    expect(landHoldersInfo.landHoldersData![0].name).toBe('John Doe')
  })

  it('should handle null landHoldersData', () => {
    const landHoldersInfo: LandHoldersInformation = {
      landHoldersData: null,
    }

    expect(landHoldersInfo.landHoldersData).toBeNull()
  })

  it('should handle empty landHoldersData array', () => {
    const landHoldersInfo: LandHoldersInformation = {
      landHoldersData: [],
    }

    expect(landHoldersInfo.landHoldersData).toBeDefined()
    expect(landHoldersInfo.landHoldersData).toHaveLength(0)
  })

  it('should handle multiple land holders', () => {
    const landHoldersInfo: LandHoldersInformation = {
      landHoldersData: [
        {
          legalPersonality: 'natural_person',
          wayToAddLandholdersInformation: 'fill',
          id: '111111111',
          dateOfBirth: '1980-01-01',
          name: 'Person 1',
          mothersName: 'Mother 1',
        },
        {
          legalPersonality: 'legal_entity',
          wayToAddLandholdersInformation: 'import',
          id: '222222222',
          dateOfBirth: '1990-01-01',
          name: 'Company 1',
          mothersName: 'Corporate Mother',
        },
      ],
    }

    expect(landHoldersInfo.landHoldersData).toHaveLength(2)
    expect(landHoldersInfo.landHoldersData![0].legalPersonality).toBe('natural_person')
    expect(landHoldersInfo.landHoldersData![1].legalPersonality).toBe('legal_entity')
  })
})
