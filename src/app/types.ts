import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { setupListeners } from '@reduxjs/toolkit/query'

import { store } from './store'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

setupListeners(store.dispatch)
