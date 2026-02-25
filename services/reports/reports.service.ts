import axios from "axios";
import { Report } from "./Interfaces";

export const reportsService = {
  getAll: async (): Promise<Report[]> => {
    const { data } = await axios.get("/api/reports");
    return data;
  },

  getById: async (id: number): Promise<Report> => {
    const { data } = await axios.get(`/api/reports/${id}`);
    return data;
  },

  create: async (file: File, groupId: number): Promise<Report> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", groupId.toString());

    const { data } = await axios.post(
      "/api/uploads/reports-pdf", 
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axios.delete(`/api/reports/${id}`);
  },

  updateStatus: async (id: number, status: string, observations?: string) => {
    const response = await axios.put(`/api/reports/${id}`, {
      status,
      observations,
    });

    return response.data;
  },
};