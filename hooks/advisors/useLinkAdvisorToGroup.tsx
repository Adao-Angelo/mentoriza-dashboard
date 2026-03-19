/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useLinkAdvisorToGroup(isCoAdvisor: boolean = false) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      advisorId,
    }: {
      groupId: number;
      advisorId: number;
    }) => {
      const endpoint = isCoAdvisor
        ? `/groups/${groupId}/link-co-advisor`
        : `/groups/${groupId}/link-advisor`;

      const { data } = await API.post(endpoint, { advisorId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['advisors'] });
      queryClient.invalidateQueries({ queryKey: ['advisors', 'list'] });

      toast.success(
        `Orientador ${isCoAdvisor ? 'co-' : ''}vinculado com sucesso!`
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Erro ao vincular orientador';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}
