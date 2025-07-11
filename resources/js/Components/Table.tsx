import DeleteModal from '@/Components/DeleteModal'
import DataTablePagination from '@/Components/table/pagination'
import { DataTableToolbar } from '@/Components/table/toolbar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { TableProps } from '@/Types'

export default function DataTable<T>({ data, columns, filterColumnBy, searchPlaceholder }: TableProps<T>) {
  return (
    <div>
      <DataTableToolbar columns={columns} filterColumnBy={filterColumnBy} searchPlaceholder={searchPlaceholder} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>{columns.map(column => (!column.hidden ? <TableHead key={String(column.id)}>{typeof column.header === 'string' ? column.header : column.header(column)}</TableHead> : null))}</TableRow>
          </TableHeader>
          <TableBody>
            {data.data.length > 0 ? (
              (data.data as Array<T>).map((row, index) => <TableRow key={index}>{columns.map(column => (!column.hidden ? <TableCell key={String(column.id)}>{column.cell(row)}</TableCell> : null))}</TableRow>)
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
        <DataTablePagination meta={data.meta} links={data.links} />
      </div>
      <DeleteModal />
    </div>
  )
}
