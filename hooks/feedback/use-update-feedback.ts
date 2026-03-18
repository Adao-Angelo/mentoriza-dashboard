import { FeedbackService } from '@/services/feedback/feedback.service';
import type {
  Feedback,
  UpdateFeedbackDto,
} from '@/services/feedback/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation<
    Feedback,
    unknown,
    { id: number; data: UpdateFeedbackDto }
  >({
    mutationFn: ({ id, data }) => FeedbackService.updateFeedback(id, data),
    onSuccess: (updatedFeedback) => {
      toast.success('Feedback atualizado com sucesso');
      queryClient.invalidateQueries({
        queryKey: ['feedbacks', { groupId: updatedFeedback.groupId }],
      });
      if (updatedFeedback.reportId) {
        queryClient.invalidateQueries({
          queryKey: ['feedbacks', { reportId: updatedFeedback.reportId }],
        });
      }
    },
  });
}
