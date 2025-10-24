import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ApiService from '@/services/axios.ts'

describe('ApiService', () => {
  let mockAxios: MockAdapter

  beforeEach(() => {
    mockAxios = new MockAdapter(ApiService['axiosInstance'], { delayResponse: 0 })
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('constructor', () => {
    it('should initialize axios instance with correct baseURL and headers', () => {
      const service = ApiService

      expect(service['axiosInstance'].defaults.baseURL).toBe(import.meta.env.VITE_DPG_URL)
    })
  })

  describe('get', () => {
    it('should make a GET request and return data', async () => {
      const testData = { id: 1, name: 'Test' }
      const endpoint = '/test-endpoint'

      mockAxios.onGet(endpoint).reply(200, testData)

      const result = await ApiService.get(endpoint)

      expect(result).toEqual(testData)
    })

    it('should include params in GET request', async () => {
      const testData = { id: 1, name: 'Test' }
      const endpoint = '/test-endpoint'
      const params = { page: 1, limit: 10 }

      mockAxios.onGet(endpoint, { params }).reply(200, testData)

      const result = await ApiService.get(endpoint, params)

      expect(result).toEqual(testData)
    })

    it('should handle GET request errors', async () => {
      const endpoint = '/test-endpoint'
      const errorMessage = 'Network Error'

      mockAxios.onGet(endpoint).networkError()

      try {
        await ApiService.get(endpoint)
        expect.fail('Expected error to be thrown')
      } catch (error) {
        expect(error.message).toBe(errorMessage)
        expect(error).toBeDefined()
      }
    })
  })

  describe('post', () => {
    it('should make a POST request with data and return response', async () => {
      const testData = { name: 'Test' }
      const responseData = { id: 1, name: 'Test' }
      const endpoint = '/test-endpoint'

      mockAxios.onPost(endpoint, testData).reply(200, responseData)

      const result = await ApiService.post(endpoint, testData)

      expect(result.data).toEqual(responseData)
    })

    it('should handle POST request errors', async () => {
      const endpoint = '/test-endpoint'
      const postData = { name: 'Test' }
      const errorMessage = 'Request failed with status code 400'

      mockAxios.onPost(endpoint, postData).reply(400, { error: 'Bad Request' })

      try {
        await ApiService.post(endpoint, postData)
        expect.fail('Expected error to be thrown')
      } catch (error) {
        expect(error.message).toBe(errorMessage)
        expect(error.response.status).toBe(400)
        expect(error.response.data.error).toBe('Bad Request')
      }
    })
  })

  // describe('handleError', () => {
  //   it('should log and rethrow errors', async () => {
  //     const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

  //     try {
  //       ApiService['handleError'](new Error('Test Error'));
  //       expect.fail('Expected error to be thrown');
  //     } catch (error) {
  //       expect(error.message).toBe('Test Error');
  //       expect(console.error).toHaveBeenCalledWith(
  //         'API call error:',
  //         expect.objectContaining({ message: 'Test Error' })
  //       );
  //     }

  //     consoleSpy.mockRestore();
  //   });
  // });
})
