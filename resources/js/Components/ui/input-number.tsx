import React, { useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/Components/ui/input'
import { cn } from '@/Lib/utils'

type CustomNumberInputProps = {
  id: string
  name: string
  className?: string
  allowNegative?: boolean
  placeholder?: string
  disabled?: boolean
} & (
  | {
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
      value: string | number
      onEnterPress?: never
    }
  | {
      onEnterPress: (event: React.ChangeEvent<HTMLInputElement>) => void
      value?: never
      onChange?: never
    }
)

const InputNumber: React.FC<CustomNumberInputProps> = ({ id, name, value, onChange, className, allowNegative = false, placeholder, onEnterPress, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const changeValue = (delta: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const input = inputRef.current
    if (!input) return

    let numberValue = parseInt(input.value) || 0
    numberValue += delta

    if (!allowNegative && numberValue < 0) {
      numberValue = 0
    }

    handleEventCalling(numberValue.toString())

    if (document.activeElement !== input) {
      input.focus()
    }
  }

  const handleEventCalling = (numberValue: string = '') => {
    if (typeof onChange === 'function') {
      onChange({
        target: { name, value: numberValue }
      } as React.ChangeEvent<HTMLInputElement>)
    } else if (typeof onEnterPress === 'function') {
      onEnterPress({
        target: { name, value: inputRef.current?.value || 0 }
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEventCalling()
    }
  }

  return (
    <div className='group relative flex'>
      <Input id={id} type='number' name={name} value={value} onChange={onChange} ref={inputRef} className={`no-spin ${className}`} placeholder={placeholder} onKeyUp={handleKeyUp} disabled={disabled} />
      <div className='absolute inset-y-0 right-2 flex items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
        <div className='flex flex-col'>
          <button
            type='button'
            tabIndex={-1}
            className={cn('m-0 -my-0.5 p-0', disabled && 'hidden')}
            onMouseDown={e => {
              const input = inputRef.current
              if (input && document.activeElement === input) {
                e.preventDefault()
              }
            }}
            onClick={e => changeValue(1, e)}
          >
            <ChevronUp className='h-4 text-muted-foreground hover:text-foreground' />
          </button>
          <button
            type='button'
            tabIndex={-1}
            className={cn('m-0 -my-0.5 p-0', disabled && 'hidden')}
            onMouseDown={e => {
              const input = inputRef.current
              if (input && document.activeElement === input) {
                e.preventDefault()
              }
            }}
            onClick={e => changeValue(-1, e)}
          >
            <ChevronDown className='h-4 text-muted-foreground hover:text-foreground' />
          </button>
        </div>
      </div>
    </div>
  )
}

export { InputNumber }
