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
import { addAssetToPortfolio, updateAssetQuantity } from '@/utils/assets.ts'
import {
  Asset,
  assetsAPI,
  PortfolioAsset,
  PortfolioAssetCandidate,
} from '@/app/api/assets'

type Props = {
  assetsFullList: Asset[]
  portfolioAssets: PortfolioAsset[]
  updateAssetsFullList: Dispatch<SetStateAction<Asset[]>>
  updatePortfolioAssets: Dispatch<SetStateAction<PortfolioAsset[]>>
} & ComponentProps<typeof Dialog>

export function AddAssetToPortfolioDialog({
  assetsFullList,
  updateAssetsFullList,
  updatePortfolioAssets,
  onOpenChange,
  ...restDialogProps
}: Props) {
  const [isLoading, setIsLoading] = useState(true)

  const [searchValue, setSearchValue] = useState('')
  const searchRegex = new RegExp(searchValue, 'i')
  const filteredAssetsFullList = assetsFullList.filter((str) =>
    searchRegex.test(str.symbol)
  )

  const virtualizedList = filteredAssetsFullList.slice(0, 10)

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

      updatePortfolioAssets((portfolio) => {
        const isNewAssetInPortfolio = portfolio.find(
          (a) => a.symbol === newAssetToPortfolio.symbol
        )

        if (isNewAssetInPortfolio) {
          return updateAssetQuantity(portfolio, selectedAsset.symbol, quantity)
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
        updateAssetsFullList(assetsWithTitleField)
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

        <ScrollArea className={'h-[200px]'}>
          {isLoading ? (
            <div
              className={'h-[200px] w-full flex justify-center items-center '}
            >
              <InfiniteLoader />
            </div>
          ) : (
            <Table>
              <TableBody>
                {virtualizedList.map((el) => {
                  return (
                    <TableRow
                      key={el.symbol}
                      className={'hover:bg-gray-100 cursor-pointer group'}
                      onClick={() => {
                        setSelectedAsset(el)
                      }}
                    >
                      <TableCell className={'group-hover:rounded-l-md '}>
                        {el.title}
                      </TableCell>
                      <TableCell>
                        <FormattedDecimal before={'$'} rounding={6}>
                          {el.lastPrice}
                        </FormattedDecimal>
                      </TableCell>
                      <TableCell className={'group-hover:rounded-r-md'}>
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
