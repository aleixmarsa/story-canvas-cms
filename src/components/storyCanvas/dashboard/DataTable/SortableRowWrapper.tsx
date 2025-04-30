"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow } from "@/components/ui/table";
import { ReactNode } from "react";

type SortableRowWrapperProps = {
  id: number;
  children: ReactNode;
  onClick?: () => void;
};

export default function SortableRowWrapper({
  id,
  children,
  onClick,
}: SortableRowWrapperProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id });

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      {...attributes}
      {...listeners}
      className="hover:bg-muted/50 transition-colors"
    >
      {children}
    </TableRow>
  );
}
