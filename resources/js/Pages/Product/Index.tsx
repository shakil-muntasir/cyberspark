import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import PageHeader from '@/Layouts/Partials/page-header'
import AddProduct from '@/Pages/Product/Partials/add-product'
import { Separator } from '@/Components/ui/separator'

import { PaginatedData } from '@/Types'
import DataTable from '@/Components/Table'
import { Product } from '@/Types/product'
import { columns as initialColumns } from '@/Pages/Product/_data/columns'
import { useEffect, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function ProductsList({ products }: { products: PaginatedData<Product> }) {
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
    <AuthenticatedLayout title='Products'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Products' description='This is the products page. You can view, edit, and delete products here.' />
        <AddProduct />
      </div>

      <Separator className='my-4' />

      <div className='mx-auto md:container'>
        <DataTable
          data={products}
          columns={columns.map(column => ({
            ...column,
            toggleSorting: (desc: boolean) => handleToggleSorting(String(column.id), desc),
            toggleVisibility: (hidden: boolean) => handleToggleVisibility(String(column.id), hidden)
          }))}
        />
      </div>
    </AuthenticatedLayout>
  )
}
