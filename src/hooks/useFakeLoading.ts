import { useEffect, useState } from 'react'

export const useFakeLoading = (ms: number) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const interval = setTimeout(() => {
      setIsLoading(false)
    }, ms)

    return () => {
      clearInterval(interval)
    }
  }, [ms])

  return { isLoading }
}
