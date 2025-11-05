import type { BaseDetails, RegistrarDetails, RepresentativeDetails } from './RegistrarDetails'

export function validateBaseDetails(obj: any): obj is BaseDetails {
  if (!obj || typeof obj !== 'object') return false

  if (typeof obj.id !== 'string') return false
  if (typeof obj.dateOfBirth !== 'string') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.mothersName !== 'string') return false

  return true
}

export function validateRepresentativeDetails(obj: any): obj is RepresentativeDetails {
  return validateBaseDetails(obj)
}

export function validateRegistrarDetails(obj: any): obj is RegistrarDetails {
  if (!obj || typeof obj !== 'object') return false

  if (!validateBaseDetails(obj)) return false

  if (obj.representative !== undefined && !validateRepresentativeDetails(obj.representative)) {
    return false
  }

  return true
}

export type { BaseDetails, RegistrarDetails, RepresentativeDetails }
