import { GroupsService } from '@/services/groups/groups.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useUnlinkStudentFromGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { groupId: number; studentId: number }) =>
      GroupsService.unlinkStudent(data.groupId, data.studentId),

    onSuccess: (data) => {
      toast.success('Estudante removido do grupo');
      queryClient.invalidateQueries({
        queryKey: ['groups', 'detail', data?.groupId],
      });
      queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const msg =
        error?.response?.data?.message || 'Erro ao remover estudante do grupo';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
