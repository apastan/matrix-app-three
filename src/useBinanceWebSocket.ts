// hooks/useBinanceWebSocket.ts
import { useEffect, useRef, useState } from 'react'
import Decimal from 'decimal.js'

// Типизация данных тикера
interface TickerData {
  s: string // Символ (например, "BTCUSDT")
  c: string // Последняя цена
  P: string // Процент изменения
}

interface TickerMessage {
  stream: string
  data: TickerData
}

interface WebSocketData {
  lastPrice: Decimal
  priceChangePercent: string
}

type WebSocketState = Record<string, WebSocketData>

function useBinanceWebSocket(symbols: string[]) {
  const [tickerData, setTickerData] = useState<WebSocketState>({})
  console.log('tickerData', tickerData)
  const wsRef = useRef<WebSocket | null>(null)
  const subscribedSymbolsRef = useRef<Set<string>>(new Set())

  // Инициализация WebSocket
  useEffect(() => {
    // Создаем WebSocket только если его еще нет
    if (!wsRef.current) {
      wsRef.current = new WebSocket('wss://stream.binance.com:9443/stream')
    }

    const ws = wsRef.current

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const message: TickerMessage = JSON.parse(event.data)
        const data = message.data

        if (data && data.s && data.c && data.P) {
          setTickerData((prev) => ({
            ...prev,
            [data.s]: {
              lastPrice: new Decimal(data.c),
              priceChangePercent: data.P,
            },
          }))
        }
      } catch (error) {
        console.error('Ошибка парсинга WebSocket-сообщения:', error)
      }
    }

    ws.onerror = (error: Event) => {
      console.error('WebSocket ошибка:', error)
    }

    ws.onclose = (event: CloseEvent) => {
      console.log(`WebSocket закрыт: ${event.code} ${event.reason}`)
      wsRef.current = null
      subscribedSymbolsRef.current.clear()
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
        wsRef.current = null
        subscribedSymbolsRef.current.clear()
      }
    }
  }, [])

  // Управление подписками
  useEffect(() => {
    if (!wsRef.current) return

    const updateSubscriptions = () => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return

      const currentSymbols = new Set(symbols)
      const subscribedSymbols = subscribedSymbolsRef.current

      // Подписываемся на новые символы
      const symbolsToSubscribe = [...currentSymbols].filter(
        (symbol) => !subscribedSymbols.has(symbol)
      )
      if (symbolsToSubscribe.length > 0) {
        const params = symbolsToSubscribe.map(
          (symbol) => `${symbol.toLowerCase()}@ticker`
        )
        wsRef.current.send(
          JSON.stringify({
            method: 'SUBSCRIBE',
            params,
            id: Date.now(),
          })
        )
        symbolsToSubscribe.forEach((symbol) => subscribedSymbols.add(symbol))
      }

      // Отписываемся от удаленных символов
      const symbolsToUnsubscribe = [...subscribedSymbols].filter(
        (symbol) => !currentSymbols.has(symbol)
      )
      if (symbolsToUnsubscribe.length > 0) {
        const params = symbolsToUnsubscribe.map(
          (symbol) => `${symbol.toLowerCase()}@ticker`
        )
        wsRef.current.send(
          JSON.stringify({
            method: 'UNSUBSCRIBE',
            params,
            id: Date.now(),
          })
        )
        symbolsToUnsubscribe.forEach((symbol) =>
          subscribedSymbols.delete(symbol)
        )
      }
    }

    if (wsRef.current.readyState === WebSocket.OPEN) {
      updateSubscriptions()
    }

    wsRef.current.onopen = () => {
      console.log('WebSocket подключен')
      updateSubscriptions()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.onopen = null
      }
    }
  }, [symbols])

  return tickerData
}

export { useBinanceWebSocket }
