type CourierServiceAttributes = {
    name: string
    delivery_price: number
}

type CourierService = {
    type: string
    id: string
    attributes: CourierServiceAttributes
}
