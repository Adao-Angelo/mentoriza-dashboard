import { AdvisorsService } from "@/services/advisor/advisors.service";
import { ApiErrorResponse } from "@/services/service.types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useActivateAdvisor() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, number>({
    mutationFn: AdvisorsService.activateAdvisor,
    onSuccess: () => {
      toast.success("Orientador ativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["advisors", "list"] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Erro ao ativar orientador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
