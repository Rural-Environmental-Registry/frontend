export type LandHoldersData = {
  legalPersonality: 'natural_person' | 'legal_entity'
  wayToAddLandholdersInformation: 'fill' | 'import'
  id: string
  dateOfBirth: string
  name: string
  mothersName: string
}

export type LandHoldersInformation = {
  landHoldersData: LandHoldersData[] | null
}
