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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSections } from "@/lib/swr/useSections";
import { useState } from "react";
import { RenderSectionData } from "@/types/section";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePreviewChannel } from "@/hooks/use-preview-iframe";
import { LIVE_PREVIEW_MESSAGES } from "@/lib/constants/story-canvas";
import { setPreviewData } from "@/lib/preview-storage/preview-storage";

type BaseProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData) => string;
  filterConfig?: {
    columnKey: string;
    placeholder: string;
  };
  isPreviewVisible?: boolean;
  addButtonLabel?: string;
  addHref?: string;
  onAddClick?: () => void;
  dataIsLoading?: boolean;
  dataFetchingError?: boolean;
  customHeaderMessage?: React.ReactNode;
};

// If `enableSorting` is true, `id` is required
//
type SortableProps<TData, TValue> = {
  enableSorting: true;
  selectedStoryId: number;
} & BaseProps<TData, TValue>;

// If `enableSorting` is false, `id` is not required
type NonSortableProps<TData, TValue> = {
  enableSorting?: false;
  selectedStoryId?: number;
} & BaseProps<TData, TValue>;

// The `DataTableProps` type is a union of `SortableProps` and `NonSortableProps`.
type DataTableProps<TData, TValue> =
  | SortableProps<TData, TValue>
  | NonSortableProps<TData, TValue>;

const DataTable = <TData, TValue>(props: DataTableProps<TData, TValue>) => {
  const {
    columns,
    data,
    getRowLink,
    filterConfig,
    enableSorting = false,
    addButtonLabel,
    addHref,
    onAddClick,
    dataFetchingError,
    dataIsLoading,
    selectedStoryId,
    customHeaderMessage,
  } = props;
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { sections = [], mutate: mutateSections } =
    useSections(selectedStoryId);

  const { sendMessage } = usePreviewChannel();

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
    mutateSections((prev) => {
      if (!prev) return prev;

      return updatedWithOrder;
    }, false);
    const previewData: RenderSectionData[] = updatedWithOrder.map((s) => ({
      id: s.currentDraftId || 0,
      name: s.currentDraft?.name || "",
      order: s.currentDraft?.order || 0,
      type: s.currentDraft?.type,
      content: s.currentDraft?.content,
    }));
    sendPreviewUpdate(previewData);
  };
  const sendPreviewUpdate = (data: RenderSectionData[]) => {
    sendMessage({
      type: LIVE_PREVIEW_MESSAGES.updateAllSections,
      payload: data,
    });
    // Save preview data to local storage
    setPreviewData("sort-sections", data);
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
              const sortableRow = row.original as { id: number };
              return (
                <SortableRowWrapper
                  key={sortableRow.id}
                  id={sortableRow.id}
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
      <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-center justify-between pb-4">
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

        <div className="flex items-center gap-2 ml-auto">
          {customHeaderMessage}
          {(addHref || onAddClick) &&
            addButtonLabel &&
            (addHref ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                data-testid="table-add-button"
                className="h-[36px]"
              >
                <Link href={addHref}>
                  <Plus className="w-4 h-4 mr-1" />
                  {addButtonLabel}
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={onAddClick}>
                <Plus className="w-4 h-4 mr-1" />
                {addButtonLabel}
              </Button>
            ))}
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border mb-6 min-h-[100px] flex items-center justify-center">
        {dataFetchingError ? (
          <p className="text-destructive text-sm">Error loading data.</p>
        ) : dataIsLoading ? (
          <Loader2 className="animate-spin" />
        ) : enableSorting ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
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
    </div>
  );
};

export default DataTable;
