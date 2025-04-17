import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { PortfolioAsset } from '@/features/portfolio/types'
import { useBinanceWebSocket } from '@/features/portfolio/hooks'
import { updateAssetPricesInPortfolio } from '@/features/portfolio/lib'
import {
  FormattedDecimal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'

type Props = {
  portfolioAssets: PortfolioAsset[]
  setPortfolioAssets: Dispatch<SetStateAction<PortfolioAsset[]>>
}

function Portfolio({ portfolioAssets, setPortfolioAssets }: Props) {
  // Получаем символы из портфеля
  const symbols = useMemo(
    () => portfolioAssets.map((asset) => asset.symbol),
    [
      portfolioAssets
        .map((asset) => asset.symbol)
        .sort() // Сортируем, чтобы игнорировать порядок активов в портфеле
        .join(','),
    ]
  )
  console.log('symbols', symbols)
  // Используем хук для WebSocket
  const tickerData = useBinanceWebSocket(symbols)

  // Обновляем portfolioAssets при получении новых данных от WebSocket
  useEffect(() => {
    if (Object.keys(tickerData).length > 0) {
      setPortfolioAssets((portfolio) =>
        updateAssetPricesInPortfolio(portfolio, tickerData)
      )
    }
  }, [tickerData])

  return portfolioAssets.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Актив</TableHead>
          <TableHead>Количество</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead>Общая стоимость</TableHead>
          <TableHead>Изм. за 24 ч.</TableHead>
          <TableHead>% портфеля</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {portfolioAssets.map((a) => (
          <TableRow key={a.symbol}>
            <TableCell>{a.title}</TableCell>
            <TableCell>
              <FormattedDecimal rounding={5}>{a.quantity}</FormattedDecimal>
            </TableCell>
            <TableCell>
              <FormattedDecimal rounding={2} before={'$'}>
                {a.lastPrice}
              </FormattedDecimal>
            </TableCell>
            <TableCell>
              <FormattedDecimal rounding={2} before={'$'}>
                {a.totalValue}
              </FormattedDecimal>
            </TableCell>
            <TableCell>
              <FormattedDecimal
                rounding={2}
                withColors
                withPlusSign
                after={'%'}
              >
                {a.priceChangePercent}
              </FormattedDecimal>
            </TableCell>
            <TableCell>
              <FormattedDecimal rounding={2} after={'%'}>
                {a.weightInPortfolio}
              </FormattedDecimal>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div
      className={'flex justify-center items-center min-h-[calc(100vh-76px)]'}
    >
      Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
    </div>
  )
}

export { Portfolio }
