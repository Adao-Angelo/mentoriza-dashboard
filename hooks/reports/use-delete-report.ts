import { ReportsService } from '@/services/reports/reports.service';
import { ApiErrorResponse, MessageResponse } from '@/services/service.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, AxiosError<ApiErrorResponse>, number>({
    mutationFn: (id) => ReportsService.deleteReport(id),

    onSuccess: (_, reportId) => {
      toast.success('Relatório removido com sucesso');

      queryClient.removeQueries({ queryKey: ['reports', 'detail', reportId] });

      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível remover o relatório';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
