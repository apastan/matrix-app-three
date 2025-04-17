import { ComponentProps } from 'react'
import { cn } from '@/utils/cn.ts'
import { Slot } from '@radix-ui/react-slot'
import Decimal, { Decimal as DecimalNameSpace } from 'decimal.js'

type FormattedDecimalProps = Omit<ComponentProps<'span'>, 'children'> & {
  asChild?: boolean
  children: DecimalNameSpace.Value
  rounding?: DecimalNameSpace.Rounding
  withColors?: boolean
  before?: string
  after?: string
  withPlusSign?: boolean
}

function FormattedDecimal({
  children,
  className,
  asChild,
  rounding = 2,
  withColors = false,
  withPlusSign = false,
  before,
  after,
  ...props
}: FormattedDecimalProps) {
  const Comp = asChild ? Slot : 'span'

  if (rounding < 0 || rounding % 1 > 0) {
    throw new Error('Decimals must be greater than 0 and be integer')
  }

  const numberAsObject =
    children instanceof Decimal ? children : new Decimal(children)
  const roundedStringValue = numberAsObject.toFixed(rounding)

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

export { FormattedDecimal, type FormattedDecimalProps }
