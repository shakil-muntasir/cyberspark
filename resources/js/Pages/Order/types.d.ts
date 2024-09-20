import { ProductVariant } from '@/Pages/Product/types'
import { User } from '@/Pages/User/types'
import { SelectOption } from '@/Types'

type Attributes = {
    id: string
    delivery_method: string
    delivery_cost: number
    payment_status: string
    total_payable: number
    total_paid: number
    total_remaining: number
    created_by_id: string
    updated_by_id: string
    created_by: string
    updated_by: string
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
    delivery_method?: 'in-house' | 'external' // Method of delivery
    delivery_cost?: number // Cost of delivery
    delivery_man_id?: string // (Optional) Foreign key to the users table (delivery man)
    courier_service_id?: string // (Optional) Foreign key to the courier services table
    total_payable?: number // The total amount to be paid for the order

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
