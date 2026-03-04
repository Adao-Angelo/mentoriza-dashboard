import { AuthService } from "@/services/auth/index.service";
import { ResetPasswordPayload } from "@/services/auth/types";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => AuthService.ResetPassword(data),
    onSuccess: () => {
      toast.success(
        "Senha redefinida com sucesso! Já pode iniciar sessão com as novas credenciais.",
      );

      router.replace("/login");
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
