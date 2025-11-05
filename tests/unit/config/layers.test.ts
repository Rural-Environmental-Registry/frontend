import { describe, it, expect } from 'vitest'
import layers from '../../../src/config/map/layers'

describe('config/map/layers (static)', () => {
  it('exports mapLayers and customLayers arrays', () => {
    expect(layers).toBeTruthy()
    expect(Array.isArray(layers.mapLayers)).toBe(true)
    expect(Array.isArray(layers.customLayers)).toBe(true)
  })

  it('mapLayers entries include url and key', () => {
    const first = layers.mapLayers[0]
    expect(first).toHaveProperty('url')
    expect(first).toHaveProperty('key')
  })

  it('replaces GEOSERVER_URL base placeholder with VITE_BASE_URL', () => {
    const expectedBase = import.meta.env.VITE_GEOSERVER_URL.replace(
      '/{baseUrl}',
      import.meta.env.VITE_BASE_URL,
    )

    const withBase = layers.customLayers
      .flatMap((g: any) => g.layers || [])
      .find((l: any) => l && l.baseUrl)
    expect(withBase).toBeTruthy()
    expect(withBase.baseUrl).toBe(expectedBase)
  })

  it('vectorizationGroups contains expected group and buffer rule', () => {
    const hydro = layers.vectorizationGroups.find(
      (g: any) => g.groupKey === 'car_hidrografia_solo_group',
    )
    expect(hydro).toBeDefined()
    const river = hydro?.layersToVectorize?.find((l: any) => l.layerCode === 'RIVER')
    expect(river).toBeDefined()

    expect(river?.rules).toBeDefined()
    if (river && river.rules) {
      expect(river.rules).toHaveProperty('buffer')
      expect(river.rules.buffer).toHaveProperty('layerCode')
    }
  })

  it('modifying a deep clone does not mutate the original export', () => {
    const clone = JSON.parse(JSON.stringify(layers))

    clone.mapLayers[0].url = 'https://example.local/tile/{z}/{x}/{y}.png'

    expect(layers.mapLayers[0].url).not.toBe('https://example.local/tile/{z}/{x}/{y}.png')
  })
})
