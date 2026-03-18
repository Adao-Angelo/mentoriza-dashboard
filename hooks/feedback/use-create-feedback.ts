import { FeedbackService } from '@/services/feedback/feedback.service';
import type {
  CreateFeedbackDto,
  Feedback,
} from '@/services/feedback/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation<Feedback, unknown, CreateFeedbackDto>({
    mutationFn: (data) => FeedbackService.createFeedback(data),
    onSuccess: (_, variables) => {
      toast.success('Feedback criado com sucesso');
      queryClient.invalidateQueries({
        queryKey: ['feedbacks', { groupId: variables.groupId }],
      });
      if (variables.reportId) {
        queryClient.invalidateQueries({
          queryKey: ['feedbacks', { reportId: variables.reportId }],
        });
      }
    },
  });
}
