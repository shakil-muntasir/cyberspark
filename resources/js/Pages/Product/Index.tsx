import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import PageHeader from '@/Layouts/Partials/page-header'
import AddProduct from '@/Pages/Product/Partials/add-product'
import { DataTable } from '@/Pages/Product/Partials/table/data-table'
import { Separator } from '@/components/ui/separator'

import { Product, columns } from '@/Pages/Product/Partials/table/columns'

export default function ProductsList({ products }: { products: Product[] }) {
    return (
        <AuthenticatedLayout title='Dashboard'>
            <div className='flex items-center justify-between'>
                <PageHeader title='Products' description='This is the products page. You can view, edit, and delete products here.' />
                <AddProduct />
            </div>

            <Separator className='my-4' />

            <div className='mx-auto md:container'>
                <DataTable columns={columns} data={products} />
            </div>
        </AuthenticatedLayout>
    )
}
