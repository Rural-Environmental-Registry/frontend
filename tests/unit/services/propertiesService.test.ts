import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ApiService from '@/services/axios'
import axios from '@/services/axios'
import {
  fetchProperties,
  getPropertyRegisterData,
  fetchPropertyDetails,
  fetchPropertyImage,
  fetchReceipt,
  buildFormData,
} from '@/services/propertiesService'
import { adaptPropertyResponse } from '@/adapters/propertyAdapter'
import { adaptPropertyForRegister } from '@/adapters/propertyRegisterAdapter'
import { adaptFormDataToPayload } from '@/adapters/propertyPayloadAdapter'

vi.mock('@/services/axios')
vi.mock('@/adapters/propertyAdapter')
vi.mock('@/adapters/propertyRegisterAdapter')
vi.mock('@/adapters/propertyPayloadAdapter')

describe('propertiesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchProperties', () => {
    it('should fetch properties and adapt them', async () => {
      const mockResponse = {
        properties: [{ id: 1, stateDistrict: 'test state', municipality: 'test_city' }],
        page: 0,
        size: 7,
        totalElements: 1,
        totalPages: 1,
        hasnext: false,
      }
      vi.mocked(ApiService.get).mockResolvedValue(mockResponse)
      sessionStorage.setItem('sub', '123')

      const result = await fetchProperties(0, 7, { query: 'test' })

      expect(ApiService.get).toHaveBeenCalledWith('/properties', {
        page: 0,
        size: 7,
        sub: '123',
        sort: 'createdAt,desc',
        query: 'test',
      })
      expect(result.properties[0].imageUrl).toBe('/properties/1/image')
      expect(result.properties[0].state).toBe('TEST STATE')
      expect(result.properties[0].city).toBe('Test City')
    })

    it('should throw an error if the API call fails', async () => {
      vi.mocked(ApiService.get).mockRejectedValue(new Error('API Error'))
      await expect(fetchProperties()).rejects.toThrow('API Error')
    })
  })

  describe('getPropertyRegisterData', () => {
    it('should fetch and adapt property register data', async () => {
      const mockData = { id: 1 }
      vi.mocked(ApiService.get).mockResolvedValue(mockData)
      vi.mocked(adaptPropertyForRegister).mockReturnValue({ adapted: true } as any)

      const result = await getPropertyRegisterData('1')

      expect(ApiService.get).toHaveBeenCalledWith('/properties/1')
      expect(adaptPropertyForRegister).toHaveBeenCalledWith(mockData, expect.any(Object))
      expect(result).toEqual({ adapted: true })
    })
  })

  describe('fetchPropertyDetails', () => {
    it('should fetch and adapt property details', async () => {
      const mockData = { id: 1 }
      vi.mocked(ApiService.get).mockResolvedValue(mockData)
      vi.mocked(adaptPropertyResponse).mockReturnValue({ adapted: true } as any)

      const result = await fetchPropertyDetails('1')

      expect(ApiService.get).toHaveBeenCalledWith('/properties/1')
      expect(adaptPropertyResponse).toHaveBeenCalledWith(mockData)
      expect(result).toEqual({ adapted: true })
    })
  })

  describe('fetchPropertyImage', () => {
    it('should fetch a property image and create an object URL', async () => {
      const mockBlob = new Blob()
      vi.mocked(axios.fetchImage).mockResolvedValue(mockBlob)

      const result = await fetchPropertyImage('1')

      expect(axios.fetchImage).toHaveBeenCalledWith('/properties/1/image')
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(result).toBe('mock-url')
    })
  })

  describe('fetchReceipt', () => {
    it('should fetch a receipt and trigger a download', async () => {
      const mockArrayBuffer = new TextEncoder().encode('pdf-content').buffer
      const mockResponse = {
        arrayBuffer: async () => mockArrayBuffer,
      }
      global.fetch = vi.fn().mockResolvedValue(mockResponse as any)

      const link = { href: '', target: '', click: vi.fn(), download: '' }
      document.createElement = vi.fn().mockReturnValue(link as any)
      document.body.appendChild = vi.fn()
      document.body.removeChild = vi.fn()
      vi.useFakeTimers()

      await fetchReceipt('1')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/properties/1/receipt'),
        expect.any(Object),
      )

      // Wait for promises to resolve
      await new Promise(process.nextTick)

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
      expect(link.href).toBe('mock-url')
      expect(link.target).toBe('_blank')
      expect(document.body.appendChild).toHaveBeenCalledWith(link)
      expect(link.click).toHaveBeenCalled()
      expect(document.body.removeChild).toHaveBeenCalledWith(link)

      vi.advanceTimersByTime(15000)
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')

      vi.useRealTimers()
    })
  })

  describe('buildFormData', () => {
    it('should build FormData with property data and map image', () => {
      const formdata = { name: 'test' }
      const adaptedData = { adaptedName: 'test' }
      vi.mocked(adaptFormDataToPayload).mockReturnValue(adaptedData)
      const mapImage = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' }
      sessionStorage.setItem('mapCaptured', JSON.stringify(mapImage))

      const result = buildFormData(formdata)

      expect(adaptFormDataToPayload).toHaveBeenCalledWith(formdata)
      expect(result.get('property')).toBeInstanceOf(Blob)
      expect(result.get('mapImage')).toBeInstanceOf(Blob)
    })

    it('should build FormData without map image if not present', () => {
      const formdata = { name: 'test' }
      const adaptedData = { adaptedName: 'test' }
      vi.mocked(adaptFormDataToPayload).mockReturnValue(adaptedData)

      const result = buildFormData(formdata)

      expect(result.get('mapImage')).toBeNull()
    })

    it('should handle errors in map image processing', () => {
      const formdata = { name: 'test' }
      vi.mocked(adaptFormDataToPayload).mockReturnValue({ adaptedName: 'test' })
      sessionStorage.setItem('mapCaptured', 'invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = buildFormData(formdata)

      expect(result.get('mapImage')).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Erro processando imagem do mapa:', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })
})
