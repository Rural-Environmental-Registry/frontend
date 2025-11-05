import { describe, it, expect } from 'vitest'
import { validateRuralPropertiesData, validateMailingAddress } from './RuralProperties.validation'

describe('RuralProperties validation', () => {
  describe('validateMailingAddress', () => {
    it('should validate valid mailing address', () => {
      const address = {
        recipientName: 'John Doe',
        addressStreet: 'Main Street',
        number: '123',
        additionalInformation: 'Near the river',
        neighborhood: 'Rural Neighborhood',
        zipCode: '12345-679',
        state: 'SP',
        city: 'São Paulo',
        email: 'john.doe@example.com',
        telephone: '11987654321',
      }
      expect(validateMailingAddress(address)).toBe(true)
    })

    it('should reject missing required fields', () => {
      expect(validateMailingAddress({})).toBe(false)
      expect(validateMailingAddress({ recipientName: 'John Doe' })).toBe(false)
    })

    it('should reject invalid types', () => {
      const address = {
        recipientName: 123,
        addressStreet: 'Main Street',
        number: '123',
        additionalInformation: 'Near the river',
        neighborhood: 'Rural Neighborhood',
        zipCode: '12345-679',
        state: 'SP',
        city: 'São Paulo',
        email: 'john.doe@example.com',
        telephone: '11987654321',
      }
      expect(validateMailingAddress(address)).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateMailingAddress(null)).toBe(false)
      expect(validateMailingAddress(undefined)).toBe(false)
    })
  })

  describe('validateRuralPropertiesData', () => {
    it('should validate valid rural properties data', () => {
      const data = {
        propertyName: 'Farm ABC',
        state: 'SP',
        city: 'São Paulo',
        zipCode: '12345-678',
        locationZonenv: 'rural',
        propertyAccessDescription: 'Access via dirt road',
        mailingAddress: {
          recipientName: 'John Doe',
          addressStreet: 'Main Street',
          number: '123',
          additionalInformation: 'Near the river',
          neighborhood: 'Rural Neighborhood',
          zipCode: '12345-679',
          state: 'SP',
          city: 'São Paulo',
          email: 'john.doe@example.com',
          telephone: '11987654321',
        },
      }
      expect(validateRuralPropertiesData(data)).toBe(true)
    })

    it('should validate valid urban properties data', () => {
      const data = {
        propertyName: 'Urban Property',
        state: 'RJ',
        city: 'Rio de Janeiro',
        zipCode: '20000-000',
        locationZonenv: 'urban',
        propertyAccessDescription: 'Access via paved road',
        mailingAddress: {
          recipientName: 'Jane Smith',
          addressStreet: 'Urban Avenue',
          number: '456',
          additionalInformation: 'Apartment 101',
          neighborhood: 'City Center',
          zipCode: '20000-001',
          state: 'RJ',
          city: 'Rio de Janeiro',
          email: 'jane.smith@example.com',
          telephone: '21987654321',
        },
      }
      expect(validateRuralPropertiesData(data)).toBe(true)
    })

    it('should reject invalid locationZonenv', () => {
      const data = {
        propertyName: 'Farm ABC',
        state: 'SP',
        city: 'São Paulo',
        zipCode: '12345-678',
        locationZonenv: 'invalid',
        propertyAccessDescription: 'Access via dirt road',
        mailingAddress: {
          recipientName: 'John Doe',
          addressStreet: 'Main Street',
          number: '123',
          additionalInformation: 'Near the river',
          neighborhood: 'Rural Neighborhood',
          zipCode: '12345-679',
          state: 'SP',
          city: 'São Paulo',
          email: 'john.doe@example.com',
          telephone: '11987654321',
        },
      }
      expect(validateRuralPropertiesData(data)).toBe(false)
    })

    it('should reject missing required fields', () => {
      expect(validateRuralPropertiesData({})).toBe(false)
      expect(validateRuralPropertiesData({ propertyName: 'Farm ABC' })).toBe(false)
    })

    it('should reject invalid types', () => {
      const data = {
        propertyName: 123,
        state: 'SP',
        city: 'São Paulo',
        zipCode: '12345-678',
        locationZonenv: 'rural',
        propertyAccessDescription: 'Access via dirt road',
        mailingAddress: {
          recipientName: 'John Doe',
          addressStreet: 'Main Street',
          number: '123',
          additionalInformation: 'Near the river',
          neighborhood: 'Rural Neighborhood',
          zipCode: '12345-679',
          state: 'SP',
          city: 'São Paulo',
          email: 'john.doe@example.com',
          telephone: '11987654321',
        },
      }
      expect(validateRuralPropertiesData(data)).toBe(false)
    })

    it('should reject invalid mailing address', () => {
      const data = {
        propertyName: 'Farm ABC',
        state: 'SP',
        city: 'São Paulo',
        zipCode: '12345-678',
        locationZonenv: 'rural',
        propertyAccessDescription: 'Access via dirt road',
        mailingAddress: {
          recipientName: 123,
          addressStreet: 'Main Street',
          number: '123',
          additionalInformation: 'Near the river',
          neighborhood: 'Rural Neighborhood',
          zipCode: '12345-679',
          state: 'SP',
          city: 'São Paulo',
          email: 'john.doe@example.com',
          telephone: '11987654321',
        },
      }
      expect(validateRuralPropertiesData(data)).toBe(false)
    })

    it('should reject missing mailing address', () => {
      const data = {
        propertyName: 'Farm ABC',
        state: 'SP',
        city: 'São Paulo',
        zipCode: '12345-678',
        locationZonenv: 'rural',
        propertyAccessDescription: 'Access via dirt road',
      }
      expect(validateRuralPropertiesData(data)).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateRuralPropertiesData(null)).toBe(false)
      expect(validateRuralPropertiesData(undefined)).toBe(false)
    })
  })
})
