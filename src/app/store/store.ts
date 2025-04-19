import { configureStore } from '@reduxjs/toolkit'
import { commonApi } from '@/app/api'
import { portfolioReducer } from '@/features/portfolio/store'

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(commonApi.middleware),
  reducer: {
    [commonApi.reducerPath]: commonApi.reducer,
    portfolio: portfolioReducer,
  },
})
