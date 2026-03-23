import { AdvisorsService } from "@/services/advisor/advisors.service";
import { ApiErrorResponse } from "@/services/service.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useDeleteAdvisor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AdvisorsService.deleteAdvisor(id),

    onSuccess: () => {
      toast.success("Orientador removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["advisors", "list"] });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg = error.response?.data?.message || "Erro ao remover orientador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
