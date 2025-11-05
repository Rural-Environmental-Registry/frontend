import type { RuralPropertiesData } from './RuralProperties'

export function validateMailingAddress(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false

  if (typeof obj.recipientName !== 'string') return false
  if (typeof obj.addressStreet !== 'string') return false
  if (typeof obj.number !== 'string') return false
  if (typeof obj.additionalInformation !== 'string') return false
  if (typeof obj.neighborhood !== 'string') return false
  if (typeof obj.zipCode !== 'string') return false
  if (typeof obj.state !== 'string') return false
  if (typeof obj.city !== 'string') return false
  if (typeof obj.email !== 'string') return false
  if (typeof obj.telephone !== 'string') return false

  return true
}

export function validateRuralPropertiesData(obj: any): obj is RuralPropertiesData {
  if (!obj || typeof obj !== 'object') return false

  if (typeof obj.propertyName !== 'string') return false
  if (typeof obj.state !== 'string') return false
  if (typeof obj.city !== 'string') return false
  if (typeof obj.zipCode !== 'string') return false
  if (!['urban', 'rural'].includes(obj.locationZonenv)) return false
  if (typeof obj.propertyAccessDescription !== 'string') return false

  if (!obj.mailingAddress || !validateMailingAddress(obj.mailingAddress)) return false

  return true
}

export type { RuralPropertiesData }
