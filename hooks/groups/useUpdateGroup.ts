import { GroupsService } from "@/services/groups/groups.service";
import { UpdateGroupDto } from "@/services/groups/Interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useUpdateGroup(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGroupDto) =>
      GroupsService.updateGroup(groupId, data),

    onSuccess: () => {
      toast.success("Grupo atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["groups", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["groups", "detail", groupId],
      });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || "Erro ao atualizar grupo";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
