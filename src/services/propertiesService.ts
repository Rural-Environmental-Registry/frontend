import { adaptPropertyResponse } from '@/adapters/propertyAdapter'
import { adaptPropertyForRegister } from '@/adapters/propertyRegisterAdapter'
import type { Property } from '@/interfaces/Property'
import axios from '@/services/axios'
import ApiService from '@/services/axios'
import mapConfigurationDataImport from '@/config/map/layers.ts'
import { adaptFormDataToPayload } from '@/adapters/propertyPayloadAdapter'

interface PagedPropertiesResponse {
  properties: Property[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasnext: boolean
}

export const fetchProperties = async (
  page = 0,
  size = 7,
  filterParams: any = {},
): Promise<PagedPropertiesResponse> => {
  try {
    const sub = sessionStorage.getItem('sub')
    const response = await ApiService.get('/properties', {
      page,
      size,
      sub,
      sort: 'createdAt,desc',
      ...filterParams,
    })

    const propertiesWithImages = response.properties.map((property: Property) => {
      const imageUrl = `/properties/${property.id}/image`
      return {
        ...property,
        state: property.stateDistrict?.toUpperCase() || '',
        city: property.municipality
          ? property.municipality
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, (char: string) => char.toUpperCase())
          : '',
        imageUrl,
      }
    })

    return {
      properties: propertiesWithImages,
      page: response.page,
      size: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      hasnext: response.hasnext,
    }
  } catch (error) {
    throw error
  }
}

export async function getPropertyRegisterData(id: string) {
  const response = await ApiService.get(`/properties/${id}`)
  return adaptPropertyForRegister(response, mapConfigurationDataImport)
}

export async function fetchPropertyDetails(id: string) {
  const response = await ApiService.get(`/properties/${id}`)
  return adaptPropertyResponse(response)
}

export async function fetchPropertyImage(id: string) {
  const urlCreator = window.URL || window.webkitURL
  const blob = await axios.fetchImage(`/properties/${id}/image`)
  return urlCreator.createObjectURL(blob)
}

export const fetchReceipt = async (id: string, autoDownload = false): Promise<void> => {
  const locationZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  fetch(
    `${import.meta.env.VITE_DPG_URL}/properties/${id}/receipt${locationZone ? '?locationZone=' + locationZone : ''}`,
    { method: 'GET', headers: { responseType: 'arraybuffer' } },
  )
    .then(async (response) => {
      const arrayBuffer = await response.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(blob)

      // Sempre abre em nova aba
      const viewLink = document.createElement('a')
      viewLink.href = pdfUrl
      viewLink.target = '_blank'
      document.body.appendChild(viewLink)
      viewLink.click()
      document.body.removeChild(viewLink)

      // Se autoDownload, também baixa
      if (autoDownload) {
        const downloadLink = document.createElement('a')
        downloadLink.href = pdfUrl
        downloadLink.download = `receipt-${Date.now()}.pdf`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl)
      }, 15000)
    })
    .catch((error) => {
      console.error('Erro:', error)
    })
}

export function buildFormData(formdata: any): globalThis.FormData {
  const formDataToSend = new globalThis.FormData()
  const propertyData = adaptFormDataToPayload(formdata)

  formDataToSend.append(
    'property',
    new Blob([JSON.stringify(propertyData)], { type: 'application/json' }),
  )

  const mapImageJson = sessionStorage.getItem('mapCaptured')
  if (mapImageJson) {
    try {
      const mapImage = JSON.parse(mapImageJson)
      if (mapImage?.image) {
        const byteString = atob(mapImage.image.split(',')[1])
        const byteArray = Uint8Array.from(byteString, (c) => c.charCodeAt(0))
        formDataToSend.append('mapImage', new Blob([byteArray], { type: 'image/png' }), 'map.png')
      }
    } catch (e) {
      console.error('Erro processando imagem do mapa:', e)
    }
  }

  return formDataToSend
}
