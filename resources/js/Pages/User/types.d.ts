import { CreatedOrUpdatedBy, SelectOption } from '@/Types'

type Attributes = {
    id: string
    name: string
    email: string
    phone: string
    gender: string
    image?: string
    status: 'active' | 'inactive'
    roles: SelectOption[]
    email_verified_at?: string
    created_by: CreatedOrUpdatedBy
    updated_by: CreatedOrUpdatedBy
    created_at: string
    updated_at: string
}

type Relationships = {
    address?: Address
    roles?: Role[]
}

export type User = {
    type: string
    id: string
    attributes: Attributes
    relationships?: Relationships
}

export type UserResource = {
    data: User
}

export type UserCollection = {
    data: User[]
}

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
