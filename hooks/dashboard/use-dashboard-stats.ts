import { DashboardService } from "@/services/dashboard/dashboard.service";
import { DashboardStats } from "@/services/dashboard/interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useDashboardStats() {
  return useQuery<DashboardStats, AxiosError<IErrorResponse>>({
    queryKey: ["dashboard", "stats"],
    queryFn: DashboardService.getStats,
    staleTime: 1000 * 60 * 5,
  });
}
