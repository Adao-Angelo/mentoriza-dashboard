import { API } from "../api";
import { LinkUserDto } from "../students/Interfaces";
import { CreateAdvisorDto, UpdateAdvisorDto } from "./interfaces";

async function createAdvisor(data: CreateAdvisorDto) {
  const response = await API.post("/advisors", data);
  return response.data;
}

async function getAllAdvisors() {
  const response = await API.get("/advisors");
  return response.data;
}

async function getAdvisor(id: number) {
  const response = await API.get(`/advisors/${id}`);
  return response.data;
}

async function updateAdvisor(id: number, data: UpdateAdvisorDto) {
  const response = await API.patch(`/advisors/${id}`, data);
  return response.data;
}

async function deactivateAdvisor(id: number) {
  const response = await API.patch(`/advisors/${id}/deactivate`);
  return response.data;
}

async function activateAdvisor(id: number) {
  const response = await API.patch(`/advisors/${id}/activate`);
  return response.data;
}

async function linkAdvisorToUser(id: number, data: LinkUserDto) {
  const response = await API.post(`/advisors/${id}/link-user`, data);
  return response.data;
}

async function unlinkAdvisorFromUser(id: number) {
  const response = await API.delete(`/advisors/${id}/unlink-user`);
  return response.data;
}

async function getAdvisorUser(id: number) {
  const response = await API.get(`/advisors/${id}/user`);
  return response.data;
}

async function getAdvisedGroups(id: number) {
  const response = await API.get(`/advisors/${id}/groups`);
  return response.data;
}

export const AdvisorsService = {
  createAdvisor,
  getAllAdvisors,
  getAdvisor,
  updateAdvisor,
  deactivateAdvisor,
  activateAdvisor,
  linkAdvisorToUser,
  unlinkAdvisorFromUser,
  getAdvisorUser,
  getAdvisedGroups,
};
