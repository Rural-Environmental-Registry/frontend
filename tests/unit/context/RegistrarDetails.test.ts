import { describe, it, expect } from 'vitest'
import type {
  BaseDetails,
  RegistrarDetails,
  RepresentativeDetails,
} from '../../src/context/RegistrarDetails'

describe('RegistrarDetails', () => {
  it('should define BaseDetails type correctly', () => {
    const baseDetails: BaseDetails = {
      id: '123456789',
      dateOfBirth: '1980-01-01',
      name: 'John Registrar',
      mothersName: 'Jane Registrar',
    }

    expect(baseDetails.id).toBe('123456789')
    expect(baseDetails.dateOfBirth).toBe('1980-01-01')
    expect(baseDetails.name).toBe('John Registrar')
    expect(baseDetails.mothersName).toBe('Jane Registrar')
  })

  it('should define RepresentativeDetails type correctly', () => {
    const representativeDetails: RepresentativeDetails = {
      id: '987654321',
      dateOfBirth: '1975-05-15',
      name: 'Jane Representative',
      mothersName: 'Mary Representative',
    }

    expect(representativeDetails.id).toBe('987654321')
    expect(representativeDetails.dateOfBirth).toBe('1975-05-15')
    expect(representativeDetails.name).toBe('Jane Representative')
    expect(representativeDetails.mothersName).toBe('Mary Representative')
  })

  it('should define RegistrarDetails without representative', () => {
    const registrarDetails: RegistrarDetails = {
      id: '111222333',
      dateOfBirth: '1985-03-10',
      name: 'Bob Registrar',
      mothersName: 'Alice Registrar',
    }

    expect(registrarDetails.id).toBe('111222333')
    expect(registrarDetails.dateOfBirth).toBe('1985-03-10')
    expect(registrarDetails.name).toBe('Bob Registrar')
    expect(registrarDetails.mothersName).toBe('Alice Registrar')
    expect(registrarDetails.representative).toBeUndefined()
  })

  it('should define RegistrarDetails with representative', () => {
    const representative: RepresentativeDetails = {
      id: '444555666',
      dateOfBirth: '1990-07-20',
      name: 'Rep Name',
      mothersName: 'Rep Mother',
    }

    const registrarDetails: RegistrarDetails = {
      id: '777888999',
      dateOfBirth: '1982-12-05',
      name: 'Main Registrar',
      mothersName: 'Main Mother',
      representative,
    }

    expect(registrarDetails.id).toBe('777888999')
    expect(registrarDetails.representative).toBeDefined()
    expect(registrarDetails.representative!.id).toBe('444555666')
    expect(registrarDetails.representative!.name).toBe('Rep Name')
  })

  it('should handle RegistrarDetails with undefined representative', () => {
    const registrarDetails: RegistrarDetails = {
      id: '111222333',
      dateOfBirth: '1985-03-10',
      name: 'Bob Registrar',
      mothersName: 'Alice Registrar',
      representative: undefined,
    }

    expect(registrarDetails.representative).toBeUndefined()
  })

  it('should handle multiple registrar details', () => {
    const registrar1: RegistrarDetails = {
      id: '111111111',
      dateOfBirth: '1980-01-01',
      name: 'Registrar 1',
      mothersName: 'Mother 1',
    }

    const registrar2: RegistrarDetails = {
      id: '222222222',
      dateOfBirth: '1990-01-01',
      name: 'Registrar 2',
      mothersName: 'Mother 2',
      representative: {
        id: '333333333',
        dateOfBirth: '1995-01-01',
        name: 'Rep 2',
        mothersName: 'Rep Mother 2',
      },
    }

    expect(registrar1.representative).toBeUndefined()
    expect(registrar2.representative).toBeDefined()
    expect(registrar2.representative!.id).toBe('333333333')
  })
})
