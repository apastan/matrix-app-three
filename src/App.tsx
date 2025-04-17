import { useEffect, useState } from 'react'
import { Container } from '@/components/layouts'
import { AddAssetToPortfolioDialog } from '@/features/portfolio/ui/'
import { Asset, assetsAPI } from '@/features/portfolio/api'
import { PortfolioAsset } from '@/features/portfolio/types'
import { Portfolio } from '@/features/portfolio/ui/portfolio.tsx'
import { InfiniteLoader } from '@/components/ui'

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
        const response = await assetsAPI.getAllAssets24hrData()

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

  return (
    <>
      <header className={'pt-5 pb-5'}>
        <Container className={'flex justify-between items-center'}>
          <div>Portfolio Overview</div>

          <AddAssetToPortfolioDialog
            setAssetsFullList={setAssetsFullList}
            setPortfolioAssets={setPortfolioAssets}
            assetsFullList={assetsFullList}
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
          ) : (
            <Portfolio
              setPortfolioAssets={setPortfolioAssets}
              portfolioAssets={portfolioAssets}
            />
          )}
        </Container>
      </main>
    </>
  )
}

export default App
