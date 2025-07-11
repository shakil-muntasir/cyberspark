import DataTable from '@/Components/Table'
import { Separator } from '@/Components/ui/separator'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import PageHeader from '@/Layouts/Partials/page-header'
import { TableData } from '@/Types'
import { columns as initialColumns } from '@/Pages/Order/_data/columns'
import { useEffect, useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { Order } from '@/Types/modules/order'

interface OrdersPageProps {
  orders: TableData<Order>
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
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
    <AuthenticatedLayout title='Orders'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Orders' description='This is the orders page. You can view, edit, and delete orders here.' />
        <Link href='/orders/create'>
          <Button className='gap-1'>
            <PlusCircleIcon className='h-4 w-4' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Add Order</span>
          </Button>
        </Link>
      </div>

      <Separator className='mt-4' />

      <DataTable
        data={orders}
        columns={columns.map(column => ({
          ...column,
          toggleSorting: (desc: boolean) => handleToggleSorting(String(column.id), desc),
          toggleVisibility: (hidden: boolean) => handleToggleVisibility(String(column.id), hidden)
        }))}
        filterColumnBy='status'
        searchPlaceholder='orders'
      />
    </AuthenticatedLayout>
  )
}

export default OrdersPage
