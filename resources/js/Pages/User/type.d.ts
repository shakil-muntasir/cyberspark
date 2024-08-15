export type User = {
    data: {
        type: string
        id: string
        attributes: {
            name: string
            email: string
            phone: string
            image?: string
            status: 'active' | 'inactive'
            address?: string
            created_by?: string
            email_verified_at?: string
            url: string
        }
    }
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
