import { MoreHorizontal } from 'lucide-react'

import { TableColumn } from '@/Types'
import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { User } from '@/Pages/User/type'
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import DeleteModal from '@/Components/DeleteModal'

const createColumns = <T,>(columns: (Omit<TableColumn<T>, 'toggleSorting' | 'toggleVisibility' | 'enableSorting' | 'hidden'> & Partial<Pick<TableColumn<T>, 'enableSorting' | 'hidden'>>)[]): TableColumn<T>[] => {
  return columns.map(column => ({
    ...column,
    toggleSorting: () => {},
    toggleVisibility: () => {},
    enableSorting: column.enableSorting ?? true,
    hidden: column.hidden ?? false
  }))
}

const columns: TableColumn<User>[] = createColumns([
  {
    id: 'name',
    label: 'Name',
    header: column => <DataTableColumnHeader column={column} title='Name' />
  },
  {
    id: 'email',
    label: 'Email',
    header: column => <DataTableColumnHeader column={column} title='Email' />
  },
  {
    id: 'phone',
    label: 'Phone',
    header: column => <DataTableColumnHeader column={column} title='Phone' />
  },
  {
    id: 'address',
    label: 'Address',
    header: column => <DataTableColumnHeader column={column} title='Address' />
  },
  {
    id: 'created_by',
    label: 'Created By',
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
    cell: ({ id, name }) => {
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

      const handleUserDeletion = () => {
        // TODO: delete the user
        router.visit('/users')
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>Copy user ID</DropdownMenuItem>
              <Link href={`/users/${id}`}>
                <DropdownMenuItem>View user details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-red-600 focus:bg-destructive focus:text-destructive-foreground' onClick={() => setIsDeleteModalOpen(true)}>
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* TODO: fix multiple modal render */}
          <DeleteModal data={{ id, name }} title='user' isOpen={isDeleteModalOpen} onCancel={() => setIsDeleteModalOpen(false)} onConfirm={handleUserDeletion} />
        </div>
      )
    }
  }
])

export { columns }
