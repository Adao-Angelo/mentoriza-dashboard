import { GroupsService } from '@/services/groups/groups.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => GroupsService.deleteGroup(groupId),

    onSuccess: (_, groupId) => {
      toast.success('Grupo removido com sucesso');
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] });
      queryClient.removeQueries({ queryKey: ['groups', 'detail', groupId] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || 'Erro ao remover grupo';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
