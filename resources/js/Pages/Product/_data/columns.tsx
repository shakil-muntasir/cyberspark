import { TableColumn } from '@/Types'
import { Product } from '@/Types/product'
import { DataTableColumnHeader } from '@/Components/table/column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { Button } from '@/Components/ui/button'
import { MoreHorizontal } from 'lucide-react'

const toggleSorting = (desc: boolean) => {
  console.log(`Sorting toggled to ${desc ? 'descending' : 'ascending'}`)
}

const toggleVisibility = (hidden: boolean) => {
  console.log(`Visibility toggled to ${hidden ? 'hidden' : 'visible'}`)
}

const createColumns = <T,>(columns: Omit<TableColumn<T>, 'toggleSorting' | 'toggleVisibility' | 'enableSorting' | 'hidden'>[]): TableColumn<T>[] => {
  return columns.map(column => ({
    toggleSorting,
    toggleVisibility,
    enableSorting: true,
    hidden: false,
    ...column
  }))
}

const columns: TableColumn<Product>[] = createColumns([
  {
    id: 'id',
    header: 'ID',
    cell: row => <span>{row.id}</span>
  },
  {
    id: 'name',
    header: column => <DataTableColumnHeader column={column} title='Name' />
  },
  {
    id: 'quantity',
    header: column => <DataTableColumnHeader column={column} title='Quantity' align='end' />,
    cell: ({ quantity }) => {
      return <div className='text-right font-medium mr-4'>{quantity}</div>
    }
  },
  {
    id: 'buying_price',
    header: column => <DataTableColumnHeader column={column} title='Buying Price' align='end' />,
    cell: ({ buying_price }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(buying_price)

      return <div className='text-right font-medium mr-4'>{formatted}</div>
    }
  },
  {
    id: 'selling_price',
    header: column => <DataTableColumnHeader column={column} title='Selling Price' align='end' />,
    cell: ({ selling_price }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(selling_price)

      return <div className='text-right font-medium mr-4'>{formatted}</div>
    }
  },
  {
    id: 'retail_price',
    header: column => <DataTableColumnHeader column={column} title='Retail Price' align='end' />,
    cell: ({ retail_price }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(retail_price)

      return <div className='text-right font-medium mr-4'>{formatted}</div>
    }
  },
  {
    id: 'status',
    header: column => <DataTableColumnHeader column={column} title='Status' />,
    cell: row => <span>{row.status}</span>
  },
  {
    id: 'actions',
    header: () => (
      <div className='flex justify-center'>
        <span>Actions</span>
      </div>
    ),
    cell: ({ id }) => {
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>Copy product ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit product</DropdownMenuItem>
              <DropdownMenuItem>View product details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
])

export { columns }
