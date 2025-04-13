import { Loader2 } from 'lucide-react'
import { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/utils.ts'

const InfiniteLoader = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof Loader2>) => {
  return <Loader2 className={cn('animate-spin', className)} {...props} />
}

export { InfiniteLoader }
