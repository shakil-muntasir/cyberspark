import { TableColumn } from '@/Types'
import { Product } from '@/Types/product'

export const columns: TableColumn<Product>[] = [
    {
        header: 'ID',
        id: 'id'
    },
    {
        header: 'Name',
        id: 'name'
    },
    {
        header: 'Quantity',
        id: 'quantity'
    },
    {
        header: 'Buying Price',
        id: 'buying_price'
    },
    {
        header: 'Selling Price',
        id: 'selling_price'
    },
    {
        header: 'Retail Price',
        id: 'retail_price'
    },
    {
        header: 'Status',
        id: 'status'
    }
]
