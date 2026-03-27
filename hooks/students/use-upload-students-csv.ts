/* eslint-disable @typescript-eslint/no-explicit-any */
import { StudentsService } from '@/services/students/students.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function useUploadStudentsCsv(course: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => StudentsService.uploadStudentsCsv(file, course),

    onSuccess: () => {
      toast.success('Estudantes carregados com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao carregar o ficheiro CSV. Verifique o formato e tente novamente.';

      toast.error(Array.isArray(message) ? message[0] : message);
    },

    retry: false,
  });
}
