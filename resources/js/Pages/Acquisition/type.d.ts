import { Product } from '@/Pages/Product/type'

export type Acquisition = {
    data: {
        type: string
        id: string
        attributes: {
            id: string
            invoice_number: string
            acquired_date: string
            products_count: string
            created_by_id: string
            updated_by_id: string
            created_by: string
            updated_by: string
            created_at: string
            updated_at: string
        }
        relationships?: {
            products?: Product[]
        }
    }
}

export type AcquiredProductForm = {
    name: string
    sku_prefix: string
    category_id: string
    quantity: string
    buying_price: string
    retail_price: string
    selling_price: string
    description?: string
}

export interface AcquisitionForm {
    invoice_number: string
    acquired_date: string
    products: AcquiredProductForm[]
}
