"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  getRowLink?: (row: TData) => string;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  onRowClick,
  getRowLink,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-md divide-y divide-muted">
      {/* Header */}
      <div className="grid grid-cols-12 bg-muted text-sm font-medium px-4 py-2">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              className="col-span-3 truncate"
              style={{ gridColumn: `span ${Math.floor(12 / columns.length)}` }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </div>
          ))
        )}
      </div>

      {/* Body */}
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => {
          const rowData = row.original;
          const isClickable = onRowClick || getRowLink;
          const href = getRowLink?.(rowData);

          const RowContent = (
            <div
              className={`grid grid-cols-12 px-4 py-3 text-sm hover:bg-muted/40 transition-colors ${
                isClickable ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (!href && onRowClick) onRowClick(rowData);
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className="col-span-3 truncate"
                  style={{
                    gridColumn: `span ${Math.floor(12 / columns.length)}`,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          );

          return href ? (
            <Link key={row.id} href={href} className="block">
              {RowContent}
            </Link>
          ) : (
            <div key={row.id}>{RowContent}</div>
          );
        })
      ) : (
        <div className="p-4 text-center text-muted-foreground text-sm">
          No results.
        </div>
      )}
    </div>
  );
};

export default DataTable;
