import { describe, it, expect, vi } from 'vitest'
import { getLayerData, findLayer } from '../../../src/utils/layerUtils'

vi.mock('@/config/map/constsMap', () => ({
  MAP_LAYERS: {
    vectorizationGroups: [
      {
        layersToVectorize: [
          {
            layerCode: 'TEST_LAYER',
            displayName: 'Test Layer',
            displayNameKey: 'test.layer',
            description: 'Test Description',
            descriptionKey: 'test.description',
            drawTools: ['polygon', 'marker'],
            rules: {
              required: true,
              overlap: false,
              geometryType: 'polygon',
              geometricUnit: 'ha',
              style: { color: '#ff0000', fillColor: '#00ff00', weight: 2, fillOpacity: 0.5 },
              buffer: {
                size: 10,
                bufferCode: 'BUFFER_TEST',
                style: {
                  color: '#0000ff',
                  weight: 1,
                  opacity: 0.8,
                  fillColor: '#ffff00',
                  fillOpacity: 0.3,
                },
              },
            },
          },
        ],
      },
    ],
  },
}))

vi.mock('@/config/map/layers.ts', () => ({
  default: {
    vectorizationGroups: [
      {
        layersToVectorize: [
          {
            layerCode: 'API_LAYER',
            apiMapping: { areaType: 'API_TYPE' },
            displayName: 'API Layer',
          },
        ],
      },
    ],
  },
}))

describe('layerUtils', () => {
  describe('getLayerData', () => {
    it('should return layer data for valid layer code', () => {
      const result = getLayerData('TEST_LAYER')

      expect(result).toBeDefined()
      expect(result?.layerCode).toBe('TEST_LAYER')
      expect(result?.displayName).toBe('Test Layer')
    })

    it('should return undefined for invalid layer code', () => {
      const result = getLayerData('INVALID_LAYER')

      expect(result).toBeUndefined()
    })

    it('should return undefined for empty layer code', () => {
      const result = getLayerData('')

      expect(result).toBeUndefined()
    })

    it('should return undefined for undefined layer code', () => {
      const result = getLayerData(undefined)

      expect(result).toBeUndefined()
    })

    it('should handle buffer layer codes', () => {
      const result = getLayerData('BUFFER_TEST')

      expect(result).toBeDefined()
      expect(result?.rules.buffer?.bufferCode).toBe('BUFFER_TEST')
    })
  })

  describe('findLayer', () => {
    it('should find layer by layerCode', () => {
      const result = findLayer('API_LAYER')

      expect(result).toBeDefined()
      expect(result?.layerCode).toBe('API_LAYER')
    })

    it('should find layer by areaType', () => {
      const result = findLayer('API_TYPE')

      expect(result).toBeDefined()
      expect(result?.apiMapping?.areaType).toBe('API_TYPE')
    })

    it('should return undefined for non-existent layer', () => {
      const result = findLayer('NON_EXISTENT')

      expect(result).toBeUndefined()
    })
  })
})
