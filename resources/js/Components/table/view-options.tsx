'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/Components/ui/dropdown-menu'
import { TableColumn } from '@/Types'

export function DataTableViewOptions<T>({ columns }: { columns: TableColumn<T>[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex'>
          <MixerHorizontalIcon className='mr-2 h-4 w-4' />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter(
            column => typeof column.header !== 'undefined' // Ensure column has a header
          )
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={String(column.id)}
                className='capitalize'
                checked={!column.hidden} // Show checkbox if column is visible
                onCheckedChange={checked => column.toggleVisibility(!checked)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
