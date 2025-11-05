import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Vue's inject function
vi.mock('vue', () => ({
  inject: vi.fn(),
}))

import { useFormContext } from '@/context/useFormContext'
import { inject } from 'vue'

describe('useFormContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return context when it exists', () => {
    const mockContext = {
      formData: { test: 'data' },
      updateFormData: vi.fn(),
      resetForm: vi.fn(),
    }

    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
  })

  it('should throw error when context is null', () => {
    vi.mocked(inject).mockReturnValue(null)

    expect(() => useFormContext()).toThrow('useFormContext must be used within a FormProvider')
    expect(inject).toHaveBeenCalledWith('formContext')
  })

  it('should throw error when context is undefined', () => {
    vi.mocked(inject).mockReturnValue(undefined)

    expect(() => useFormContext()).toThrow('useFormContext must be used within a FormProvider')
    expect(inject).toHaveBeenCalledWith('formContext')
  })

  it('should throw error when context is false', () => {
    vi.mocked(inject).mockReturnValue(false)

    expect(() => useFormContext()).toThrow('useFormContext must be used within a FormProvider')
    expect(inject).toHaveBeenCalledWith('formContext')
  })

  it('should throw error when context is empty string', () => {
    vi.mocked(inject).mockReturnValue('')

    expect(() => useFormContext()).toThrow('useFormContext must be used within a FormProvider')
    expect(inject).toHaveBeenCalledWith('formContext')
  })

  it('should throw error when context is 0', () => {
    vi.mocked(inject).mockReturnValue(0)

    expect(() => useFormContext()).toThrow('useFormContext must be used within a FormProvider')
    expect(inject).toHaveBeenCalledWith('formContext')
  })

  it('should return context when it is an empty object', () => {
    const mockContext = {}
    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
  })

  it('should return context when it is an array', () => {
    const mockContext = []
    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
  })

  it('should return context when it is a number', () => {
    const mockContext = 42
    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
  })

  it('should return context when it is a string', () => {
    const mockContext = 'test'
    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
  })

  it('should return context when it is a boolean true', () => {
    const mockContext = true
    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
  })

  it('should handle complex context object', () => {
    const mockContext = {
      formData: {
        propertyName: 'Test Property',
        state: 'Test State',
        city: 'Test City',
      },
      updateFormData: vi.fn(),
      resetForm: vi.fn(),
      validation: {
        isValid: true,
        errors: [],
      },
      submitForm: vi.fn(),
      clearForm: vi.fn(),
    }

    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
    expect(result.formData).toEqual(mockContext.formData)
    expect(result.updateFormData).toBe(mockContext.updateFormData)
    expect(result.resetForm).toBe(mockContext.resetForm)
  })

  it('should handle context with nested objects', () => {
    const mockContext = {
      formData: {
        property: {
          name: 'Test',
          location: {
            state: 'State',
            city: 'City',
          },
        },
        owner: {
          name: 'Owner',
          contact: {
            email: 'test@test.com',
            phone: '123-456-7890',
          },
        },
      },
      updateFormData: vi.fn(),
    }

    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
    expect(result.formData.property.name).toBe('Test')
    expect(result.formData.owner.contact.email).toBe('test@test.com')
  })

  it('should handle context with functions', () => {
    const mockContext = {
      formData: {},
      updateFormData: vi.fn(),
      resetForm: vi.fn(),
      validateForm: vi.fn(),
      submitForm: vi.fn(),
      clearForm: vi.fn(),
    }

    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
    expect(typeof result.updateFormData).toBe('function')
    expect(typeof result.resetForm).toBe('function')
    expect(typeof result.validateForm).toBe('function')
  })

  it('should handle context with arrays', () => {
    const mockContext = {
      formData: {
        items: ['item1', 'item2', 'item3'],
        numbers: [1, 2, 3, 4, 5],
        objects: [
          { id: 1, name: 'Object 1' },
          { id: 2, name: 'Object 2' },
        ],
      },
      updateFormData: vi.fn(),
    }

    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
    expect(Array.isArray(result.formData.items)).toBe(true)
    expect(result.formData.items).toHaveLength(3)
    expect(result.formData.numbers).toHaveLength(5)
    expect(result.formData.objects).toHaveLength(2)
  })

  it('should handle context with mixed data types', () => {
    const mockContext = {
      formData: {
        string: 'test',
        number: 42,
        boolean: true,
        null: null,
        undefined: undefined,
        object: { key: 'value' },
        array: [1, 2, 3],
      },
      updateFormData: vi.fn(),
    }

    vi.mocked(inject).mockReturnValue(mockContext)

    const result = useFormContext()

    expect(inject).toHaveBeenCalledWith('formContext')
    expect(result).toBe(mockContext)
    expect(typeof result.formData.string).toBe('string')
    expect(typeof result.formData.number).toBe('number')
    expect(typeof result.formData.boolean).toBe('boolean')
    expect(result.formData.null).toBeNull()
    expect(result.formData.undefined).toBeUndefined()
    expect(typeof result.formData.object).toBe('object')
    expect(Array.isArray(result.formData.array)).toBe(true)
  })
})
