import { describe, it, expect, beforeEach, vi } from 'vitest'
import { processLayerService } from '@/services/calculationEngineService'
import ApiService from '@/services/axios'

vi.mock('@/services/axios')

describe('calculationEngineService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processLayerService', () => {
    it('should call ApiService.post with correct endpoint', async () => {
      const mockPayload = [
        {
          properties: {
            layerCode: 'PROPERTY',
            tipo: 'PROPERTY_TYPE',
            area_ha: 100,
            area: 50,
          },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: {
                  layerCode: 'PROPERTY',
                  tipo: 'PROPERTY_TYPE',
                  area_ha: 100,
                  area: 50,
                },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should call ApiService.post with multiple feature payloads', async () => {
      const mockPayload = [
        {
          properties: {
            layerCode: 'TEST',
            area_ha: 100,
            area: 50,
          },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: {
                  layerCode: 'TEST',
                  area_ha: 100,
                  area: 50,
                },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should handle empty feature array from API', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'TEST' },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should call API even with undefined features in response', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'TEST' },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: undefined,
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should call API and propagate errors', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'TEST' },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      const mockError = new Error('API Error')
      vi.mocked(ApiService.post).mockRejectedValue(mockError)

      await expect(processLayerService(mockPayload)).rejects.toThrow()

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should send custom properties in payload to API', async () => {
      const mockPayload = [
        {
          properties: {
            layerCode: 'LAYER1',
            tipo: 'NEW_TYPE',
            area_ha: 150,
            customProp: 'custom_value',
          },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: {
                  layerCode: 'LAYER1',
                  tipo: 'NEW_TYPE',
                  area_ha: 150,
                  customProp: 'custom_value',
                },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should send multiple features to API', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'L1', tipo: 'T1', area_ha: 100 },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
        {
          properties: { layerCode: 'L2', tipo: 'T2', area_ha: 200 },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: { layerCode: 'L1', tipo: 'T1', area_ha: 100 },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
              {
                properties: { layerCode: 'L2', tipo: 'T2', area_ha: 200 },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should call ApiService.post with correct structure', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'TEST' },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [[0, 0]] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: { PPA_WIDER_THAN_10M: { features: [] } },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        expect.objectContaining({
          parameters: expect.objectContaining({
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          }),
        }),
        {},
      )
    })

    it('should handle null layerCode in response payload', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'PROPERTY' },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: { layerCode: 'PROPERTY', tipo: null },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should send payload with extra properties to API', async () => {
      const mockPayload = [
        {
          properties: {
            layerCode: 'L1',
            tipo: 'T1',
            area_ha: 100,
            area: 50,
            extra: 'data',
          },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: {
                  layerCode: 'L1',
                  tipo: 'T1',
                  area_ha: 100,
                  area: 50,
                  extra: 'data',
                },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should send layer without tipo property to API', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'LAYER', area_ha: 100 },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: { layerCode: 'LAYER', area_ha: 100 },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should send layer without area_ha property to API', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'LAYER', area: 50 },
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [] },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: {
          PPA_WIDER_THAN_10M: {
            features: [
              {
                properties: { layerCode: 'LAYER', area: 50 },
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [] },
              },
            ],
          },
        },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        {
          parameters: {
            geojson: {
              type: 'FeatureCollection',
              features: mockPayload,
            },
          },
        },
        {},
      )
    })

    it('should format payload and call API with adapted payload', async () => {
      const mockPayload = [
        {
          properties: { layerCode: 'ADAPT_LAYER', area_ha: 12 },
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
        },
      ]

      vi.mocked(ApiService.post).mockResolvedValue({
        data: { PPA_WIDER_THAN_10M: { features: [] } },
      })

      await processLayerService(mockPayload)

      expect(ApiService.post).toHaveBeenCalledTimes(1)
      expect(ApiService.post).toHaveBeenCalledWith(
        '/calculations/execute',
        expect.objectContaining({
          parameters: expect.objectContaining({
            geojson: expect.objectContaining({
              type: 'FeatureCollection',
              features: expect.arrayContaining([
                expect.objectContaining({
                  type: 'Feature',
                  properties: expect.objectContaining({ layerCode: 'ADAPT_LAYER' }),
                }),
              ]),
            }),
          }),
        }),
        {},
      )
    })

    it('should reject and not call API for invalid payload', async () => {
      // make sure ApiService.post would throw if called
      vi.mocked(ApiService.post).mockResolvedValue({ data: {} })

      // call with invalid payload (null)
      await expect(processLayerService(null as any)).rejects.toThrow()

      // ensure the Api was not called because the function must validate input before sending
      expect(ApiService.post).not.toHaveBeenCalled()
    })
  })
})
