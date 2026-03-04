import { AdvisorsService } from "@/services/advisor/advisors.service";
import { UpdateAdvisorDto } from "@/services/advisor/interfaces";
import { ApiErrorResponse } from "@/services/service.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useUpdateAdvisor() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: number; data: UpdateAdvisorDto }
  >({
    mutationFn: ({ id, data }) => AdvisorsService.updateAdvisor(id, data),
    onSuccess: () => {
      toast.success("Orientador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["advisors", "list"] });
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message || "Erro ao atualizar orientador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
