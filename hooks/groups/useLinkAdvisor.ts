import { GroupsService } from "@/services/groups/groups.service";
import { LinkAdvisorDto } from "@/services/groups/Interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useLinkAdvisor(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LinkAdvisorDto) =>
      await GroupsService.linkAdvisor(groupId, data),

    onSuccess: () => {
      toast.success("Orientador vinculado com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["groups", "detail", groupId],
      });
      queryClient.invalidateQueries({ queryKey: ["groups", "list"] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || "Erro ao vincular orientador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
