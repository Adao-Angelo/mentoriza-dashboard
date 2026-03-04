import { ApiErrorResponse } from "@/services/service.types";
import { SubmissionsService } from "@/services/submission/submissions.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, number>({
    mutationFn: SubmissionsService.deleteSubmission,
    onSuccess: (_, id) => {
      toast.success("Submissão removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["submissions", "list"] });
      queryClient.invalidateQueries({ queryKey: ["submissions", "active"] });
      return id;
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Erro ao remover submissão";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
