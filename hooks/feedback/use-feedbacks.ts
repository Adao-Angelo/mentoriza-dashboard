import { FeedbackService } from '@/services/feedback/feedback.service';
import type { Feedback } from '@/services/feedback/interfaces';
import { useQuery } from '@tanstack/react-query';

export function useFeedbacks(filters?: {
  groupId?: number;
  reportId?: number;
}) {
  return useQuery<Feedback[], Error>({
    queryKey: ['feedbacks', filters],
    queryFn: () => FeedbackService.getFeedbacks(filters),
    enabled: !!filters,
  });
}
