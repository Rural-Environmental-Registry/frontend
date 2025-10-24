export type RuralPropertiesData = {
  propertyName: string
  state: string
  city: string
  zipCode: string
  locationZonenv: 'urban' | 'rural'
  propertyAccessDescription: string
  mailingAddress: {
    recipientName: string
    addressStreet: string
    number: string
    additionalInformation: string
    neighborhood: string
    zipCode: string
    state: string
    city: string
    email: string
    telephone: string
  }
}
