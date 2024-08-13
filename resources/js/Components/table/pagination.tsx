import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'

import { Button } from '@/Components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { PaginationData } from '@/Types'

export default function DataTablePagination<T>({ meta, links }: PaginationData) {
  const page = usePage()
  const [pageSize, setPageSize] = useState(meta.per_page)

  const fetchPaginatedData = (pageNumber: number) => {
    router.get(page.url, {
      page: pageNumber,
      per_page: pageSize
    })
  }

  const fetchPerPageData = (value: string) => {
    router.get(page.url, { per_page: Number(value) })
    setPageSize(Number(value))
  }

  return (
    <div className='flex flex-col md:flex-row items-center justify-between md:px-2'>
      <div className='flex items-center space-x-2 md:mr-4'>
        <p className='text-sm font-medium'>Rows per page</p>
        <Select value={`${pageSize}`} onValueChange={fetchPerPageData}>
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[10, 20, 30, 40, 50].map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='w-full mt-4 md:mt-auto md:w-auto justify-end flex items-center space-x-6 lg:space-x-8'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {`${meta.current_page}`} of {meta.last_page}
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' className='hidden h-8 w-8 p-0 lg:flex' disabled={meta.current_page === 1} onClick={() => fetchPaginatedData(1)}>
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='h-8 w-8 p-0' disabled={meta.current_page === 1} onClick={() => fetchPaginatedData(meta.current_page - 1)}>
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='h-8 w-8 p-0' disabled={meta.current_page === meta.last_page} onClick={() => fetchPaginatedData(meta.current_page + 1)}>
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='hidden h-8 w-8 p-0 lg:flex' disabled={links.next === null} onClick={() => fetchPaginatedData(meta.last_page)}>
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
