import { DashboardService } from '@/services/dashboard/dashboard.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type ReportsTrendRange = 'day' | 'week' | 'month' | '3m' | '6m';

export interface ReportsTrendPoint {
  period: string;
  value: number;
}

export interface ReportsTrendResponse {
  range: ReportsTrendRange;
  points: ReportsTrendPoint[];
  total: number;
  average: number;
}

export function useDashboardReportsTrend(range: ReportsTrendRange) {
  return useQuery<ReportsTrendResponse, AxiosError<IErrorResponse>>({
    queryKey: ['dashboard', 'reports-trend', range],
    queryFn: () => DashboardService.getReportsTrend(range),
    staleTime: 1000 * 60 * 5,
  });
}
