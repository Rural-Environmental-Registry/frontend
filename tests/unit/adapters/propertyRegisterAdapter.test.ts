import { describe, it, expect, vi } from 'vitest'
import { adaptPropertyForRegister, calculateAreaInfo } from '@/adapters/propertyRegisterAdapter'

describe('calculateAreaInfo', () => {
  it('should calculate area info correctly', () => {
    const info = calculateAreaInfo(10)
    expect(info.m2.value).toBe(100000)
    expect(info.km2.value).toBe(0.1)
    expect(info.ha.value).toBe(10)
    expect(info.m2.formatted).toBe('100000.00 m²')
    expect(info.km2.formatted).toBe('0.10 km²')
    expect(info.ha.formatted).toBe('10.00 ha')
    expect(info.m.formatted).toBe('0.00 m')
    expect(info.km.formatted).toBe('0.00 km')
  })
})

describe('adaptPropertyForRegister', () => {
  vi.mock('@/utils/layerUtils', () => ({
    getLayerData: (code: string) => ({
      layerCode: code,
      description: 'desc',
      descriptionKey: 'descKey',
      displayName: 'display',
      displayNameKey: 'displayKey',
      drawTools: [],
      rules: { style: { color: 'red' } },
      parentGroup: 'parent',
    }),
  }))
  vi.mock('@/config/diff_area.json', () => ({
    __esModule: true,
    default: { layer_code: 'mainLayerCode' },
  }))
  vi.mock('@/adapters/propertyFormAdapter', () => ({
    adaptApiDataToFormData: (apiData: any) => ({ mapped: true, id: apiData.id }),
  }))

  it('should return default structure if apiData is undefined', () => {
    const result = adaptPropertyForRegister(undefined, {})
    expect(result.geoData.vectorizedLayers).toEqual({})
    expect(result.formData).toBeNull()
  })

  it('should adapt main area and subareas correctly', () => {
    const apiData = {
      id: '1',
      propertyName: 'Farm',
      mainArea: { geometry: [1, 2, 3], area: 10 },
      subAreas: [
        { areaType: 'sub1', geometry: [4, 5, 6], area: 5 },
        { areaType: 'BUFFER', geometry: [7, 8, 9], area: 2 }, // should be skipped
      ],
    }
    const mapLayers = {}
    const result = adaptPropertyForRegister(apiData, mapLayers)
    expect(result.geoData.vectorizedLayers['mainLayerCode']).toBeDefined()
    expect(result.geoData.vectorizedLayers['sub1']).toBeDefined()
    expect(result.geoData.vectorizedLayers['BUFFER']).toBeUndefined()
    expect(result.formData).toEqual({ mapped: true, id: '1' })
    expect(result.editingRegistry.id).toBe('1')
    expect(result.editingRegistry.name).toBe('Farm')
  })
})
