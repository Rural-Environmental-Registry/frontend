import { describe, it, expect } from 'vitest'
import { formatNumberWithCommas, latLonToDMS } from '../../../src/utils/generalUtils'

describe('generalUtils', () => {
  describe('formatNumberWithCommas', () => {
    it('should format number with commas for US locale', () => {
      const result = formatNumberWithCommas(1234567.89, 'en-US')
      expect(result).toBe('1,234,567.89')
    })

    it('should format number with commas for Brazilian locale', () => {
      const result = formatNumberWithCommas(1234567.89, 'pt-BR')
      expect(result).toBe('1.234.567,89')
    })

    it('should format integer numbers', () => {
      const result = formatNumberWithCommas(1000000, 'en-US')
      expect(result).toBe('1,000,000')
    })

    it('should format small numbers', () => {
      const result = formatNumberWithCommas(123.45, 'en-US')
      expect(result).toBe('123.45')
    })

    it('should format zero', () => {
      const result = formatNumberWithCommas(0, 'en-US')
      expect(result).toBe('0')
    })
  })

  describe('latLonToDMS', () => {
    it('should convert positive latitude and longitude to DMS', () => {
      const result = latLonToDMS(40.7128, -74.006)

      expect(result.lat).toContain('N')
      expect(result.lon).toContain('W')
      expect(result.lat).toContain('°')
      expect(result.lon).toContain('°')
    })

    it('should convert negative latitude and longitude to DMS', () => {
      const result = latLonToDMS(-23.5505, -46.6333)

      expect(result.lat).toContain('S')
      expect(result.lon).toContain('W')
      expect(result.lat).toContain('°')
      expect(result.lon).toContain('°')
    })

    it('should handle zero coordinates', () => {
      const result = latLonToDMS(0, 0)

      expect(result.lat).toContain('N')
      expect(result.lon).toContain('E')
    })

    it('should handle decimal coordinates', () => {
      const result = latLonToDMS(51.5074, -0.1278)

      expect(result.lat).toContain('N')
      expect(result.lon).toContain('W')
      expect(typeof result.lat).toBe('string')
      expect(typeof result.lon).toBe('string')
    })
  })
})
