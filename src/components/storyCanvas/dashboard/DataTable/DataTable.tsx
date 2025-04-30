// components/storyCanvas/dashboard/DataTable/DataTable.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableRowWrapper from "./SortableRowWrapper";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import DataTablePagination from "./DataTablePagination";

import { useDashboardStore } from "@/stores/dashboard-store";
import { useState } from "react";

type DataTableProps<TData extends { id: number }, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData) => string;
  filterConfig?: {
    columnKey: string;
    placeholder: string;
  };
  enableSorting?: boolean;
};

const DataTable = <TData extends { id: number }, TValue>({
  columns,
  data,
  getRowLink,
  filterConfig,
  enableSorting = false,
}: DataTableProps<TData, TValue>) => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { setSections, sections } = useDashboardStore();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const newSections = arrayMove(sections, oldIndex, newIndex);

    const updatedWithOrder = newSections.map((s, i) => ({
      ...s,
      currentDraft: {
        ...s.currentDraft!,
        order: i,
      },
    }));
    setSections(updatedWithOrder);
  };

  const tableContent = (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const rowLink = getRowLink?.(row.original);
            const rowContent = row
              .getVisibleCells()
              .map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ));

            if (enableSorting) {
              return (
                <SortableRowWrapper
                  key={row.id}
                  id={row.original.id}
                  onClick={() => rowLink && router.push(rowLink)}
                >
                  {rowContent}
                </SortableRowWrapper>
              );
            } else {
              return (
                <TableRow
                  key={row.id}
                  onClick={() => rowLink && router.push(rowLink)}
                  className={`${
                    rowLink ? "cursor-pointer" : ""
                  } hover:bg-muted/50 transition-colors`}
                >
                  {rowContent}
                </TableRow>
              );
            }
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="w-full">
      <div className="flex items-center pb-4">
        {filterConfig && (
          <Input
            placeholder={filterConfig.placeholder}
            value={
              (table
                .getColumn(filterConfig.columnKey)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterConfig.columnKey)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border mb-6">
        {enableSorting ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {tableContent}
            </SortableContext>
          </DndContext>
        ) : (
          tableContent
        )}
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default DataTable;
