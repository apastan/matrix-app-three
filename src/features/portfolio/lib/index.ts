import Decimal from 'decimal.js'
import {
  type AssetFieldsToUpdate,
  type PortfolioAsset,
  type PortfolioAssetCandidate,
} from '@/features/portfolio/types'

function updateAssetQuantityInPortfolio(
  portfolio: PortfolioAsset[],
  symbol: string,
  newQuantity: Decimal
): PortfolioAsset[] {
  const updatedPortfolio = portfolio.map((asset) => {
    if (asset.symbol === symbol) {
      return {
        ...asset,
        quantity: asset.quantity.add(newQuantity),
        totalValue: newQuantity.mul(asset.lastPrice), // totalValue = quantity * lastPrice
      }
    }
    return asset
  })

  // Пересчитываем веса всех активов
  return recalculatePortfolioWeights(updatedPortfolio)
}

function addAssetToPortfolio(
  portfolio: PortfolioAsset[],
  asset: PortfolioAssetCandidate
): PortfolioAsset[] {
  // Создаем новый актив для портфеля
  const newPortfolioAsset: PortfolioAsset = {
    title: asset.title,
    symbol: asset.symbol,
    lastPrice: asset.lastPrice,
    priceChangePercent: asset.priceChangePercent,
    quantity: asset.quantity,
    totalValue: asset.quantity.mul(asset.lastPrice), // totalValue = quantity * lastPrice
    weightInPortfolio: new Decimal(0), // Временное значение, пересчитаем позже
  }

  // Добавляем новый актив в портфель
  const updatedPortfolio = [...portfolio, newPortfolioAsset]

  // Пересчитываем веса всех активов
  return recalculatePortfolioWeights(updatedPortfolio)
}

function updateAssetPricesInPortfolio(
  portfolio: PortfolioAsset[],
  tickerData: Record<string, AssetFieldsToUpdate>
): PortfolioAsset[] {
  // Обновляем все активы
  const updatedPortfolio = portfolio.map((asset) => {
    const fields = tickerData[asset.symbol]
    if (fields) {
      const updatedLastPrice = fields.lastPrice
      return {
        ...asset,
        lastPrice: updatedLastPrice,
        priceChangePercent: fields.priceChangePercent,
        totalValue: asset.quantity.mul(updatedLastPrice),
      }
    }
    return asset
  })

  // Пересчитываем веса
  return recalculatePortfolioWeights(updatedPortfolio)
}

function recalculatePortfolioWeights(
  portfolio: PortfolioAsset[]
): PortfolioAsset[] {
  // Суммируем totalValue всех активов
  const totalPortfolioValue = portfolio.reduce(
    (acc, asset) => acc.add(asset.totalValue),
    new Decimal(0)
  )

  // Если портфель пустой или totalPortfolioValue = 0, возвращаем без изменений
  if (totalPortfolioValue.eq(0)) {
    return portfolio.map((asset) => ({
      ...asset,
      weightInPortfolio: new Decimal(0),
    }))
  }

  // Пересчитываем weightInPortfolio для каждого актива
  return portfolio.map((asset) => ({
    ...asset,
    weightInPortfolio: asset.totalValue.div(totalPortfolioValue).mul(100),
  }))
}

export {
  updateAssetQuantityInPortfolio,
  addAssetToPortfolio,
  updateAssetPricesInPortfolio,
  recalculatePortfolioWeights,
}
