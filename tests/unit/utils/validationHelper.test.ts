import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { ValidationHelper } from '@/utils/validationHelper'

describe('ValidationHelper', () => {
  let mockValidation: any
  let mockFormData: any
  let mockGetLanguage: any
  let validationHelper: ValidationHelper

  beforeEach(() => {
    mockGetLanguage = vi.fn((key: string) => {
      const translations: { [key: string]: string } = {
        'register.registrarDetails.card': 'Registrar Details',
        'register.landholdersInformation.card': 'Landholders Information',
        'register.ruralProperty.card': 'Rural Property',
        'register.propertyRights.card': 'Property Rights',
        'register.registrarDetails.form.id': 'ID',
        'register.registrarDetails.form.name': 'Name',
        'register.registrarDetails.representativeData': 'Representative Data',
        'register.landholdersInformation.form.id': 'Landholder ID',
        'register.landholdersInformation.warningModal': 'Add at least one landholder',
        'register.propertyRights.form.area': 'Area',
        'register.propertyRights.form.book': 'Book',
        'register.propertyRights.invalidForm': 'Add at least one document',
        'register.propertyRights.validationError.header': 'Required fields missing:',
        'register.propertyRights.validationError.step': 'Step',
        'register.propertyRights.validationError.fields': 'Fields',
        'register.propertyRights.validationError.instruction': 'Please fill all required fields.',
      }
      return translations[key] || key
    })

    mockValidation = ref({
      registrarDetails: {
        $invalid: false,
        id: { $invalid: false },
        name: { $invalid: false },
        representative: {
          $invalid: false,
          id: { $invalid: false },
          name: { $invalid: false },
        },
      },
      landHoldersInformation: {
        $invalid: false,
        id: { $invalid: false },
        name: { $invalid: false },
      },
      ruralProperties: {
        $invalid: false,
        propertyName: { $invalid: false },
        mailingAddress: {
          $invalid: false,
          recipientName: { $invalid: false },
        },
      },
      propertyRights: {
        $invalid: false,
        area: { $invalid: false },
        book: { $invalid: false },
      },
    })

    mockFormData = {
      landHoldersInformation: {
        landHoldersData: [{ id: '123', name: 'Test' }],
      },
      propertyRights: {
        propertyRightsData: [{ area: '100', book: 'Book1' }],
      },
    }

    validationHelper = new ValidationHelper({
      validation: mockValidation,
      formData: mockFormData,
      getLanguage: mockGetLanguage,
    })
  })

  describe('getInvalidFieldsDetails', () => {
    it('should return empty array when all validations are valid', () => {
      const result = validationHelper.getInvalidFieldsDetails()
      expect(result).toEqual([])
    })

    it('should detect invalid registrar details fields', () => {
      mockValidation.value.registrarDetails.$invalid = true
      mockValidation.value.registrarDetails.id.$invalid = true
      mockValidation.value.registrarDetails.name.$invalid = true

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Registrar Details')
      expect(result[0].fields).toContain('ID')
      expect(result[0].fields).toContain('Name')
    })

    it('should detect invalid representative fields', () => {
      mockValidation.value.registrarDetails.$invalid = true
      mockValidation.value.registrarDetails.representative.$invalid = true
      mockValidation.value.registrarDetails.representative.id.$invalid = true

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].fields).toContain('Representative Data - ID')
    })

    it('should detect invalid landholders information fields', () => {
      mockValidation.value.landHoldersInformation.$invalid = true
      mockValidation.value.landHoldersInformation.id.$invalid = true

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Landholders Information')
      expect(result[0].fields).toContain('Landholder ID')
    })

    it('should detect invalid rural properties fields', () => {
      mockValidation.value.ruralProperties.$invalid = true
      mockValidation.value.ruralProperties.propertyName.$invalid = true

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Rural Property')
    })

    it('should detect invalid mailing address fields', () => {
      mockValidation.value.ruralProperties.$invalid = true
      mockValidation.value.ruralProperties.mailingAddress.$invalid = true
      mockValidation.value.ruralProperties.mailingAddress.recipientName.$invalid = true

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Rural Property')
    })

    it('should detect invalid property rights fields', () => {
      mockValidation.value.propertyRights.$invalid = true
      mockValidation.value.propertyRights.area.$invalid = true
      mockValidation.value.propertyRights.book.$invalid = true

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Property Rights')
      expect(result[0].fields).toContain('Area')
      expect(result[0].fields).toContain('Book')
    })

    it('should detect missing landholders data', () => {
      mockFormData.landHoldersInformation.landHoldersData = []

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Landholders Information')
      expect(result[0].fields).toContain('Add at least one landholder')
    })

    it('should detect missing property rights data', () => {
      mockFormData.propertyRights.propertyRightsData = []

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(1)
      expect(result[0].step).toBe('Property Rights')
      expect(result[0].fields).toContain('Add at least one document')
    })

    it('should handle multiple validation errors across steps', () => {
      mockValidation.value.registrarDetails.$invalid = true
      mockValidation.value.registrarDetails.id.$invalid = true
      mockValidation.value.propertyRights.$invalid = true
      mockValidation.value.propertyRights.area.$invalid = true
      mockFormData.landHoldersInformation.landHoldersData = []

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(3)
      expect(result.map((r) => r.step)).toContain('Registrar Details')
      expect(result.map((r) => r.step)).toContain('Property Rights')
      expect(result.map((r) => r.step)).toContain('Landholders Information')
    })
  })

  describe('buildValidationMessage', () => {
    it('should return empty string for empty invalid fields', () => {
      const result = validationHelper.buildValidationMessage([])
      expect(result).toBe('')
    })

    it('should build formatted validation message', () => {
      const invalidFields = [
        { step: 'Step 1', fields: ['Field A', 'Field B'] },
        { step: 'Step 2', fields: ['Field C'] },
      ]

      const result = validationHelper.buildValidationMessage(invalidFields)

      expect(result).toContain('Required fields missing:')
      expect(result).toContain('Step: Step 1')
      expect(result).toContain('Fields: Field A, Field B')
      expect(result).toContain('Step: Step 2')
      expect(result).toContain('Fields: Field C')
      expect(result).toContain('Please fill all required fields.')
    })
  })

  describe('getPropertyRightsInvalidFields', () => {
    it('should return empty array when property rights validation is valid', () => {
      const result = validationHelper.getPropertyRightsInvalidFields()
      expect(result).toEqual([])
    })

    it('should return invalid property rights fields', () => {
      mockValidation.value.propertyRights.area.$invalid = true
      mockValidation.value.propertyRights.book.$invalid = true

      const result = validationHelper.getPropertyRightsInvalidFields()

      expect(result).toContain('Area')
      expect(result).toContain('Book')
    })

    it('should handle unknown field keys', () => {
      mockValidation.value.propertyRights.unknownField = { $invalid: true }

      const result = validationHelper.getPropertyRightsInvalidFields()

      expect(result).toContain('unknownField')
    })
  })

  describe('edge cases', () => {
    it('should handle null/undefined formData properties', () => {
      mockFormData.landHoldersInformation = null
      mockFormData.propertyRights = undefined

      const result = validationHelper.getInvalidFieldsDetails()

      expect(result).toHaveLength(2)
      expect(result.some((r) => r.fields.includes('Add at least one landholder'))).toBe(true)
      expect(result.some((r) => r.fields.includes('Add at least one document'))).toBe(true)
    })

    it('should handle validation objects without $invalid property', () => {
      delete mockValidation.value.registrarDetails.$invalid

      expect(() => validationHelper.getInvalidFieldsDetails()).not.toThrow()
    })
  })
})
