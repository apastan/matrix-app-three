import axios from 'axios'
import { ResponseAsset } from 'src/app/api/assets'

const instance = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
})

const assetsAPI = {
  get24hr: () => {
    return instance.get<ResponseAsset[]>('/ticker/24hr')
  },
}

export { assetsAPI }
