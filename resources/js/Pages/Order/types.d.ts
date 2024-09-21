import { ProductVariant } from '@/Pages/Product/types'
import { User } from '@/Pages/User/types'
import { CreatedOrUpdatedBy, SelectOption } from '@/Types'

type Attributes = {
    code: string
    customer: string
    delivery_method: string
    delivered_by: string
    delivery_cost: number
    payment_status: string
    total_payable: number
    total_paid: number
    total_remaining: number
    created_by: CreatedOrUpdatedBy
    updated_by: CreatedOrUpdatedBy
    created_at: string
    updated_at: string
}

type CourierService = SelectOption & {
    id: string
}

type Relationships = {
    customer: User
    delivery_man: User
    courier_service: CourierService[]
    variants: ProductVariant[]
}

export type Order = {
    type: string
    id: string
    attributes: Attributes
    relationships?: Relationships
}

export type OrderResource = {
    data: Order
}

export type OrderCollection = {
    data: Order[]
}

export type OrderForm = {
    customer_id?: string
    delivery_method?: 'in-house' | 'external'
    delivery_cost?: number
    delivery_man_id?: string
    courier_service_id?: string
    total_payable?: number

    order_variants: OrderVariant[]

    address: {
        contact_number: string
        email: string
        street: string
        city: string
        state: string
        zip?: number
    }

    payment_status?: 'due' | 'partial' | 'paid'
    total_paid?: number
    payment_method?: 'cash_on_delivery' | 'cheque' | 'mobile_banking'
    service_provider?: string
    account_number?: string
    txn_id?: string
    bank_name?: string
    cheque_number?: string
}

export type OrderVariant = {
    product_variant_id: string
    quantity: number
}
