import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  openConfirm: (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  closeConfirm: () => void;
  resolve: ((value: boolean) => void) | null;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  title: "Confirmação",
  message: "",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  onConfirm: () => {},
  onCancel: () => {},
  resolve: null,

  openConfirm: ({
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  }) =>
    set({
      isOpen: true,
      title: title || "Confirmação",
      message,
      confirmText: confirmText || "Confirmar",
      cancelText: cancelText || "Cancelar",
      onConfirm,
      onCancel: onCancel || (() => {}),
    }),

  closeConfirm: () => set({ isOpen: false }),
}));
