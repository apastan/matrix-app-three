import { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'
import { Slot } from '@radix-ui/react-slot'
import DecimalConstructor from 'decimal.js'

type DecimalProps = Omit<ComponentProps<'span'>, 'children'> & {
  asChild?: boolean
  children: string | number
  precision?: number
  withColors?: boolean
  before?: string
  after?: string
  withPlusSign?: boolean
}

function Decimal({
  children,
  className,
  asChild,
  precision = 2,
  withColors = false,
  withPlusSign = false,
  before,
  after,
  ...props
}: DecimalProps) {
  const Comp = asChild ? Slot : 'span'

  if (precision < 0 || precision % 1 > 0) {
    throw new Error('Decimals must be greater than 0 and be integer')
  }

  const numberAsObject = new DecimalConstructor(children)
  const roundedStringValue = numberAsObject.toFixed(precision)

  const isPositiveOrZero = numberAsObject.toNumber() >= 0

  const color = isPositiveOrZero ? 'text-emerald-600' : 'text-red-500'

  return (
    <Comp className={cn(withColors && color, className)} {...props}>
      {before}
      {withPlusSign && isPositiveOrZero ? '+' : ''}
      {roundedStringValue}
      {after}
    </Comp>
  )
}

export { Decimal, type DecimalProps }
