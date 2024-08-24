import { MoreHorizontal } from 'lucide-react'

import { DataTableColumnHeader } from '@/Components/table/column-header'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'
import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'
import { Product } from '@/Pages/Product/type'
import { TableColumn } from '@/Types'
import { Link, router } from '@inertiajs/react'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { toTitleCase } from '@/Lib/utils'

// TODO: add orders to product

const handleCopyId = (id: string): void => {
  navigator.clipboard.writeText(id)
  setTimeout(() => {
    toast({
      title: 'Copied!',
      description: 'The product ID is copied to the clipboard.',
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

const columns: TableColumn<Product>[] = createColumns([
  {
    id: 'name',
    label: 'Name',
    header: column => <DataTableColumnHeader column={column} title='Name' />
  },
  {
    id: 'total_stock',
    label: 'Total Stock',
    header: column => <DataTableColumnHeader column={column} title='Total Stock' align='end' />,
    cell: ({ total_stock }) => <div className='mr-4 text-right font-medium'>{total_stock}</div>
  },
  {
    id: 'variants_count',
    label: 'Variants',
    header: column => <DataTableColumnHeader column={column} title='Variants' align='end' />,
    cell: ({ variants_count }) => <div className='mr-4 text-right font-medium'>{variants_count}</div>
  },
  {
    id: 'stock_status',
    label: 'Stock Status',
    header: column => <DataTableColumnHeader column={column} title='Stock Status' align='center' />,
    cell: ({ stock_status }) => (
      <span className='flex justify-center'>
        <Badge variant={stock_status === 'available' ? 'default' : 'secondary'}>{toTitleCase(stock_status)}</Badge>
      </span>
    )
  },
  {
    id: 'status',
    label: 'Status',
    header: column => <DataTableColumnHeader column={column} title='Status' align='center' />,
    cell: ({ status }) => (
      <span className='flex justify-center'>
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>{toTitleCase(status)}</Badge>
      </span>
    ),
    options: [
      {
        label: 'Active',
        value: 'active',
        icon: CheckCircledIcon
      },
      {
        label: 'Inactive',
        value: 'inactive',
        icon: CrossCircledIcon
      }
    ]
  },
  {
    id: 'created_by',
    label: 'Created by',
    header: column => <DataTableColumnHeader column={column} title='Created by' />
  },
  {
    id: 'actions',
    label: 'Actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: ({ id, name }) => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id,
        name,
        title: 'product',
        onConfirm: () => router.visit('/products')
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
              <DropdownMenuItem onClick={() => handleCopyId(id)}>Copy product ID</DropdownMenuItem>
              <Link href={`/products/${id}`}>
                <DropdownMenuItem>View product details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-red-600 focus:bg-destructive focus:text-destructive-foreground' onClick={() => initializeDeleteModal(deleteModalData)}>
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
])

export { columns }
