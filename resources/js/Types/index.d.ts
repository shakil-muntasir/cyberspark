export interface User {
    id: number
    name: string
    email: string
    email_verified_at: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User
    }
}

export interface PaginatedData<T> {
    data: T[]
    per_page: number
    current_page: number
    last_page: number
    first_page_url: string | null
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
    next_page_url: string | null
    prev_page_url: string | null
    last_page_url: string | null
}

export interface TableColumn<T> {
    id: keyof T | ((row: T) => any) | 'actions'
    header: string | ((column: TableColumn<T>) => JSX.Element)
    cell?: string | ((row: T) => JSX.Element)
    sorted?: 'asc' | 'desc'
    toggleSorting: (desc: boolean) => void
    toggleVisibility: (hidden: boolean) => void
    enableSorting: boolean
    hidden: boolean
}

export interface TableProps<T> {
    data: PaginatedData<T>
    columns: TableColumn<T>[]
}
