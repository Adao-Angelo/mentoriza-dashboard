import { ApiErrorResponse } from "@/services/service.types";
import { UpdateSubmissionDto } from "@/services/submission/Interfaces";
import { SubmissionsService } from "@/services/submission/submissions.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useUpdateSubmission() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: number; data: UpdateSubmissionDto }
  >({
    mutationFn: ({ id, data }) => SubmissionsService.updateSubmission(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Submissão atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["submissions", "list"] });
      queryClient.invalidateQueries({ queryKey: ["submissions", "active"] });
      return id;
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message || "Erro ao atualizar submissão";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
