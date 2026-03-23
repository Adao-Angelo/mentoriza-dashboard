import { GroupsService } from "@/services/groups/groups.service";
import { Group, UpdateGroupDto } from "@/services/groups/Interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useUpdateGroup(groupId?: number) {
  const queryClient = useQueryClient();

  return useMutation<
    Group,
    AxiosError<IErrorResponse>,
    { id: number; data: UpdateGroupDto }
  >({
    mutationFn: ({ id, data }) => GroupsService.updateGroup(id, data),

    onSuccess: (updatedGroup) => {
      toast.success("Grupo atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["groups", "list"] });
      queryClient.setQueryData(
        ["groups", "detail", updatedGroup.id],
        updatedGroup,
      );
      queryClient.invalidateQueries({
        queryKey: ["groups", "detail", updatedGroup.id],
      });
    },

    onError: (error) => {
      const msg = error?.response?.data?.message || "Erro ao atualizar grupo";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
