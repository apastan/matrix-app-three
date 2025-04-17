import { useEffect } from 'react'
import { useBinanceWebSocket } from '@/features/portfolio/hooks'
import {
  FormattedDecimal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/app/types.ts'
import { updateAssetPrices } from '@/features/portfolio/store'
import { getPortfolioSymbolsAsString } from '@/features/portfolio/lib'

function Portfolio() {
  const dispatch = useAppDispatch()
  const portfolioAssets = useAppSelector((state) => state.portfolio)

  // Получаем символы из портфеля вида
  const PortfolioSymbolsAsString = getPortfolioSymbolsAsString(portfolioAssets)

  const tickerData = useBinanceWebSocket(PortfolioSymbolsAsString)

  // Обновляем portfolioAssets при получении новых данных от WebSocket
  useEffect(() => {
    if (Object.keys(tickerData).length > 0) {
      dispatch(updateAssetPrices(tickerData))
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
