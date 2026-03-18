import {
  ReportsTrendRange,
  ReportsTrendResponse,
} from "@/hooks/dashboard/use-dashboard-reports-trend";
import { API } from "@/services/api";
import { DashboardStats } from "./interfaces";

async function getStats(): Promise<DashboardStats> {
  const { data } = await API.get<DashboardStats>("/dashboard/stats");
  return data;
}

async function getReportsTrend(range: ReportsTrendRange) {
  const { data } = await API.get<ReportsTrendResponse>(
    "/dashboard/reports-trend",
    {
      params: { range },
    },
  );
  return data;
}

export const DashboardService = {
  getStats,
  getReportsTrend,
};
