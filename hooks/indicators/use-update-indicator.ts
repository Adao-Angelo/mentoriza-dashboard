import { IndicatorsService } from '@/services/indicator/indicators.service';
import type { UpdateIndicatorDto } from '@/services/indicator/Interfaces';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useUpdateIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIndicatorDto }) =>
      IndicatorsService.updateIndicator(id, data),

    onSuccess: () => {
      toast.success('Indicador atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['indicators', 'list'] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || 'Erro ao atualizar indicador';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
