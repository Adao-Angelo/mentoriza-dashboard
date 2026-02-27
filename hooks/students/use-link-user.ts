/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageResponse } from '@/services/service.types';
import { LinkUserDto } from '@/services/students/Interfaces';
import { StudentsService } from '@/services/students/students.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function useLinkUser() {
  const queryClient = useQueryClient();

  return useMutation<
    MessageResponse,
    Error,
    { studentId: number; data: LinkUserDto }
  >({
    mutationFn: ({ studentId, data }) =>
      StudentsService.linkUser(studentId, data),

    onSuccess: (_, { studentId }) => {
      toast.success('Usuário vinculado ao estudante com sucesso');
      queryClient.invalidateQueries({
        queryKey: ['students', 'detail', studentId],
      });
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Erro ao vincular usuário';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
