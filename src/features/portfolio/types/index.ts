import Decimal from 'decimal.js'
import { Asset } from '@/features/portfolio/api'

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
  type PortfolioAsset,
  type AssetFieldsToUpdate,
  type PortfolioAssetCandidate,
}
