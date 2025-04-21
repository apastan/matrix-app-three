import { FormattedDecimal, FormattedDecimalProps } from '@/components/ui'
import { Skeleton, SkeletonProps } from '@/components/ui/skeleton.tsx'
import { cn } from '@/utils'

type FormattedDecimalOrSkeletonProps = FormattedDecimalProps & {
  skeletonProps?: SkeletonProps
}

const FormattedDecimalOrSkeleton = ({
  children,
  skeletonProps,
  ...props
}: FormattedDecimalOrSkeletonProps) => {
  const { className, ...restSkeletonProps } = skeletonProps || {}

  if (children === '0')
    return (
      <Skeleton
        className={cn('w-[70px] h-[20px]', className)}
        {...restSkeletonProps}
      />
    )

  return <FormattedDecimal {...props}>{children}</FormattedDecimal>
}

export { FormattedDecimalOrSkeleton, type FormattedDecimalOrSkeletonProps }
