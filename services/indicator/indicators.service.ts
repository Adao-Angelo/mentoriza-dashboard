import { API } from "@/services/api";
import { CreateIndicatorDto, UpdateIndicatorDto } from "./Interfaces";

async function createIndicator(data: CreateIndicatorDto) {
  const response = await API.post("/indicators", data);
  return response.data;
}

async function getAllIndicators() {
  const response = await API.get("/indicators");
  return response.data;
}

async function getIndicator(id: number) {
  const response = await API.get(`/indicators/${id}`);
  return response.data;
}

async function updateIndicator(id: number, data: UpdateIndicatorDto) {
  const response = await API.patch(`/indicators/${id}`, data);
  return response.data;
}

async function deleteIndicator(id: number) {
  const response = await API.delete(`/indicators/${id}`);
  return response.data;
}

export const IndicatorsService = {
  createIndicator,
  getAllIndicators,
  getIndicator,
  updateIndicator,
  deleteIndicator,
};
