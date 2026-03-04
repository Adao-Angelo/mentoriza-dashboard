import { AdvisorsService } from "@/services/advisor/advisors.service";
import { ApiErrorResponse } from "@/services/service.types";
import { LinkUserDto } from "@/services/students/Interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export function useLinkAdvisorToUser() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    { id: number; data: LinkUserDto }
  >({
    mutationFn: ({ id, data }) => AdvisorsService.linkAdvisorToUser(id, data),
    onSuccess: () => {
      toast.success("Usuário vinculado ao orientador com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["advisors", "list"] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Erro ao vincular usuário";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
