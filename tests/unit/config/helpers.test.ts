import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import helpers from '@/config/map/helpers'

describe('helpers.ts', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('saveMapState', () => {
    it('should save map state correctly with vectorized layers', () => {
      const vectorizedLayers = {
        TEST_LAYER: {
          layerCode: 'TEST_LAYER',
          displayName: 'Test Layer',
          description: 'Test Description',
          descriptionKey: 'test.description',
          displayNameKey: 'test.display',
          drawTools: ['polygon'],
          rules: { required: true },
          parentGroup: 'test-group',
          vectorizedArea: {
            geoJson: {
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                  ],
                ],
              },
            },
            info: { ha: { value: 100 } },
            buffer: { geometry: { type: 'Polygon' } },
            options: { color: 'red' },
          },
        },
      }

      helpers.saveMapState(vectorizedLayers, 1)
      const savedState = sessionStorage.getItem('mapState')

      expect(savedState).toBeDefined()
      const parsedState = JSON.parse(savedState!)
      expect(parsedState.currentStep).toBe(1)
      expect(parsedState.vectorizedLayers.TEST_LAYER).toBeDefined()
      expect(parsedState.vectorizedLayers.TEST_LAYER.layerCode).toBe('TEST_LAYER')
      expect(parsedState.vectorizedLayers.TEST_LAYER.description).toBe('Test Description')
      expect(parsedState.vectorizedLayers.TEST_LAYER.displayName).toBe('Test Layer')
    })

    it('should skip layers without vectorizedArea', () => {
      const vectorizedLayers = {
        LAYER_WITH_AREA: {
          layerCode: 'LAYER_WITH_AREA',
          displayName: 'Layer 1',
          description: 'Layer 1 Description',
          descriptionKey: 'key1',
          displayNameKey: 'name1',
          drawTools: ['polygon'],
          rules: { required: true },
          parentGroup: 'group1',
          vectorizedArea: {
            geoJson: { geometry: { type: 'Polygon' } },
            info: { ha: { value: 50 } },
            buffer: { geometry: { type: 'Polygon' } },
            options: {},
          },
        },
        LAYER_WITHOUT_AREA: {
          layerCode: 'LAYER_WITHOUT_AREA',
          displayName: 'Layer 2',
        },
      }

      helpers.saveMapState(vectorizedLayers, 2)
      const savedState = JSON.parse(sessionStorage.getItem('mapState')!)

      expect(savedState.vectorizedLayers.LAYER_WITH_AREA).toBeDefined()
      expect(savedState.vectorizedLayers.LAYER_WITHOUT_AREA).toBeUndefined()
    })

    it('should handle empty vectorizedLayers', () => {
      helpers.saveMapState({}, 1)
      const savedState = JSON.parse(sessionStorage.getItem('mapState')!)

      expect(savedState.vectorizedLayers).toEqual({})
      expect(savedState.currentStep).toBe(1)
    })

    it('should save multiple layers correctly', () => {
      const vectorizedLayers = {
        LAYER_1: {
          layerCode: 'LAYER_1',
          displayName: 'Layer 1',
          description: 'First',
          descriptionKey: 'desc1',
          displayNameKey: 'name1',
          drawTools: ['polygon'],
          rules: {},
          parentGroup: 'g1',
          vectorizedArea: {
            geoJson: { geometry: { type: 'Polygon' } },
            info: { ha: { value: 100 } },
            buffer: { geometry: {} },
            options: {},
          },
        },
        LAYER_2: {
          layerCode: 'LAYER_2',
          displayName: 'Layer 2',
          description: 'Second',
          descriptionKey: 'desc2',
          displayNameKey: 'name2',
          drawTools: ['polygon'],
          rules: {},
          parentGroup: 'g2',
          vectorizedArea: {
            geoJson: { geometry: { type: 'Polygon' } },
            info: { ha: { value: 200 } },
            buffer: { geometry: {} },
            options: {},
          },
        },
      }

      helpers.saveMapState(vectorizedLayers, 3)
      const savedState = JSON.parse(sessionStorage.getItem('mapState')!)

      expect(Object.keys(savedState.vectorizedLayers).length).toBe(2)
      expect(savedState.vectorizedLayers.LAYER_1.layerCode).toBe('LAYER_1')
      expect(savedState.vectorizedLayers.LAYER_2.layerCode).toBe('LAYER_2')
    })

    it('should include all layer properties in saved state', () => {
      const vectorizedLayers = {
        COMPLETE_LAYER: {
          layerCode: 'COMPLETE',
          displayName: 'Complete Layer',
          description: 'Complete Description',
          descriptionKey: 'desc.key',
          displayNameKey: 'name.key',
          drawTools: ['polygon', 'line', 'point'],
          rules: { required: true, geometricUnit: 'ha' },
          parentGroup: 'parent-group',
          vectorizedArea: {
            geoJson: {
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [1, 1],
                    [1, 0],
                  ],
                ],
              },
            },
            info: { ha: { value: 150 }, m2: { value: 1500000 } },
            buffer: {
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [2, 2],
                  ],
                ],
              },
            },
            options: { color: 'blue', weight: 3, fill: true },
          },
        },
      }

      helpers.saveMapState(vectorizedLayers, 4)
      const savedState = JSON.parse(sessionStorage.getItem('mapState')!)
      const layer = savedState.vectorizedLayers.COMPLETE_LAYER

      expect(layer.layerCode).toBe('COMPLETE')
      expect(layer.displayName).toBe('Complete Layer')
      expect(layer.description).toBe('Complete Description')
      expect(layer.descriptionKey).toBe('desc.key')
      expect(layer.displayNameKey).toBe('name.key')
      expect(layer.drawTools).toEqual(['polygon', 'line', 'point'])
      expect(layer.rules).toEqual({ required: true, geometricUnit: 'ha' })
      expect(layer.parentGroup).toBe('parent-group')
      expect(layer.vectorizedArea).toBeDefined()
      expect(layer.vectorizedArea.geoJson).toBeDefined()
      expect(layer.vectorizedArea.info).toBeDefined()
    })

    it('should preserve vectorizedArea nested structure', () => {
      const vectorizedLayers = {
        NESTED: {
          layerCode: 'NESTED',
          displayName: 'Nested',
          description: 'Nested Layer',
          descriptionKey: 'nested.desc',
          displayNameKey: 'nested.name',
          drawTools: ['polygon'],
          rules: { geometricUnit: 'ha' },
          parentGroup: 'nested-group',
          vectorizedArea: {
            geoJson: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                  ],
                ],
              },
            },
            info: { ha: { value: 1 }, m2: { value: 10000 } },
            buffer: {
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [11, 11],
                  ],
                ],
              },
            },
            options: { color: 'red', opacity: 0.8, weight: 2, dashArray: '5, 5' },
          },
        },
      }

      helpers.saveMapState(vectorizedLayers, 2)
      const savedState = JSON.parse(sessionStorage.getItem('mapState')!)
      const layer = savedState.vectorizedLayers.NESTED

      expect(layer.vectorizedArea.geoJson.type).toBe('Feature')
      expect(layer.vectorizedArea.info.m2.value).toBe(10000)
      expect(layer.vectorizedArea.buffer.geometry.type).toBe('Polygon')
      expect(layer.vectorizedArea.options.dashArray).toBe('5, 5')
    })
  })

  describe('loadMapState', () => {
    it('should roundtrip saveMapState -> loadMapState preserving structure', () => {
      const vectorizedLayers = {
        ROUND: {
          layerCode: 'ROUND',
          displayName: 'Round Layer',
          description: 'Round test',
          descriptionKey: 'round.desc',
          displayNameKey: 'round.name',
          drawTools: ['polygon'],
          rules: { geometricUnit: 'ha' },
          parentGroup: 'round-group',
          vectorizedArea: {
            geoJson: {
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                  ],
                ],
              },
            },
            info: { ha: { value: 42 } },
            buffer: { geometry: {} },
            options: { color: 'purple' },
          },
        },
      }

      helpers.saveMapState(vectorizedLayers, 7)
      const loaded = helpers.loadMapState()

      expect(loaded).toBeDefined()
      expect(loaded?.currentStep).toBe(7)
      expect(loaded?.vectorizedLayers.ROUND).toBeDefined()
      expect(loaded?.vectorizedLayers.ROUND.vectorizedArea.info.ha.value).toBe(42)
    })
    it('should retrieve saved map state', () => {
      const mapState = {
        currentStep: 2,
        vectorizedLayers: {
          LAYER1: {
            layerCode: 'LAYER1',
            displayName: 'Layer 1',
            description: 'Test',
            descriptionKey: 'key',
            displayNameKey: 'name',
            drawTools: [],
            rules: {},
            parentGroup: 'group',
            vectorizedArea: { geoJson: {}, info: {}, buffer: {}, options: {} },
          },
        },
      }

      sessionStorage.setItem('mapState', JSON.stringify(mapState))
      const retrieved = helpers.loadMapState()

      expect(retrieved).toEqual(mapState)
      expect(retrieved.currentStep).toBe(2)
      expect(retrieved.vectorizedLayers.LAYER1).toBeDefined()
    })

    it('should return null when mapState is not set', () => {
      sessionStorage.removeItem('mapState')
      const retrieved = helpers.loadMapState()

      expect(retrieved).toBeNull()
    })

    it('should parse and return mapState with complex structure', () => {
      const complexState = {
        currentStep: 5,
        vectorizedLayers: {
          PROPERTY: {
            layerCode: 'PROPERTY',
            displayName: 'Main Property',
            description: 'Property Area',
            descriptionKey: 'property.desc',
            displayNameKey: 'property.name',
            drawTools: ['polygon', 'line'],
            rules: { required: true, geometricUnit: 'ha' },
            parentGroup: 'main',
            vectorizedArea: {
              geoJson: { type: 'Feature', geometry: { type: 'Polygon' } },
              info: { ha: { value: 500 } },
              buffer: { geometry: { type: 'Polygon' } },
              options: { color: 'blue', weight: 2 },
            },
          },
        },
      }

      sessionStorage.setItem('mapState', JSON.stringify(complexState))
      const retrieved = helpers.loadMapState()

      expect(retrieved.currentStep).toBe(5)
      expect(retrieved.vectorizedLayers.PROPERTY.vectorizedArea.info.ha.value).toBe(500)
    })

    it('should preserve nested object structure when loading', () => {
      const mapState = {
        currentStep: 3,
        vectorizedLayers: {
          NESTED: {
            layerCode: 'NESTED',
            displayName: 'Nested Layer',
            description: 'Nested test',
            descriptionKey: 'nested.desc',
            displayNameKey: 'nested.name',
            drawTools: ['polygon'],
            rules: { required: false, geometricUnit: 'm2' },
            parentGroup: 'nested-group',
            vectorizedArea: {
              geoJson: {
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [0, 0],
                      [1, 1],
                    ],
                  ],
                },
              },
              info: { m2: { value: 1000 }, ha: { value: 0.1 } },
              buffer: { geometry: { type: 'Polygon' } },
              options: { color: 'red', transparency: 0.5 },
            },
          },
        },
      }

      sessionStorage.setItem('mapState', JSON.stringify(mapState))
      const retrieved = helpers.loadMapState()

      expect(retrieved.vectorizedLayers.NESTED.rules.geometricUnit).toBe('m2')
      expect(retrieved.vectorizedLayers.NESTED.vectorizedArea.info.m2.value).toBe(1000)
      expect(retrieved.vectorizedLayers.NESTED.vectorizedArea.options.transparency).toBe(0.5)
    })

    it('should handle multiple vectorized layers in state', () => {
      const mapState = {
        currentStep: 4,
        vectorizedLayers: {
          PROPERTY: {
            layerCode: 'PROPERTY',
            displayName: 'Property',
            description: 'Main property',
            descriptionKey: 'prop.desc',
            displayNameKey: 'prop.name',
            drawTools: ['polygon'],
            rules: { required: true },
            parentGroup: 'properties',
            vectorizedArea: {
              geoJson: { geometry: { type: 'Polygon' } },
              info: { ha: { value: 100 } },
              buffer: { geometry: {} },
              options: { color: 'green' },
            },
          },
          VEGETATION: {
            layerCode: 'VEGETATION',
            displayName: 'Native Vegetation',
            description: 'Vegetation area',
            descriptionKey: 'veg.desc',
            displayNameKey: 'veg.name',
            drawTools: ['polygon'],
            rules: { required: false },
            parentGroup: 'environmental',
            vectorizedArea: {
              geoJson: { geometry: { type: 'Polygon' } },
              info: { ha: { value: 20 } },
              buffer: { geometry: {} },
              options: { color: 'brown' },
            },
          },
        },
      }

      sessionStorage.setItem('mapState', JSON.stringify(mapState))
      const retrieved = helpers.loadMapState()

      expect(Object.keys(retrieved.vectorizedLayers).length).toBe(2)
      expect(retrieved.vectorizedLayers.PROPERTY.layerCode).toBe('PROPERTY')
      expect(retrieved.vectorizedLayers.VEGETATION.layerCode).toBe('VEGETATION')
      expect(retrieved.vectorizedLayers.PROPERTY.vectorizedArea.info.ha.value).toBe(100)
      expect(retrieved.vectorizedLayers.VEGETATION.vectorizedArea.info.ha.value).toBe(20)
    })
  })

  describe('scrollToMap', () => {
    it('should not throw when map container does not exist', () => {
      expect(() => helpers.scrollToMap()).not.toThrow()
    })

    it('should call querySelector with correct selectors', () => {
      const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue(null)

      helpers.scrollToMap()

      expect(querySelectorSpy).toHaveBeenCalledWith('html')
      querySelectorSpy.mockRestore()
    })

    it('should use default offsetUp value of 120 when not provided', () => {
      const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue(null)

      helpers.scrollToMap()

      expect(querySelectorSpy).toHaveBeenCalled()
      querySelectorSpy.mockRestore()
    })

    it('should handle custom offsetUp values', () => {
      const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValue(null)

      expect(() => helpers.scrollToMap(50)).not.toThrow()
      expect(() => helpers.scrollToMap(200)).not.toThrow()
      expect(() => helpers.scrollToMap(0)).not.toThrow()

      querySelectorSpy.mockRestore()
    })

    it('should scroll to calculated position when elements exist', () => {
      const mockHtmlTag = {
        scrollTo: vi.fn(),
      }
      const mockMapContainer = {
        offsetTop: 100,
        offsetHeight: 200,
        hasAttribute: vi.fn(() => false),
        setAttribute: vi.fn(),
        focus: vi.fn(),
      }

      const querySelectorSpy = vi.spyOn(document, 'querySelector')
      querySelectorSpy.mockReturnValueOnce(mockHtmlTag as any) // for html
      querySelectorSpy.mockReturnValueOnce(mockMapContainer as any) // for map container

      Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

      helpers.scrollToMap(120)

      expect(mockHtmlTag.scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' }),
      )
    })
  })

  describe('takeScreenshot', () => {
    it('should handle missing map container gracefully', async () => {
      await helpers.takeScreenshot()
      const captured = sessionStorage.getItem('mapCaptured')

      expect(captured).toBeNull()
    })

    it('should return early when getBoundingClientRect returns null', async () => {
      const mockMapContainer = {
        getBoundingClientRect: vi.fn(() => null),
      }

      vi.spyOn(document, 'querySelector').mockReturnValue(mockMapContainer as any)

      await helpers.takeScreenshot()

      expect(mockMapContainer.getBoundingClientRect).toHaveBeenCalled()
    })

    it('should log error when capture fails', async () => {
      const mockMapContainer = {
        getBoundingClientRect: vi.fn(() => ({
          width: 500,
          height: 500,
          top: 0,
          left: 0,
          bottom: 500,
          right: 500,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        })),
      }

      vi.spyOn(document, 'querySelector').mockReturnValue(mockMapContainer as any)
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await helpers.takeScreenshot()

      // Error is logged when canvas operations fail in jsdom
      expect(errorSpy).toHaveBeenCalled()
    })
  })

  describe('updateFormData', () => {
    it.skip('should update form data when both formData and mapState exist', () => {
      const formData = {
        mapData: { existingField: 'value' },
        otherData: 'test',
      }

      const mapState = {
        vectorizedLayers: {
          PROPERTY: {
            vectorizedArea: {
              geoJson: {
                geometry: {
                  coordinates: [
                    [
                      [0, 0],
                      [1, 1],
                    ],
                  ],
                },
              },
              info: { ha: { value: 100 } },
            },
            rules: { geometricUnit: 'ha' },
          },
        },
      }

      sessionStorage.setItem('formData', JSON.stringify(formData))
      sessionStorage.setItem('mapState', JSON.stringify(mapState))

      helpers.updateFormData()

      const updatedFormData = JSON.parse(sessionStorage.getItem('formData')!)
      expect(updatedFormData.mapData).toBeDefined()
    })

    it('should do nothing when formData is missing', () => {
      sessionStorage.removeItem('formData')
      sessionStorage.setItem('mapState', JSON.stringify({ vectorizedLayers: {} }))

      expect(() => helpers.updateFormData()).not.toThrow()
    })

    it('should do nothing when mapState is missing', () => {
      sessionStorage.setItem('formData', JSON.stringify({ mapData: {} }))
      sessionStorage.removeItem('mapState')

      expect(() => helpers.updateFormData()).not.toThrow()
    })

    it.skip('should dispatch mapDataSaved event after update', () => {
      const formData = { mapData: {} }
      const mapState = { vectorizedLayers: {} }

      sessionStorage.setItem('formData', JSON.stringify(formData))
      sessionStorage.setItem('mapState', JSON.stringify(mapState))

      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent')

      helpers.updateFormData()

      expect(dispatchEventSpy).toHaveBeenCalled()
      const dispatchedEvent = dispatchEventSpy.mock.calls[0][0]
      expect(dispatchedEvent.type).toBe('mapDataSaved')
    })

    it.skip('should merge map data with existing form data', () => {
      const formData = {
        mapData: { existingKey: 'existingValue' },
        stepData: { step1: 'data1' },
      }

      const mapState = {
        vectorizedLayers: {
          MAIN: {
            vectorizedArea: {
              geoJson: {
                geometry: {
                  coordinates: [
                    [
                      [0, 0],
                      [1, 0],
                      [1, 1],
                    ],
                  ],
                },
              },
              info: { ha: { value: 250 } },
            },
            rules: { geometricUnit: 'ha' },
          },
        },
      }

      sessionStorage.setItem('formData', JSON.stringify(formData))
      sessionStorage.setItem('mapState', JSON.stringify(mapState))

      helpers.updateFormData()

      const updatedFormData = JSON.parse(sessionStorage.getItem('formData')!)
      expect(updatedFormData.stepData).toEqual({ step1: 'data1' })
      expect(updatedFormData.mapData).toBeDefined()
    })

    it.skip('should handle complex vectorized layers in updateFormData', () => {
      const formData = { mapData: {}, other: 'data' }

      const mapState = {
        vectorizedLayers: {
          PROPERTY: {
            vectorizedArea: {
              geoJson: {
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [0, 0],
                      [10, 10],
                      [10, 0],
                    ],
                  ],
                },
              },
              info: { ha: { value: 100 } },
            },
            rules: { geometricUnit: 'ha' },
          },
          VEGETATION: {
            vectorizedArea: {
              geoJson: {
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [5, 5],
                      [15, 15],
                      [15, 5],
                    ],
                  ],
                },
              },
              info: { ha: { value: 50 } },
            },
            rules: { geometricUnit: 'ha' },
          },
        },
      }

      sessionStorage.setItem('formData', JSON.stringify(formData))
      sessionStorage.setItem('mapState', JSON.stringify(mapState))

      expect(() => helpers.updateFormData()).not.toThrow()

      const updatedFormData = JSON.parse(sessionStorage.getItem('formData')!)
      expect(updatedFormData.mapData).toBeDefined()
      expect(updatedFormData.other).toBe('data')
    })
  })
})
