import { ReportsService } from '@/services/reports/reports.service';
import { ApiErrorResponse } from '@/services/service.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useUploadReportPdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, groupId }: { file: File; groupId: number }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('groupId', groupId.toString());

      return ReportsService.uploadReportPdf(formData);
    },
    onSuccess: () => {
      toast.success('Relatório enviado com sucesso! Em avaliação...');
      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error?.message || 'Erro ao enviar o relatório');
      console.error('Upload error:', error);
    },
  });
}
