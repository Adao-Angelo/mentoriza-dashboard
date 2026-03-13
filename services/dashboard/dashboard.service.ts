import { API } from "@/services/api";
import { DashboardStats } from "./interfaces";

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await API.get<DashboardStats>("/dashboard/stats");
    return data;
  },
};
