import DeleteModal from '@/Components/DeleteModal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { TableColumn } from '@/Types'

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
}

const SimpleDataTable = <T,>({ data, columns }: TableProps<T>) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column =>
              !column.hidden ? (
                <TableHead className='px-6' key={String(column.id)}>
                  {typeof column.header === 'string' ? column.header : column.header(column)}
                </TableHead>
              ) : null
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            (data as Array<T>).map((row, index) => (
              <TableRow key={index}>
                {columns.map(column =>
                  !column.hidden ? (
                    <TableCell className='px-6 py-2' key={String(column.id)}>
                      {column.cell(row)}
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-18 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteModal />
    </>
  )
}

export default SimpleDataTable
