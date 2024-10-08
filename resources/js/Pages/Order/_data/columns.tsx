import { Link, router } from '@inertiajs/react'
import { BikeIcon, MoreHorizontal, TruckIcon } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'

import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'

import { TableColumn } from '@/Types'

import { formatCurrency, toTitleCase } from '@/Lib/utils'
import { PaymentBadge } from '@/Components/PaymentBadge'
import { Order } from '@/Types/modules/order'

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

const columns: TableColumn<Order>[] = createColumns([
  {
    id: 'id',
    header: column => <DataTableColumnHeader column={column} title='Code' />,
    cell: order => (
      <Link href={`/orders/${order.id}`} className='font-medium text-blue-500 underline-offset-2 hover:underline dark:text-blue-300'>
        {order.attributes.code}
      </Link>
    )
  },

  {
    id: 'total_payable',
    header: column => <DataTableColumnHeader column={column} title='Payable' align='end' />,
    cell: order => <div className='mr-4 text-nowrap text-right'>{formatCurrency(order.attributes.total_payable)}</div>
  },
  {
    id: 'payment_status',
    header: () => <div className='text-nowrap text-center'>Payment Status</div>,
    cell: order => {
      let variant: 'draft' | 'due' | 'partial' | 'paid' = 'draft'
      const { payment_status } = order.attributes
      switch (payment_status) {
        case 'paid':
          variant = 'paid'
          break
        case 'partial':
          variant = 'partial'
          break
        case 'due':
          variant = 'due'
          break
        default:
          variant = 'draft'
      }

      return (
        <span className='flex justify-center'>
          <PaymentBadge variant={variant}>{toTitleCase(payment_status)}</PaymentBadge>
        </span>
      )
    }
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: order => <div className='text-nowrap'>{order.attributes.customer}</div>
  },
  {
    id: 'delivered_by',
    header: 'Delivered By',
    cell: order => (
      <div className='flex items-center gap-1 text-nowrap'>
        {order.attributes.delivery_method === 'in-house' ? <BikeIcon className='h-4.5 w-4.5' /> : <TruckIcon className='h-4.5 w-4.5' />}
        {order.attributes.delivered_by}
      </div>
    )
  },
  {
    id: 'created_by',
    header: 'Created by',
    cell: user => <div className='text-nowrap'>{user.attributes.created_by?.name}</div>
  },
  {
    id: 'actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: order => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id: order.id,
        name: `${order.attributes.code}`,
        title: 'order',
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
              <DropdownMenuItem onClick={() => handleCopyId(order.id)}>Copy order ID</DropdownMenuItem>
              <Link href={`/orders/${order.id}`}>
                <DropdownMenuItem>View order details</DropdownMenuItem>
              </Link>
              <a href={route('invoices.show', order.id)} target='_blank' rel='noreferrer'>
                <DropdownMenuItem>Print</DropdownMenuItem>
              </a>
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
