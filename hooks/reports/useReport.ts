import type { Report } from '@/services/reports/Interfaces';
import { ReportsService } from '@/services/reports/reports.service';
import { useQuery } from '@tanstack/react-query';

export function useReport(reportId: number | undefined) {
  return useQuery<Report, Error>({
    queryKey: ['reports', 'detail', reportId],
    queryFn: () => ReportsService.getReportById(reportId!),
    enabled: !!reportId,
    staleTime: 1000 * 60 * 2,
  });
}
