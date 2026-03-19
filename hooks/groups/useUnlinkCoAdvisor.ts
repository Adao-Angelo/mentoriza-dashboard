import { GroupsService } from '@/services/groups/groups.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface UseUnlinkCoAdvisorProps {
  groupId: number;
}

export function useUnlinkCoAdvisor({ groupId }: UseUnlinkCoAdvisorProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => GroupsService.unlinkCoAdvisor(groupId),

    onSuccess: () => {
      toast.success('Co-orientador removido do grupo');
      queryClient.invalidateQueries({
        queryKey: ['groups', 'detail', groupId],
      });
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || 'Erro ao remover orientador';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
