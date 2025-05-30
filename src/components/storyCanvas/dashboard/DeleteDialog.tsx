"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";

type Props = {
  onConfirm: () => void;
  dialogTitle: string;
  itemName: string;
};

const DeleteDialog = ({ onConfirm, dialogTitle, itemName }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={(e) => e.stopPropagation()}
          className="px-2 w-full justify-start"
          data-testid="delete-dialog-trigger"
        >
          <span className="flex items-center justify-start gap-2">
            <Trash className="h-4 w-4" />
            Delete
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-dialog-title">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription data-testid="delete-dialog-description">
            Are you sure you want to delete <strong>{itemName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
              }}
              data-testid="delete-dialog-cancel-button"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
              }}
              data-testid="delete-dialog-confirm-button"
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
