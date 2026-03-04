import { AdvisorsService } from "@/services/advisor/advisors.service";
import { Advisor } from "@/services/advisor/interfaces";
import { ApiErrorResponse } from "@/services/service.types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetAdvisorGroups(id: number | null) {
  return useQuery<Advisor["groups"], AxiosError<ApiErrorResponse>>({
    queryKey: ["advisors", "groups", id],
    queryFn: () => AdvisorsService.getAdvisedGroups(id!),
    enabled: !!id,
  });
}
