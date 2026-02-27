/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageResponse } from '@/services/service.types';
import { LinkGroupDto } from '@/services/students/Interfaces';
import { StudentsService } from '@/services/students/students.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function useLinkGroup() {
  const queryClient = useQueryClient();

  return useMutation<
    MessageResponse,
    Error,
    { studentId: number; data: LinkGroupDto }
  >({
    mutationFn: ({ studentId, data }) =>
      StudentsService.linkGroup(studentId, data),

    onSuccess: (_, { studentId }) => {
      toast.success('Estudante vinculado ao grupo com sucesso');
      queryClient.invalidateQueries({
        queryKey: ['students', 'detail', studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['students', 'group', studentId],
      });
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Erro ao vincular ao grupo';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
