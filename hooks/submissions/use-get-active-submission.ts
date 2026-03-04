import { ApiErrorResponse } from '@/services/service.types';
import { Submission } from '@/services/submission/Interfaces';
import { SubmissionsService } from '@/services/submission/submissions.service';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useGetActiveSubmission() {
  return useQuery<Submission | null, AxiosError<ApiErrorResponse>>({
    queryKey: ['submissions', 'active'],
    queryFn: SubmissionsService.getActiveSubmission,
    staleTime: 1000 * 60 * 3,
  });
}
