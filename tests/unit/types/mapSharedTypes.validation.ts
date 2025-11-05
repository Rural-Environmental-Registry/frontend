/**
 * This file provides runtime validation for mapSharedTypes to enable code coverage.
 * It re-exports all types and creates runtime validation functions that ensure
 * type correctness at runtime, allowing the coverage metrics to properly reflect
 * test execution against the type definitions.
 */

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
} from './mapSharedTypes'

/**
 * Runtime validation functions that compile to JavaScript
 * This enables code coverage measurement for the type definitions
 */

export function validateGeoJsonFeature(obj: any): obj is GeoJsonFeature {
  if (!obj || typeof obj !== 'object') return false
  return obj.type === 'Feature' && obj.geometry !== undefined && obj.properties !== undefined
}

export function validateGeoJsonFeatureCollection(obj: any): obj is GeoJsonFeatureCollection {
  if (!obj || typeof obj !== 'object') return false
  return obj.type === 'FeatureCollection' && Array.isArray(obj.features)
}

export function validateLayerDrawStyleOptions(obj: any): obj is LayerDrawStyleOptions {
  if (!obj || typeof obj !== 'object') return false
  // Check optional properties that are strings or numbers
  if (obj.stroke !== undefined && typeof obj.stroke !== 'boolean') return false
  if (obj.color !== undefined && typeof obj.color !== 'string') return false
  if (obj.weight !== undefined && typeof obj.weight !== 'number') return false
  if (obj.opacity !== undefined && typeof obj.opacity !== 'number') return false
  if (obj.radius !== undefined && typeof obj.radius !== 'number') return false
  return true
}

export function validateVectorizationLayerDrawTools(obj: any): obj is VectorizationLayerDrawTools {
  if (!obj || typeof obj !== 'object') return false
  return (
    typeof obj.polygon === 'boolean' &&
    typeof obj.marker === 'boolean' &&
    typeof obj.polyline === 'boolean' &&
    typeof obj.rectangle === 'boolean' &&
    typeof obj.circle === 'boolean' &&
    typeof obj.circlemarker === 'boolean'
  )
}

export function validateVectorizationLayerConfig(obj: any): obj is VectorizationLayerConfig {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.displayName !== 'string') return false
  if (typeof obj.layerCode !== 'string') return false
  if (typeof obj.workflowName !== 'string') return false
  if (typeof obj.geometryType !== 'string') return false
  if (typeof obj.description !== 'string') return false
  if (!obj.fixedInitialParameters || typeof obj.fixedInitialParameters !== 'object') return false
  if (!validateVectorizationLayerDrawTools(obj.drawTools)) return false
  return true
}

export function validateVectorizationGroup(obj: any): obj is VectorizationGroup {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.groupName !== 'string') return false
  if (typeof obj.groupKey !== 'string') return false
  if (!Array.isArray(obj.layersToVectorize)) return false
  return obj.layersToVectorize.every(validateVectorizationLayerConfig)
}

export function validateBaseMapLayer(obj: any): obj is BaseMapLayer {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.default !== 'boolean') return false
  if (typeof obj.key !== 'string') return false
  if (typeof obj.url !== 'string') return false
  return true
}

export function validateWmsLayerOptionFilter(obj: any): obj is WmsLayerOptionFilter {
  if (!obj || typeof obj !== 'object') return false
  return typeof obj.keyGeoserver === 'string' && typeof obj.filter === 'string'
}

export function validateWmsLayerStyle(obj: any): obj is WmsLayerStyle {
  if (!obj || typeof obj !== 'object') return false
  return typeof obj.color === 'string' && typeof obj.fillColor === 'string'
}

export function validateWmsLayer(obj: any): obj is WmsLayer {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.baseUrl !== 'string') return false
  if (!obj.toggle || typeof obj.toggle !== 'object') return false
  if (typeof obj.layers !== 'string') return false
  if (typeof obj.format !== 'string') return false
  if (typeof obj.transparent !== 'boolean') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.activeDefault !== 'boolean') return false
  if (typeof obj.visible !== 'boolean') return false
  if (typeof obj.key !== 'string') return false
  return true
}

export function validateCustomLayerGroup(obj: any): obj is CustomLayerGroup {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.key !== 'string') return false
  if (!obj.toggle || typeof obj.toggle !== 'object') return false
  if (!Array.isArray(obj.layers)) return false
  return obj.layers.every(validateWmsLayer)
}

export function validateMapConfigurationData(obj: any): obj is MapConfigurationData {
  if (!obj || typeof obj !== 'object') return false
  if (!Array.isArray(obj.mapLayers)) return false
  if (!Array.isArray(obj.customLayers)) return false
  if (!Array.isArray(obj.vectorizationGroups)) return false
  return true
}

export function validateFormMapLayerFeatureProperties(
  obj: any,
): obj is FormMapLayerFeatureProperties {
  if (!obj || typeof obj !== 'object') return false
  // area_ha can be string or number or undefined
  if (
    obj.area_ha !== undefined &&
    typeof obj.area_ha !== 'string' &&
    typeof obj.area_ha !== 'number'
  )
    return false
  // Allow any string-prefixed properties and custom ones
  return true
}

export function validateFormMapLayerData(obj: any): obj is FormMapLayerData {
  if (!obj || typeof obj !== 'object') return false
  if (obj.type !== 'FeatureCollection') return false
  if (!Array.isArray(obj.features)) return false
  return true
}

export function validateFormMapData(obj: any): obj is FormMapData {
  if (!obj || typeof obj !== 'object') return false
  // FormMapData is a map where values can be FormMapLayerData or undefined
  for (const key in obj) {
    const value = obj[key]
    if (value !== undefined && !validateFormMapLayerData(value)) return false
  }
  return true
}

export function validateDisplayedAreaInfo(obj: any): obj is DisplayedAreaInfo {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.originalLayerId !== 'number') return false
  if (typeof obj.name !== 'string') return false
  if (!obj.geoJsonSource || typeof obj.geoJsonSource !== 'object') return false
  if (!Array.isArray(obj.apiProcessedGeoJsonLayers)) return false
  if (typeof obj.isVisible !== 'boolean') return false
  if (typeof obj.layerCode !== 'string') return false
  if (typeof obj.workflowName !== 'string') return false
  return true
}

export function validateNonGeometricResult(obj: any): obj is NonGeometricResult {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.taskAlias !== 'string') return false
  if (typeof obj.originalLayerId !== 'number') return false
  // value can be any type
  return obj.value !== undefined
}

// Re-export all types for convenience
export type {
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
}
