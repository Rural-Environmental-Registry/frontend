import { describe, it, expect } from 'vitest'
import type { PropertyRightsData, PropertyRights } from '../../src/context/PropertyRights'

describe('PropertyRights', () => {
  it('should define PropertyRightsData type correctly', () => {
    const propertyRightsData: PropertyRightsData = {
      propertyLandholding: 'property',
      registeredPropertyName: 'Farm ABC',
      area: '100.5',
      documentType: 'DEED',
      titleDeedLandDocument: 'DOC123',
      documentDate: '2023-01-15',
      book: 'Book A',
      page: 'Page 1',
      stateOfTheNotaryOffice: 'SP',
      cityOfTheNotaryOffice: 'São Paulo',
      propertyCertification: 'CERT123',
      nationalRuralPropertyRegistrationNumber: 'REG456',
    }

    expect(propertyRightsData.propertyLandholding).toBe('property')
    expect(propertyRightsData.registeredPropertyName).toBe('Farm ABC')
    expect(propertyRightsData.area).toBe('100.5')
    expect(propertyRightsData.documentType).toBe('DEED')
    expect(propertyRightsData.titleDeedLandDocument).toBe('DOC123')
    expect(propertyRightsData.documentDate).toBe('2023-01-15')
    expect(propertyRightsData.book).toBe('Book A')
    expect(propertyRightsData.page).toBe('Page 1')
    expect(propertyRightsData.stateOfTheNotaryOffice).toBe('SP')
    expect(propertyRightsData.cityOfTheNotaryOffice).toBe('São Paulo')
    expect(propertyRightsData.propertyCertification).toBe('CERT123')
    expect(propertyRightsData.nationalRuralPropertyRegistrationNumber).toBe('REG456')
  })

  it('should define PropertyRightsData with landholding', () => {
    const propertyRightsData: PropertyRightsData = {
      propertyLandholding: 'landholding',
      registeredPropertyName: 'Land XYZ',
      area: '200.0',
      documentType: 'CONTRACT',
      titleDeedLandDocument: 'DOC789',
      documentDate: '2023-06-20',
      book: 'Book B',
      page: 'Page 2',
      stateOfTheNotaryOffice: 'RJ',
      cityOfTheNotaryOffice: 'Rio de Janeiro',
      propertyCertification: 'CERT789',
      nationalRuralPropertyRegistrationNumber: 'REG789',
    }

    expect(propertyRightsData.propertyLandholding).toBe('landholding')
    expect(propertyRightsData.registeredPropertyName).toBe('Land XYZ')
  })

  it('should define PropertyRights type correctly', () => {
    const propertyRights: PropertyRights = {
      propertyRightsData: [
        {
          propertyLandholding: 'property',
          registeredPropertyName: 'Farm ABC',
          area: '100.5',
          documentType: 'DEED',
          titleDeedLandDocument: 'DOC123',
          documentDate: '2023-01-15',
          book: 'Book A',
          page: 'Page 1',
          stateOfTheNotaryOffice: 'SP',
          cityOfTheNotaryOffice: 'São Paulo',
          propertyCertification: 'CERT123',
          nationalRuralPropertyRegistrationNumber: 'REG456',
        },
      ],
    }

    expect(propertyRights.propertyRightsData).toBeDefined()
    expect(propertyRights.propertyRightsData).toHaveLength(1)
    expect(propertyRights.propertyRightsData![0].registeredPropertyName).toBe('Farm ABC')
  })

  it('should handle null propertyRightsData', () => {
    const propertyRights: PropertyRights = {
      propertyRightsData: null,
    }

    expect(propertyRights.propertyRightsData).toBeNull()
  })

  it('should handle empty propertyRightsData array', () => {
    const propertyRights: PropertyRights = {
      propertyRightsData: [],
    }

    expect(propertyRights.propertyRightsData).toBeDefined()
    expect(propertyRights.propertyRightsData).toHaveLength(0)
  })

  it('should handle multiple property rights', () => {
    const propertyRights: PropertyRights = {
      propertyRightsData: [
        {
          propertyLandholding: 'property',
          registeredPropertyName: 'Farm 1',
          area: '100.5',
          documentType: 'DEED',
          titleDeedLandDocument: 'DOC123',
          documentDate: '2023-01-15',
          book: 'Book A',
          page: 'Page 1',
          stateOfTheNotaryOffice: 'SP',
          cityOfTheNotaryOffice: 'São Paulo',
          propertyCertification: 'CERT123',
          nationalRuralPropertyRegistrationNumber: 'REG456',
        },
        {
          propertyLandholding: 'landholding',
          registeredPropertyName: 'Land 2',
          area: '200.0',
          documentType: 'CONTRACT',
          titleDeedLandDocument: 'DOC789',
          documentDate: '2023-06-20',
          book: 'Book B',
          page: 'Page 2',
          stateOfTheNotaryOffice: 'RJ',
          cityOfTheNotaryOffice: 'Rio de Janeiro',
          propertyCertification: 'CERT789',
          nationalRuralPropertyRegistrationNumber: 'REG789',
        },
      ],
    }

    expect(propertyRights.propertyRightsData).toHaveLength(2)
    expect(propertyRights.propertyRightsData![0].propertyLandholding).toBe('property')
    expect(propertyRights.propertyRightsData![1].propertyLandholding).toBe('landholding')
  })
})
