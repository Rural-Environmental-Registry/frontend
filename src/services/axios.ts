import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_DPG_URL,
    })
  }

  public async get(endpoint: string, params?: any): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(endpoint, { params })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  public fetchImage = async (imageUrl: string): Promise<Blob> => {
    try {
      return this.axiosInstance(imageUrl, { responseType: 'arraybuffer' }).then((response) => {
        const blob = new Blob([response.data], { type: 'image/png' })
        return blob
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async post(endpoint: string, data: any, configs: any): Promise<any> {
    try {
      return await this.axiosInstance.post(endpoint, data, configs)
    } catch (error) {
      this.handleError(error)
    }
  }

  public async put(endpoint: string, data: any, configs: any): Promise<any> {
    try {
      return await this.axiosInstance.put(endpoint, data, configs)
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any): void {
    console.error('API call error (ApiService):', error)
    throw error
  }
}

export const carDpgApiService = new ApiService()

const VITE_CALCULATION_ENGINE_BASE_URL = import.meta.env.VITE_CALCULATION_ENGINE_BASE_URL

if (!VITE_CALCULATION_ENGINE_BASE_URL) {
  console.warn(
    'VITE_CALCULATION_ENGINE_BASE_URL não está definido no arquivo .env. ' +
      'Por favor, adicione-o para permitir a comunicação com o Motor de Cálculo. ' +
      'Ex: VITE_CALCULATION_ENGINE_BASE_URL=http://localhost:8080',
  )
}

export const calculationEngineApi = axios.create({
  baseURL: VITE_CALCULATION_ENGINE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default carDpgApiService
