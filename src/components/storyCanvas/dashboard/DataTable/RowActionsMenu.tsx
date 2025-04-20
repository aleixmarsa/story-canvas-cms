"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RowActionsMenuProps<T> = {
  editHref?: string;
  onDelete?: () => void;
  renderDeleteButton?: (item: T) => React.ReactNode;
  additionalItems?: React.ReactNode;
  item: T;
};

const RowActionsMenu = <T,>({
  editHref,
  onDelete,
  renderDeleteButton,
  additionalItems,
  item,
}: RowActionsMenuProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open row actions</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {editHref && (
          <Link href={editHref} passHref>
            <DropdownMenuItem asChild>
              <span className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </span>
            </DropdownMenuItem>
          </Link>
        )}

        {renderDeleteButton
          ? renderDeleteButton(item)
          : onDelete && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}

        {additionalItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionsMenu;
