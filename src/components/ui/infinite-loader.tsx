import { Loader2 } from 'lucide-react'
import { ComponentProps } from 'react'
import { cn } from '@/utils/cn.ts'

const InfiniteLoader = ({
  className,
  ...props
}: ComponentProps<typeof Loader2>) => {
  return <Loader2 className={cn('animate-spin', className)} {...props} />
}

export { InfiniteLoader }
