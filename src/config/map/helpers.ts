import { toPng } from 'html-to-image'
import { area } from '@turf/turf'
import diffArea from '@/config/diff_area.json'

export default {
  saveMapState: (vectorizedLayers: any, currentStep: any): void => {
    const vectorizedLayerInfo: any = {}

    for (const layer in vectorizedLayers) {
      if (!vectorizedLayers[layer].vectorizedArea) continue
      // this approach is used to avoid circular references in the object
      vectorizedLayerInfo[layer] = {
        description: vectorizedLayers[layer].description,
        descriptionKey: vectorizedLayers[layer].descriptionKey,
        displayName: vectorizedLayers[layer].displayName,
        displayNameKey: vectorizedLayers[layer].displayNameKey,
        drawTools: vectorizedLayers[layer].drawTools,
        layerCode: vectorizedLayers[layer].layerCode,
        rules: vectorizedLayers[layer].rules,
        parentGroup: vectorizedLayers[layer].parentGroup,
        vectorizedArea: {
          buffer: vectorizedLayers[layer].vectorizedArea.buffer,
          geoJson: vectorizedLayers[layer].vectorizedArea.geoJson,
          info: vectorizedLayers[layer].vectorizedArea.info,
          options: vectorizedLayers[layer].vectorizedArea.options,
        },
      }
    }

    const state: any = {
      vectorizedLayers: vectorizedLayerInfo,
      currentStep,
    }

    window.sessionStorage.setItem('mapState', JSON.stringify(state))
  },
  loadMapState: (): any => {
    const mapState = window.sessionStorage.getItem('mapState')

    if (mapState) {
      return JSON.parse(mapState)
    }

    return null
  },
  scrollToMap: (offsetUp = 120): void => {
    const htmlTag: any = document.querySelector('html')
    const mapContainer: any =
      document.querySelector('#map-container') ||
      document.querySelector('.leaflet-container') ||
      document.querySelector('.map-container')
    if (!htmlTag || !mapContainer) return

    const { offsetTop, offsetHeight } = mapContainer
    const mapCenter = offsetTop + offsetHeight / 2
    const target = Math.max(0, Math.floor(mapCenter - window.innerHeight / 2 - offsetUp))
    htmlTag.scrollTo({ top: target, behavior: 'smooth' })

    setTimeout(() => {
      if (!mapContainer.hasAttribute('tabindex')) mapContainer.setAttribute('tabindex', '-1')
      ;(mapContainer as HTMLElement).focus()
    }, 450)
  },
  takeScreenshot: async (): Promise<void> => {
    const mapContainer: any = document.querySelector('#map-container')
    if (!mapContainer) return

    const mapSize = mapContainer.getBoundingClientRect()
    if (!mapSize) return

    const { width, height } = mapSize

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height

      const vectorImg = new Image()
      vectorImg.src = await toPng(mapContainer, {
        backgroundColor: 'white',
        skipFonts: true,
        filter: (node) =>
          !(
            node instanceof HTMLElement &&
            (node.classList?.contains('leaflet-control') ||
              node.classList?.contains('layer-menu') ||
              node.classList?.contains('coordinate-button'))
          ),
      })

      await new Promise<void>((resolve) => {
        vectorImg.onload = () => {
          ctx!.drawImage(vectorImg, 0, 0)
          resolve()
        }
      })

      const finalImage = canvas.toDataURL('image/png')
      sessionStorage.setItem('mapCaptured', JSON.stringify({ image: finalImage }))
    } catch (err) {
      console.error('Error capturing map image:', err)
    }
  },
  updateFormData: (): void => {
    const formData = window.sessionStorage.getItem('formData')
    const mapState = window.sessionStorage.getItem('mapState')

    if (formData && mapState) {
      const { vectorizedLayers } = JSON.parse(mapState)
      const savedFormData = JSON.parse(formData)

      savedFormData.mapData = {
        ...savedFormData.mapData,
        ...formatToPayload(vectorizedLayers),
      }

      window.sessionStorage.setItem('formData', JSON.stringify(savedFormData))
      window.dispatchEvent(new Event('mapDataSaved'))
    }
  },
}

const formatToPayload = (vectorizedLayers: any): any => {
  const { layer_code } = diffArea
  const mainPropertyKey = layer_code
  const formattedData: any = {
    mainArea: {},
    subAreas: [],
  }

  const propertyData = vectorizedLayers[mainPropertyKey]
  formattedData.mainArea['geometry'] = propertyData?.vectorizedArea?.geoJson?.geometry
  formattedData.mainArea['area'] = propertyData?.vectorizedArea?.info?.ha?.value
  formattedData.mainArea['lat'] =
    propertyData?.vectorizedArea?.geoJson?.geometry?.coordinates[0][0][0]
  formattedData.mainArea['lon'] =
    propertyData?.vectorizedArea?.geoJson?.geometry?.coordinates[0][0][1]

  for (const key in vectorizedLayers) {
    if (key === mainPropertyKey) continue
    const layer = vectorizedLayers[key]
    if (!layer?.vectorizedArea) continue

    formattedData.subAreas.push({
      geometry: layer.vectorizedArea.geoJson.geometry,
      area: layer.vectorizedArea.info?.[layer.rules.geometricUnit].value || 0,
      areaType: layer.layerCode,
    })

    const buffer = layer.vectorizedArea.buffer

    const bufferArea = (buffer: any) => {
      const toHa = 0.0001
      return area(buffer) * toHa
    }

    if (buffer) {
      formattedData.subAreas.push({
        geometry: buffer.geometry,
        area: bufferArea(buffer),
        areaType: layer.rules.buffer.bufferCode,
      })
    }
  }

  return formattedData
}
