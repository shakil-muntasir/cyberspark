import { MoreHorizontal } from 'lucide-react'

import { DataTableColumnHeader } from '@/Components/table/column-header'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { toast } from '@/Components/ui/use-toast'
import { DeleteModalData, useDeleteModal } from '@/Contexts/DeleteModalContext'
import { User } from '@/Pages/User/types'
import { TableColumn } from '@/Types'
import { Link, router } from '@inertiajs/react'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { toTitleCase } from '@/Lib/utils'

const handleCopyId = (id: string): void => {
  navigator.clipboard.writeText(id)
  setTimeout(() => {
    toast({
      title: 'Copied!',
      description: 'The user ID is copied to the clipboard.',
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

const columns: TableColumn<User>[] = createColumns([
  {
    id: 'name',
    header: column => <DataTableColumnHeader column={column} title='Name' />,
    cell: user => (
      <Link href={`/users/${user.id}`} className='font-medium text-blue-500 underline-offset-2 hover:underline dark:text-blue-300'>
        {user.attributes.name}
      </Link>
    )
  },
  {
    id: 'email',
    header: column => <DataTableColumnHeader column={column} title='Email' />,
    cell: user => <div className='font-medium'>{user.attributes.email}</div>
  },
  {
    id: 'phone',
    header: column => <DataTableColumnHeader column={column} title='Phone' />,
    cell: user => <div className='font-medium'>{user.attributes.email}</div>
  },
  {
    id: 'gender',
    header: column => <DataTableColumnHeader column={column} title='Gender' />,
    cell: user => <>{toTitleCase(user.attributes.gender)}</>
  },
  {
    id: 'status',
    header: column => <DataTableColumnHeader column={column} title='Status' align='center' />,
    cell: user => (
      <span className='flex justify-center'>
        <Badge variant={user.attributes.status === 'active' ? 'default' : 'secondary'}>{toTitleCase(user.attributes.status)}</Badge>
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
    header: () => <div className='text-center'>Created by</div>,
    cell: user => <div className='flex justify-center'>{user.attributes.created_by?.name}</div>
  },
  {
    id: 'actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: user => {
      const { initializeDeleteModal } = useDeleteModal()

      const deleteModalData: DeleteModalData = {
        id: user.id,
        name: user.attributes.name,
        title: 'user',
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
              <DropdownMenuItem onClick={() => handleCopyId(user.id)}>Copy user ID</DropdownMenuItem>
              <Link href={`/users/${user.id}`}>
                <DropdownMenuItem>View user details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className='text-red-600 focus:bg-destructive focus:text-destructive-foreground' onClick={() => initializeDeleteModal(deleteModalData)}>
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
])

export { columns }
