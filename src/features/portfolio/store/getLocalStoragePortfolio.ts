import { PortfolioAssetLocalStorage } from '@/features/portfolio/types'
import { createTitleFromSymbol } from '@/features/portfolio/lib'

function getLocalStoragePortfolio() {
  try {
    const l = localStorage.getItem('portfolioData')
    if (l) {
      const data = JSON.parse(l) as PortfolioAssetLocalStorage[]

      if (data) {
        return data.map((a) => ({
          title: createTitleFromSymbol(a.s),
          symbol: a.s,
          quantity: a.q,
          lastPrice: '0',
          totalValue: '0',
          weightInPortfolio: '0',
          priceChangePercent: '0',
        }))
      }
    }
  } catch {
    console.log('Ошибка чтения данных о портфеле из local storage')
  }
}

export { getLocalStoragePortfolio }
