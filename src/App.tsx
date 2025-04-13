import { Button } from '@/components/ui/button.tsx'

function App() {
  return (
    <>
      <div className="mx-auto w-full max-w-[1440px]">
        <header className={'flex justify-between'}>
          <div>Portfolio Overview</div>
          <Button>Добавить</Button>
        </header>
      </div>
      <div className="mx-auto w-full max-w-[1440px]">
        <main>Таблица</main>
      </div>
    </>
  )
}

export default App
