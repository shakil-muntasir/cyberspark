import { Link, router } from '@inertiajs/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'

import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'

import { TableColumn } from '@/Types'
import { OrderVariant } from '@/Types/modules/order-variant'
import { formatCurrency } from '@/Lib/utils'

const handleCopyId = (id: string): void => {
  navigator.clipboard.writeText(id)
  setTimeout(() => {
    toast({
      title: 'Copied!',
      description: 'The order ID is copied to the clipboard.',
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

const columns: TableColumn<OrderVariant>[] = createColumns([
  {
    id: 'id',
    header: 'Name',
    cell: variant => (
      <Link href={`/products/${variant.relationships?.product_variant.relationships?.product?.id}`} className='font-medium text-blue-500 underline-offset-2 hover:underline dark:text-blue-300'>
        {variant.relationships?.product_variant.relationships?.product?.attributes.name}
      </Link>
    )
  },

  {
    id: 'sku',
    header: 'SKU',
    cell: variant => <div className='mr-4 text-nowrap'>{variant.relationships?.product_variant.attributes.sku}</div>
  },

  {
    id: 'quantity',
    header: () => <div className='text-right'>Quantity</div>,
    cell: variant => <div className='text-nowrap text-right'>{variant.attributes.quantity}</div>
  },

  {
    id: 'unit_price',
    header: () => <div className='text-right'>Price</div>,
    cell: variant => <div className='text-nowrap text-right'>{formatCurrency(variant.attributes.unit_price)}</div>
  },

  {
    id: 'subtotal',
    header: () => <div className='text-right'>Total</div>,
    cell: variant => <div className='text-nowrap text-right'>{formatCurrency(variant.attributes.subtotal)}</div>
  },

  {
    id: 'actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: variant => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id: variant.id,
        name: `${variant.relationships?.product_variant.attributes.sku}`,
        title: 'product',
        onConfirm: () => router.visit('/orders')
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
              <DropdownMenuItem onClick={() => handleCopyId(variant.id)}>Copy order ID</DropdownMenuItem>
              <DropdownMenuItem className='text-red-600 focus:bg-destructive focus:text-destructive-foreground' onClick={() => initializeDeleteModal(deleteModalData)}>
                Delete order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
])

export { columns }
