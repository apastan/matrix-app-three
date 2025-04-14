import Decimal from 'decimal.js'

type ResponseAsset = {
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

type Asset = ResponseAsset & { title: string }

type TrackedAsset = Asset & {
  quantity: Decimal
  totalValue: Decimal
  weightInPortfolio: Decimal
}

export { type ResponseAsset, type Asset, type TrackedAsset }
