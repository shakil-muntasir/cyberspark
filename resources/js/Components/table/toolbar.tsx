'use client'

import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { cn, toTitleCase } from '@/Lib/utils'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/Components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { Separator } from '@/Components/ui/separator'
import { Input } from '@/Components/ui/input'
import { useEffect, useState, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import { TableProps } from '@/Types'
import { DataTableViewOptions } from '@/Components/table/view-options'
import { CircleXIcon } from 'lucide-react'

interface DataTableToolbarProps<T> extends Omit<TableProps<T>, 'data' | 'pagination'> {
  disableFilter?: boolean
  filterColumnBy: string
  searchPlaceholder: string
}

export const DataTableToolbar = <T,>({ columns, disableFilter = false, filterColumnBy, searchPlaceholder }: DataTableToolbarProps<T>) => {
  const page = usePage()
  const initialRender = useRef(true)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const skipEffect = useRef(false) // New flag to control useEffect trigger

  const [search, setSearch] = useState<string | undefined>(() => {
    const urlParams = new URLSearchParams(page.url.split('?')[1] || '')
    const search = urlParams.get('search')

    return search ?? ''
  })

  const [filterValue, setFilterValue] = useState<string[]>(() => {
    const urlParams = new URLSearchParams(page.url.split('?')[1] || '')
    const validKeys = columns.find(column => column.id === filterColumnBy)?.options?.map(option => option.value)
    const filters = Array.from(urlParams.keys()).filter(key => validKeys?.includes(key))

    return filters.length > 0 ? filters : []
  })

  const column = columns.find(column => column.id === filterColumnBy)!

  const updateURL = (search: string | undefined, filters: string[]) => {
    const params = new URLSearchParams(page.url.split('?')[1] || '')

    // Handle the search parameter
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }

    // Handle filter parameters
    column?.options?.forEach(option => {
      if (filters.includes(option.value)) {
        params.set(option.value, 'true')
      } else {
        params.delete(option.value)
      }
    })

    // Check if any parameters (search or filters) are present
    const hasParams = search || filters.length > 0

    // Handle the page parameter based on presence of other parameters
    if (hasParams) {
      params.set('page', '1')
    } else {
      params.delete('page')
    }

    // Construct the new URL with sorted parameters
    const sortedParams = new URLSearchParams(Array.from(params.entries()).sort())
    const newUrl = `${page.url.split('?')[0]}?${sortedParams.toString()}`

    // Perform the router.get with the new URL
    router.get(newUrl, {}, { preserveState: true, replace: true })
  }

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false

      return
    }

    if (skipEffect.current) {
      skipEffect.current = false

      return
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    searchTimeout.current = setTimeout(() => {
      updateURL(search, filterValue)
    }, 400)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [search, filterValue])

  const clearFilter = () => {
    skipEffect.current = true // Set the flag to skip the next useEffect trigger
    setFilterValue([])
    setSearch('') // Clear the search input
    // Clear all query parameters
    const baseUrl = page.url.split('?')[0]
    router.get(baseUrl, {}, { preserveState: true, replace: true })
  }

  const hasQueryParams = !!new URLSearchParams(page.url.split('?')[1] || '').toString()

  return (
    <div className='flex items-center py-4'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input id='table-search' placeholder={`Search ${searchPlaceholder}...`} value={search || ''} onChange={e => setSearch(e.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        {!disableFilter && column?.options && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 border-dashed'>
                <PlusCircledIcon className='mr-2 h-4 w-4' />
                {toTitleCase(column?.id.toString())}
                {filterValue.length > 0 && (
                  <>
                    <Separator orientation='vertical' className='mx-2 h-4' />
                    <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                      {filterValue.length}
                    </Badge>
                    <div className='hidden space-x-1 lg:flex'>
                      {filterValue.length > 2 ? (
                        <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                          {filterValue.length} selected
                        </Badge>
                      ) : (
                        column
                          .options!.filter(option => filterValue.includes(option.value))
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
                <CommandInput placeholder={toTitleCase(column?.id.toString())} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {column?.options?.map(option => {
                      const isSelected = filterValue.includes(option.value)

                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const newValues = isSelected ? filterValue.filter(value => value !== option.value) : [...filterValue, option.value]
                            setFilterValue(newValues)
                          }}
                        >
                          <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible')}>
                            <CheckIcon className={cn('h-4 w-4')} />
                          </div>
                          {option.icon && <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
                          <span>{option.label}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                  {filterValue.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem onSelect={clearFilter} className='justify-center text-center'>
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {hasQueryParams && (
          <Button variant='secondary' className='flex h-8 items-center gap-2 px-3' onClick={clearFilter}>
            <CircleXIcon className='h-4 w-4' />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      <DataTableViewOptions columns={columns} />
    </div>
  )
}
