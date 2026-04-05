import { API } from "@/services/api";

export interface PTTeacher {
  id: number;
  userId: number;
  course: "informatica" | "electronica";
  user: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    status: "active" | "inactive";
  };
}

export interface CreatePTTeacherDto {
  email: string;
  name: string;
  password?: string;
  phone?: string;
  course: "informatica" | "electronica";
}

export interface UpdatePTTeacherDto {
  email?: string;
  name?: string;
  phone?: string;
  course?: "informatica" | "electronica";
}

async function getAll() {
  const res = await API.get<PTTeacher[]>("/pt-teachers");
  return res.data;
}

async function getById(id: number) {
  const res = await API.get<PTTeacher>(`/pt-teachers/${id}`);
  return res.data;
}

async function create(data: CreatePTTeacherDto) {
  const res = await API.post<PTTeacher>("/pt-teachers", data);
  return res.data;
}

async function update(id: number, data: UpdatePTTeacherDto) {
  const res = await API.patch<PTTeacher>(`/pt-teachers/${id}`, data);
  return res.data;
}

async function deactivate(id: number) {
  const res = await API.patch(`/pt-teachers/${id}/deactivate`);
  return res.data;
}

async function activate(id: number) {
  const res = await API.patch(`/pt-teachers/${id}/activate`);
  return res.data;
}

export const PTTeacherService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};
