import { ReportsService } from '@/services/reports/reports.service';
import { ApiErrorResponse } from '@/services/service.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useUploadReportDocx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      file: File;
      groupId: number;
      sources?: string[];
    }) => {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('groupId', payload.groupId.toString());

      if (payload.sources?.length) {
        formData.append('sources', JSON.stringify(payload.sources));
      }

      return ReportsService.uploadReportDocx(formData);
    },
    onSuccess: () => {
      toast.success('Relatório enviado com sucesso! Em avaliação...');
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg = error?.response?.data?.message || 'Erro ao criar relatório';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
