import { Product } from '@/Pages/Product/types'

type Attributes = {
    id: string
    invoice_number: string
    acquired_date: string
    products_count: string
    created_at: string
    updated_at: string
}

type Relationships = {
    products?: Product[]
}

export type Acquisition = {
    type: string
    id: string
    attributes: Attributes
    relationships?: Relationships
}

export type AcquisitionResource = {
    data: Acquisition
}

export type AcquisitionCollection = {
    data: Acquisition[]
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
