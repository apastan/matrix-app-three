import { getPortfolioSymbolsAsString } from '@/features/portfolio/lib'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { PortfolioAsset } from '@/features/portfolio/types'

export function useSetPortfolioAssetsToLocalStorage(
  portfolioAssets: PortfolioAsset[]
) {
  const portfolioSymbolsWithQuantityAsString = getPortfolioSymbolsAsString(
    portfolioAssets,
    { withQuantity: true }
  )

  const isInitialRender = useRef(true)

  useEffect(() => {
    // Пропускаем первый рендер, поскольку нам нужно отлавливать только изменения portfolioSymbolsWithQuantityAsString
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    // Проверяем, есть ли данные для сохранения
    if (portfolioSymbolsWithQuantityAsString) {
      try {
        const portfolioData = portfolioAssets.map((a) => ({
          s: a.symbol,
          q: a.quantity,
        }))
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData))
        toast(`Сохранено в localStorage`)
      } catch (error) {
        console.error('Ошибка записи в localStorage:', error)
      }
    }
  }, [portfolioSymbolsWithQuantityAsString])
}
