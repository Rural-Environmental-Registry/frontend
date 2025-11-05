import { describe, it, expect } from 'vitest'
import {
  validateProperty,
  createProperty,
  validatePropertyArray,
  updatePropertyName,
  updatePropertyCode,
  getPropertyDisplayName,
  propertyHasLocation,
  filterPropertiesByMunicipality,
  filterPropertiesByStateDistrict,
  findPropertyById,
  findPropertyByCode,
  sortPropertiesByName,
  sortPropertiesByCode,
  getPropertiesCount,
  duplicateProperty,
  propertyToJSON,
  propertyFromJSON,
  mergeProperties,
  compareProperties,
} from './Property.validation'
import type { Property } from '@/interfaces/Property'

describe('Property Interface Validation', () => {
  describe('validateProperty', () => {
    it('should validate a valid property', () => {
      const property = {
        id: '123',
        code: 'PROP001',
        propertyName: 'Test Property',
        stateDistrict: 'District A',
        municipality: 'City B',
        imageUrl: 'https://example.com/image.jpg',
      }
      expect(validateProperty(property)).toBe(true)
    })

    it('should validate property with minimal required fields', () => {
      const property = {
        id: '123',
        code: 'PROP001',
        propertyName: 'Test Property',
      }
      expect(validateProperty(property)).toBe(true)
    })

    it('should reject null or undefined', () => {
      expect(validateProperty(null)).toBe(false)
      expect(validateProperty(undefined)).toBe(false)
    })

    it('should reject invalid id type', () => {
      expect(validateProperty({ id: 123, code: 'A', propertyName: 'B' })).toBe(false)
    })

    it('should reject invalid code type', () => {
      expect(validateProperty({ id: '1', code: 123, propertyName: 'B' })).toBe(false)
    })

    it('should reject invalid propertyName type', () => {
      expect(validateProperty({ id: '1', code: 'A', propertyName: 123 })).toBe(false)
    })

    it('should reject invalid stateDistrict type', () => {
      expect(validateProperty({ id: '1', code: 'A', propertyName: 'B', stateDistrict: 123 })).toBe(
        false,
      )
    })

    it('should reject invalid municipality type', () => {
      expect(validateProperty({ id: '1', code: 'A', propertyName: 'B', municipality: 123 })).toBe(
        false,
      )
    })

    it('should reject invalid imageUrl type', () => {
      expect(validateProperty({ id: '1', code: 'A', propertyName: 'B', imageUrl: 123 })).toBe(false)
    })

    it('should reject missing required fields', () => {
      expect(validateProperty({ id: '1', code: 'A' })).toBe(false)
      expect(validateProperty({ id: '1', propertyName: 'B' })).toBe(false)
      expect(validateProperty({ code: 'A', propertyName: 'B' })).toBe(false)
    })
  })

  describe('createProperty', () => {
    it('should create property with all fields', () => {
      const property = createProperty(
        '123',
        'PROP001',
        'Test Property',
        'District A',
        'City B',
        'https://example.com/image.jpg',
      )

      expect(property.id).toBe('123')
      expect(property.code).toBe('PROP001')
      expect(property.propertyName).toBe('Test Property')
      expect(property.stateDistrict).toBe('District A')
      expect(property.municipality).toBe('City B')
      expect(property.imageUrl).toBe('https://example.com/image.jpg')
    })

    it('should create property with minimal fields', () => {
      const property = createProperty('123', 'PROP001', 'Test Property')

      expect(property.id).toBe('123')
      expect(property.code).toBe('PROP001')
      expect(property.propertyName).toBe('Test Property')
      expect(property.stateDistrict).toBeUndefined()
      expect(property.municipality).toBeUndefined()
      expect(property.imageUrl).toBeUndefined()
    })

    it('should create property with partial fields', () => {
      const property = createProperty('123', 'PROP001', 'Test Property', 'District A')

      expect(property.stateDistrict).toBe('District A')
      expect(property.municipality).toBeUndefined()
    })
  })

  describe('validatePropertyArray', () => {
    it('should validate array of valid properties', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'Property 1' },
        { id: '2', code: 'B', propertyName: 'Property 2' },
      ]
      expect(validatePropertyArray(properties)).toBe(true)
    })

    it('should validate empty array', () => {
      expect(validatePropertyArray([])).toBe(true)
    })

    it('should reject non-array', () => {
      expect(validatePropertyArray('not-array')).toBe(false)
      expect(validatePropertyArray({ id: '1', code: 'A', propertyName: 'B' })).toBe(false)
    })

    it('should reject array with invalid property', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'Property 1' },
        { id: '2', code: 'B' }, // Missing propertyName
      ]
      expect(validatePropertyArray(properties)).toBe(false)
    })
  })

  describe('updatePropertyName', () => {
    it('should update property name', () => {
      const original = { id: '1', code: 'A', propertyName: 'Old Name' }
      const updated = updatePropertyName(original, 'New Name')

      expect(updated.propertyName).toBe('New Name')
      expect(updated.id).toBe('1')
      expect(updated.code).toBe('A')
      expect(original.propertyName).toBe('Old Name') // Original unchanged
    })
  })

  describe('updatePropertyCode', () => {
    it('should update property code', () => {
      const original = { id: '1', code: 'OLD', propertyName: 'Name' }
      const updated = updatePropertyCode(original, 'NEW')

      expect(updated.code).toBe('NEW')
      expect(updated.id).toBe('1')
      expect(original.code).toBe('OLD') // Original unchanged
    })
  })

  describe('getPropertyDisplayName', () => {
    it('should format display name correctly', () => {
      const property = { id: '1', code: 'PROP001', propertyName: 'My Property' }
      expect(getPropertyDisplayName(property)).toBe('My Property (PROP001)')
    })
  })

  describe('propertyHasLocation', () => {
    it('should return true when municipality is present', () => {
      const property = { id: '1', code: 'A', propertyName: 'B', municipality: 'City' }
      expect(propertyHasLocation(property)).toBe(true)
    })

    it('should return true when stateDistrict is present', () => {
      const property = { id: '1', code: 'A', propertyName: 'B', stateDistrict: 'District' }
      expect(propertyHasLocation(property)).toBe(true)
    })

    it('should return true when both are present', () => {
      const property = {
        id: '1',
        code: 'A',
        propertyName: 'B',
        municipality: 'City',
        stateDistrict: 'District',
      }
      expect(propertyHasLocation(property)).toBe(true)
    })

    it('should return false when neither is present', () => {
      const property = { id: '1', code: 'A', propertyName: 'B' }
      expect(propertyHasLocation(property)).toBe(false)
    })
  })

  describe('filterPropertiesByMunicipality', () => {
    it('should filter properties by municipality', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1', municipality: 'City1' },
        { id: '2', code: 'B', propertyName: 'P2', municipality: 'City2' },
        { id: '3', code: 'C', propertyName: 'P3', municipality: 'City1' },
      ] as Property[]

      const filtered = filterPropertiesByMunicipality(properties, 'City1')

      expect(filtered).toHaveLength(2)
      expect(filtered[0].id).toBe('1')
      expect(filtered[1].id).toBe('3')
    })

    it('should return empty array when no matches', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1', municipality: 'City1' },
      ] as Property[]

      const filtered = filterPropertiesByMunicipality(properties, 'City2')

      expect(filtered).toHaveLength(0)
    })
  })

  describe('filterPropertiesByStateDistrict', () => {
    it('should filter properties by state district', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1', stateDistrict: 'District1' },
        { id: '2', code: 'B', propertyName: 'P2', stateDistrict: 'District2' },
        { id: '3', code: 'C', propertyName: 'P3', stateDistrict: 'District1' },
      ] as Property[]

      const filtered = filterPropertiesByStateDistrict(properties, 'District1')

      expect(filtered).toHaveLength(2)
      expect(filtered[0].id).toBe('1')
      expect(filtered[1].id).toBe('3')
    })

    it('should return empty array when no matches', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1', stateDistrict: 'District1' },
      ] as Property[]

      const filtered = filterPropertiesByStateDistrict(properties, 'District2')

      expect(filtered).toHaveLength(0)
    })
  })

  describe('findPropertyById', () => {
    it('should find property by id', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1' },
        { id: '2', code: 'B', propertyName: 'P2' },
      ] as Property[]

      const found = findPropertyById(properties, '2')

      expect(found).toBeDefined()
      expect(found?.id).toBe('2')
      expect(found?.propertyName).toBe('P2')
    })

    it('should return undefined when not found', () => {
      const properties = [{ id: '1', code: 'A', propertyName: 'P1' }] as Property[]

      const found = findPropertyById(properties, '999')

      expect(found).toBeUndefined()
    })
  })

  describe('findPropertyByCode', () => {
    it('should find property by code', () => {
      const properties = [
        { id: '1', code: 'ALPHA', propertyName: 'P1' },
        { id: '2', code: 'BETA', propertyName: 'P2' },
      ] as Property[]

      const found = findPropertyByCode(properties, 'BETA')

      expect(found).toBeDefined()
      expect(found?.code).toBe('BETA')
      expect(found?.id).toBe('2')
    })

    it('should return undefined when not found', () => {
      const properties = [{ id: '1', code: 'ALPHA', propertyName: 'P1' }] as Property[]

      const found = findPropertyByCode(properties, 'GAMMA')

      expect(found).toBeUndefined()
    })
  })

  describe('sortPropertiesByName', () => {
    it('should sort properties alphabetically by name', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'Zebra Property' },
        { id: '2', code: 'B', propertyName: 'Apple Property' },
        { id: '3', code: 'C', propertyName: 'Mango Property' },
      ] as Property[]

      const sorted = sortPropertiesByName(properties)

      expect(sorted[0].propertyName).toBe('Apple Property')
      expect(sorted[1].propertyName).toBe('Mango Property')
      expect(sorted[2].propertyName).toBe('Zebra Property')
    })

    it('should not modify original array', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'Z' },
        { id: '2', code: 'B', propertyName: 'A' },
      ] as Property[]

      sortPropertiesByName(properties)

      expect(properties[0].propertyName).toBe('Z')
      expect(properties[1].propertyName).toBe('A')
    })
  })

  describe('sortPropertiesByCode', () => {
    it('should sort properties alphabetically by code', () => {
      const properties = [
        { id: '1', code: 'ZEBRA', propertyName: 'P1' },
        { id: '2', code: 'ALPHA', propertyName: 'P2' },
        { id: '3', code: 'MANGO', propertyName: 'P3' },
      ] as Property[]

      const sorted = sortPropertiesByCode(properties)

      expect(sorted[0].code).toBe('ALPHA')
      expect(sorted[1].code).toBe('MANGO')
      expect(sorted[2].code).toBe('ZEBRA')
    })
  })

  describe('getPropertiesCount', () => {
    it('should return correct count', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1' },
        { id: '2', code: 'B', propertyName: 'P2' },
        { id: '3', code: 'C', propertyName: 'P3' },
      ] as Property[]

      expect(getPropertiesCount(properties)).toBe(3)
    })

    it('should return 0 for empty array', () => {
      expect(getPropertiesCount([])).toBe(0)
    })
  })

  describe('duplicateProperty', () => {
    it('should create duplicate with new id and code', () => {
      const original = {
        id: '1',
        code: 'ORIG',
        propertyName: 'Property',
        municipality: 'City',
      } as Property
      const duplicate = duplicateProperty(original, '2', 'DUP')

      expect(duplicate.id).toBe('2')
      expect(duplicate.code).toBe('DUP')
      expect(duplicate.propertyName).toBe('Property')
      expect(duplicate.municipality).toBe('City')
    })

    it('should preserve optional fields', () => {
      const original = {
        id: '1',
        code: 'ORIG',
        propertyName: 'Property',
        stateDistrict: 'District',
        municipality: 'City',
        imageUrl: 'https://example.com/image.jpg',
      } as Property
      const duplicate = duplicateProperty(original, '2', 'DUP')

      expect(duplicate.stateDistrict).toBe('District')
      expect(duplicate.imageUrl).toBe('https://example.com/image.jpg')
    })
  })

  describe('propertyToJSON', () => {
    it('should serialize property to JSON', () => {
      const property = { id: '1', code: 'A', propertyName: 'Property' } as Property
      const json = propertyToJSON(property)

      expect(json).toContain('"id":"1"')
      expect(json).toContain('"code":"A"')
      expect(json).toContain('"propertyName":"Property"')
    })

    it('should include optional fields', () => {
      const property = {
        id: '1',
        code: 'A',
        propertyName: 'Property',
        municipality: 'City',
      } as Property
      const json = propertyToJSON(property)

      expect(json).toContain('"municipality":"City"')
    })
  })

  describe('propertyFromJSON', () => {
    it('should deserialize valid JSON to property', () => {
      const json = '{"id":"1","code":"A","propertyName":"Property"}'
      const property = propertyFromJSON(json)

      expect(property).toBeDefined()
      expect(property?.id).toBe('1')
      expect(property?.code).toBe('A')
      expect(property?.propertyName).toBe('Property')
    })

    it('should handle optional fields', () => {
      const json = '{"id":"1","code":"A","propertyName":"Property","municipality":"City"}'
      const property = propertyFromJSON(json)

      expect(property?.municipality).toBe('City')
    })

    it('should return null for invalid JSON', () => {
      expect(propertyFromJSON('not-json')).toBeNull()
    })

    it('should return null for invalid property', () => {
      const json = '{"id":"1","code":"A"}' // Missing propertyName
      expect(propertyFromJSON(json)).toBeNull()
    })
  })

  describe('mergeProperties', () => {
    it('should merge multiple properties', () => {
      const properties = [
        { id: '1', code: 'A', propertyName: 'P1', stateDistrict: 'D1' },
        { id: '2', code: 'B', propertyName: 'P2', stateDistrict: 'D1' },
        { id: '3', code: 'C', propertyName: 'P3', stateDistrict: 'D1' },
      ] as Property[]

      const merged = mergeProperties(properties)

      expect(merged.id).toBe('1')
      expect(merged.code).toBe('A')
      expect(merged.propertyName).toContain('P1')
      expect(merged.propertyName).toContain('P2')
      expect(merged.propertyName).toContain('P3')
    })

    it('should handle empty array', () => {
      const merged = mergeProperties([])

      expect(Object.keys(merged)).toHaveLength(0)
    })

    it('should handle single property', () => {
      const properties = [{ id: '1', code: 'A', propertyName: 'P1' }] as Property[]

      const merged = mergeProperties(properties)

      expect(merged.propertyName).toBe('P1')
    })
  })

  describe('compareProperties', () => {
    it('should return true for identical properties', () => {
      const prop1 = { id: '1', code: 'A', propertyName: 'P1', municipality: 'City' } as Property
      const prop2 = { id: '1', code: 'A', propertyName: 'P1', municipality: 'City' } as Property

      expect(compareProperties(prop1, prop2)).toBe(true)
    })

    it('should return false for different id', () => {
      const prop1 = { id: '1', code: 'A', propertyName: 'P1' } as Property
      const prop2 = { id: '2', code: 'A', propertyName: 'P1' } as Property

      expect(compareProperties(prop1, prop2)).toBe(false)
    })

    it('should return false for different code', () => {
      const prop1 = { id: '1', code: 'A', propertyName: 'P1' } as Property
      const prop2 = { id: '1', code: 'B', propertyName: 'P1' } as Property

      expect(compareProperties(prop1, prop2)).toBe(false)
    })

    it('should return false for different propertyName', () => {
      const prop1 = { id: '1', code: 'A', propertyName: 'P1' } as Property
      const prop2 = { id: '1', code: 'A', propertyName: 'P2' } as Property

      expect(compareProperties(prop1, prop2)).toBe(false)
    })

    it('should compare optional fields', () => {
      const prop1 = { id: '1', code: 'A', propertyName: 'P1', municipality: 'City1' } as Property
      const prop2 = { id: '1', code: 'A', propertyName: 'P1', municipality: 'City2' } as Property

      expect(compareProperties(prop1, prop2)).toBe(false)
    })

    it('should handle undefined optional fields', () => {
      const prop1 = { id: '1', code: 'A', propertyName: 'P1' } as Property
      const prop2 = { id: '1', code: 'A', propertyName: 'P1' } as Property

      expect(compareProperties(prop1, prop2)).toBe(true)
    })
  })
})
