import { getLayerData } from '@/utils/layerUtils'
import { adaptApiDataToFormData } from './propertyFormAdapter'
import diffArea from '@/config/diff_area.json'

export function adaptPropertyForRegister(apiData: any, mapLayers: any) {
  if (!apiData) {
    return {
      geoData: { vectorizedLayers: {}, currentStep: null },
      formData: null,
    }
  }

  const vectorizedLayers: Record<string, any> = {}

  // Main Area usando getLayerData()
  const { layer_code } = diffArea
  const mainLayer = getLayerData(layer_code, mapLayers)
  if (apiData.mainArea?.geometry && mainLayer) {
    vectorizedLayers[mainLayer.layerCode] = {
      description: mainLayer.description || '',
      descriptionKey: mainLayer.descriptionKey || '',
      displayName: mainLayer.displayName || '',
      displayNameKey: mainLayer.displayNameKey || '',
      drawTools: mainLayer.drawTools || [],
      layerCode: mainLayer.layerCode,
      rules: mainLayer.rules || {},
      parentGroup: mainLayer.parentGroup || '',
      vectorizedArea: {
        buffer: null,
        geoJson: {
          type: 'Feature',
          properties: {},
          geometry: apiData.mainArea.geometry,
        },
        info: calculateAreaInfo(apiData.mainArea.area || 0),
        options: {
          ...(mainLayer.rules?.style || {}),
          pane: 'overlayPane',
          layerCode: mainLayer.layerCode,
          rules: mainLayer.rules || {},
        },
      },
    }
  }

  // Sub Areas
  if (Array.isArray(apiData.subAreas)) {
    for (const subArea of apiData.subAreas) {
      if (String(subArea.areaType).includes('BUFFER')) continue
      const foundedLayer = getLayerData(subArea.areaType, mapLayers)
      if (!foundedLayer) continue

      vectorizedLayers[foundedLayer.layerCode] = {
        description: foundedLayer.description || '',
        descriptionKey: foundedLayer.descriptionKey || '',
        displayName: foundedLayer.displayName || '',
        displayNameKey: foundedLayer.displayNameKey || '',
        drawTools: foundedLayer.drawTools || [],
        layerCode: foundedLayer.layerCode,
        rules: foundedLayer.rules || {},
        parentGroup: foundedLayer.parentGroup || '',
        vectorizedArea: {
          buffer: null,
          geoJson: {
            type: 'Feature',
            properties: {},
            geometry: subArea.geometry,
          },
          info: calculateAreaInfo(subArea.area || 0),
          options: {
            ...(foundedLayer.rules?.style || {}),
            pane: 'overlayPane',
            layerCode: foundedLayer.layerCode,
            rules: foundedLayer.rules || {},
          },
        },
      }
    }
  }

  const geoData = {
    vectorizedLayers,
    currentStep: {
      group: {
        key: 'car_imovel_group',
        open: true,
      },
      layer: {
        key: layer_code,
      },
    },
  }
  const structuredData = adaptApiDataToFormData(apiData)

  return {
    geoData,
    formData: structuredData,
    editingRegistry: {
      id: apiData.id || '',
      name: apiData.propertyName || '',
    },
  }
}

// Função utilitária para calcular área
export function calculateAreaInfo(areaHa: number) {
  const m2 = areaHa * 10000
  const km2 = areaHa / 100
  return {
    m2: { value: m2, formatted: `${m2.toFixed(2)} m²` },
    km2: { value: km2, formatted: `${km2.toFixed(2)} km²` },
    ha: { value: areaHa, formatted: `${areaHa.toFixed(2)} ha` },
    m: { value: 0, formatted: '0.00 m' },
    km: { value: 0, formatted: '0.00 km' },
  }
}
