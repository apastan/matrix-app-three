import { Asset24hrTicker } from '@/features/portfolio/api'

type PortfolioAsset = {
  title: string
  symbol: Asset24hrTicker['symbol']
  quantity: string
  lastPrice: string
  priceChangePercent: Asset24hrTicker['priceChangePercent']
  totalValue: string
  weightInPortfolio: string
}

type PortfolioAssetCandidate = Omit<PortfolioAsset, 'weightInPortfolio'>

type AssetFieldsToUpdate = {
  lastPrice: string
  priceChangePercent: Asset24hrTicker['priceChangePercent']
}

type PortfolioAssetLocalStorage = {
  q: string
  s: string
}

export {
  type PortfolioAsset,
  type AssetFieldsToUpdate,
  type PortfolioAssetCandidate,
  type PortfolioAssetLocalStorage,
}
