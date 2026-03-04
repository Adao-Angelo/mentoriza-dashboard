import { AdvisorsService } from "@/services/advisor/advisors.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import { CreateAdvisorDto } from "@/services/advisor/interfaces";
import { ApiErrorResponse } from "@/services/service.types";

export function useCreateAdvisor() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorResponse>, CreateAdvisorDto>({
    mutationFn: AdvisorsService.createAdvisor,
    onSuccess: () => {
      toast.success("Orientador criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["advisors", "list"] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Erro ao criar orientador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
