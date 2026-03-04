import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => StudentsService.deleteStudentCascade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Estudante removido com sucesso");
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error.response?.data?.message || "Erro ao remover estudante";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
