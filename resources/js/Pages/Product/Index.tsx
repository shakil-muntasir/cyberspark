import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import PageHeader from '@/Layouts/Partials/page-header'
import AddProduct from '@/Pages/Product/Partials/add-product'
import { Separator } from '@/Components/ui/separator'

import { PaginatedData } from '@/Types'
import DataTable from '@/Components/Table'
import { Product } from '@/Types/product'
import { columns } from '@/Pages/Product/_data/columns'

export default function ProductsList({ products }: { products: PaginatedData<Product> }) {
    return (
        <AuthenticatedLayout title='Products'>
            <div className='flex items-center justify-between'>
                <PageHeader title='Products' description='This is the products page. You can view, edit, and delete products here.' />
                <AddProduct />
            </div>

            <Separator className='my-4' />

            <div className='mx-auto md:container'>
                <DataTable data={products} columns={columns} />
            </div>
        </AuthenticatedLayout>
    )
}
