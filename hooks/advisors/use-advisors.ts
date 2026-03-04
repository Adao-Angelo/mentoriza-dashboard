import { AdvisorsService } from "@/services/advisor/advisors.service";
import { Advisor } from "@/services/advisor/interfaces";
import { ApiErrorResponse } from "@/services/service.types";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useAdvisors() {
  return useQuery<Advisor[], AxiosError<ApiErrorResponse>>({
    queryKey: ["advisors", "list"],
    queryFn: AdvisorsService.getAllAdvisors,
    staleTime: 1000 * 60 * 5,
  });
}
