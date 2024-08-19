export type Product = {
    data: {
        type: string
        id: string
        attributes: {
            id: string
            name: string
            description?: string
            status: 'active' | 'inactive'
            variants: string
            total_stock: string
            stock_status: string
            created_by_id: string
            updated_by_id: string
            created_by: string
            updated_by: string
            created_at: string
            updated_at: string
        }
    }
}

export type ProductForm = {
    sku: string
    name: string
    description: string
    category?: string
    status?: string
    quantity: number | null
    buying_price: number | null
    retail_price: number | null
    selling_price: number | null
}

export type ProductStatus = {
    label: string
    value: string
}
