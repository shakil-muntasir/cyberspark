import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from '@radix-ui/react-icons'

import { TableColumn } from '@/Types'
import { cn } from '@/Lib/utils'

import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'

interface DataTableColumnHeaderProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  column: TableColumn<T>
  title: string
  align?: 'start' | 'end' | 'center' | ''
}

export function DataTableColumnHeader<T>({ column, title, className, align = '' }: DataTableColumnHeaderProps<T>) {
  return (
    <div className={cn('flex items-center space-x-2', className, align !== '' ? `justify-${align}` : '')}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='-ml-3 h-8 data-[state=open]:bg-accent'>
            <span>{title}</span>
            {column.sorted === 'desc' ? <ArrowDownIcon className='ml-2 h-4 w-4' /> : column.sorted === 'asc' ? <ArrowUpIcon className='ml-2 h-4 w-4' /> : <CaretSortIcon className='ml-2 h-4 w-4' />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(true)}>
            <EyeNoneIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
