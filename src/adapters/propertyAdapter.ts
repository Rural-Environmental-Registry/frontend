import { layer_code } from '@/config/diff_area.json'
import { useDateFormat } from '@vueuse/core'
import type { Geometry } from 'geojson'
import { getLayerData, type LayerData } from '../utils/layerUtils'

export function formatText(value: string): string {
  return value
    ? value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : ''
}

export type PropertyForView = {
  id: string
  propertyName: string
  code: string
  stateDistrict: string
  municipality: string
  zipcode: string
  locationZone: string
  areas: AreaForView[]
  owners: Array<any>
  attributes: Array<any>
  documents: Array<any>
}

export type AreaForView = {
  id: string
  geometry: Geometry
  type: 'main' | 'subarea' | 'buffer'
  layerData: LayerData | undefined
  properties: {
    area: number
    lat: number
    lon: number
    attributes: any[]
  }
}

export type DocumentForView = {
  id: string
  documentType: string
  registeredPropertyName: string
  area: number
  attributes: Array<{ name: string; value: string }>
  holdingType: string
  deed: string
  cityOfNotaryOffice: string
  stateOfNotaryOffice: string
}

export function formatAttributeValue(attr: any) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/g
  if (attr?.value && dateRegex.test(attr.value)) {
    return { ...attr, value: useDateFormat(attr.value, 'DD/MM/YYYY') }
  }
  return { ...attr, value: formatText(attr?.value || '') }
}

export function getAttrValue(attrs: Array<{ name: string; value: string }>, name: string): string {
  const attr = attrs.find((a) => a.name === name)
  if (
    !attr ||
    attr.value === null ||
    attr.value === undefined ||
    attr.value === 'null' ||
    attr.value === ''
  ) {
    return 'N/A'
  }
  if (attr.value === 'Null') {
    return ''
  }
  return String(attr.value)
}

export function parseLandholderType(
  attributes: Array<{ name: string; value: string }>,
): 'naturalPerson' | 'legalEntity' | 'N/A' {
  if (!attributes || !Array.isArray(attributes)) return 'N/A'
  const attr = attributes.find((a) => a.name === 'landholderType')
  if (!attr || !attr.value) return 'N/A'
  return attr.value === 'natural_person' ? 'naturalPerson' : 'legalEntity'
}

export function adaptPropertyResponse(apiData: any): PropertyForView {
  if (!apiData) return {} as PropertyForView

  const areas: AreaForView[] = []

  const headQuarter = {
    layerName: 'PROPERTY_HEADQUARTERS',
    lat: 0,
    lon: 0,
  }
  const existsHeadquarter = Array.from(apiData.subAreas).some((subArea: any) =>
    String(subArea.areaType).includes(headQuarter.layerName),
  )
  if (existsHeadquarter) {
    const headQuarterSubArea: any = Array.from(apiData.subAreas).filter((subArea: any) =>
      String(subArea.areaType).includes(headQuarter.layerName),
    )[0]
    headQuarter.lat = headQuarterSubArea.geometry.coordinates[1] || 0
    headQuarter.lon = headQuarterSubArea.geometry.coordinates[0] || 0
  }

  //* Main Area
  areas.push({
    id: apiData.id,
    geometry: apiData.mainArea.geometry || [],
    type: 'main',
    layerData: getLayerData(layer_code),
    properties: {
      area: apiData.mainArea.area || 0,
      lat: headQuarter.lat || apiData.mainArea.lat || 0,
      lon: headQuarter.lon || apiData.mainArea.lon || 0,
      attributes: apiData.mainArea.attributes || [],
    },
  })

  //* SubAreas
  Array.from(apiData.subAreas || []).forEach((subArea: any) => {
    const tempArea = {} as AreaForView
    tempArea.id = subArea.id
    tempArea.geometry = subArea.geometry || []
    tempArea.type = String(subArea.areaType).includes('BUFFER') ? 'buffer' : 'subarea'
    tempArea.layerData = getLayerData(subArea.areaType)
    tempArea.properties = {
      area: subArea.area || 0,
      lat: subArea.lat || 0,
      lon: subArea.lon || 0,
      attributes: subArea.attributes || [],
    }

    areas.push(tempArea)
  })

  const documents: DocumentForView[] = Array.isArray(apiData.documents)
    ? apiData.documents.map((doc: any) => {
        const attrs = Array.isArray(doc.attributes) ? doc.attributes.map(formatAttributeValue) : []

        return {
          id: doc.id || '',
          documentType: doc.documentType || '',
          registeredPropertyName: doc.registeredPropertyName || 'N/A',
          area: doc.area || 0,
          attributes: attrs,
          holdingType: getAttrValue(attrs, 'holdingType').toLowerCase(), // para chave da linguagem em lower case
          deed: getAttrValue(attrs, 'deed'),
          cityOfNotaryOffice: getAttrValue(attrs, 'city_of_notary_office'),
          stateOfNotaryOffice: getAttrValue(attrs, 'state_of_notary_office').toUpperCase(),
        }
      })
    : []

  const owners = Array.isArray(apiData.owners)
    ? apiData.owners.map((owner: any) => ({
        id: owner.id || '',
        name: owner.name || 'N/A',
        identifier: owner.identifier || 'N/A',
        dateOfBirth: owner.dateOfBirth ? useDateFormat(owner.dateOfBirth, 'DD/MM/YYYY') : 'N/A',
        mothersName: owner.mothersName || 'N/A',
        landholderType: parseLandholderType(owner.attributes),
        // caso precise, mantenha atributos originais:
        attributes: owner.attributes || [],
      }))
    : []

  return {
    id: apiData.id || '',
    propertyName: apiData.propertyName || 'N/A',
    code: apiData.code || 'N/A',
    stateDistrict: apiData.stateDistrict?.toUpperCase() || 'N/A',
    municipality: formatText(apiData.municipality || ''),
    zipcode: apiData.zipcode || 'N/A',
    locationZone: apiData.locationZone || 'N/A',
    areas,
    owners,
    attributes: Array.isArray(apiData.attributes) ? apiData.attributes : [],
    documents,
  }
}
