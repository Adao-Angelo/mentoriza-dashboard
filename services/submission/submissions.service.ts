import { API } from "../api";
import type { CreateSubmissionDto, UpdateSubmissionDto } from "./Interfaces";

async function createSubmission(data: CreateSubmissionDto) {
  const response = await API.post("/submissions", data);
  return response.data;
}

async function updateSubmission(id: number, data: UpdateSubmissionDto) {
  const response = await API.patch(`/submissions/${id}`, data);
  return response.data;
}

async function getActiveSubmission() {
  const response = await API.get("/submissions/active");
  return response.data;
}

async function getAllSubmissions() {
  const response = await API.get("/submissions");
  return response.data;
}

async function deleteSubmission(id: number) {
  const response = await API.delete(`/submissions/${id}`);
  return response.data;
}

export const SubmissionsService = {
  createSubmission,
  updateSubmission,
  getActiveSubmission,
  getAllSubmissions,
  deleteSubmission,
};
