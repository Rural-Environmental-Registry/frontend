import { describe, it, expect } from 'vitest'
import { adaptApiDataToFormData } from '@/adapters/propertyFormAdapter'

describe('adaptApiDataToFormData', () => {
  it('should map all fields correctly from apiData', () => {
    const apiData = {
      mapData: { foo: 'bar' },
      registrar: {
        identifier: '1',
        dateOfBirth: '2000-01-01',
        name: 'John',
        mothersName: 'Jane',
      },
      representative: {
        identifier: '2',
        dateOfBirth: '1990-01-01',
        name: 'Rep',
        mothersName: 'RepMom',
      },
      owners: [
        {
          identifier: '3',
          dateOfBirth: '1980-01-01',
          name: 'Owner',
          mothersName: 'OwnerMom',
          attributes: [{ name: 'landholderType', value: 'legal_entity' }],
        },
      ],
      propertyName: 'Farm',
      stateDistrict: 'SP',
      municipality: 'City',
      zipcode: '12345-678',
      locationZone: 'urban',
      attributes: [
        { name: 'property_access_description', value: 'desc' },
        { name: 'mailing_address_recipient_name', value: 'rec' },
        { name: 'mailing_address_street', value: 'street' },
        { name: 'mailing_address_number', value: '10' },
        { name: 'mailing_address_additional_info', value: 'apt' },
        { name: 'mailing_address_neighborhood', value: 'neigh' },
        { name: 'mailing_address_zip_code', value: '99999-999' },
        { name: 'mailing_address_state', value: 'SP' },
        { name: 'mailing_address_city', value: 'City' },
        { name: 'mailing_address_email', value: 'mail@mail.com' },
        { name: 'mailing_address_telephone', value: '123456789' },
      ],
      documents: [
        {
          attributes: [
            { name: 'holdingType', value: 'proprietario' },
            { name: 'deed', value: 'escritura' },
            { name: 'documentDate', value: '2020-01-01' },
            { name: 'book', value: 'A' },
            { name: 'page', value: '1' },
            { name: 'state_of_notary_office', value: 'SP' },
            { name: 'city_of_notary_office', value: 'City' },
            { name: 'property_certification', value: 'cert' },
            { name: 'national_rural_land_registration_number', value: '123' },
          ],
          registeredPropertyName: 'Farm',
          area: 100,
          documentType: 'DEED',
        },
      ],
    }
    const result = adaptApiDataToFormData(apiData)
    expect(result.mapData).toEqual({ foo: 'bar' })
    expect(result.registrarDetails.id).toBe('1')
    expect(result.registrarDetails.representative?.id).toBe('2')
    expect(result.landHoldersInformation.landHoldersData[0].legalPersonality).toBe('legal_entity')
    expect(result.ruralProperties.propertyName).toBe('Farm')
    expect(result.ruralProperties.mailingAddress.recipientName).toBe('rec')
    expect(result.propertyRights.propertyRightsData[0].propertyLandholding).toBe('proprietario')
    expect(result.propertyRights.propertyRightsData[0].documentType).toBe('deed')
    expect(
      result.propertyRights.propertyRightsData[0].nationalRuralPropertyRegistrationNumber,
    ).toBe('123')
  })

  it('should handle missing optional fields gracefully', () => {
    const apiData = {}
    const result = adaptApiDataToFormData(apiData)
    expect(result.mapData).toEqual({})
    expect(result.registrarDetails.id).toBe('')
    expect(result.landHoldersInformation.landHoldersData).toEqual([])
    expect(result.ruralProperties.propertyName).toBe('')
    expect(result.ruralProperties.mailingAddress.recipientName).toBe('')
    expect(result.propertyRights.propertyRightsData).toEqual([])
  })
})
