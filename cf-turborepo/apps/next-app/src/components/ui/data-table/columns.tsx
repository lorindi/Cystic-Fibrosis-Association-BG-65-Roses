import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface DataTableColumn<TData> {
  accessorKey: keyof TData
  header: string
  cell?: (props: { row: { original: TData } }) => React.ReactNode
}

export function createColumns<TData>(columns: DataTableColumn<TData>[]): ColumnDef<TData>[] {
  return columns.map((column) => ({
    accessorKey: column.accessorKey as string,
    header: column.header,
    cell: column.cell
      ? ({ row }) => column.cell!({ row })
      : ({ row }) => row.getValue(column.accessorKey as string),
  }))
} 