import { GroupsService } from "@/services/groups/groups.service";
import { LinkAdvisorDto } from "@/services/groups/Interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function useChangeAdvisor(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LinkAdvisorDto) =>
      GroupsService.changeAdvisor(groupId, data),

    onSuccess: () => {
      toast.success("Orientador atualizado com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["groups", "detail", groupId],
      });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || "Erro ao trocar orientador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
