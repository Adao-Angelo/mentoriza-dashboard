import { CreateReportDto } from '@/services/reports/Interfaces';
import { ReportsService } from '@/services/reports/reports.service';
import { ApiErrorResponse, MessageResponse } from '@/services/service.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation<
    MessageResponse,
    AxiosError<ApiErrorResponse>,
    CreateReportDto
  >({
    mutationFn: (data) => ReportsService.createReport(data),

    onSuccess: () => {
      toast.success('Relatório criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },

    onError: (error) => {
      const msg = error?.response?.data?.message || 'Erro ao criar relatório';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
