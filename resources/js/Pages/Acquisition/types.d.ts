import { Product } from '@/Pages/Product/types'
import { CreatedOrUpdatedBy } from '@/Types'

type Attributes = {
    invoice_number: string
    acquired_date: string
    products_count: string
    created_by: CreatedOrUpdatedBy
    updated_by: CreatedOrUpdatedBy
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
    id: string
    name: string
    sku_prefix: string
    category_id: string
    quantity: string
    buying_price: string
    retail_price: string
    selling_price: string
    stock_threshold: string | null
    description: string | null
}

export interface AcquisitionForm {
    invoice_number: string
    acquired_date: string
    products: AcquiredProductForm[]
}
