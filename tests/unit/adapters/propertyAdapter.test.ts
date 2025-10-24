import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as propertyAdapter from '@/adapters/propertyAdapter'

// Mock external dependencies
vi.mock('@vueuse/core', () => ({
  useDateFormat: (date: string, _format: string) => `formatted-${date}`,
}))
vi.mock('@/config/diff_area.json', () => ({
  layer_code: 'mockLayerCode',
}))
vi.mock('@/utils/layerUtils', () => ({
  getLayerData: (code: string) => ({ code }),
}))

describe('propertyAdapter', () => {
  describe('formatText', () => {
    it('should format text with underscores', () => {
      expect(propertyAdapter.formatText('MINHA_CIDADE')).toBe('Minha Cidade')
    })
    it('should return empty string if value is empty', () => {
      expect(propertyAdapter.formatText('')).toBe('')
    })
  })

  describe('formatAttributeValue', () => {
    it('should format date if value is yyyy-mm-dd', () => {
      const attr = { value: '2023-09-18' }
      expect(propertyAdapter.formatAttributeValue(attr)).toEqual({ value: 'formatted-2023-09-18' })
    })
    it('should format text if not a date', () => {
      const attr = { value: 'MINHA_CIDADE' }
      expect(propertyAdapter.formatAttributeValue(attr)).toEqual({ value: 'Minha Cidade' })
    })
    it('should return empty string if value does not exist', () => {
      expect(propertyAdapter.formatAttributeValue({})).toEqual({ value: '' })
    })
  })

  describe('getAttrValue', () => {
    const attrs = [
      { name: 'foo', value: 'bar' },
      { name: 'baz', value: '' },
      { name: 'null', value: null as any },
    ]
    it('should return value if exists', () => {
      expect(propertyAdapter.getAttrValue(attrs, 'foo')).toBe('bar')
    })
    it('should return N/A if not found', () => {
      expect(propertyAdapter.getAttrValue(attrs, 'notfound')).toBe('N/A')
    })
    it('should return N/A if value is empty', () => {
      expect(propertyAdapter.getAttrValue(attrs, 'baz')).toBe('N/A')
    })
    it('should return N/A if value is null', () => {
      expect(propertyAdapter.getAttrValue(attrs, 'null')).toBe('N/A')
    })
  })

  describe('parseLandholderType', () => {
    it('should return naturalPerson if value is natural_person', () => {
      const attrs = [{ name: 'landholderType', value: 'natural_person' }]
      expect(propertyAdapter.parseLandholderType(attrs)).toBe('naturalPerson')
    })
    it('should return legalEntity if value is other', () => {
      const attrs = [{ name: 'landholderType', value: 'legal_entity' }]
      expect(propertyAdapter.parseLandholderType(attrs)).toBe('legalEntity')
    })
    it('should return N/A if attribute not found', () => {
      expect(propertyAdapter.parseLandholderType([])).toBe('N/A')
    })
    it('should return N/A if not an array', () => {
      expect(propertyAdapter.parseLandholderType(null as any)).toBe('N/A')
    })
  })

  describe('adaptPropertyResponse', () => {
    let apiData: any
    beforeEach(() => {
      apiData = {
        id: '1',
        propertyName: 'Fazenda',
        code: 'ABC',
        stateDistrict: 'sp',
        municipality: 'CIDADE_EXEMPLO',
        zipcode: '12345-678',
        locationZone: 'rural',
        mainArea: {
          geometry: [1, 2, 3],
          area: 100,
          lat: 10,
          lon: 20,
          attributes: [{ name: 'foo', value: 'bar' }],
        },
        subAreas: [
          {
            id: '2',
            geometry: [4, 5, 6],
            areaType: 'BUFFER',
            area: 50,
            lat: 11,
            lon: 21,
            attributes: [],
          },
        ],
        documents: [
          {
            id: 'd1',
            documentType: 'DEED',
            registeredPropertyName: 'Fazenda',
            area: 100,
            attributes: [
              { name: 'holdingType', value: 'proprietario' },
              { name: 'deed', value: 'escritura' },
              { name: 'city_of_notary_office', value: 'cidade' },
              { name: 'state_of_notary_office', value: 'sp' },
            ],
          },
        ],
        owners: [
          {
            id: 'o1',
            name: 'João',
            identifier: '123',
            dateOfBirth: '2000-01-01',
            mothersName: 'Maria',
            attributes: [{ name: 'landholderType', value: 'natural_person' }],
          },
        ],
        attributes: [{ name: 'foo', value: 'bar' }],
      }
    })

    it('should return PropertyForView object correctly', () => {
      const result = propertyAdapter.adaptPropertyResponse(apiData)
      expect(result.id).toBe('1')
      expect(result.propertyName).toBe('Fazenda')
      expect(result.stateDistrict).toBe('SP')
      expect(result.municipality).toBe('Cidade Exemplo')
      expect(result.areas.length).toBeGreaterThan(0)
      expect(result.documents[0].holdingType).toBe('proprietario')
      expect(result.owners[0].landholderType).toBe('naturalPerson')
    })

    it('should return empty object if apiData is undefined', () => {
      expect(propertyAdapter.adaptPropertyResponse(undefined)).toEqual({})
    })
  })
})
