import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Badge } from '@/Components/ui/badge'

interface MultiSelectProps {
  id?: string
  values: { label: string; value: string }[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  defaultSelectedValues?: { label: string; value: string }[]
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ id, values = [], onValueChange, placeholder, defaultSelectedValues = [] }) => {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultSelectedValues.map(item => item.value))
  const widthRef = React.useRef<HTMLDivElement>(null)

  const handleSetValue = (val: string) => {
    const newValue = selectedValues.includes(val) ? selectedValues.filter(item => item !== val) : [...selectedValues, val]
    setSelectedValues(newValue)
    onValueChange(newValue)
  }

  return (
    <>
      <div ref={widthRef} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' role='combobox' aria-expanded={open} className='flex h-auto w-full items-center justify-between px-3 py-1.5'>
            <div className='flex flex-wrap justify-start gap-2'>
              {selectedValues.length
                ? selectedValues.map((val, i) => (
                    <span className='flex justify-center' key={i}>
                      <Badge variant='outline' className='text-xxs font-normal'>
                        {values.find(item => item.value === val)?.label}
                      </Badge>
                    </span>
                  ))
                : (placeholder ?? 'Select options')}
            </div>
            <div className='flex items-center self-center'>
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' style={{ width: widthRef.current?.offsetWidth ?? 'auto' }}>
          <Command>
            <CommandInput id={id} placeholder='Search items...' />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {values.map(item => (
                  <CommandItem key={item.value} value={item.value} onSelect={() => handleSetValue(item.value)}>
                    <Check className={selectedValues.includes(item.value) ? 'mr-2 h-4 w-4 opacity-100' : 'mr-2 h-4 w-4 opacity-0'} />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
