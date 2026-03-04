import type { Report } from "@/services/reports/Interfaces";
import { ReportsService } from "@/services/reports/reports.service";
import { useQuery } from "@tanstack/react-query";

export function useReportsByGroup(groupId: number | undefined) {
  return useQuery<Report[], Error>({
    queryKey: ["reports", "group", groupId],
    queryFn: () => ReportsService.getReportsByGroup(groupId!),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 3,
  });
}
