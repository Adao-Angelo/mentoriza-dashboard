import { GroupsService } from '@/services/groups/groups.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: GroupsService.createGroup,

    onSuccess: () => {
      toast.success('Grupo criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg = error?.response?.data?.message || 'Erro ao criar grupo';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
