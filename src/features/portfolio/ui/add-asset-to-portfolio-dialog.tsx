import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormattedDecimal,
  InfiniteLoader,
  Input,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui'
import { Label } from '@radix-ui/react-label'
import {
  ChangeEvent,
  ComponentProps,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from 'react'
import Decimal from 'decimal.js'
import {
  addAssetToPortfolio,
  updateAssetQuantityInPortfolio,
} from '@/features/portfolio/lib'
import { Asset, assetsAPI } from '@/features/portfolio/api'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  PortfolioAsset,
  PortfolioAssetCandidate,
} from '@/features/portfolio/types'

type Props = {
  assetsFullList: Asset[]
  setAssetsFullList: Dispatch<SetStateAction<Asset[]>>
  setPortfolioAssets: Dispatch<SetStateAction<PortfolioAsset[]>>
} & ComponentProps<typeof Dialog>

export function AddAssetToPortfolioDialog({
  assetsFullList,
  setAssetsFullList,
  setPortfolioAssets,
  onOpenChange,
  ...restDialogProps
}: Props) {
  const [isLoading, setIsLoading] = useState(true)

  const [searchValue, setSearchValue] = useState('')
  const searchRegex = new RegExp(searchValue, 'i')
  const filteredAssetsFullList = assetsFullList.filter((str) =>
    searchRegex.test(str.symbol)
  )

  const scrollRef = useRef(null)
  const rowVirtualizer = useVirtualizer({
    count: filteredAssetsFullList.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 37,
    overscan: 5,
  })

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const assetQuantityInputRef = useRef<HTMLInputElement>(null)
  const isAssetQuantityValid = useRef<boolean>(false)
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null)

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleAssetQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const decimal = new Decimal(parseFloat(e.target.value))
    const num = decimal.toNumber()
    const isValid = Number.isInteger(num) && num > 0
    isAssetQuantityValid.current = isValid
  }

  const clearSelectedAsset = () => {
    setSelectedAsset(null)
    setSearchValue('')
  }

  const handleAddAssetSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (assetQuantityInputRef.current && selectedAsset) {
      const quantity = new Decimal(assetQuantityInputRef.current.value)
      const lastPrice = new Decimal(selectedAsset.lastPrice)
      const totalValue = quantity.mul(lastPrice)

      const newAssetToPortfolio: PortfolioAssetCandidate = {
        symbol: selectedAsset.symbol,
        title: selectedAsset.symbol.replace('USDT', ''),
        lastPrice,
        priceChangePercent: selectedAsset.priceChangePercent,
        quantity,
        totalValue,
      }

      setPortfolioAssets((portfolio) => {
        const isNewAssetInPortfolio = portfolio.find(
          (a) => a.symbol === newAssetToPortfolio.symbol
        )

        if (isNewAssetInPortfolio) {
          return updateAssetQuantityInPortfolio(
            portfolio,
            selectedAsset.symbol,
            quantity
          )
        }

        return addAssetToPortfolio(portfolio, newAssetToPortfolio)
      })
    }

    if (closeDialogButtonRef.current) {
      closeDialogButtonRef.current.click()
    }
  }

  const getData = () => {
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
        console.log('error getting assets 24hr') // TODO add Sonner component
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          getData()
        } else {
          setTimeout(clearSelectedAsset, 200)
        }

        onOpenChange?.(open)
      }}
      {...restDialogProps}
    >
      <DialogTrigger asChild>
        <Button type={'button'}>Добавить</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить валюту</DialogTitle>
        </DialogHeader>

        <Input
          type={'text'}
          disabled={isLoading}
          value={searchValue}
          onChange={handleSearchInputChange}
        />

        <ScrollArea className={'h-[300px]'} viewportRef={scrollRef}>
          {isLoading ? (
            <div
              className={'h-[200px] w-full flex justify-center items-center '}
            >
              <InfiniteLoader />
            </div>
          ) : (
            <Table>
              <TableBody
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const el = filteredAssetsFullList[virtualItem.index]
                  return (
                    <TableRow
                      key={virtualItem.key}
                      className={'hover:bg-gray-100 cursor-pointer group'}
                      onClick={() => {
                        setSelectedAsset(el)
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <TableCell
                        className={'group-hover:rounded-l-md'}
                        style={{ flex: '1', minWidth: 0 }}
                      >
                        {el.title}
                      </TableCell>
                      <TableCell style={{ flex: '1', minWidth: 0 }}>
                        <FormattedDecimal before={'$'} rounding={6}>
                          {el.lastPrice}
                        </FormattedDecimal>
                      </TableCell>
                      <TableCell
                        style={{ flex: '1', minWidth: 0 }}
                        className={'group-hover:rounded-r-md text-right pr-6'}
                      >
                        <FormattedDecimal withColors after={'%'} withPlusSign>
                          {el.priceChangePercent}
                        </FormattedDecimal>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>

        {selectedAsset && (
          <form onSubmit={handleAddAssetSubmit}>
            <div
              className={'flex flex-wrap justify-center-safe gap-2 pb-4 pt-4'}
            >
              <Label
                htmlFor={'selected-asset'}
                className={'flex justify-center items-center gap-3'}
              >
                <span>{selectedAsset.title}</span>
                <span>${selectedAsset.lastPrice}</span>
              </Label>

              <Input
                onChange={handleAssetQuantityChange}
                id={'selected-asset'}
                type={'number'}
                min={1}
                required
                ref={assetQuantityInputRef}
              />
            </div>

            <DialogFooter>
              <Button type={'submit'}>Добавить</Button>
              <DialogClose asChild>
                <Button
                  variant={'outline'}
                  type={'button'}
                  ref={closeDialogButtonRef}
                >
                  Отмена
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
