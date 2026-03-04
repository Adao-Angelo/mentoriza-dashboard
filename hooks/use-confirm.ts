import { useConfirmStore } from "@/store/confirm-store";

export function useConfirm() {
  const { openConfirm } = useConfirmStore();

  return async (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }) => {
    return new Promise<boolean>((resolve) => {
      openConfirm({
        ...options,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };
}
