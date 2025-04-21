import { Container } from '@/components/layouts'
import { AddAssetToPortfolioDialog } from '@/features/portfolio/ui/'
import { Toaster } from '@/components/ui/sonner'
import { Portfolio } from '@/features/portfolio/ui/portfolio.tsx'
import { InfiniteLoader } from '@/components/ui'
import { useFakeLoading } from '@/hooks'

function App() {
  const { isLoading } = useFakeLoading(200)

  return (
    <>
      <Toaster />
      <header className={'pt-5 pb-5'}>
        <Container className={'flex justify-between items-center'}>
          <div>Portfolio Overview</div>

          <AddAssetToPortfolioDialog />
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
            <Portfolio />
          )}
        </Container>
      </main>
    </>
  )
}

export default App
