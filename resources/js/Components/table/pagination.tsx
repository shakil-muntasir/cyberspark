import { Button } from '@/Components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { PaginatedData } from '@/Types'
import { router, usePage } from '@inertiajs/react'
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

interface PaginationProps<T> {
  data: PaginatedData<T>
}

export default function DataTablePagination<T>({ data: { per_page, current_page, last_page, first_page_url, next_page_url, prev_page_url, last_page_url } }: PaginationProps<T>) {
  const page = usePage()
  const [pageSize, setPageSize] = useState(per_page)

  const visitPage = (url: string | null) => {
    router.get(url!, {
      per_page: pageSize
    })
  }

  const fetchData = (value: string) => {
    router.get(page.url, { per_page: Number(value) })
    setPageSize(Number(value))
  }

  return (
    <div className='flex flex-col md:flex-row items-center justify-between md:px-2'>
      <div className='flex items-center space-x-2 md:mr-4'>
        <p className='text-sm font-medium'>Rows per page</p>
        <Select value={`${pageSize}`} onValueChange={fetchData}>
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
          Page {`${current_page}`} of {last_page}
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' className='hidden h-8 w-8 p-0 lg:flex' disabled={prev_page_url === null} onClick={() => visitPage(first_page_url)}>
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='h-8 w-8 p-0' disabled={prev_page_url === null} onClick={() => visitPage(prev_page_url)}>
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='h-8 w-8 p-0' disabled={next_page_url === null} onClick={() => visitPage(next_page_url)}>
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' className='hidden h-8 w-8 p-0 lg:flex' disabled={next_page_url === null} onClick={() => visitPage(last_page_url)}>
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
