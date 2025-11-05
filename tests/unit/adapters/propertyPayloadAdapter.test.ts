import { describe, it, expect } from 'vitest'
import { adaptFormDataToPayload } from '@/adapters/propertyPayloadAdapter'

describe('adaptFormDataToPayload', () => {
  it('should adapt all form fields to payload correctly', () => {
    const formData: any = {
      ruralProperties: {
        propertyName: 'Farm',
        state: 'SP',
        city: 'City',
        zipCode: '12345-678',
        locationZonenv: 'rural',
        propertyAccessDescription: 'desc',
        mailingAddress: {
          recipientName: 'rec',
          addressStreet: 'street',
          number: '10',
          neighborhood: 'neigh',
          zipCode: '99999-999',
          state: 'SP',
          city: 'City',
          additionalInformation: 'apt',
          email: 'mail@mail.com',
          telephone: '123456789',
        },
      },
      landHoldersInformation: {
        landHoldersData: [
          {
            id: '123.456.789-00',
            name: 'Owner',
            mothersName: 'OwnerMom',
            dateOfBirth: '1980-01-01',
            legalPersonality: 'legal_entity',
          },
        ],
      },
      registrarDetails: {
        id: '987.654.321-00',
        name: 'Registrar',
        mothersName: 'RegistrarMom',
        dateOfBirth: '1970-01-01',
        representative: {
          id: '111.222.333-44',
          name: 'Rep',
          mothersName: 'RepMom',
          dateOfBirth: '1990-01-01',
        },
      },
      propertyRights: {
        propertyRightsData: [
          {
            registeredPropertyName: 'Farm',
            area: '100',
            documentType: 'deed',
            propertyLandholding: 'proprietario',
            titleDeedLandDocument: 'escritura',
            documentDate: '2020-01-01',
            book: 'A',
            page: '1',
            stateOfTheNotaryOffice: 'SP',
            cityOfTheNotaryOffice: 'City',
            propertyCertification: 'cert',
            nationalRuralPropertyRegistrationNumber: '123',
          },
        ],
      },
      mapData: {
        mainArea: { geometry: [1, 2, 3] },
        subAreas: [{ geometry: [4, 5, 6] }],
      },
    }
    const payload = adaptFormDataToPayload(formData)
    expect(payload.propertyName).toBe('Farm')
    expect(payload.stateDistrict).toBe('SP')
    expect(payload.municipality).toBe('City')
    expect(payload.zipcode).toBe('12345-678')
    expect(payload.locationZone).toBe('RURAL')
    expect(payload.attributes.find((a: any) => a.name === 'mailing_address_street').value).toBe(
      'street',
    )
    expect(payload.owners[0].identifier).toBe('12345678900')
    expect(payload.registrar.identifier).toBe('98765432100')
    expect(payload.representative.identifier).toBe('11122233344')
    expect(payload.documents[0].documentType).toBe('DEED')
    expect(payload.mainArea.geometry).toEqual([1, 2, 3])
    expect(payload.subAreas[0].geometry).toEqual([4, 5, 6])
  })

  it('should handle missing optional fields gracefully', () => {
    const formData: any = {
      ruralProperties: { mailingAddress: {} },
      landHoldersInformation: {},
      registrarDetails: {},
      propertyRights: {},
      mapData: {},
    }
    const payload = adaptFormDataToPayload(formData)
    expect(payload.propertyName).toBeUndefined()
    expect(payload.stateDistrict).toBeUndefined()
    expect(payload.owners).toEqual([])
    expect(payload.registrar.identifier).toBe('')
    expect(payload.documents).toEqual([])
    expect(payload.mainArea).toBeUndefined()
    expect(payload.subAreas).toBeUndefined()
  })
})
