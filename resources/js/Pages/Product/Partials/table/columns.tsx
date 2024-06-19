'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Checkbox } from '@/Components/ui/checkbox'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/Pages/Product/Partials/table/column-header'
import { Product } from '@/Types/product'

export const columns: ColumnDef<Product>[] = [
    {
        id: 'select',
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label='Select all' />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label='Select row' />,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Quantity' align='end' />,
        cell: ({ row }) => {
            const quantity = parseFloat(row.getValue('quantity'))

            return <div className='text-right font-medium mr-4'>{quantity}</div>
        }
    },
    {
        accessorKey: 'buying_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Buying Price' align='end' />,
        cell: ({ row }) => {
            const buying_price = parseFloat(row.getValue('buying_price'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(buying_price)

            return <div className='text-right font-medium mr-4'>{formatted}</div>
        }
    },
    {
        accessorKey: 'selling_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Selling Price' align='end' />,
        cell: ({ row }) => {
            const selling_price = parseFloat(row.getValue('selling_price'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(selling_price)

            return <div className='text-right font-medium mr-4'>{formatted}</div>
        }
    },
    {
        accessorKey: 'retail_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Retail Price' align='end' />,
        cell: ({ row }) => {
            const retail_price = parseFloat(row.getValue('retail_price'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(retail_price)

            return <div className='text-right font-medium mr-4'>{formatted}</div>
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        }
    },
    {
        id: 'actions',
        header: () => (
            <div className='flex justify-center'>
                <span>Actions</span>
            </div>
        ),
        cell: ({ row }) => {
            const product = row.original

            return (
                <div className='flex justify-center items-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>Copy product ID</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit product</DropdownMenuItem>
                            <DropdownMenuItem>View product details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]
