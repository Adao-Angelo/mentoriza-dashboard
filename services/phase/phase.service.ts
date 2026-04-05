import { API } from "@/services/api";
import { CreatePhaseDto, Phase, UpdatePhaseDto } from "./interfaces";

async function getPhases() {
  const res = await API.get<Phase[]>("/phases");
  return res.data;
}

async function getPhaseById(id: number) {
  const res = await API.get<Phase>(`/phases/${id}`);
  return res.data;
}

async function createPhase(data: CreatePhaseDto) {
  const res = await API.post<Phase>("/phases", data);
  return res.data;
}

async function updatePhase(id: number, data: UpdatePhaseDto) {
  const res = await API.patch<Phase>(`/phases/${id}`, data);
  return res.data;
}

async function deletePhase(id: number) {
  const res = await API.delete(`/phases/${id}`);
  return res.data;
}

export const PhaseService = {
  getPhases,
  getPhaseById,
  createPhase,
  updatePhase,
  deletePhase,
};
