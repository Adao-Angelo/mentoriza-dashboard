import { UpdateStudentDto } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentDto }) =>
      StudentsService.updateStudent(id, data),

    onSuccess: (_, variables) => {
      toast.success("Estudante atualizado");
      queryClient.invalidateQueries({
        queryKey: ["students", "detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["students", "list"] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || "Erro ao atualizar";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
