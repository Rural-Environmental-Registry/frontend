import type { FormData } from '@/context/FormContext.vue'

export function adaptApiDataToFormData(apiData: any): FormData {
  return {
    mapData: apiData.mapData || {},

    registrarDetails: {
      id: apiData.registrar?.identifier || '',
      dateOfBirth: apiData.registrar?.dateOfBirth || '',
      name: apiData.registrar?.name || '',
      mothersName: apiData.registrar?.mothersName || '',
      representative: apiData.representative
        ? {
            id: apiData.representative.identifier || '',
            dateOfBirth: apiData.representative.dateOfBirth || '',
            name: apiData.representative.name || '',
            mothersName: apiData.representative.mothersName || '',
          }
        : undefined,
    },

    landHoldersInformation: {
      landHoldersData:
        apiData.owners?.map((o: any) => ({
          id: o.identifier || '',
          dateOfBirth: o.dateOfBirth || '',
          name: o.name || '',
          mothersName: o.mothersName || '',
          legalPersonality:
            o.attributes?.find((attr: any) => attr.name === 'landholderType')?.value || '',
        })) || [],
    },

    ruralProperties: {
      propertyName: apiData.propertyName || '',
      state: apiData.stateDistrict || '',
      city: apiData.municipality || '',
      zipCode: apiData.zipcode || '',
      locationZonenv: (String(apiData.locationZone || 'rural').toLowerCase() as 'rural') || 'urban',
      propertyAccessDescription:
        apiData.attributes?.find((a: any) => a.name === 'property_access_description')?.value || '',
      mailingAddress: {
        recipientName:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_recipient_name')
            ?.value || '',
        addressStreet:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_street')?.value || '',
        number:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_number')?.value || '',
        additionalInformation:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_additional_info')
            ?.value || '',
        neighborhood:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_neighborhood')?.value ||
          '',
        zipCode:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_zip_code')?.value || '',
        state:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_state')?.value || '',
        city: apiData.attributes?.find((a: any) => a.name === 'mailing_address_city')?.value || '',
        email:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_email')?.value || '',
        telephone:
          apiData.attributes?.find((a: any) => a.name === 'mailing_address_telephone')?.value || '',
      },
    },

    propertyRights: {
      propertyRightsData:
        apiData.documents?.map((doc: any) => {
          return {
            propertyLandholding:
              doc.attributes?.find((a: any) => a.name === 'holdingType')?.value || '',
            registeredPropertyName: doc.registeredPropertyName || '',
            area: doc.area || 0,
            documentType: (doc.documentType || '').toLowerCase(),
            titleDeedLandDocument: doc.attributes?.find((a: any) => a.name === 'deed')?.value || '',
            documentDate: doc.attributes?.find((a: any) => a.name === 'documentDate')?.value || '',
            book: doc.attributes?.find((a: any) => a.name === 'book')?.value || '',
            page: doc.attributes?.find((a: any) => a.name === 'page')?.value || '',
            stateOfTheNotaryOffice:
              doc.attributes?.find((a: any) => a.name === 'state_of_notary_office')?.value || '',
            cityOfTheNotaryOffice:
              doc.attributes?.find((a: any) => a.name === 'city_of_notary_office')?.value || '',
            propertyCertification:
              doc.attributes?.find((a: any) => a.name === 'property_certification')?.value || '',
            nationalRuralPropertyRegistrationNumber:
              doc.attributes?.find((a: any) => a.name === 'national_rural_land_registration_number')
                ?.value || '',
          }
        }) || [],
    },
  }
}
