import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { ChangeEvent, ComponentProps, FormEvent, useRef, useState } from 'react'
import Decimal from 'decimal.js'
import { createTitleFromSymbol } from '@/features/portfolio/lib'
import {
  Asset24hrTicker,
  useGetAllAssets24hrQuery,
} from '@/features/portfolio/api'
import { useVirtualizer } from '@tanstack/react-virtual'
import { PortfolioAssetCandidate } from '@/features/portfolio/types'
import { upsertAsset } from '@/features/portfolio/store'
import { useAppDispatch } from '@/app/store/types.ts'

export function AddAssetToPortfolioDialog({
  onOpenChange,
  ...restDialogProps
}: ComponentProps<typeof Dialog>) {
  const dispatch = useAppDispatch()
  const {
    data: assetsFullList = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllAssets24hrQuery()

  const [searchValue, setSearchValue] = useState('')
  const filteredAssetsFullList = assetsFullList.filter((asset) =>
    asset.symbol.toLowerCase().includes(searchValue.toLowerCase())
  )

  const scrollRef = useRef(null)
  const rowVirtualizer = useVirtualizer({
    count: filteredAssetsFullList.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 37,
    overscan: 5,
  })

  const [selectedAsset, setSelectedAsset] = useState<Asset24hrTicker | null>(
    null
  )

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
        lastPrice: lastPrice.toString(),
        priceChangePercent: selectedAsset.priceChangePercent,
        quantity: quantity.toString(),
        totalValue: totalValue.toString(),
      }

      dispatch(upsertAsset(newAssetToPortfolio))
    }

    if (closeDialogButtonRef.current) {
      closeDialogButtonRef.current.click()
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          // получаем самые актуальные данные, инвалидируем кэш
          refetch()
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
          <DialogDescription>
            Выберите нужный актив из списка ниже
          </DialogDescription>
        </DialogHeader>

        <Input
          type={'text'}
          disabled={isLoading || isFetching}
          value={searchValue}
          onChange={handleSearchInputChange}
        />

        <ScrollArea className={'h-[300px]'} viewportRef={scrollRef}>
          {isLoading || isFetching ? (
            <div
              className={'h-[300px] w-full flex justify-center items-center '}
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
                        {createTitleFromSymbol(el.symbol)}
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
                <span>{createTitleFromSymbol(selectedAsset.symbol)}</span>
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
