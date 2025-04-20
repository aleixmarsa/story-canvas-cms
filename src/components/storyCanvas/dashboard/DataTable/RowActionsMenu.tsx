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
              <Button
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                className="px-2 w-full justify-start"
              >
                <span className="flex items-center justify-start gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </span>
              </Button>
            </DropdownMenuItem>
          </Link>
        )}

        {renderDeleteButton
          ? renderDeleteButton(item)
          : onDelete && (
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="px-2 w-full justify-start"
                >
                  <span className="flex items-center justify-start gap-2">
                    <Trash className="h-4 w-4" />
                    Delete
                  </span>
                </Button>
              </DropdownMenuItem>
            )}

        {additionalItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionsMenu;
