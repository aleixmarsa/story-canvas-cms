"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash, Rocket } from "lucide-react";
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
  onPublish?: () => void;
};

const RowActionsMenu = <T,>({
  editHref,
  onDelete,
  renderDeleteButton,
  additionalItems,
  item,
  onPublish,
}: RowActionsMenuProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => e.stopPropagation()}
        data-testid="row-actions-menu"
      >
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open row actions</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {editHref && (
          <DropdownMenuItem asChild>
            <Link
              href={editHref}
              className="flex items-center gap-2 px-2 py-1.5 w-full text-sm hover:bg-muted cursor-pointer font-medium"
              data-testid="action-edit-button"
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil className="h-4 w-4" color="black" />
              Edit
            </Link>
          </DropdownMenuItem>
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
                  data-testid="action-delete-button"
                >
                  <span className="flex items-center justify-start gap-2">
                    <Trash className="h-4 w-4" color="black" />
                    Delete
                  </span>
                </Button>
              </DropdownMenuItem>
            )}
        {onPublish && (
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onPublish();
              }}
              className="px-2 w-full justify-start"
              data-testid="action-delete-button"
            >
              <span className="flex items-center justify-start gap-2">
                <Rocket className="h-4 w-4" color="black" />
                Publish
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
