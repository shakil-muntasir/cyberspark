import { useEffect, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import PageHeader from '@/Layouts/Partials/page-header'
import AddAcquisition from '@/Pages/Acquisition/Partials/add-acquisition'
import { columns as initialColumns } from '@/Pages/Acquisition/data/columns'

import DataTable from '@/Components/Table'
import { Separator } from '@/Components/ui/separator'

import { Acquisition } from '@/Pages/Acquisition/types'
import { SelectOption, TableData } from '@/Types'

interface AcquisitionsListProps {
  acquisitions: TableData<Acquisition>
  categories: SelectOption[]
}

const AcquisitionsList: React.FC<AcquisitionsListProps> = ({ acquisitions, categories }) => {
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
    <AuthenticatedLayout title='Acquisitions'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Acquisitions' description='This is the acquisitions page. You can view, edit, and delete acquisitions here.' />
        <AddAcquisition categories={categories} />
      </div>

      <Separator className='mt-4' />

      <DataTable
        data={acquisitions}
        columns={columns.map(column => ({
          ...column,
          toggleSorting: (desc: boolean) => handleToggleSorting(String(column.id), desc),
          toggleVisibility: (hidden: boolean) => handleToggleVisibility(String(column.id), hidden)
        }))}
        filterColumnBy='status'
        searchPlaceholder='acquisitions'
      />
    </AuthenticatedLayout>
  )
}

export default AcquisitionsList
