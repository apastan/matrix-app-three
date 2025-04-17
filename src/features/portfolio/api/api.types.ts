type Asset24hrTicker = {
  askPrice: string
  askQty: string
  bidPrice: string
  bidQty: string
  closeTime: number
  count: number
  firstId: number
  highPrice: string
  lastId: number
  lastPrice: string
  lastQty: string
  lowPrice: string
  openPrice: string
  openTime: number
  prevClosePrice: string
  priceChange: string
  priceChangePercent: string
  quoteVolume: string
  symbol: string
  volume: string
  weightedAvgPrice: string
}

type ResponseGetAllAssets24hr = Asset24hrTicker[]

export { type Asset24hrTicker, type ResponseGetAllAssets24hr }
