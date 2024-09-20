import { Link, router } from '@inertiajs/react'
import { BikeIcon, MoreHorizontal, TruckIcon } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'

import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'

import { TableColumn } from '@/Types'
import { Order } from '@/Pages/Order/types'
import { formatCurrency, toTitleCase } from '@/Lib/utils'
import { PaymentBadge } from '@/Components/PaymentBadge'

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
    label: 'Code',
    header: column => <DataTableColumnHeader column={column} title='Code' />,
    cell: ({ id, code }) => (
      <Link href={`/orders/${id}`} className='font-medium text-blue-500 underline-offset-2 hover:underline dark:text-blue-300'>
        {code}
      </Link>
    )
  },
  {
    id: 'customer',
    label: 'Customer',
    header: 'Customer'
  },
  {
    id: 'total_payable',
    label: 'Total Payable',
    header: column => <DataTableColumnHeader column={column} title='Total Payable' align='end' />,
    cell: ({ total_payable }) => <div className='mr-4 text-right'>{formatCurrency(total_payable)}</div>
  },
  {
    id: 'payment_status',
    label: 'Payment Status',
    header: () => <div className='text-center'>Payment Status</div>,
    cell: ({ payment_status }) => {
      let variant: 'draft' | 'due' | 'partial' | 'paid' = 'draft'
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
    id: 'delivered_by',
    label: 'Delivered By',
    header: 'Delivered By',
    cell: ({ delivery_method, delivered_by }) => (
      <div className='flex items-center gap-1'>
        {delivery_method === 'in-house' ? <BikeIcon className='h-4.5 w-4.5' /> : <TruckIcon className='h-4.5 w-4.5' />}
        {delivered_by}
      </div>
    )
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
    cell: ({ id, code }) => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id,
        name: `${code}`,
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
              <DropdownMenuItem onClick={() => handleCopyId(id)}>Copy order ID</DropdownMenuItem>
              <Link href={`/orders/${id}`}>
                <DropdownMenuItem>View order details</DropdownMenuItem>
              </Link>
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
