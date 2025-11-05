import { describe, it, expect } from 'vitest'
import {
  validateLandHoldersData,
  validateLandHoldersInformation,
} from './LandHoldersInformation.validation'

describe('LandHoldersInformation validation', () => {
  describe('validateLandHoldersData', () => {
    it('should validate valid natural person data', () => {
      const data = {
        legalPersonality: 'natural_person',
        wayToAddLandholdersInformation: 'fill',
        id: '123456789',
        dateOfBirth: '1990-01-01',
        name: 'John Doe',
        mothersName: 'Jane Doe',
      }
      expect(validateLandHoldersData(data)).toBe(true)
    })

    it('should validate valid legal entity data', () => {
      const data = {
        legalPersonality: 'legal_entity',
        wayToAddLandholdersInformation: 'import',
        id: '987654321',
        dateOfBirth: '1985-05-15',
        name: 'Acme Corp',
        mothersName: 'Corporate Mother',
      }
      expect(validateLandHoldersData(data)).toBe(true)
    })

    it('should reject invalid legalPersonality', () => {
      const data = {
        legalPersonality: 'invalid',
        wayToAddLandholdersInformation: 'fill',
        id: '123456789',
        dateOfBirth: '1990-01-01',
        name: 'John Doe',
        mothersName: 'Jane Doe',
      }
      expect(validateLandHoldersData(data)).toBe(false)
    })

    it('should reject invalid wayToAddLandholdersInformation', () => {
      const data = {
        legalPersonality: 'natural_person',
        wayToAddLandholdersInformation: 'invalid',
        id: '123456789',
        dateOfBirth: '1990-01-01',
        name: 'John Doe',
        mothersName: 'Jane Doe',
      }
      expect(validateLandHoldersData(data)).toBe(false)
    })

    it('should reject missing required fields', () => {
      expect(validateLandHoldersData({})).toBe(false)
      expect(validateLandHoldersData({ legalPersonality: 'natural_person' })).toBe(false)
    })

    it('should reject invalid types', () => {
      const data = {
        legalPersonality: 'natural_person',
        wayToAddLandholdersInformation: 'fill',
        id: 123456789,
        dateOfBirth: '1990-01-01',
        name: 'John Doe',
        mothersName: 'Jane Doe',
      }
      expect(validateLandHoldersData(data)).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateLandHoldersData(null)).toBe(false)
      expect(validateLandHoldersData(undefined)).toBe(false)
    })
  })

  describe('validateLandHoldersInformation', () => {
    it('should validate valid information with data array', () => {
      const info = {
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
      expect(validateLandHoldersInformation(info)).toBe(true)
    })

    it('should validate valid information with null data', () => {
      const info = {
        landHoldersData: null,
      }
      expect(validateLandHoldersInformation(info)).toBe(true)
    })

    it('should validate valid information with empty array', () => {
      const info = {
        landHoldersData: [],
      }
      expect(validateLandHoldersInformation(info)).toBe(true)
    })

    it('should reject invalid data in array', () => {
      const info = {
        landHoldersData: [
          {
            legalPersonality: 'invalid',
            wayToAddLandholdersInformation: 'fill',
            id: '123456789',
            dateOfBirth: '1990-01-01',
            name: 'John Doe',
            mothersName: 'Jane Doe',
          },
        ],
      }
      expect(validateLandHoldersInformation(info)).toBe(false)
    })

    it('should reject non-array landHoldersData', () => {
      const info = {
        landHoldersData: 'not-array',
      }
      expect(validateLandHoldersInformation(info)).toBe(false)
    })

    it('should reject missing landHoldersData', () => {
      expect(validateLandHoldersInformation({})).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateLandHoldersInformation(null)).toBe(false)
      expect(validateLandHoldersInformation(undefined)).toBe(false)
    })
  })
})
