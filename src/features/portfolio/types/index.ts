import Decimal from 'decimal.js'
import { Asset24hrTicker } from '@/features/portfolio/api'

type PortfolioAsset = {
  title: string
  symbol: Asset24hrTicker['symbol']
  lastPrice: Decimal
  priceChangePercent: Asset24hrTicker['priceChangePercent']
  quantity: Decimal
  totalValue: Decimal
  weightInPortfolio: Decimal
}

type PortfolioAssetCandidate = Omit<PortfolioAsset, 'weightInPortfolio'>

type AssetFieldsToUpdate = {
  lastPrice: Decimal
  priceChangePercent: Asset24hrTicker['priceChangePercent']
}

export {
  type PortfolioAsset,
  type AssetFieldsToUpdate,
  type PortfolioAssetCandidate,
}
