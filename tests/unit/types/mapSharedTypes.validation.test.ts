import { describe, it, expect } from 'vitest'
import {
  validateGeoJsonFeature,
  validateGeoJsonFeatureCollection,
  validateLayerDrawStyleOptions,
  validateVectorizationLayerDrawTools,
  validateVectorizationLayerConfig,
  validateVectorizationGroup,
  validateBaseMapLayer,
  validateWmsLayerOptionFilter,
  validateWmsLayerStyle,
  validateWmsLayer,
  validateCustomLayerGroup,
  validateMapConfigurationData,
  validateFormMapLayerFeatureProperties,
  validateFormMapLayerData,
  validateFormMapData,
  validateDisplayedAreaInfo,
  validateNonGeometricResult,
} from './mapSharedTypes.validation'

describe('mapSharedTypes runtime validation', () => {
  describe('validateGeoJsonFeature', () => {
    it('should validate valid GeoJsonFeature', () => {
      const feature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: { name: 'Test' },
      }
      expect(validateGeoJsonFeature(feature)).toBe(true)
    })

    it('should reject invalid GeoJsonFeature', () => {
      expect(validateGeoJsonFeature(null)).toBe(false)
      expect(validateGeoJsonFeature({ type: 'Feature' })).toBe(false)
      expect(validateGeoJsonFeature({ type: 'FeatureCollection' })).toBe(false)
    })

    it('should reject object without required properties', () => {
      expect(validateGeoJsonFeature({ geometry: {} })).toBe(false)
      expect(validateGeoJsonFeature({ properties: {} })).toBe(false)
    })
  })

  describe('validateGeoJsonFeatureCollection', () => {
    it('should validate valid GeoJsonFeatureCollection', () => {
      const collection = {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', geometry: null, properties: {} }],
      }
      expect(validateGeoJsonFeatureCollection(collection)).toBe(true)
    })

    it('should reject invalid GeoJsonFeatureCollection', () => {
      expect(validateGeoJsonFeatureCollection(null)).toBe(false)
      expect(validateGeoJsonFeatureCollection({ type: 'FeatureCollection' })).toBe(false)
      expect(validateGeoJsonFeatureCollection({ features: [] })).toBe(false)
    })

    it('should handle empty features array', () => {
      const collection = { type: 'FeatureCollection', features: [] }
      expect(validateGeoJsonFeatureCollection(collection)).toBe(true)
    })
  })

  describe('validateLayerDrawStyleOptions', () => {
    it('should validate valid LayerDrawStyleOptions', () => {
      const options = {
        stroke: true,
        color: '#FF0000',
        weight: 2,
        opacity: 0.8,
        radius: 10,
      }
      expect(validateLayerDrawStyleOptions(options)).toBe(true)
    })

    it('should validate empty object as valid (all optional)', () => {
      expect(validateLayerDrawStyleOptions({})).toBe(true)
    })

    it('should reject invalid types', () => {
      expect(validateLayerDrawStyleOptions(null)).toBe(false)
      expect(validateLayerDrawStyleOptions('string')).toBe(false)
      expect(validateLayerDrawStyleOptions({ stroke: 'not-boolean' })).toBe(false)
      expect(validateLayerDrawStyleOptions({ color: 123 })).toBe(false)
      expect(validateLayerDrawStyleOptions({ weight: 'not-number' })).toBe(false)
    })
  })

  describe('validateVectorizationLayerDrawTools', () => {
    it('should validate valid VectorizationLayerDrawTools', () => {
      const tools = {
        polygon: true,
        marker: false,
        polyline: true,
        rectangle: false,
        circle: true,
        circlemarker: false,
      }
      expect(validateVectorizationLayerDrawTools(tools)).toBe(true)
    })

    it('should reject missing properties', () => {
      expect(validateVectorizationLayerDrawTools({ polygon: true })).toBe(false)
      expect(validateVectorizationLayerDrawTools({})).toBe(false)
    })

    it('should reject invalid boolean values', () => {
      const invalid = {
        polygon: 'true',
        marker: 0,
        polyline: null,
        rectangle: false,
        circle: true,
        circlemarker: false,
      }
      expect(validateVectorizationLayerDrawTools(invalid)).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(validateVectorizationLayerDrawTools(null)).toBe(false)
      expect(validateVectorizationLayerDrawTools(undefined)).toBe(false)
    })
  })

  describe('validateVectorizationLayerConfig', () => {
    it('should validate valid VectorizationLayerConfig', () => {
      const config = {
        displayName: 'Test Layer',
        layerCode: 'TEST',
        workflowName: 'test_wf',
        geometryType: 'Polygon',
        description: 'Test description',
        fixedInitialParameters: { key: 'value' },
        drawTools: {
          polygon: true,
          marker: false,
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
        },
      }
      expect(validateVectorizationLayerConfig(config)).toBe(true)
    })

    it('should reject missing required properties', () => {
      const incomplete = {
        displayName: 'Test',
        layerCode: 'TEST',
        workflowName: 'wf',
      }
      expect(validateVectorizationLayerConfig(incomplete)).toBe(false)
    })

    it('should reject invalid drawTools', () => {
      const config = {
        displayName: 'Test',
        layerCode: 'TEST',
        workflowName: 'wf',
        geometryType: 'Polygon',
        description: 'desc',
        fixedInitialParameters: {},
        drawTools: { polygon: true }, // Invalid - missing other properties
      }
      expect(validateVectorizationLayerConfig(config)).toBe(false)
    })
  })

  describe('validateVectorizationGroup', () => {
    it('should validate valid VectorizationGroup', () => {
      const group = {
        groupName: 'Test Group',
        groupKey: 'TEST_GROUP',
        layersToVectorize: [
          {
            displayName: 'Layer',
            layerCode: 'LAYER',
            workflowName: 'wf',
            geometryType: 'Polygon',
            description: 'desc',
            fixedInitialParameters: {},
            drawTools: {
              polygon: true,
              marker: false,
              polyline: false,
              rectangle: false,
              circle: false,
              circlemarker: false,
            },
          },
        ],
      }
      expect(validateVectorizationGroup(group)).toBe(true)
    })

    it('should reject with invalid layers', () => {
      const group = {
        groupName: 'Test',
        groupKey: 'TEST',
        layersToVectorize: [{ invalid: 'layer' }],
      }
      expect(validateVectorizationGroup(group)).toBe(false)
    })

    it('should reject non-array layersToVectorize', () => {
      const group = {
        groupName: 'Test',
        groupKey: 'TEST',
        layersToVectorize: 'not-array',
      }
      expect(validateVectorizationGroup(group)).toBe(false)
    })
  })

  describe('validateBaseMapLayer', () => {
    it('should validate valid BaseMapLayer', () => {
      const layer = {
        name: 'OSM',
        default: true,
        key: 'osm',
        url: 'https://example.com',
      }
      expect(validateBaseMapLayer(layer)).toBe(true)
    })

    it('should reject missing required properties', () => {
      expect(validateBaseMapLayer({ name: 'OSM' })).toBe(false)
      expect(validateBaseMapLayer({ name: 'OSM', default: true, key: 'osm' })).toBe(false)
    })

    it('should reject invalid types', () => {
      const invalid = {
        name: 'OSM',
        default: 'true',
        key: 'osm',
        url: 'https://example.com',
      }
      expect(validateBaseMapLayer(invalid)).toBe(false)
    })
  })

  describe('validateWmsLayerOptionFilter', () => {
    it('should validate valid WmsLayerOptionFilter', () => {
      const filter = {
        keyGeoserver: 'CQL_FILTER',
        filter: 'area > 1000',
      }
      expect(validateWmsLayerOptionFilter(filter)).toBe(true)
    })

    it('should reject invalid types', () => {
      expect(validateWmsLayerOptionFilter({ keyGeoserver: 123, filter: 'test' })).toBe(false)
      expect(validateWmsLayerOptionFilter({ keyGeoserver: 'key', filter: 123 })).toBe(false)
    })

    it('should reject missing properties', () => {
      expect(validateWmsLayerOptionFilter({ keyGeoserver: 'key' })).toBe(false)
      expect(validateWmsLayerOptionFilter({ filter: 'test' })).toBe(false)
    })
  })

  describe('validateWmsLayerStyle', () => {
    it('should validate valid WmsLayerStyle', () => {
      const style = {
        color: '#FF0000',
        fillColor: '#00FF00',
      }
      expect(validateWmsLayerStyle(style)).toBe(true)
    })

    it('should reject invalid types', () => {
      expect(validateWmsLayerStyle({ color: 123, fillColor: '#00FF00' })).toBe(false)
      expect(validateWmsLayerStyle({ color: '#FF0000', fillColor: 123 })).toBe(false)
    })

    it('should reject missing properties', () => {
      expect(validateWmsLayerStyle({ color: '#FF0000' })).toBe(false)
      expect(validateWmsLayerStyle({ fillColor: '#00FF00' })).toBe(false)
    })
  })

  describe('validateWmsLayer', () => {
    it('should validate valid WmsLayer', () => {
      const layer = {
        baseUrl: 'https://example.com/wms',
        toggle: { active: 'ON', inactive: 'OFF' },
        layers: 'layer1',
        format: 'image/png',
        transparent: true,
        name: 'WMS Layer',
        activeDefault: false,
        visible: true,
        key: 'wms',
      }
      expect(validateWmsLayer(layer)).toBe(true)
    })

    it('should reject missing required properties', () => {
      const incomplete = {
        baseUrl: 'https://example.com/wms',
        layers: 'layer1',
        format: 'image/png',
      }
      expect(validateWmsLayer(incomplete)).toBe(false)
    })

    it('should reject invalid types', () => {
      const invalid = {
        baseUrl: 123,
        toggle: { active: 'ON', inactive: 'OFF' },
        layers: 'layer1',
        format: 'image/png',
        transparent: 'true',
        name: 'WMS Layer',
        activeDefault: false,
        visible: true,
        key: 'wms',
      }
      expect(validateWmsLayer(invalid)).toBe(false)
    })
  })

  describe('validateCustomLayerGroup', () => {
    it('should validate valid CustomLayerGroup', () => {
      const group = {
        name: 'Custom',
        key: 'CUSTOM',
        toggle: { active: 'show', inactive: 'hide' },
        layers: [
          {
            baseUrl: 'https://example.com/wms',
            toggle: { active: 'ON', inactive: 'OFF' },
            layers: 'layer1',
            format: 'image/png',
            transparent: true,
            name: 'Layer',
            activeDefault: false,
            visible: true,
            key: 'layer',
          },
        ],
      }
      expect(validateCustomLayerGroup(group)).toBe(true)
    })

    it('should reject invalid layers', () => {
      const group = {
        name: 'Custom',
        key: 'CUSTOM',
        toggle: { active: 'show', inactive: 'hide' },
        layers: [{ invalid: 'layer' }],
      }
      expect(validateCustomLayerGroup(group)).toBe(false)
    })

    it('should reject non-array layers', () => {
      const group = {
        name: 'Custom',
        key: 'CUSTOM',
        toggle: { active: 'show', inactive: 'hide' },
        layers: 'not-array',
      }
      expect(validateCustomLayerGroup(group)).toBe(false)
    })
  })

  describe('validateMapConfigurationData', () => {
    it('should validate valid MapConfigurationData', () => {
      const config = {
        mapLayers: [],
        customLayers: [],
        vectorizationGroups: [],
      }
      expect(validateMapConfigurationData(config)).toBe(true)
    })

    it('should reject missing arrays', () => {
      expect(validateMapConfigurationData({ mapLayers: [] })).toBe(false)
      expect(validateMapConfigurationData({})).toBe(false)
    })

    it('should reject non-array properties', () => {
      const invalid = {
        mapLayers: 'not-array',
        customLayers: [],
        vectorizationGroups: [],
      }
      expect(validateMapConfigurationData(invalid)).toBe(false)
    })
  })

  describe('validateFormMapLayerFeatureProperties', () => {
    it('should validate valid FormMapLayerFeatureProperties', () => {
      const props = {
        area_ha: 100,
        _layerCode: 'LAYER',
        customField: 'value',
      }
      expect(validateFormMapLayerFeatureProperties(props)).toBe(true)
    })

    it('should allow empty object', () => {
      expect(validateFormMapLayerFeatureProperties({})).toBe(true)
    })

    it('should accept area_ha as string or number', () => {
      const stringArea = { area_ha: '100' }
      const numberArea = { area_ha: 100 }
      expect(validateFormMapLayerFeatureProperties(stringArea)).toBe(true)
      expect(validateFormMapLayerFeatureProperties(numberArea)).toBe(true)
    })

    it('should reject invalid area_ha type', () => {
      const invalid = { area_ha: { value: 100 } }
      expect(validateFormMapLayerFeatureProperties(invalid)).toBe(false)
    })

    it('should reject null', () => {
      expect(validateFormMapLayerFeatureProperties(null)).toBe(false)
    })
  })

  describe('validateFormMapLayerData', () => {
    it('should validate valid FormMapLayerData', () => {
      const data = {
        type: 'FeatureCollection',
        features: [],
      }
      expect(validateFormMapLayerData(data)).toBe(true)
    })

    it('should reject invalid type', () => {
      const invalid = {
        type: 'Feature',
        features: [],
      }
      expect(validateFormMapLayerData(invalid)).toBe(false)
    })

    it('should reject non-array features', () => {
      const invalid = {
        type: 'FeatureCollection',
        features: 'not-array',
      }
      expect(validateFormMapLayerData(invalid)).toBe(false)
    })

    it('should reject missing properties', () => {
      expect(validateFormMapLayerData({ type: 'FeatureCollection' })).toBe(false)
      expect(validateFormMapLayerData({ features: [] })).toBe(false)
    })
  })

  describe('validateFormMapData', () => {
    it('should validate valid FormMapData', () => {
      const mapData = {
        PROPERTY: {
          type: 'FeatureCollection',
          features: [],
        },
        VEGETATION: undefined,
      }
      expect(validateFormMapData(mapData)).toBe(true)
    })

    it('should reject invalid layer data', () => {
      const invalid = {
        PROPERTY: {
          type: 'Feature',
          features: [],
        },
      }
      expect(validateFormMapData(invalid)).toBe(false)
    })

    it('should accept empty object', () => {
      expect(validateFormMapData({})).toBe(true)
    })

    it('should reject null', () => {
      expect(validateFormMapData(null)).toBe(false)
    })
  })

  describe('validateDisplayedAreaInfo', () => {
    it('should validate valid DisplayedAreaInfo', () => {
      const info = {
        originalLayerId: 1,
        name: 'Area',
        geoJsonSource: {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
          properties: {},
        },
        apiProcessedGeoJsonLayers: [],
        isVisible: true,
        layerCode: 'AREA',
        workflowName: 'area_wf',
      }
      expect(validateDisplayedAreaInfo(info)).toBe(true)
    })

    it('should reject missing required properties', () => {
      const incomplete = {
        originalLayerId: 1,
        name: 'Area',
        geoJsonSource: {},
      }
      expect(validateDisplayedAreaInfo(incomplete)).toBe(false)
    })

    it('should reject invalid types', () => {
      const invalid = {
        originalLayerId: 'not-number',
        name: 'Area',
        geoJsonSource: {},
        apiProcessedGeoJsonLayers: [],
        isVisible: 'true',
        layerCode: 'AREA',
        workflowName: 'area_wf',
      }
      expect(validateDisplayedAreaInfo(invalid)).toBe(false)
    })
  })

  describe('validateNonGeometricResult', () => {
    it('should validate valid NonGeometricResult', () => {
      const result = {
        taskAlias: 'calculation',
        value: 42,
        originalLayerId: 1,
      }
      expect(validateNonGeometricResult(result)).toBe(true)
    })

    it('should support various value types', () => {
      const numResult = { taskAlias: 'calc', value: 100, originalLayerId: 1 }
      const strResult = { taskAlias: 'text', value: 'result', originalLayerId: 1 }
      const objResult = { taskAlias: 'obj', value: { data: 'result' }, originalLayerId: 1 }

      expect(validateNonGeometricResult(numResult)).toBe(true)
      expect(validateNonGeometricResult(strResult)).toBe(true)
      expect(validateNonGeometricResult(objResult)).toBe(true)
    })

    it('should reject missing required properties', () => {
      const incomplete = { taskAlias: 'calc', originalLayerId: 1 }
      expect(validateNonGeometricResult(incomplete)).toBe(false)
    })

    it('should reject invalid types', () => {
      const invalid = {
        taskAlias: 123,
        value: 42,
        originalLayerId: 'not-number',
      }
      expect(validateNonGeometricResult(invalid)).toBe(false)
    })

    it('should reject null', () => {
      expect(validateNonGeometricResult(null)).toBe(false)
    })
  })
})
