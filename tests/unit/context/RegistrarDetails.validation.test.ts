import { describe, it, expect } from 'vitest'
import {
  validateBaseDetails,
  validateRepresentativeDetails,
  validateRegistrarDetails,
} from './RegistrarDetails.validation'

describe('RegistrarDetails validation', () => {
  describe('validateBaseDetails', () => {
    it('should validate valid base details', () => {
      const details = {
        id: '123456789',
        dateOfBirth: '1980-01-01',
        name: 'John Doe',
        mothersName: 'Jane Doe',
      }
      expect(validateBaseDetails(details)).toBe(true)
    })

    it('should reject missing required fields', () => {
      expect(validateBaseDetails({})).toBe(false)
      expect(validateBaseDetails({ id: '123456789' })).toBe(false)
    })

    it('should reject invalid types', () => {
      const details = {
        id: 123456789,
        dateOfBirth: '1980-01-01',
        name: 'John Doe',
        mothersName: 'Jane Doe',
      }
      expect(validateBaseDetails(details)).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateBaseDetails(null)).toBe(false)
      expect(validateBaseDetails(undefined)).toBe(false)
    })
  })

  describe('validateRepresentativeDetails', () => {
    it('should validate valid representative details', () => {
      const details = {
        id: '987654321',
        dateOfBirth: '1990-05-10',
        name: 'Alice Rep',
        mothersName: 'Betty Rep',
      }
      expect(validateRepresentativeDetails(details)).toBe(true)
    })

    it('should reject invalid representative details', () => {
      expect(validateRepresentativeDetails({})).toBe(false)
      expect(validateRepresentativeDetails(null)).toBe(false)
    })
  })

  describe('validateRegistrarDetails', () => {
    it('should validate registrar details without representative', () => {
      const details = {
        id: '111222333',
        dateOfBirth: '1985-03-10',
        name: 'Bob Registrar',
        mothersName: 'Alice Registrar',
      }
      expect(validateRegistrarDetails(details)).toBe(true)
    })

    it('should validate registrar details with representative', () => {
      const details = {
        id: '777888999',
        dateOfBirth: '1982-12-05',
        name: 'Main Registrar',
        mothersName: 'Main Mother',
        representative: {
          id: '444555666',
          dateOfBirth: '1990-07-20',
          name: 'Rep Name',
          mothersName: 'Rep Mother',
        },
      }
      expect(validateRegistrarDetails(details)).toBe(true)
    })

    it('should validate registrar details with undefined representative', () => {
      const details = {
        id: '111222333',
        dateOfBirth: '1985-03-10',
        name: 'Bob Registrar',
        mothersName: 'Alice Registrar',
        representative: undefined,
      }
      expect(validateRegistrarDetails(details)).toBe(true)
    })

    it('should reject invalid base details', () => {
      const details = {
        id: 123,
        dateOfBirth: '1985-03-10',
        name: 'Bob Registrar',
        mothersName: 'Alice Registrar',
      }
      expect(validateRegistrarDetails(details)).toBe(false)
    })

    it('should reject invalid representative', () => {
      const details = {
        id: '777888999',
        dateOfBirth: '1982-12-05',
        name: 'Main Registrar',
        mothersName: 'Main Mother',
        representative: {
          id: 123,
          dateOfBirth: '1990-07-20',
          name: 'Rep Name',
          mothersName: 'Rep Mother',
        },
      }
      expect(validateRegistrarDetails(details)).toBe(false)
    })

    it('should reject missing required fields', () => {
      expect(validateRegistrarDetails({})).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateRegistrarDetails(null)).toBe(false)
      expect(validateRegistrarDetails(undefined)).toBe(false)
    })
  })
})
