export type Product = {
    id: string
    sku: string
    name: string
    quantity: number
    buying_price: number
    selling_price: number
    retail_price: number
    status: 'active' | 'inactive'
    created_by?: string
    url: string
}

export type ProductForm = {
    sku: string
    name: string
    description: string
    quantity: number | null
    buying_price: number | null
    retail_price: number | null
    selling_price: number | null
}
