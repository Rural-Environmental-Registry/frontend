import type { FormData } from '@/context/FormContext.vue'

type PayloadAttribute = {
  name: string
  value: string | number | null
}

type DocumentForPayload = {
  registeredPropertyName: string
  area: string
  documentType: string | null
  attributes: PayloadAttribute[]
}

/**
 * Sanitizes an identifier by removing non-digit characters.
 * @param id The identifier to sanitize.
 * @returns The sanitized identifier as a string.
 */
function sanitizeIdentifier(id: string | number | undefined | null): string {
  return String(id ?? '')
    .trim()
    .replace(/\D/g, '')
}

/**
 * Adapts mailing address data from the form to an array of payload attributes.
 * @param mailingAddress The mailing address object from the form.
 * @returns An array of attributes for the payload.
 */
function adaptMailingAddress(mailingAddress: any): PayloadAttribute[] {
  const addressMapping: Record<string, string> = {
    recipientName: 'mailing_address_recipient_name',
    addressStreet: 'mailing_address_street',
    number: 'mailing_address_number',
    neighborhood: 'mailing_address_neighborhood',
    zipCode: 'mailing_address_zip_code',
    state: 'mailing_address_state',
    city: 'mailing_address_city',
    additionalInformation: 'mailing_address_additional_info',
    email: 'mailing_address_email',
    telephone: 'mailing_address_telephone',
  }

  return Object.entries(addressMapping).map(([key, name]) => ({
    name,
    value: mailingAddress[key] ?? '',
  }))
}

/**
 * Adapts document data from the form to an array of payload attributes.
 * @param documents The documents list from the form.
 * @returns An array of documents and their attributes for the payload.
 */
function adaptDocumentsForPayload(documents: any): DocumentForPayload[] {
  const documentAttributesMapping: Record<string, string> = {
    propertyLandholding: 'holdingType',
    titleDeedLandDocument: 'deed',
    documentDate: 'documentDate',
    book: 'book',
    page: 'page',
    stateOfTheNotaryOffice: 'state_of_notary_office',
    cityOfTheNotaryOffice: 'city_of_notary_office',
    propertyCertification: 'property_certification',
    nationalRuralPropertyRegistrationNumber: 'national_rural_land_registration_number',
  }

  return documents.map((doc: any) => ({
    registeredPropertyName: doc.registeredPropertyName,
    area: doc.area,
    documentType: doc.documentType === '' ? null : doc.documentType.toUpperCase(),
    attributes: Object.entries(documentAttributesMapping).map(([key, name]) => ({
      name,
      value: doc[key] === '' ? null : (doc[key] ?? null),
    })),
  }))
}

/**
 * Adapta os dados do formulário e geoData para o payload da API.
 * @param formData Dados do formulário de registro de propriedade
 * @returns Payload para envio à API
 */
export function adaptFormDataToPayload(formData: FormData) {
  const { ruralProperties, landHoldersInformation, registrarDetails, propertyRights, mapData } =
    formData

  const attributes: PayloadAttribute[] = [
    ...adaptMailingAddress(ruralProperties.mailingAddress),
    {
      name: 'property_access_description',
      value: ruralProperties.propertyAccessDescription ?? '',
    },
  ]

  const documents = adaptDocumentsForPayload(propertyRights.propertyRightsData || [])

  const payload = {
    propertyName: ruralProperties.propertyName,
    stateDistrict: ruralProperties.state,
    municipality: ruralProperties.city,
    zipcode: ruralProperties.zipCode,
    locationZone: ruralProperties.locationZonenv?.toUpperCase() || '',
    attributes,
    owners: (landHoldersInformation.landHoldersData || []).map((holder) => ({
      identifier: sanitizeIdentifier(holder.id),
      name: holder.name,
      mothersName: holder.mothersName,
      dateOfBirth: holder.dateOfBirth,
      attributes: [{ name: 'landholderType', value: holder.legalPersonality }],
    })),
    registrar: {
      identifier: sanitizeIdentifier(registrarDetails.id),
      name: registrarDetails.name,
      mothersName: registrarDetails.mothersName,
      dateOfBirth: registrarDetails.dateOfBirth,
    },
    representative: registrarDetails.representative
      ? {
          identifier: sanitizeIdentifier(registrarDetails.representative.id),
          name: registrarDetails.representative.name,
          mothersName: registrarDetails.representative.mothersName,
          dateOfBirth: registrarDetails.representative.dateOfBirth,
        }
      : undefined,
    documents,
    mainArea: mapData.mainArea,
    subAreas: mapData.subAreas,
  }

  console.log('Payload:', payload)
  return payload
}
