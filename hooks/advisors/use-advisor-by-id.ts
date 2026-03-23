import { AdvisorsService } from "@/services/advisor/advisors.service";
import { Advisor } from "@/services/advisor/interfaces";
import { useQuery } from "@tanstack/react-query";

export function useAdvisorById(advisorId: number) {
  return useQuery<Advisor>({
    queryKey: ["advisors", "detail", advisorId],
    queryFn: () => AdvisorsService.getAdvisor(advisorId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!advisorId,
  });
}
