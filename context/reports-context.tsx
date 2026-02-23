"use client";

import { createContext, useContext, useState } from "react";

export interface Report {
  id: string;
  groupNumber: number;
  theme: string;
  date: string;
  status: string;
  fileName: string;
}

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  updateStatus: (id: string, status: string) => void;
}

const ReportsContext = createContext<ReportsContextType | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = (report: Report) => {
    setReports((prev) => [...prev, report]);
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const updateStatus = (id: string, status: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
  };

  return (
    <ReportsContext.Provider
      value={{ reports, addReport, deleteReport, updateStatus }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used inside ReportsProvider");
  }
  return context;
}