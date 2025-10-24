import { MAP_LAYERS } from '@/config/map/constsMap'
import mapConfigurationDataImport from '@/config/map/layers.ts'
import type { MapConfigurationData, VectorizationLayerConfig } from '@/types/mapSharedTypes'

export type LayerData = {
  displayName: string
  displayNameKey: string
  layerCode: string
  description: string
  descriptionKey: string
  drawTools: string[]
  rules: {
    required: boolean
    overlap: boolean
    geometryType: string
    geometricUnit: string
    style: { color: string; fillColor: string; weight: number; fillOpacity: number }
    buffer: {
      size: number
      bufferCode: string
      style: {
        color: string
        weight: number
        opacity: number
        fillColor: string
        fillOpacity: number
      }
    }
  }
  parentGroup?: string
}

/**
 * Retorna as informações de uma camada com base no código fornecido.
 * @param layerCode Código ou identificador da camada que vem do backend
 * @param layers Configuração de camadas do mapa
 * @returns LayerData ou undefined se não for encontrada
 */
export function getLayerData(layerCode: string | undefined, layers = MAP_LAYERS): any {
  if (!layerCode || !layers?.vectorizationGroups) {
    return undefined
  }

  if (!layerCode.includes('BUFFER')) {
    for (const group of layers.vectorizationGroups) {
      for (const layer of group.layersToVectorize as LayerData[]) {
        if (layer.layerCode.includes(layerCode)) {
          return layer
        }
      }
    }
  } else {
    for (const group of layers.vectorizationGroups) {
      for (const layer of group.layersToVectorize as LayerData[]) {
        if (layer.rules.buffer) {
          if (layer.rules.buffer.bufferCode.includes(layerCode)) {
            return layer
          }
        }
      }
    }
  }

  return undefined
}

const mapConfiguration: MapConfigurationData = mapConfigurationDataImport as MapConfigurationData

/**
 * Localiza uma camada com base no identificador (layerCode ou areaType)
 * @param identifier Código da camada ou areaType
 * @returns VectorizationLayerConfig ou undefined
 */
export function findLayer(identifier: string): VectorizationLayerConfig | undefined {
  for (const group of mapConfiguration.vectorizationGroups) {
    const layer = group.layersToVectorize.find(
      (l) => l.layerCode === identifier || l.apiMapping?.areaType === identifier,
    )
    if (layer) return layer
  }
  return undefined
}
