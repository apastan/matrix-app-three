import { ComponentProps } from 'react'
import { cn } from '@/utils/cn.ts'

const Container = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1440px] pl-4 pr-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Container }
