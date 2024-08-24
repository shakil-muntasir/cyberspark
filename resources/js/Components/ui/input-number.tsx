import React, { useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/Components/ui/input'

interface CustomNumberInputProps {
  id: string
  name: string
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  allowNegative?: boolean
  placeholder?: string
}

const InputNumber: React.FC<CustomNumberInputProps> = ({ id, name, value, onChange, className, allowNegative = false, placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const changeValue = (delta: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const input = inputRef.current
    if (!input) return

    // Save the current value and adjust it
    let numberValue = parseInt(input.value) || 0
    numberValue += delta

    if (!allowNegative) {
      if (numberValue < 0) {
        numberValue = 0
      }
    }

    // Update the input value
    onChange({
      target: { name, value: numberValue.toString() }
    } as React.ChangeEvent<HTMLInputElement>)

    // Focus the input field if it's not focused
    if (document.activeElement !== input) {
      input.focus()
    }
  }

  return (
    <div className='group relative flex'>
      <Input id={id} type='number' name={name} value={value} onChange={onChange} ref={inputRef} className={`no-spin ${className}`} placeholder={placeholder} />
      <div className='absolute right-2 top-1 flex h-10 flex-col opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
        <button
          type='button'
          tabIndex={-1}
          className='m-0 p-0 text-muted-foreground hover:text-foreground'
          onMouseDown={e => {
            const input = inputRef.current
            if (input && document.activeElement === input) {
              e.preventDefault() // Prevent button from stealing focus only if input is already focused
            }
          }}
          onClick={e => changeValue(1, e)}
        >
          <ChevronUp className='-mb-0.5 h-4' />
        </button>
        <button
          type='button'
          tabIndex={-1}
          className='m-0 p-0'
          onMouseDown={e => {
            const input = inputRef.current
            if (input && document.activeElement === input) {
              e.preventDefault() // Prevent button from stealing focus only if input is already focused
            }
          }}
          onClick={e => changeValue(-1, e)}
        >
          <ChevronDown className='-mb-0.5 h-4 text-muted-foreground hover:text-foreground' />
        </button>
      </div>
    </div>
  )
}

export { InputNumber }
