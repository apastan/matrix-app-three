import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Decimal from 'decimal.js'
import { recalculatePortfolioWeights } from '@/features/portfolio/lib'
import {
  AssetFieldsToUpdate,
  PortfolioAsset,
  PortfolioAssetCandidate,
} from '@/features/portfolio/types'
import { getLocalStoragePortfolio } from '@/features/portfolio/store/getLocalStoragePortfolio.ts'

const initialState: PortfolioAsset[] = getLocalStoragePortfolio() || []

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    // Установить полный список активов
    setPortfolioAssets: (_, action: PayloadAction<PortfolioAsset[]>) => {
      return action.payload
    },

    // Добавить новый актив или обновить количество существующего
    upsertAsset: (state, action: PayloadAction<PortfolioAssetCandidate>) => {
      const asset = action.payload
      const existingAssetIndex = state.findIndex(
        (a) => a.symbol === asset.symbol
      )

      let updatedPortfolio: PortfolioAsset[]

      if (existingAssetIndex !== -1) {
        // Актив существует, обновляем количество и totalValue
        updatedPortfolio = state.map((a, index) => {
          if (index === existingAssetIndex) {
            const currentQuantity = new Decimal(a.quantity)
            const newQuantity = new Decimal(asset.quantity)
            const lastPrice = new Decimal(a.lastPrice)
            return {
              ...a,
              quantity: currentQuantity.add(newQuantity).toString(), // Сохраняем как строку
              totalValue: currentQuantity
                .add(newQuantity)
                .mul(lastPrice)
                .toString(), // Сохраняем как строку
            }
          }
          return a
        })
      } else {
        // Актив новый, добавляем его
        const quantity = new Decimal(asset.quantity)
        const lastPrice = new Decimal(asset.lastPrice)
        const newPortfolioAsset: PortfolioAsset = {
          title: asset.title,
          symbol: asset.symbol,
          lastPrice: asset.lastPrice,
          priceChangePercent: asset.priceChangePercent,
          quantity: asset.quantity,
          totalValue: quantity.mul(lastPrice).toString(), // Сохраняем как строку
          weightInPortfolio: '0', // Временное значение, пересчитаем позже
        }
        updatedPortfolio = [...state, newPortfolioAsset]
      }

      // Пересчитываем веса всех активов
      return recalculatePortfolioWeights(updatedPortfolio)
    },

    // Обновить цены нескольких активов
    updateAssetPrices: (
      state,
      action: PayloadAction<Record<string, AssetFieldsToUpdate>>
    ) => {
      const tickerData = action.payload

      const updatedPortfolio = state.map((asset) => {
        const fields = tickerData[asset.symbol]
        if (fields) {
          const updatedLastPrice = new Decimal(fields.lastPrice)
          const quantity = new Decimal(asset.quantity)
          return {
            ...asset,
            lastPrice: fields.lastPrice,
            priceChangePercent: fields.priceChangePercent,
            totalValue: quantity.mul(updatedLastPrice).toString(), // Сохраняем как строку
          }
        }
        return asset
      })

      // Пересчитываем веса
      return recalculatePortfolioWeights(updatedPortfolio)
    },

    // Удалить актив из портфеля
    removeAsset: (state, action: PayloadAction<string>) => {
      const symbol = action.payload

      // Удаляем актив по символу
      const updatedPortfolio = state.filter((asset) => asset.symbol !== symbol)

      // Пересчитываем веса всех активов
      return recalculatePortfolioWeights(updatedPortfolio)
    },
  },
})

export const {
  setPortfolioAssets,
  upsertAsset,
  updateAssetPrices,
  removeAsset,
} = portfolioSlice.actions

export const portfolioReducer = portfolioSlice.reducer
