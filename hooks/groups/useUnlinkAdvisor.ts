import { GroupsService } from '@/services/groups/groups.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useUnlinkAdvisor(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => GroupsService.unlinkAdvisor(groupId),

    onSuccess: () => {
      toast.success('Orientador removido do grupo');
      queryClient.invalidateQueries({
        queryKey: ['groups', 'detail', groupId],
      });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || 'Erro ao remover orientador';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
