import axios from 'axios'
import { TCurrency } from '@/app/api/currencies'

const instance = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
})

const currenciesAPI = {
  get24hr: () => {
    return instance.get<TCurrency>('/ticker/24hr')
  },
}

export { currenciesAPI }
