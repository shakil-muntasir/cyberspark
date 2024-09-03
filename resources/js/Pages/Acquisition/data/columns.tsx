import { Link, router } from '@inertiajs/react'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/Components/ui/button'
import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'

import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'

import { Acquisition } from '@/Pages/Acquisition/types'
import { TableColumn } from '@/Types'

const handleCopyId = (id: string): void => {
  navigator.clipboard.writeText(id)
  setTimeout(() => {
    toast({
      title: 'Copied!',
      description: 'The acquisition ID is copied to the clipboard.',
      duration: 2000
    })
  }, 200)
}

const createColumns = <T,>(columns: (Omit<TableColumn<T>, 'toggleSorting' | 'toggleVisibility' | 'enableSorting' | 'hidden'> & Partial<Pick<TableColumn<T>, 'enableSorting' | 'hidden'>>)[]): TableColumn<T>[] => {
  return columns.map(column => ({
    ...column,
    toggleSorting: () => {},
    toggleVisibility: () => {},
    enableSorting: column.enableSorting ?? true,
    hidden: column.hidden ?? false
  }))
}

const columns: TableColumn<Acquisition>[] = createColumns([
  {
    id: 'invoice_number',
    label: 'Invoice Number',
    header: column => <DataTableColumnHeader column={column} title='Invoice Number' />
  },
  {
    id: 'products_count',
    label: 'Products',
    header: column => <DataTableColumnHeader column={column} title='Products' />,
    cell: ({ products_count }) => <div className='mr-4 font-medium'>{products_count}</div>
  },
  {
    id: 'acquired_date',
    label: 'Acquired Date',
    header: column => <DataTableColumnHeader column={column} title='Acquired Date' />,
    cell: ({ acquired_date }) => <div className='mr-4 font-medium'>{acquired_date}</div>
  },
  {
    id: 'created_by',
    label: 'Created by',
    header: 'Created By'
  },
  {
    id: 'actions',
    label: 'Actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: ({ id, invoice_number }) => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id,
        name: invoice_number,
        title: 'Acquisition',
        onConfirm: () => router.visit('/acquisitions')
      }

      return (
        <div className='flex items-center justify-center'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCopyId(id)}>Copy Acquisition ID</DropdownMenuItem>
              <Link href={`/acquisitions/${id}`}>
                <DropdownMenuItem>View Acquisition Details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-red-600 focus:bg-destructive focus:text-destructive-foreground' onClick={() => initializeDeleteModal(deleteModalData)}>
                Delete Acquisition
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
])

export { columns }
