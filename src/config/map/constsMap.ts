import Layers from '@/config/map/layers.ts'
import languages from '@/config/languages.json'

export const MAP_LAYERS = Layers

export function getTranslatedLayers(getLanguageFn: (key: string) => string) {
  const layersCopy = JSON.parse(JSON.stringify(MAP_LAYERS))

  const translateObject = (obj: any): void => {
    if (Array.isArray(obj)) {
      // Se for um array, percorre cada item
      obj.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          translateObject(item)
        }
      })
    } else if (typeof obj === 'object' && obj !== null) {
      // Se for um objeto, percorre cada propriedade
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key.endsWith('Key') && typeof obj[key] === 'string') {
            // Traduz propriedades que terminam com 'Key'
            const translationKey = obj[key] as string
            const translatedText = getLanguageFn(translationKey)
            const baseKey = key.replace('Key', '')
            obj[baseKey] = translatedText
          } else if (key === 'toggle' && typeof obj[key] === 'object' && obj[key] !== null) {
            // Traduz especificamente as chaves active e inactive do toggle
            const toggle = obj[key] as Record<string, string>
            if (toggle.active) {
              toggle.active = getLanguageFn(`common.${toggle.active}`) || toggle.active
            }
            if (toggle.inactive) {
              toggle.inactive = getLanguageFn(`common.${toggle.inactive}`) || toggle.inactive
            }
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursivamente traduz objetos e arrays aninhados
            translateObject(obj[key])
          }
        }
      }
    }
  }

  translateObject(layersCopy)

  return layersCopy
}

type Lang = 'en-us' | 'pt-br' | 'es-es'
export const getTranslatedDescriptiveMemorial = (lang: Lang) => languages[lang].descriptiveMemorial

export const MapOptions = {
  map: {
    config: {
      zoomControl: true,
      minZoom: 3,
      maxZoom: 17,
      center: [-15.235, -51.9253],
      zoom: 4,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      preferCanvas: false,
      markerZoomAnimation: false,
      stabilizeMarkersOnZoom: true,
    },
  },
  layersMenu: {
    size: 'medium',
  },
  drawing: {
    show: true,
    options: {
      position: 'topright',
      drawMarker: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      drawPolygon: false,
      drawPolyline: false,
      editMode: false,
      removalMode: false,
    },
  },
  tools: {
    show: true,
    position: 'topright',
    fullscreen: { show: true, title: 'Fullscreen' },
    center: { show: true, title: 'Center map', target: 'drawn' },
    measureArea: {
      show: true,
      title: 'Measure',
    },
    texts: {
      measureResult: 'Measurement',
      measureLength: 'Distance',
      measureArea: 'Area',
      measurePanelTitle: 'Measure distances and areas',
      measureLineTitle: 'Measure line',
      measurePolygonTitle: 'Measure polygon',
      measureLineHelp: 'Click two points on the map. Double-click to finish the line.',
      measurePolygonHelp:
        'Click to add vertices. Finish on the first point, use Finish, or double-click.',
      measureCancel: 'Cancel',
      measureFinish: 'Finish measurement',
      noGeometry: 'No geometry to center on',
    },
  },
}
