import { IndicatorsService } from "@/services/indicator/indicators.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useCreateIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: IndicatorsService.createIndicator,

    onSuccess: () => {
      toast.success("Indicador criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["indicators", "list"] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || "Erro ao criar indicador";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
