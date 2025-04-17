import { configureStore } from '@reduxjs/toolkit'
import { commonApi } from '@/app/common-api.ts'

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(commonApi.middleware),
  reducer: {
    [commonApi.reducerPath]: commonApi.reducer,
  },
})
