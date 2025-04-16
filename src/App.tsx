import { useEffect, useMemo, useState } from 'react'
import {
  FormattedDecimal,
  InfiniteLoader,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/'
import { Asset, assetsAPI, PortfolioAsset } from '@/app/api/assets/'
import { Container } from '@/components/layouts'
import { AddAssetToPortfolioDialog } from '@/add-asset-to-portfolio-dialog.tsx'
import { useBinanceWebSocket } from '@/useBinanceWebSocket.ts'
import { updateAssetPricesInPortfolio } from '@/utils'
import { Table, TableHead } from '@/components/ui/table.tsx'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const [assetsFullList, setAssetsFullList] = useState<Asset[]>([])
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([])

  console.log('portfolioAssets', portfolioAssets)

  // TODO remove later
  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const response = await assetsAPI.get24hr()

        const data = response.data
        const onlyUSDTAssets = data.filter(
          (asset) => asset.symbol.endsWith('USDT') && asset.count > 0
        )
        const assetsWithTitleField = onlyUSDTAssets.map((asset) => ({
          ...asset,
          title: asset.symbol.replace('USDT', ''),
        }))
        // TODO rewrite to loop
        // TODO remove unused fields
        setAssetsFullList(assetsWithTitleField)
      } catch (error) {
        console.log('error getting assets 24hr')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

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

  return (
    <>
      <header className={'pt-5 pb-5'}>
        <Container className={'flex justify-between items-center'}>
          <div>Portfolio Overview</div>

          <AddAssetToPortfolioDialog
            updateAssetsFullList={setAssetsFullList}
            updatePortfolioAssets={setPortfolioAssets}
            assetsFullList={assetsFullList}
            portfolioAssets={portfolioAssets}
            onOpenChange={(open) => {
              console.log(open)
            }}
          />
        </Container>
      </header>

      <main>
        <Container>
          {isLoading ? (
            <div
              className={
                'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40'
              }
            >
              <InfiniteLoader size={40} />
            </div>
          ) : portfolioAssets.length > 0 ? (
            <main>
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
                        <FormattedDecimal rounding={5}>
                          {a.quantity}
                        </FormattedDecimal>
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
            </main>
          ) : (
            <div
              className={
                'flex justify-center items-center min-h-[calc(100vh-76px)]'
              }
            >
              Нет активов в вашем портфеле. Добавьте что-нибудь, чтобы начать!
            </div>
          )}
        </Container>
      </main>
    </>
  )
}

export default App
