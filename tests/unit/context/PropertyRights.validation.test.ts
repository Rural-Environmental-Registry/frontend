import { describe, it, expect } from 'vitest'
import { validatePropertyRightsData, validatePropertyRights } from './PropertyRights.validation'

describe('PropertyRights validation', () => {
  describe('validatePropertyRightsData', () => {
    it('should validate valid property data', () => {
      const data = {
        propertyLandholding: 'property',
        registeredPropertyName: 'Farm ABC',
        area: '100.5',
        documentType: 'DEED',
        titleDeedLandDocument: 'DOC123',
        documentDate: '2023-01-15',
        book: 'Book A',
        page: 'Page 1',
        stateOfTheNotaryOffice: 'SP',
        cityOfTheNotaryOffice: 'São Paulo',
        propertyCertification: 'CERT123',
        nationalRuralPropertyRegistrationNumber: 'REG456',
      }
      expect(validatePropertyRightsData(data)).toBe(true)
    })

    it('should validate valid landholding data', () => {
      const data = {
        propertyLandholding: 'landholding',
        registeredPropertyName: 'Land XYZ',
        area: '200.0',
        documentType: 'CONTRACT',
        titleDeedLandDocument: 'DOC789',
        documentDate: '2023-06-20',
        book: 'Book B',
        page: 'Page 2',
        stateOfTheNotaryOffice: 'RJ',
        cityOfTheNotaryOffice: 'Rio de Janeiro',
        propertyCertification: 'CERT789',
        nationalRuralPropertyRegistrationNumber: 'REG789',
      }
      expect(validatePropertyRightsData(data)).toBe(true)
    })

    it('should reject invalid propertyLandholding', () => {
      const data = {
        propertyLandholding: 'invalid',
        registeredPropertyName: 'Farm ABC',
        area: '100.5',
        documentType: 'DEED',
        titleDeedLandDocument: 'DOC123',
        documentDate: '2023-01-15',
        book: 'Book A',
        page: 'Page 1',
        stateOfTheNotaryOffice: 'SP',
        cityOfTheNotaryOffice: 'São Paulo',
        propertyCertification: 'CERT123',
        nationalRuralPropertyRegistrationNumber: 'REG456',
      }
      expect(validatePropertyRightsData(data)).toBe(false)
    })

    it('should reject missing required fields', () => {
      expect(validatePropertyRightsData({})).toBe(false)
      expect(validatePropertyRightsData({ propertyLandholding: 'property' })).toBe(false)
    })

    it('should reject invalid types', () => {
      const data = {
        propertyLandholding: 'property',
        registeredPropertyName: 123,
        area: '100.5',
        documentType: 'DEED',
        titleDeedLandDocument: 'DOC123',
        documentDate: '2023-01-15',
        book: 'Book A',
        page: 'Page 1',
        stateOfTheNotaryOffice: 'SP',
        cityOfTheNotaryOffice: 'São Paulo',
        propertyCertification: 'CERT123',
        nationalRuralPropertyRegistrationNumber: 'REG456',
      }
      expect(validatePropertyRightsData(data)).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validatePropertyRightsData(null)).toBe(false)
      expect(validatePropertyRightsData(undefined)).toBe(false)
    })
  })

  describe('validatePropertyRights', () => {
    it('should validate valid property rights with data array', () => {
      const rights = {
        propertyRightsData: [
          {
            propertyLandholding: 'property',
            registeredPropertyName: 'Farm ABC',
            area: '100.5',
            documentType: 'DEED',
            titleDeedLandDocument: 'DOC123',
            documentDate: '2023-01-15',
            book: 'Book A',
            page: 'Page 1',
            stateOfTheNotaryOffice: 'SP',
            cityOfTheNotaryOffice: 'São Paulo',
            propertyCertification: 'CERT123',
            nationalRuralPropertyRegistrationNumber: 'REG456',
          },
        ],
      }
      expect(validatePropertyRights(rights)).toBe(true)
    })

    it('should validate valid property rights with null data', () => {
      const rights = {
        propertyRightsData: null,
      }
      expect(validatePropertyRights(rights)).toBe(true)
    })

    it('should validate valid property rights with empty array', () => {
      const rights = {
        propertyRightsData: [],
      }
      expect(validatePropertyRights(rights)).toBe(true)
    })

    it('should reject invalid data in array', () => {
      const rights = {
        propertyRightsData: [
          {
            propertyLandholding: 'invalid',
            registeredPropertyName: 'Farm ABC',
            area: '100.5',
            documentType: 'DEED',
            titleDeedLandDocument: 'DOC123',
            documentDate: '2023-01-15',
            book: 'Book A',
            page: 'Page 1',
            stateOfTheNotaryOffice: 'SP',
            cityOfTheNotaryOffice: 'São Paulo',
            propertyCertification: 'CERT123',
            nationalRuralPropertyRegistrationNumber: 'REG456',
          },
        ],
      }
      expect(validatePropertyRights(rights)).toBe(false)
    })

    it('should reject non-array propertyRightsData', () => {
      const rights = {
        propertyRightsData: 'not-array',
      }
      expect(validatePropertyRights(rights)).toBe(false)
    })

    it('should reject missing propertyRightsData', () => {
      expect(validatePropertyRights({})).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validatePropertyRights(null)).toBe(false)
      expect(validatePropertyRights(undefined)).toBe(false)
    })
  })
})
