import type { Report } from "@/services/reports/Interfaces";
import { ReportsService } from "@/services/reports/reports.service";
import { useQuery } from "@tanstack/react-query";

export function useReportsBySubmission(submissionId: number | undefined) {
  return useQuery<Report[], Error>({
    queryKey: ["reports", "submission", submissionId],
    queryFn: () => ReportsService.getReportsBySubmission(submissionId!),
    enabled: !!submissionId,
    staleTime: 1000 * 60 * 3,
  });
}
