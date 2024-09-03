import { UserResource } from '@/Pages/User/types'

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: UserResource
    }
}

export interface PaginationData {
    links: {
        first: string | null
        last: string | null
        prev: string | null
        next: string | null
    }
    meta: {
        current_page: number
        from: number | null
        last_page: number
        links: {
            url: string | null
            label: string
            active: boolean
        }[]
        path: string
        per_page: number
        to: number | null
        total: number
    }
}

export interface TableData<T> extends PaginationData {
    data: T[]
}

export type ColumnOption = {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

// Define a generic type for the attributes structure
export type Attributes<T> = T extends { data: { attributes: infer A } } ? A : never

export interface TableColumn<T> {
    id: keyof Attributes<T> | ((row: Attributes<T>) => JSX.Element) | 'actions'
    label: string
    header: string | ((column: TableColumn<T>) => JSX.Element)
    cell?: keyof Attributes<T> | ((row: Attributes<T>) => JSX.Element)
    sorted?: 'asc' | 'desc'
    toggleSorting: (desc: boolean) => void
    toggleVisibility: (hidden: boolean) => void
    enableSorting: boolean
    hidden: boolean
    options?: ColumnOption[]
}

export interface TableProps<T> {
    data: TableData<T>
    columns: TableColumn<T>[]
    filterColumnBy: string
    searchPlaceholder: string
}

export type FormKeyOf<ObjectType> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object ? `${Key}` | `${Key}.${FormKeyOf<ObjectType[Key]>}` : `${Key}`
}[keyof ObjectType & (string | number)]

export type FormErrors<ObjectType> = Partial<{
    [Key in FormKeyOf<ObjectType>]: string
}>

export type SelectOption = {
    label: string
    value: string
}
