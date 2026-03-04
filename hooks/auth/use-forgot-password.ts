import { ForgotPasswordFormData } from "@/schemas/auth/forgot-password-schema";
import { AuthService } from "@/services/auth/index.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => {
      return AuthService.ForgotPassword(data);
    },
    onSuccess: () => {
      toast.success(
        "Enviamos um e-mail para você. Verifique sua caixa de entrada.",
      );
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      const message = error.response?.data?.message;

      const formattedMessage = Array.isArray(message)
        ? message[0]
        : message || "Erro inesperado";

      toast.error(formattedMessage);
    },
  });
}
