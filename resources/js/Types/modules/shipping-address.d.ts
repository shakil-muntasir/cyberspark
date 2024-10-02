type ShippingAddressAttributes = {
    contact_number: string
    email: string
    street: string
    city: string
    state: string
    zip: number | null
}

type ShippingAddress = {
    type: string
    id: string
    attributes: ShippingAddressAttributes
}
