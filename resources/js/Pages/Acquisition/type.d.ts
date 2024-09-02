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
