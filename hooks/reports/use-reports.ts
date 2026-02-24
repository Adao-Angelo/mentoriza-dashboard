import { useState, useEffect } from "react";
import { Report } from "@/services/reports/Interfaces";
import { reportsService } from "@/services/reports/reports.service";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getAll();
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (file: File, groupId: number) => {
    try {
      setUploading(true);
      const newReport = await reportsService.create(file, groupId);
      setReports((prev) => [newReport, ...prev]);
    } finally {
      setUploading(false);
    }
  };

  const removeLocalReport = async (id: number) => {
    try {
      await reportsService.remove(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    reports,
    loading,
    uploading,
    createReport,
    removeLocalReport,
    fetchReports,
  };
};