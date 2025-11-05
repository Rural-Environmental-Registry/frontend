import { describe, it, expect } from 'vitest'
import '../../../src/types/mapSharedTypes'

import type {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  LayerDrawStyleOptions,
  VectorizationLayerDrawTools,
  VectorizationLayerConfig,
  VectorizationGroup,
  BaseMapLayer,
  WmsLayerOptionFilter,
  WmsLayerStyle,
  WmsLayer,
  CustomLayerGroup,
  MapConfigurationData,
  FormMapLayerFeatureProperties,
  FormMapLayerData,
  FormMapData,
  DisplayedAreaInfo,
  NonGeometricResult,
} from '../../../src/types/mapSharedTypes'

describe('mapSharedTypes', () => {
  it('should define GeoJsonFeature type correctly', () => {
    const feature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {
        name: 'Test Point',
      },
    }

    expect(feature.type).toBe('Feature')
    expect(feature.geometry.type).toBe('Point')
    expect(feature.properties?.name).toBe('Test Point')
  })

  it('should define GeoJsonFeatureCollection type correctly', () => {
    const featureCollection: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
          properties: {},
        },
      ],
    }

    expect(featureCollection.type).toBe('FeatureCollection')
    expect(featureCollection.features).toHaveLength(1)
  })

  it('should define LayerDrawStyleOptions type correctly', () => {
    const styleOptions: LayerDrawStyleOptions = {
      stroke: true,
      color: '#ff0000',
      weight: 2,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '5,5',
      dashOffset: '0',
      fill: true,
      fillColor: '#00ff00',
      fillOpacity: 0.5,
      fillRule: 'nonzero',
      iconType: 'defaultMarker',
      iconUrl: 'https://example.com/icon.png',
      radius: 10,
    }

    expect(styleOptions.stroke).toBe(true)
    expect(styleOptions.color).toBe('#ff0000')
    expect(styleOptions.weight).toBe(2)
    expect(styleOptions.opacity).toBe(0.8)
    expect(styleOptions.lineCap).toBe('round')
    expect(styleOptions.lineJoin).toBe('round')
    expect(styleOptions.dashArray).toBe('5,5')
    expect(styleOptions.dashOffset).toBe('0')
    expect(styleOptions.fill).toBe(true)
    expect(styleOptions.fillColor).toBe('#00ff00')
    expect(styleOptions.fillOpacity).toBe(0.5)
    expect(styleOptions.fillRule).toBe('nonzero')
    expect(styleOptions.iconType).toBe('defaultMarker')
    expect(styleOptions.iconUrl).toBe('https://example.com/icon.png')
    expect(styleOptions.radius).toBe(10)
  })

  it('should define VectorizationLayerDrawTools type correctly', () => {
    const drawTools: VectorizationLayerDrawTools = {
      polygon: true,
      marker: false,
      polyline: true,
      rectangle: false,
      circle: true,
      circlemarker: false,
    }

    expect(drawTools.polygon).toBe(true)
    expect(drawTools.marker).toBe(false)
    expect(drawTools.polyline).toBe(true)
    expect(drawTools.rectangle).toBe(false)
    expect(drawTools.circle).toBe(true)
    expect(drawTools.circlemarker).toBe(false)
  })

  it('should define VectorizationLayerConfig type correctly', () => {
    const layerConfig: VectorizationLayerConfig = {
      displayName: 'Test Layer',
      displayNameKey: 'test.layer',
      layerCode: 'TEST_LAYER',
      workflowName: 'test_workflow',
      tooltip: 'Test tooltip',
      geometryType: 'Polygon',
      description: 'Test description',
      fixedInitialParameters: { test: 'param' },
      drawStyle: {
        stroke: true,
        color: '#0000ff',
      },
      drawTools: {
        polygon: true,
        marker: false,
        polyline: true,
        rectangle: false,
        circle: true,
        circlemarker: false,
      },
    }

    expect(layerConfig.displayName).toBe('Test Layer')
    expect(layerConfig.displayNameKey).toBe('test.layer')
    expect(layerConfig.layerCode).toBe('TEST_LAYER')
    expect(layerConfig.workflowName).toBe('test_workflow')
    expect(layerConfig.tooltip).toBe('Test tooltip')
    expect(layerConfig.geometryType).toBe('Polygon')
    expect(layerConfig.description).toBe('Test description')
    expect(layerConfig.drawStyle?.stroke).toBe(true)
    expect(layerConfig.drawStyle?.color).toBe('#0000ff')
    expect(layerConfig.drawTools?.polygon).toBe(true)
  })

  it('should define all complex types correctly', () => {
    const vectorizationGroup: VectorizationGroup = {
      groupName: 'Environmental',
      groupKey: 'ENV_GROUP',
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

    expect(vectorizationGroup.groupName).toBe('Environmental')
    expect(vectorizationGroup.layersToVectorize).toHaveLength(1)
  })

  it('should define BaseMapLayer type correctly', () => {
    const baseMapLayer: BaseMapLayer = {
      name: 'OpenStreetMap',
      default: true,
      key: 'osm',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    }

    expect(baseMapLayer.name).toBe('OpenStreetMap')
    expect(baseMapLayer.default).toBe(true)
    expect(baseMapLayer.key).toBe('osm')
  })

  it('should define WmsLayer type correctly', () => {
    const wmsLayer: WmsLayer = {
      baseUrl: 'https://example.com/wms',
      toggle: { active: 'ON', inactive: 'OFF' },
      layers: 'layer1',
      format: 'image/png',
      transparent: true,
      name: 'WMS',
      activeDefault: false,
      visible: true,
      key: 'wms_layer',
    }

    expect(wmsLayer.name).toBe('WMS')
    expect(wmsLayer.transparent).toBe(true)
    expect(wmsLayer.format).toBe('image/png')
  })

  it('should define CustomLayerGroup type correctly', () => {
    const customLayerGroup: CustomLayerGroup = {
      name: 'Custom',
      key: 'CUSTOM',
      toggle: { active: 'show', inactive: 'hide' },
      layers: [
        {
          baseUrl: 'https://example.com/wms',
          toggle: { active: 'ON', inactive: 'OFF' },
          layers: 'layer',
          format: 'image/png',
          transparent: false,
          name: 'Layer',
          activeDefault: false,
          visible: false,
          key: 'layer',
        },
      ],
    }

    expect(customLayerGroup.name).toBe('Custom')
    expect(customLayerGroup.layers).toHaveLength(1)
  })

  it('should define MapConfigurationData type correctly', () => {
    const config: MapConfigurationData = {
      mapLayers: [],
      customLayers: [],
      vectorizationGroups: [],
    }

    expect(config.mapLayers).toHaveLength(0)
    expect(config.customLayers).toHaveLength(0)
    expect(config.vectorizationGroups).toHaveLength(0)
  })

  it('should define FormMapLayerFeatureProperties type correctly', () => {
    const props: FormMapLayerFeatureProperties = {
      area_ha: 100,
      _layerCode: 'PROP',
      _displayName: 'Property',
      _workflowName: 'wf',
      customField: 'value',
    }

    expect(props.area_ha).toBe(100)
    expect(props._layerCode).toBe('PROP')
    expect(props.customField).toBe('value')
  })

  it('should define FormMapLayerData type correctly', () => {
    const layerData: FormMapLayerData = {
      type: 'FeatureCollection',
      features: [],
    }

    expect(layerData.type).toBe('FeatureCollection')
    expect(layerData.features).toHaveLength(0)
  })

  it('should define FormMapData type correctly', () => {
    const mapData: FormMapData = {
      PROPERTY: {
        type: 'FeatureCollection',
        features: [],
      },
      VEGETATION: undefined,
    }

    expect(mapData.PROPERTY).toBeDefined()
    expect(mapData.VEGETATION).toBeUndefined()
  })

  it('should define DisplayedAreaInfo type correctly', () => {
    const areaInfo: DisplayedAreaInfo = {
      originalLayerId: 1,
      name: 'Area',
      geoJsonSource: {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[]] },
        properties: {},
      },
      apiProcessedGeoJsonLayers: [],
      isVisible: true,
      layerCode: 'AREA',
      workflowName: 'area_wf',
    }

    expect(areaInfo.name).toBe('Area')
    expect(areaInfo.isVisible).toBe(true)
    expect(areaInfo.layerCode).toBe('AREA')
  })

  it('should define NonGeometricResult type correctly', () => {
    const result: NonGeometricResult = {
      taskAlias: 'calculation',
      value: 42,
      originalLayerId: 1,
    }

    expect(result.taskAlias).toBe('calculation')
    expect(result.value).toBe(42)
    expect(result.originalLayerId).toBe(1)
  })

  it('should support WmsLayerOptionFilter type', () => {
    const filter: WmsLayerOptionFilter = {
      keyGeoserver: 'CQL_FILTER',
      filter: 'area > 1000',
    }

    expect(filter.keyGeoserver).toBe('CQL_FILTER')
    expect(filter.filter).toBe('area > 1000')
  })

  it('should support WmsLayerStyle type', () => {
    const style: WmsLayerStyle = {
      color: '#FF0000',
      fillColor: '#00FF00',
    }

    expect(style.color).toBe('#FF0000')
    expect(style.fillColor).toBe('#00FF00')
  })

  it('should handle LayerDrawStyleOptions with all lineCap values', () => {
    const buttStyle: LayerDrawStyleOptions = { lineCap: 'butt' }
    const roundStyle: LayerDrawStyleOptions = { lineCap: 'round' }
    const squareStyle: LayerDrawStyleOptions = { lineCap: 'square' }
    const inheritStyle: LayerDrawStyleOptions = { lineCap: 'inherit' }

    expect(buttStyle.lineCap).toBe('butt')
    expect(roundStyle.lineCap).toBe('round')
    expect(squareStyle.lineCap).toBe('square')
    expect(inheritStyle.lineCap).toBe('inherit')
  })

  it('should handle LayerDrawStyleOptions with all lineJoin values', () => {
    const miterStyle: LayerDrawStyleOptions = { lineJoin: 'miter' }
    const roundStyle: LayerDrawStyleOptions = { lineJoin: 'round' }
    const bevelStyle: LayerDrawStyleOptions = { lineJoin: 'bevel' }
    const inheritStyle: LayerDrawStyleOptions = { lineJoin: 'inherit' }

    expect(miterStyle.lineJoin).toBe('miter')
    expect(roundStyle.lineJoin).toBe('round')
    expect(bevelStyle.lineJoin).toBe('bevel')
    expect(inheritStyle.lineJoin).toBe('inherit')
  })

  it('should handle LayerDrawStyleOptions with all fillRule values', () => {
    const nonzeroStyle: LayerDrawStyleOptions = { fillRule: 'nonzero' }
    const evenoddStyle: LayerDrawStyleOptions = { fillRule: 'evenodd' }
    const inheritStyle: LayerDrawStyleOptions = { fillRule: 'inherit' }

    expect(nonzeroStyle.fillRule).toBe('nonzero')
    expect(evenoddStyle.fillRule).toBe('evenodd')
    expect(inheritStyle.fillRule).toBe('inherit')
  })

  it('should handle LayerDrawStyleOptions with all iconType values', () => {
    const defaultMarkerStyle: LayerDrawStyleOptions = { iconType: 'defaultMarker' }
    const customSvgStyle: LayerDrawStyleOptions = { iconType: 'customSvg' }

    expect(defaultMarkerStyle.iconType).toBe('defaultMarker')
    expect(customSvgStyle.iconType).toBe('customSvg')
  })

  it('should handle LayerDrawStyleOptions with dashArray as number array', () => {
    const dashArrayStyle: LayerDrawStyleOptions = { dashArray: [5, 10, 15] }

    expect(dashArrayStyle.dashArray).toEqual([5, 10, 15])
  })

  it('should handle VectorizationLayerConfig with all optional properties', () => {
    const fullConfig: VectorizationLayerConfig = {
      displayName: 'Full Config',
      displayNameKey: 'full.config',
      layerCode: 'FULL_CONFIG',
      workflowName: 'full_workflow',
      tooltip: 'Full tooltip',
      apiOutputLayerIdentifier: 'api_output_123',
      geometryType: 'Polygon',
      description: 'Full description',
      descriptionKey: 'full.description',
      fixedInitialParameters: { param1: 'value1', param2: 123 },
      drawTools: {
        polygon: true,
        marker: false,
        polyline: true,
        rectangle: false,
        circle: true,
        circlemarker: false,
      },
      drawStyle: {
        stroke: true,
        color: '#0000ff',
        weight: 2,
        opacity: 0.8,
      },
      apiResultStyle: {
        fill: true,
        fillColor: '#00ff00',
        fillOpacity: 0.5,
      },
      maxInstances: 10,
      required: true,
      apiMapping: {
        type: 'mainArea',
        areaType: 'main_area_type',
      },
    }

    expect(fullConfig.displayNameKey).toBe('full.config')
    expect(fullConfig.tooltip).toBe('Full tooltip')
    expect(fullConfig.apiOutputLayerIdentifier).toBe('api_output_123')
    expect(fullConfig.descriptionKey).toBe('full.description')
    expect(fullConfig.fixedInitialParameters.param1).toBe('value1')
    expect(fullConfig.drawStyle?.stroke).toBe(true)
    expect(fullConfig.apiResultStyle?.fill).toBe(true)
    expect(fullConfig.maxInstances).toBe(10)
    expect(fullConfig.required).toBe(true)
    expect(fullConfig.apiMapping?.type).toBe('mainArea')
  })

  it('should handle VectorizationLayerConfig with subArea apiMapping', () => {
    const subAreaConfig: VectorizationLayerConfig = {
      displayName: 'Sub Area Config',
      layerCode: 'SUB_AREA',
      workflowName: 'sub_workflow',
      geometryType: 'Point',
      description: 'Sub area description',
      fixedInitialParameters: {},
      drawTools: {
        polygon: false,
        marker: true,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
      },
      apiMapping: {
        type: 'subArea',
        areaType: 'sub_area_type',
      },
    }

    expect(subAreaConfig.apiMapping?.type).toBe('subArea')
    expect(subAreaConfig.apiMapping?.areaType).toBe('sub_area_type')
  })

  it('should handle VectorizationGroup with all optional properties', () => {
    const fullGroup: VectorizationGroup = {
      groupName: 'Full Group',
      groupNameKey: 'full.group',
      groupKey: 'FULL_GROUP',
      description: 'Full group description',
      descriptionKey: 'full.group.description',
      layersToVectorize: [],
    }

    expect(fullGroup.groupNameKey).toBe('full.group')
    expect(fullGroup.description).toBe('Full group description')
    expect(fullGroup.descriptionKey).toBe('full.group.description')
  })

  it('should handle BaseMapLayer with all optional properties', () => {
    const fullBaseLayer: BaseMapLayer = {
      name: 'Full Base Layer',
      nameKey: 'full.base',
      default: false,
      key: 'full_base',
      url: 'https://example.com/tiles/{z}/{x}/{y}.png',
      attribution: '© Full Attribution',
      attributionKey: 'full.attribution',
    }

    expect(fullBaseLayer.nameKey).toBe('full.base')
    expect(fullBaseLayer.attribution).toBe('© Full Attribution')
    expect(fullBaseLayer.attributionKey).toBe('full.attribution')
  })

  it('should handle WmsLayer with all optional properties', () => {
    const fullWmsLayer: WmsLayer = {
      baseUrl: 'https://example.com/geoserver/wms',
      toggle: { active: 'active', inactive: 'inactive' },
      layers: 'full_layer',
      format: 'image/jpeg',
      transparent: false,
      name: 'Full WMS Layer',
      nameKey: 'wms.full_layer',
      activeDefault: true,
      visible: false,
      key: 'full_wms',
      style: {
        color: '#ff0000',
        fillColor: '#00ff00',
      },
      options: [
        {
          keyGeoserver: 'CQL_FILTER',
          filter: 'area > 1000',
        },
      ],
    }

    expect(fullWmsLayer.nameKey).toBe('wms.full_layer')
    expect(fullWmsLayer.style?.color).toBe('#ff0000')
    expect(fullWmsLayer.options).toHaveLength(1)
    expect(fullWmsLayer.options![0].keyGeoserver).toBe('CQL_FILTER')
  })

  it('should handle CustomLayerGroup with all optional properties', () => {
    const fullCustomGroup: CustomLayerGroup = {
      name: 'Full Custom Group',
      nameKey: 'custom.full_group',
      key: 'FULL_CUSTOM',
      toggle: { active: 'show', inactive: 'hide' },
      layers: [],
    }

    expect(fullCustomGroup.nameKey).toBe('custom.full_group')
  })

  it('should handle FormMapLayerFeatureProperties with all property types', () => {
    const fullProps: FormMapLayerFeatureProperties = {
      area_ha: '100.5',
      _layerCode: 'FULL_LAYER',
      _displayName: 'Full Layer',
      _workflowName: 'full_workflow',
      stringProp: 'string_value',
      numberProp: 42,
      booleanProp: true,
      objectProp: { nested: 'value' },
      arrayProp: [1, 2, 3],
    }

    expect(fullProps.area_ha).toBe('100.5')
    expect(fullProps._layerCode).toBe('FULL_LAYER')
    expect(fullProps._displayName).toBe('Full Layer')
    expect(fullProps._workflowName).toBe('full_workflow')
    expect(fullProps.stringProp).toBe('string_value')
    expect(fullProps.numberProp).toBe(42)
    expect(fullProps.booleanProp).toBe(true)
    expect(fullProps.objectProp).toEqual({ nested: 'value' })
    expect(fullProps.arrayProp).toEqual([1, 2, 3])
  })

  it('should handle FormMapLayerFeatureProperties with numeric area_ha', () => {
    const numericProps: FormMapLayerFeatureProperties = {
      area_ha: 100.5,
      _layerCode: 'NUMERIC_LAYER',
    }

    expect(numericProps.area_ha).toBe(100.5)
  })

  it('should handle DisplayedAreaInfo with all optional properties', () => {
    const fullAreaInfo: DisplayedAreaInfo = {
      originalLayerId: 123,
      name: 'Full Area',
      nameKey: 'area.full',
      geoJsonSource: {
        type: 'Feature',
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
        properties: {},
      },
      apiResults: { result1: 'value1', result2: 42 },
      apiProcessedGeoJsonLayers: [],
      areaHa: 100.5,
      calculatedAreaText: '100.5 hectares',
      isVisible: true,
      isApiDerived: true,
      layerCode: 'FULL_AREA',
      workflowName: 'full_area_workflow',
      style: {
        stroke: true,
        color: '#ff0000',
        weight: 2,
      },
    }

    expect(fullAreaInfo.nameKey).toBe('area.full')
    expect(fullAreaInfo.apiResults?.result1).toBe('value1')
    expect(fullAreaInfo.apiResults?.result2).toBe(42)
    expect(fullAreaInfo.areaHa).toBe(100.5)
    expect(fullAreaInfo.calculatedAreaText).toBe('100.5 hectares')
    expect(fullAreaInfo.isApiDerived).toBe(true)
    expect(fullAreaInfo.style?.stroke).toBe(true)
  })

  it('should handle NonGeometricResult with different value types', () => {
    const stringResult: NonGeometricResult = {
      taskAlias: 'string_task',
      value: 'string_value',
      originalLayerId: 1,
    }

    const numberResult: NonGeometricResult = {
      taskAlias: 'number_task',
      value: 42,
      originalLayerId: 2,
    }

    const objectResult: NonGeometricResult = {
      taskAlias: 'object_task',
      value: { data: 'test', count: 5 },
      originalLayerId: 3,
    }

    const arrayResult: NonGeometricResult = {
      taskAlias: 'array_task',
      value: [1, 2, 3, 4, 5],
      originalLayerId: 4,
    }

    expect(stringResult.value).toBe('string_value')
    expect(numberResult.value).toBe(42)
    expect(objectResult.value).toEqual({ data: 'test', count: 5 })
    expect(arrayResult.value).toEqual([1, 2, 3, 4, 5])
  })

  it('should handle different geometry types in GeoJsonFeature', () => {
    const pointFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {},
    }

    const lineStringFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      },
      properties: {},
    }

    const polygonFeature: GeoJsonFeature = {
      type: 'Feature',
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
      properties: {},
    }

    const multiPointFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'MultiPoint',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
      properties: {},
    }

    const multiLineStringFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [0, 0],
            [1, 1],
          ],
          [
            [2, 2],
            [3, 3],
          ],
        ],
      },
      properties: {},
    }

    const multiPolygonFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        ],
      },
      properties: {},
    }

    expect(pointFeature.geometry.type).toBe('Point')
    expect(lineStringFeature.geometry.type).toBe('LineString')
    expect(polygonFeature.geometry.type).toBe('Polygon')
    expect(multiPointFeature.geometry.type).toBe('MultiPoint')
    expect(multiLineStringFeature.geometry.type).toBe('MultiLineString')
    expect(multiPolygonFeature.geometry.type).toBe('MultiPolygon')
  })

  it('should handle null geometry in GeoJsonFeature', () => {
    const nullGeometryFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: null,
      properties: {},
    }

    expect(nullGeometryFeature.geometry).toBeNull()
  })

  it('should handle empty properties in GeoJsonFeature', () => {
    const emptyPropsFeature: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: null,
    }

    expect(emptyPropsFeature.properties).toBeNull()
  })
})
