export type PropertyRightsData = {
  propertyLandholding: 'property' | 'landholding'
  registeredPropertyName: string
  area: string
  documentType: string
  titleDeedLandDocument: string
  documentDate: string
  book: string
  page: string
  stateOfTheNotaryOffice: string
  cityOfTheNotaryOffice: string
  // nationalRuralLandRegistrySystemCode: string,
  propertyCertification: string
  nationalRuralPropertyRegistrationNumber: string
  // legalReserve: boolean,
}

export type PropertyRights = {
  propertyRightsData: PropertyRightsData[] | null
}
