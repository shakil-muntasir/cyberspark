import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'

import { cn } from '@/Lib/utils'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/Components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Separator } from '@/Components/ui/separator'
import { ColumnOption, TableColumn } from '@/Types'
import { useEffect, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

interface DataTableFacetedFilterProps<TData, TValue> {
  column: TableColumn<TData>
  title?: string
  options: ColumnOption[]
}

export function DataTableFacetedFilter<TData, TValue>({ column, title, options }: DataTableFacetedFilterProps<TData, TValue>) {
  const page = usePage()

  const [filterValue, setFilterValue] = useState<string[]|undefined>([])

  const createParams = (values: string[]) =>
    options.reduce((acc, option) => {
      acc[option.value] = values.includes(option.value) ? true : undefined
      return acc
    }, {} as Record<string, boolean | undefined>)

  useEffect(() => {
    // Extract filter values from query parameters
    const urlParams = new URLSearchParams(page.url.split('?')[1] || '')

    // Filter parameters that match the options
    const validKeys = options.map(option => option.value)
    const filters = Array.from(urlParams.keys()).filter(key => validKeys.includes(key))

    setFilterValue(filters)
  }, [page.url, options])

  useEffect(() => {
    if(filterValue === undefined) return
    const params = createParams(filterValue)

    if (filterValue.length > 0) {
      router.get(page.url, params, {
        preserveState: true,
        replace: true
      })
    } else {
      router.get(page.url, { ...params, page: undefined, per_page: undefined }, {
        preserveState: true,
        replace: true
      })
    }
  }, [filterValue, page.url, router])

  const clearFilter = () => {
    setFilterValue([])

    // Check if the search parameter is present and valid
    const urlParams = new URLSearchParams(page.url.split('?')[1] || '')
    const search = urlParams.get('search')

    // Create parameters for the router call
    const params = createParams([])

    if (!search || search === '') {
      // Exclude 'page' and 'per_page' if search is '' or undefined
      params['page'] = undefined
      params['per_page'] = undefined
    }

    router.get(page.url, params, { preserveState: true, replace: true })
  }

  const selectedValues = new Set(filterValue)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => selectedValues.has(option.value))
                    .map(option => (
                      <Badge variant='secondary' key={option.value} className='rounded-sm px-1 font-normal'>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      setFilterValue(filterValues.length ? filterValues : [])
                    }}
                  >
                    <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}>
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
                    <span>{option.label}</span>
                    {/* TODO: enable later when we have the count */}
                    {/* {facets.get(option.value) && <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>{facets.get(option.value)}</span>} */}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => clearFilter()} className='justify-center text-center'>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
