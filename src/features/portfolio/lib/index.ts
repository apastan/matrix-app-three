import { PortfolioAsset } from '@/features/portfolio/types'
import Decimal from 'decimal.js'

function createTitleFromSymbol(symbol: string) {
  return symbol.replace('USDT', '')
}

// Вспомогательная функция для пересчета весов
function recalculatePortfolioWeights(
  portfolio: PortfolioAsset[]
): PortfolioAsset[] {
  // Суммируем totalValue всех активов
  const totalPortfolioValue = portfolio.reduce(
    (acc, asset) => acc.add(new Decimal(asset.totalValue)),
    new Decimal(0)
  )

  // Если портфель пустой или totalPortfolioValue = 0, возвращаем без изменений
  if (totalPortfolioValue.eq(0)) {
    return portfolio.map((asset) => ({
      ...asset,
      weightInPortfolio: '0',
    }))
  }

  // Пересчитываем weightInPortfolio для каждого актива
  return portfolio.map((asset) => ({
    ...asset,
    weightInPortfolio: new Decimal(asset.totalValue)
      .div(totalPortfolioValue)
      .mul(100)
      .toString(),
  }))
}

function getPortfolioSymbolsAsString(portfolioAssets: PortfolioAsset[]) {
  return portfolioAssets
    .map((asset) => asset.symbol)
    .sort() // Сортируем, чтобы игнорировать порядок активов в портфеле
    .join(',')
}

export {
  createTitleFromSymbol,
  recalculatePortfolioWeights,
  getPortfolioSymbolsAsString,
}
