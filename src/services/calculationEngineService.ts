import ApiService from '@/services/axios'

export const processLayerService = async (payload: any): Promise<any> => {
  addSentLayers(payload)

  const adpaptPayload = (layers: any): any => {
    return {
      parameters: {
        geojson: {
          type: 'FeatureCollection',
          features: layers,
        },
      },
    }
  }

  const adaptResponse = (features: any[]): { features: any[]; removedLayers: string[] } => {
    if (!features?.length) return { features: [], removedLayers: [] }

    features.forEach((feature: any) => {
      handleDifference(feature.properties.layerCode)

      feature.properties.layerCode = feature.properties.tipo || feature.properties.layerCode
      feature.properties.area = feature.properties.area_ha || feature.properties.area

      delete feature.properties.tipo
      delete feature.properties.area_ha
    })

    return { features, removedLayers: [...sentLayers] }
  }

  try {
    const response = await ApiService.post('/calculations/execute', adpaptPayload(payload), {})

    return adaptResponse(response?.data?.PPA_WIDER_THAN_10M?.features)
  } catch (error) {
    throw new Error(`error processing layers in API: ${error}`)
  }
}

const sentLayers = new Set<string>()

const addSentLayers = (layers: any[]): void => {
  layers.forEach((layer: any) => sentLayers.add(layer.properties.layerCode))
}

const handleDifference = (layerCode: string): void => {
  if (sentLayers.has(layerCode)) sentLayers.delete(layerCode)
}
