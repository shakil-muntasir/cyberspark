import DataTablePagination from '@/Components/table/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { TableProps } from '@/Types'

export default function DataTable<T>({ data, columns }: TableProps<T>) {
  return (
    <div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={String(column.id)}>{typeof column.header === 'string' ? column.header : column.header(column)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length > 0 ? (
              data.data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell key={String(column.id)}>{column.cell ? (typeof column.cell === 'string' ? row[column.cell as keyof T] : column.cell(row)) : typeof column.id === 'function' ? column.id(row) : row[column.id as keyof T]}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='pt-4'>
        <DataTablePagination data={data} />
      </div>
    </div>
  )
}
