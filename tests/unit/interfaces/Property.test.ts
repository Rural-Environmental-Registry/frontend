import { describe, it, expect } from 'vitest'
import type { Property } from '../../src/interfaces/Property'

describe('Property interface', () => {
  it('should define Property interface correctly', () => {
    const property: Property = {
      id: '123',
      code: 'PROP001',
      propertyName: 'Farm ABC',
      stateDistrict: 'SP',
      municipality: 'São Paulo',
      imageUrl: 'https://example.com/image.jpg',
    }

    expect(property.id).toBe('123')
    expect(property.code).toBe('PROP001')
    expect(property.propertyName).toBe('Farm ABC')
    expect(property.stateDistrict).toBe('SP')
    expect(property.municipality).toBe('São Paulo')
    expect(property.imageUrl).toBe('https://example.com/image.jpg')
  })

  it('should work with minimal required fields', () => {
    const property: Property = {
      id: '456',
      code: 'PROP002',
      propertyName: 'Farm XYZ',
    }

    expect(property.id).toBe('456')
    expect(property.code).toBe('PROP002')
    expect(property.propertyName).toBe('Farm XYZ')
    expect(property.stateDistrict).toBeUndefined()
    expect(property.municipality).toBeUndefined()
    expect(property.imageUrl).toBeUndefined()
  })

  it('should handle optional fields as undefined', () => {
    const property: Property = {
      id: '789',
      code: 'PROP003',
      propertyName: 'Farm DEF',
      stateDistrict: undefined,
      municipality: undefined,
      imageUrl: undefined,
    }

    expect(property.stateDistrict).toBeUndefined()
    expect(property.municipality).toBeUndefined()
    expect(property.imageUrl).toBeUndefined()
  })
})
