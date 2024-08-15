import { User } from '@/Pages/User/type'


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User
    }
}

export interface PaginationData  {
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    }
}

export interface TableData<T> extends PaginationData {
    data: T[];
}

export type ColumnOption = {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

export interface TableColumn<T> {
    id: keyof T | ((row: T) => any) | 'actions'
    label: string
    header: string | ((column: TableColumn<T>) => JSX.Element)
    cell?: string | ((row: T) => JSX.Element)
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
