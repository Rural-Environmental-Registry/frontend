import type { PropertyRightsData, PropertyRights } from './PropertyRights'

export function validatePropertyRightsData(obj: any): obj is PropertyRightsData {
  if (!obj || typeof obj !== 'object') return false

  if (!['property', 'landholding'].includes(obj.propertyLandholding)) return false
  if (typeof obj.registeredPropertyName !== 'string') return false
  if (typeof obj.area !== 'string') return false
  if (typeof obj.documentType !== 'string') return false
  if (typeof obj.titleDeedLandDocument !== 'string') return false
  if (typeof obj.documentDate !== 'string') return false
  if (typeof obj.book !== 'string') return false
  if (typeof obj.page !== 'string') return false
  if (typeof obj.stateOfTheNotaryOffice !== 'string') return false
  if (typeof obj.cityOfTheNotaryOffice !== 'string') return false
  if (typeof obj.propertyCertification !== 'string') return false
  if (typeof obj.nationalRuralPropertyRegistrationNumber !== 'string') return false

  return true
}

export function validatePropertyRights(obj: any): obj is PropertyRights {
  if (!obj || typeof obj !== 'object') return false

  if (obj.propertyRightsData !== null && !Array.isArray(obj.propertyRightsData)) return false
  if (Array.isArray(obj.propertyRightsData)) {
    return obj.propertyRightsData.every(validatePropertyRightsData)
  }

  return true
}

export type { PropertyRightsData, PropertyRights }
