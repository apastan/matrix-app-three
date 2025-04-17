import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const commonApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BINANCE_BASE_API_URL,
  }),
  endpoints: () => ({}),
  reducerPath: 'commonApi',
  tagTypes: ['ALL_ASSETS-DATA-24HR'],
})
