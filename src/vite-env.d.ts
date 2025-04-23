/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BINANCE_BASE_API_URL: string
  readonly VITE_BINANCE_WEBSOCKET_STREAM_API_URL: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
