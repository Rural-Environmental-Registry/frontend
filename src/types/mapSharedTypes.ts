import type L from 'leaflet'
import type {
  Geometry,
  GeoJsonProperties,
  Feature as GeoJsonFeatureType,
  FeatureCollection as GeoJsonFeatureCollectionType,
} from 'geojson'

export type GeoJsonFeature<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> = GeoJsonFeatureType<G, P>
export type GeoJsonFeatureCollection<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> = GeoJsonFeatureCollectionType<G, P>

export interface LayerDrawStyleOptions {
  stroke?: boolean
  color?: string
  weight?: number
  opacity?: number
  lineCap?: 'butt' | 'round' | 'square' | 'inherit'
  lineJoin?: 'miter' | 'round' | 'bevel' | 'inherit'
  dashArray?: string | number[]
  dashOffset?: string
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  fillRule?: 'nonzero' | 'evenodd' | 'inherit'
  iconType?: 'defaultMarker' | 'customSvg'
  iconUrl?: string
  radius?: number
}

export interface VectorizationLayerDrawTools {
  polygon: boolean
  marker: boolean
  polyline: boolean
  rectangle: boolean
  circle: boolean
  circlemarker: boolean
}

export interface VectorizationLayerConfig {
  displayName: string
  displayNameKey?: string
  layerCode: string
  workflowName: string
  tooltip?: string
  apiOutputLayerIdentifier?: string
  geometryType: string
  description: string
  descriptionKey?: string
  fixedInitialParameters: Record<string, unknown>
  drawTools: VectorizationLayerDrawTools
  drawStyle?: LayerDrawStyleOptions
  apiResultStyle?: LayerDrawStyleOptions
  maxInstances?: number
  required?: boolean
  apiMapping?: {
    type: 'mainArea' | 'subArea'
    areaType?: string
  }
}

export interface VectorizationGroup {
  groupName: string
  groupNameKey?: string
  groupKey: string
  description?: string
  descriptionKey?: string
  layersToVectorize: VectorizationLayerConfig[]
}

export interface BaseMapLayer {
  name: string
  nameKey?: string
  default: boolean
  key: string
  url: string
  attribution?: string
  attributionKey?: string
}

export interface WmsLayerOptionFilter {
  keyGeoserver: string
  filter: string
}

export interface WmsLayerStyle {
  color: string
  fillColor: string
}

export interface WmsLayer {
  baseUrl: string
  toggle: { active: string; inactive: string }
  layers: string
  format: string
  transparent: boolean
  name: string
  nameKey?: string
  activeDefault: boolean
  visible: boolean
  key: string
  style?: WmsLayerStyle
  options?: WmsLayerOptionFilter[]
}

export interface CustomLayerGroup {
  name: string
  nameKey?: string
  key: string
  toggle: { active: string; inactive: string }
  layers: WmsLayer[]
}

export interface MapConfigurationData {
  mapLayers: BaseMapLayer[]
  customLayers: CustomLayerGroup[]
  vectorizationGroups: VectorizationGroup[]
}

export interface FormMapLayerFeatureProperties extends GeoJsonProperties {
  area_ha?: string | number
  _layerCode?: string
  _displayName?: string
  _workflowName?: string
  [key: string]: any
}
export type FormMapLayerFeature = GeoJsonFeature<GeoJSON.Geometry, FormMapLayerFeatureProperties>

export interface FormMapLayerData
  extends GeoJsonFeatureCollection<GeoJSON.Geometry, FormMapLayerFeatureProperties> {
  features: FormMapLayerFeature[]
}

export type FormMapData = {
  [layerCode: string]: FormMapLayerData | undefined
}

export interface DisplayedAreaInfo {
  originalLayerId: number
  name: string
  nameKey?: string
  geoJsonSource: GeoJsonFeature
  apiResults?: Record<string, any>
  apiProcessedGeoJsonLayers: L.Layer[]
  areaHa?: number
  calculatedAreaText?: string
  isVisible: boolean
  isApiDerived?: boolean
  layerCode: string
  workflowName: string
  style?: LayerDrawStyleOptions
}

export interface NonGeometricResult {
  taskAlias: string
  value: unknown
  originalLayerId: number
}
