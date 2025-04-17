import axios from 'axios'
import { ResponseAsset } from '@/features/portfolio/api/index.ts'

const instance = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
})

const assetsAPI = {
  getAllAssets24hrData: () => {
    return instance.get<ResponseAsset[]>('/ticker/24hr')
  },
}

export { assetsAPI }
