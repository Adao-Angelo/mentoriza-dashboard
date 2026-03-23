import { API } from "@/services/api";
import type {
  CreateStudentDto,
  LinkGroupDto,
  LinkUserDto,
  UpdateStudentDto,
} from "./Interfaces";

async function createStudent(data: CreateStudentDto) {
  const response = await API.post("/students", data);
  return response.data;
}

interface GetStudentsParams {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string;
  groupId?: number;
}

async function getAllStudents(params: GetStudentsParams = {}) {
  const response = await API.get("/students", { params });
  return response.data;
}

async function getStudent(id: number) {
  const response = await API.get(`/students/${id}`);
  return response.data;
}

async function getStudentGroup(id: number) {
  const response = await API.get(`/students/${id}/group`);
  return response.data;
}

async function updateStudent(id: number, data: UpdateStudentDto) {
  const response = await API.patch(`/students/${id}`, data);
  return response.data;
}

async function deactivateStudent(id: number) {
  const response = await API.patch(`/students/${id}/deactivate`);
  return response.data;
}

async function activateStudent(id: number) {
  const response = await API.patch(`/students/${id}/activate`);
  return response.data;
}

async function linkGroup(id: number, data: LinkGroupDto) {
  const response = await API.post(`/students/${id}/link-group`, data);
  return response.data;
}

async function unlinkGroup(id: number) {
  const response = await API.delete(`/students/${id}/unlink-group`);
  return response.data;
}

async function linkUser(id: number, data: LinkUserDto) {
  const response = await API.post(`/students/${id}/link-user`, data);
  return response.data;
}

async function unlinkUser(id: number) {
  const response = await API.delete(`/students/${id}/unlink-user`);
  return response.data;
}

async function changeGroup(id: number, data: LinkGroupDto) {
  const response = await API.post(`/students/${id}/change-group`, data);
  return response.data;
}

async function deleteStudentCascade(id: number) {
  const response = await API.delete(`/students/${id}/cascade`);
  return response;
}

async function uploadStudentsCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/uploads/students-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

async function getStudentsWithoutGroup(course?: string) {
  const params = course ? { course } : {};
  const response = await API.get("/students/without-group/available", {
    params,
  });
  return response.data;
}

export const StudentsService = {
  createStudent,
  getAllStudents,
  getStudent,
  getStudentGroup,
  updateStudent,
  deactivateStudent,
  activateStudent,
  linkGroup,
  unlinkGroup,
  linkUser,
  unlinkUser,
  changeGroup,
  uploadStudentsCsv,
  deleteStudentCascade,
  getStudentsWithoutGroup,
};
