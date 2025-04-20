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
  userEmail: string;
};

export const DeleteUserDialog = ({ onConfirm, userEmail }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <span className="flex items-center gap-2">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{userEmail}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
