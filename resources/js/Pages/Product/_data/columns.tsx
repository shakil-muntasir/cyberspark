import { Link, router } from '@inertiajs/react'
import { MoreHorizontal } from 'lucide-react'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'

import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'

import { toTitleCase } from '@/Lib/utils'
import { Product } from '@/Pages/Product/types'
import { TableColumn } from '@/Types'

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
    header: column => <DataTableColumnHeader column={column} title='Name' />,
    cell: product => (
      <Link href={`/products/${product.id}`} className='text-nowrap font-medium text-blue-500 underline-offset-2 hover:underline dark:text-blue-300'>
        {product.attributes.name}
      </Link>
    )
  },
  {
    id: 'sku_prefix',
    header: column => <DataTableColumnHeader column={column} title='SKU Prefix' />,
    cell: product => <div className='font-medium'>{product.attributes.sku_prefix}</div>
  },
  {
    id: 'category',
    header: 'Category',
    cell: product => <div className='text-nowrap'>{product.attributes.category}</div>
  },
  {
    id: 'variants_sum_quantity',
    header: column => <DataTableColumnHeader column={column} title='Total Stock' align='end' />,
    cell: product => <div className='mr-4 text-right font-medium'>{product.attributes.variants_sum_quantity}</div>
  },
  {
    id: 'order_variants_sum_quantity',
    header: column => <DataTableColumnHeader column={column} title='Total Sold' align='end' />,
    cell: product => <div className='mr-4 text-right font-medium'>{product.attributes.order_variants_sum_quantity}</div>
  },
  {
    id: 'variants_count',
    header: column => <DataTableColumnHeader column={column} title='Variants' align='end' />,
    cell: product => <div className='mr-4 text-right'>{product.attributes.variants_count}</div>
  },
  {
    id: 'availability',
    header: () => <div className='text-center'>Availability</div>,
    cell: product => {
      let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'default'
      const { availability } = product.attributes
      switch (availability) {
        case 'available':
          variant = 'default'
          break
        case 'stock low':
          variant = 'outline'
          break
        case 'out of stock':
          variant = 'destructive'
          break
        default:
          variant = 'default'
      }

      return (
        <span className='flex justify-center'>
          <Badge variant={variant}>{toTitleCase(availability)}</Badge>
        </span>
      )
    }
  },
  {
    id: 'status',
    header: column => <DataTableColumnHeader column={column} title='Status' align='center' />,
    cell: product => (
      <span className='flex justify-center'>
        <Badge variant={product.attributes.status === 'active' ? 'default' : 'secondary'}>{toTitleCase(product.attributes.status)}</Badge>
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
    header: 'Created by',
    cell: product => <div className='text-nowrap'>{product.attributes.created_by?.name}</div>
  },
  {
    id: 'actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: product => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id: product.id,
        name: product.attributes.name,
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
              <DropdownMenuItem onClick={() => handleCopyId(product.id)}>Copy product ID</DropdownMenuItem>
              <Link href={`/products/${product.id}`}>
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
