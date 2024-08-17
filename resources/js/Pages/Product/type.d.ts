export type Product = {
    data: {
        type: string
        id: string
        attributes: {
            id: string
            sku: string
            name: string
            description?: string
            quantity: number
            buying_price: number
            selling_price: number
            retail_price: number
            status: 'active' | 'inactive'
            creator_id: string
            updater_id: string
            created_by: string
            updated_by: string
            created_at: string
            updated_at: string
            url: string
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
