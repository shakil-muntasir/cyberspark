import { SelectOption } from '@/Types'

export type OrderForm = {
    customer_id: string
    delivery_method: 'in-house' | 'external' | null
    delivery_cost: number | null
    delivery_man_id: string
    courier_service_id: string
    sales_rep_id: string
    total_payable: number | null

    order_variants: OrderVariantForm[]

    address: ShippingAddressAttributes

    payment_status: 'due' | 'partial' | 'paid' | null
    total_paid: number | null
    payment_method: 'cash_on_delivery' | 'cheque' | 'mobile_banking' | null
    service_provider: string
    account_number: string
    txn_id: string
    bank_name: string
    cheque_number: string
}

export type OrderVariantForm = {
    product_variant_id: string
    quantity: number
}

export interface StatusOption extends SelectOption {
    color: string
}
