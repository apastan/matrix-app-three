import { Asset24hrTicker } from '@/features/portfolio/api'

type PortfolioAsset = {
  title: string
  symbol: Asset24hrTicker['symbol']
  lastPrice: string
  priceChangePercent: Asset24hrTicker['priceChangePercent']
  quantity: string
  totalValue: string
  weightInPortfolio: string
}

type PortfolioAssetCandidate = Omit<PortfolioAsset, 'weightInPortfolio'>

type AssetFieldsToUpdate = {
  lastPrice: string
  priceChangePercent: Asset24hrTicker['priceChangePercent']
}

export {
  type PortfolioAsset,
  type AssetFieldsToUpdate,
  type PortfolioAssetCandidate,
}
