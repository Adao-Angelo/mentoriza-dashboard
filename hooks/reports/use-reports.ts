import type { Report } from "@/services/reports/Interfaces";
import { ReportsService } from "@/services/reports/reports.service";
import { useQuery } from "@tanstack/react-query";

export function useReports() {
  return useQuery<Report[], Error>({
    queryKey: ["reports", "list"],
    queryFn: () => ReportsService.getAllReports(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
