import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/Lib/utils'

const badgeVariants = cva('inline-flex min-w-15 justify-center items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
  variants: {
    variant: {
      draft: 'text-foreground',
      due: 'border-transparent bg-red-200 text-rose-700',
      partial: 'border-transparent bg-yellow-100 text-yellow-600',
      paid: 'border-transparent bg-green-300 text-green-700'
    }
  },
  defaultVariants: {
    variant: 'draft'
  }
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function PaymentBadge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), 'text-nowrap', className)} {...props} />
}

export { PaymentBadge }
