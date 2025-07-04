import { useEffect, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import PageHeader from '@/Layouts/Partials/page-header'
import AddUser from '@/Pages/User/Partials/add-user'
import DataTable from '@/Components/Table'
import { Separator } from '@/Components/ui/separator'

import { columns as initialColumns } from '@/Pages/User/_data/columns'
import { SelectOption, TableData } from '@/Types'
import { User } from '@/Pages/User/types'

interface UsersListProps {
  genders: SelectOption[]
  roles: SelectOption[]
  states: SelectOption[]
  users: TableData<User>
}

const UsersList: React.FC<UsersListProps> = ({ genders, roles, states, users }) => {
  const page = usePage()
  const [columns, setColumns] = useState(initialColumns)

  useEffect(() => {
    const { sortBy, sortTo } = route().params
    if (sortBy && sortTo) {
      setColumns(prevColumns => prevColumns.map(column => (column.id === sortBy ? { ...column, sorted: sortTo as 'asc' | 'desc' } : { ...column, sorted: undefined })))
    }
  }, [page])

  const handleToggleSorting = (columnId: string, desc: boolean) => {
    setColumns(prevColumns => prevColumns.map(column => (column.id === columnId ? { ...column, sorted: sortTo } : { ...column, sorted: undefined })))

    const sortTo = desc ? 'desc' : 'asc'
    router.get(page.url, {
      sortBy: columnId,
      sortTo,
      page: 1
    })
  }

  const handleToggleVisibility = (columnId: string, hidden: boolean) => {
    setColumns(prevColumns => prevColumns.map(column => (column.id === columnId ? { ...column, hidden } : column)))
  }

  return (
    <AuthenticatedLayout title='Users'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Users' description='This is the users page. You can view, edit, and delete users here.' />
        <AddUser genders={genders} roles={roles} states={states} />
      </div>

      <Separator className='mt-4' />

      <DataTable
        data={users}
        columns={columns.map(column => ({
          ...column,
          toggleSorting: (desc: boolean) => handleToggleSorting(String(column.id), desc),
          toggleVisibility: (hidden: boolean) => handleToggleVisibility(String(column.id), hidden)
        }))}
        filterColumnBy='status'
        searchPlaceholder='users'
      />
    </AuthenticatedLayout>
  )
}

export default UsersList
