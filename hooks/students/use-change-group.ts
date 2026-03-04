/* eslint-disable @typescript-eslint/no-explicit-any */

import { MessageResponse } from "@/services/service.types";
import { LinkGroupDto } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useChangeGroup() {
  const queryClient = useQueryClient();

  return useMutation<
    MessageResponse,
    Error,
    { studentId: number; data: LinkGroupDto }
  >({
    mutationFn: ({ studentId, data }) =>
      StudentsService.changeGroup(studentId, data),

    onSuccess: (_, { studentId }) => {
      toast.success("Grupo do estudante alterado com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["students", "detail", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["students", "group", studentId],
      });
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Erro ao alterar o grupo";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
