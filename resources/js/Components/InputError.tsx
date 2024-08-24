import { cn } from '@/Lib/utils'
import { HTMLAttributes } from 'react'

interface InputErrorProps {
  message?: string
  className?: string
  isOutside?: boolean
}

export default function InputError({ message, className = '', isOutside = false, ...props }: InputErrorProps & HTMLAttributes<HTMLParagraphElement>) {
  if (message && message.length > 0) {
    return (
      <p {...props} className={cn('text-xs text-destructive', className)}>
        {message}
      </p>
    )
  }

  return <p className={isOutside ? 'h-2' : 'h-4'} />
}
