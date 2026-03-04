import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: StudentsService.createStudent,

    onSuccess: () => {
      toast.success("Estudante criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["students", "list"] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || "Erro ao criar estudante";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
