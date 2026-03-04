import { IndicatorsService } from "@/services/indicator/indicators.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useDeleteIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IndicatorsService.deleteIndicator(id),

    onSuccess: () => {
      toast.success("Indicador removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["indicators", "list"] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || "Erro ao remover indicador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
