import { cn } from '@/utils'
import { ComponentProps } from 'react'

type SkeletonProps = ComponentProps<'div'>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-gray-300 animate-pulse rounded-md ', className)}
      {...props}
    />
  )
}

export { Skeleton, type SkeletonProps }
