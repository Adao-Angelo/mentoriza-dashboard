"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmStore } from "@/store/confirm-store";

export function ConfirmDialog() {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    closeConfirm,
  } = useConfirmStore();

  const handleConfirm = () => {
    onConfirm();
    closeConfirm();
  };

  const handleCancel = () => {
    onCancel();
    closeConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size={"lg"} onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction size={"lg"} onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
