import { GroupsService } from "@/services/groups/groups.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useLinkStudentToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { groupId: number; studentId: number }) =>
      GroupsService.linkStudent(data.groupId, { studentId: data.studentId }),

    onSuccess: () => {
      toast.success("Estudante vinculado ao grupo");
      queryClient.invalidateQueries({
        queryKey: ["groups", "detail"],
      });
      queryClient.invalidateQueries({ queryKey: ["students", "list"] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || "Erro ao vincular estudante";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
