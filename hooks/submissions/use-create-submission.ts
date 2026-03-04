import { ApiErrorResponse } from '@/services/service.types';
import { CreateSubmissionDto } from '@/services/submission/Interfaces';
import { SubmissionsService } from '@/services/submission/submissions.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    CreateSubmissionDto
  >({
    mutationFn: SubmissionsService.createSubmission,
    onSuccess: () => {
      toast.success('Submissão criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['submissions', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['submissions', 'active'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Erro ao criar submissão';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
}
