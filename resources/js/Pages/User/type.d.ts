export type Address = {
    type: string
    id: string
    attributes: {
        id: string
        street: string
        city: string
        state: string
        zip: string
        created_at: string
        updated_at: string
    }
}

export type Role = {
    type: string
    id: string
    attributes: {
        id: string
        label: string
        value: string
        created_at: string
        updated_at: string
    }
}

export type User = {
    data: {
        type: string
        id: string
        attributes: {
            id: string
            name: string
            email: string
            phone: string
            gender: string
            image?: string
            status: 'active' | 'inactive'
            roles: { label: string; value: string }[]
            created_by?: string
            email_verified_at?: string
            url: string
        }
        relationships: {
            address?: Address
            roles?: Role[]
        }
    }
}

export type UserForm = {
    name: string
    email: string
    gender: string
    phone: string
    image?: File
    roles: string[]
    status?: string
    password: string
    address: {
        street: string
        city: string
        state: string
        zip: string
    }
}
