export type User = {
    id: string
    name: string
    email: string
    phone: string
    image?: string
    status: 'active' | 'inactive'
    url: string
}

export type UserForm = {
    name: string
    email: string
    phone: string
    image?: File
    role: string
    address: string
    city: string
    state: string
    zip: string
    password: string
}
