import { ApiErrorResponse } from "@/services/service.types";
import { Submission } from "@/services/submission/Interfaces";
import { SubmissionsService } from "@/services/submission/submissions.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useSubmissions() {
  return useQuery<Submission[], AxiosError<ApiErrorResponse>>({
    queryKey: ["submissions", "list"],
    queryFn: SubmissionsService.getAllSubmissions,
    staleTime: 1000 * 60 * 5,
  });
}
