import { CreatedOrUpdatedBy } from '@/Types'

type TransactionAttributes = {
    amount: number
    payment_method: string
    service_provider: string
    account_number: string
    txn_id: string
    bank_name: string
    cheque_number: string
    created_by: CreatedOrUpdatedBy
    updated_by: CreatedOrUpdatedBy
    created_at: string
    updated_at: string
}

type Transaction = {
    type: string
    id: string
    attributes: TransactionAttributes
}
