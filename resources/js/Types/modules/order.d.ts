import { OrderVariant } from '@/Types/modules/order-variant'
import { Transaction } from '@/Types/modules/transaction'
import { ProductVariant } from '@/Pages/Product/types'
import { User } from '@/Pages/User/types'
import { CreatedOrUpdatedBy } from '@/Types'

type OrderAttributes = {
    code: string
    customer: string
    delivery_method: string
    delivered_by: string
    delivery_cost: number
    payment_status: string
    total_payable: number
    status: string
    created_by: CreatedOrUpdatedBy
    updated_by: CreatedOrUpdatedBy
    created_at: string
    updated_at: string
}

type OrderRelationships = {
    customer: User
    delivery_man: User
    courier_service: CourierService
    order_variants: OrderVariant[]
    product_variants: ProductVariant[]
    sales_rep: User
    shipping_address: ShippingAddress
    transactions: Transaction[]
}

export type Order = {
    type: string
    id: string
    attributes: OrderAttributes
    relationships?: OrderRelationships
}

export type OrderResource = {
    data: Order
}

export type OrderCollection = {
    data: Order[]
}
