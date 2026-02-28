import { GroupsService } from '@/services/groups/groups.service';
import { GenerateGroupsDto } from '@/services/groups/Interfaces';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useGenerateGroups() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateGroupsDto) => GroupsService.generateGroups(data),

    onSuccess: () => {
      toast.success('Grupos gerados com sucesso');
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message ||
        'Erro ao gerar grupos automaticamente';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
