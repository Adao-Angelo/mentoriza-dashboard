import { Report, UpdateStatusPayload } from '@/services/reports/Interfaces';
import { ReportsService } from '@/services/reports/reports.service';
import { ApiErrorResponse } from '@/services/service.types';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Report,
    AxiosError<ApiErrorResponse>,
    { id: number; payload: UpdateStatusPayload }
  >({
    mutationFn: ({ id, payload }) =>
      ReportsService.updateReportStatus(id, payload),

    onSuccess: (updatedReport, variables) => {
      toast.success(`Status atualizado para ${updatedReport.status}`);

      queryClient.setQueryData(
        ['reports', 'detail', variables.id],
        updatedReport
      );

      queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
      queryClient.invalidateQueries({
        queryKey: ['reports', 'submission', updatedReport.submissionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reports', 'group', updatedReport.groupId],
      });
    },

    onError: (error) => {
      const msg =
        error?.response?.data?.message || 'Não foi possível atualizar o status';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
