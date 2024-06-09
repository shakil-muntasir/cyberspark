import { Input } from '@/Components/ui/input'
import { DataTableViewOptions } from '@/Pages/Product/Partials/table/view-options'
import { Table } from '@tanstack/react-table'
import { Button } from '@/Components/ui/button'
import { Cross2Icon } from '@radix-ui/react-icons'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { DataTableFacetedFilter } from '@/Pages/Product/Partials/table/faceted-filter'

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>
    searchName: string
    searchColumn?: string
}

export const statuses = [
    {
        value: 'active',
        label: 'Active',
        icon: CheckCircledIcon
    },
    {
        value: 'inactive',
        label: 'Inactive',
        icon: CrossCircledIcon
    }
]

export default function DataTableToolbar<TData>({ searchColumn, searchName, table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className='flex items-center py-4'>
            <div className='flex flex-1 items-center space-x-2'>
                <Input placeholder={`Search ${searchName}...`} value={(table.getColumn(searchColumn || 'name')?.getFilterValue() as string) ?? ''} onChange={event => table.getColumn(searchColumn || 'name')?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />

                {table.getColumn('status') && <DataTableFacetedFilter column={table.getColumn('status')} title='Status' options={statuses} />}
                {isFiltered && (
                    <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
                        Reset
                        <Cross2Icon className='ml-2 h-4 w-4' />
                    </Button>
                )}
            </div>

            <DataTableViewOptions table={table} />
        </div>
    )
}
