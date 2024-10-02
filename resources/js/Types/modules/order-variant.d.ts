import { ProductVariant } from '@/Pages/Product/types'
import { CreatedOrUpdatedBy } from '@/Types'

type OrderVariantAttributes = {
    quantity: number
    unit_price: number
    subtotal: number
    created_by: CreatedOrUpdatedBy
    updated_by: CreatedOrUpdatedBy
    created_at: string
    updated_at: string
}

type OrderVariantRelationships = {
    product_variant: ProductVariant
}

type OrderVariant = {
    type: string
    id: string
    attributes: OrderVariantAttributes
    relationships?: OrderVariantRelationships
}
