'use client'

import { Input } from '@/Components/ui/input'
import { router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { TableProps } from '@/Types'
import { DataTableFacetedFilter } from '@/Components/table/faceted-filter'
import { DataTableViewOptions } from '@/Components/table/view-options'

interface DataTableToolbarProps<T> extends Omit<TableProps<T>, 'data'> {}

export const DataTableToolbar = <T,>({ columns, filterColumnBy, filterPlaceholder }: DataTableToolbarProps<T>) => {
  const page = usePage()
  const [search, setSearch] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Check if the search parameter is present and valid
    const urlParams = new URLSearchParams(page.url.split('?')[1] || '')
    const search = urlParams.get('search')

    if (!search || search === '') return

    setSearch(search)
  }, [page.url])

  useEffect(() => {
    if (search === undefined) return

    if (search === '') {
      return router.get(page.url, { search: undefined, page: undefined, per_page: undefined }, { preserveState: true, replace: true })
    } else {
      const timer = setTimeout(() => {
        router.get(
          page.url,
          { search, page: 1 },
          {
            preserveState: true,
            replace: true
          }
        )
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [search])
  const column = columns.find(column => column.id === filterColumnBy)!

  return (
    <div className='flex items-center py-4'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input placeholder={`Filter ${filterPlaceholder}...`} value={search || ''} onChange={e => setSearch(e.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

        {column.id === 'status' && <DataTableFacetedFilter column={column} title='Status' options={column?.options ?? []} />}
      </div>

      <DataTableViewOptions columns={columns} />
    </div>
  )
}
