import type { LandHoldersData, LandHoldersInformation } from './LandHoldersInformation'

export function validateLandHoldersData(obj: any): obj is LandHoldersData {
  if (!obj || typeof obj !== 'object') return false

  if (!['natural_person', 'legal_entity'].includes(obj.legalPersonality)) return false
  if (!['fill', 'import'].includes(obj.wayToAddLandholdersInformation)) return false
  if (typeof obj.id !== 'string') return false
  if (typeof obj.dateOfBirth !== 'string') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.mothersName !== 'string') return false

  return true
}

export function validateLandHoldersInformation(obj: any): obj is LandHoldersInformation {
  if (!obj || typeof obj !== 'object') return false

  if (obj.landHoldersData !== null && !Array.isArray(obj.landHoldersData)) return false
  if (Array.isArray(obj.landHoldersData)) {
    return obj.landHoldersData.every(validateLandHoldersData)
  }

  return true
}

export type { LandHoldersData, LandHoldersInformation }
