import {
  ResponseGetAllAssets24hr,
  Asset24hrTicker,
} from '@/features/portfolio/api'
import { commonApi } from '@/app/common-api'

export const assetsApi = commonApi.injectEndpoints({
  endpoints: (builder) => ({
    GetAllAssets24hr: builder.query<Asset24hrTicker[], void>({
      providesTags: ['ALL_ASSETS-DATA-24HR'],
      query: () => '/ticker/24hr',

      transformResponse: (response: ResponseGetAllAssets24hr) => {
        return response.filter(
          (asset) => asset.symbol.endsWith('USDT') && asset.count > 0
        )
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetAllAssets24hrQuery } = assetsApi
