/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupsService } from "@/services/groups/groups.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useLinkStudentsToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { groupId: number; studentIds: number[] }) =>
      GroupsService.linkStudents(data.groupId, data.studentIds),

    onSuccess: () => {
      toast.success("Estudantes vinculados ao grupo com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({
        queryKey: ["students", "without-group"],
      });
    },

    onError: (error: AxiosError<any>) => {
      const msg =
        error?.response?.data?.message || "Erro ao vincular estudantes";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
