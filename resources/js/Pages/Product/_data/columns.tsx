import { MoreHorizontal } from 'lucide-react'

import { TableColumn } from '@/Types'
import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { Product } from '@/Pages/Product/type'
import { Link, router } from '@inertiajs/react'
import DeleteModal from '@/Components/DeleteModal'
import { useState } from 'react'

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
    id: 'sku',
    label: 'SKU',
    header: column => <DataTableColumnHeader column={column} title='SKU' />
  },
  {
    id: 'name',
    label: 'Name',
    header: column => <DataTableColumnHeader column={column} title='Name' />
  },
  {
    id: 'quantity',
    label: 'Quantity',
    header: column => <DataTableColumnHeader column={column} title='Quantity' align='end' />,
    cell: ({ quantity }) => {
      return <div className='text-right font-medium mr-4'>{quantity}</div>
    }
  },
  {
    id: 'buying_price',
    label: 'Buying Price',
    header: column => <DataTableColumnHeader column={column} title='Buying Price' align='end' />,
    cell: ({ buying_price }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(buying_price)

      return <div className='text-right font-medium mr-4'>{formatted}</div>
    }
  },
  {
    id: 'selling_price',
    label: 'Selling Price',
    header: column => <DataTableColumnHeader column={column} title='Selling Price' align='end' />,
    cell: ({ selling_price }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(selling_price)

      return <div className='text-right font-medium mr-4'>{formatted}</div>
    }
  },
  {
    id: 'retail_price',
    label: 'Retail Price',
    header: column => <DataTableColumnHeader column={column} title='Retail Price' align='end' />,
    cell: ({ retail_price }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(retail_price)

      return <div className='text-right font-medium mr-4'>{formatted}</div>
    }
  },
  {
    id: 'created_by',
    label: 'Created by',
    header: column => <DataTableColumnHeader column={column} title='Created by' />
  },
  {
    id: 'status',
    label: 'Status',
    header: column => <DataTableColumnHeader column={column} title='Status' align='center' />,
    cell: ({ status }) => (
      <span className='flex justify-center'>
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
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
    id: 'actions',
    label: 'Actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: ({ id }) => {
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

      const handleProductDeletion = () => {
        // TODO: delete the product
        router.visit('/products')
      }
      return (
        <div className='flex justify-center items-center'>
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
              {/* TODO: add a toaster with proper message */}
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>Copy product ID</DropdownMenuItem>
              <Link href={`/products/${id}`}>
                <DropdownMenuItem>View product details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-red-600 focus:bg-destructive focus:text-destructive-foreground' onClick={() => setIsDeleteModalOpen(true)}>
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* TODO: fix the bug with multiple modal render */}
          <DeleteModal title='product' isOpen={isDeleteModalOpen} onCancel={() => setIsDeleteModalOpen(false)} onConfirm={handleProductDeletion} />
        </div>
      )
    }
  }
])

export { columns }
