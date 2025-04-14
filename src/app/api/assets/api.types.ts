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

type PortfolioAsset = {
  title: Asset['title']
  symbol: Asset['symbol']
  lastPrice: Decimal
  priceChangePercent: Asset['priceChangePercent']
  quantity: Decimal
  totalValue: Decimal
  weightInPortfolio: Decimal
}

type PortfolioAssetCandidate = Omit<PortfolioAsset, 'weightInPortfolio'>

type AssetFieldsToUpdate = {
  lastPrice: Decimal
  priceChangePercent: Asset['priceChangePercent']
}

export {
  type ResponseAsset,
  type Asset,
  type PortfolioAsset,
  type AssetFieldsToUpdate,
  type PortfolioAssetCandidate,
}
