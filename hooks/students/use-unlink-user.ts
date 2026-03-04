import { MessageResponse } from "@/services/service.types";
import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useUnlinkUser() {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, AxiosError<IErrorResponse>, number>({
    mutationFn: (studentId) => StudentsService.unlinkUser(studentId),

    onSuccess: (_, studentId) => {
      toast.success("Usuário desvinculado do estudante");
      queryClient.invalidateQueries({
        queryKey: ["students", "detail", studentId],
      });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || "Erro ao desvincular usuário";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
