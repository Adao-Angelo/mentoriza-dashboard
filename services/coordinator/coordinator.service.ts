import { API } from "@/services/api";

export interface Coordinator {
  id: number;
  userId: number;
  user: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    status: "active" | "inactive";
  };
}

export interface CreateCoordinatorDto {
  email: string;
  name: string;
  password?: string;
  phone?: string;
}

export interface UpdateCoordinatorDto {
  email?: string;
  name?: string;
  phone?: string;
}

async function getAll() {
  const res = await API.get<Coordinator[]>("/coordinators");
  return res.data;
}

async function getById(id: number) {
  const res = await API.get<Coordinator>(`/coordinators/${id}`);
  return res.data;
}

async function create(data: CreateCoordinatorDto) {
  const res = await API.post<Coordinator>("/coordinators", data);
  return res.data;
}

async function update(id: number, data: UpdateCoordinatorDto) {
  const res = await API.patch<Coordinator>(`/coordinators/${id}`, data);
  return res.data;
}

async function deactivate(id: number) {
  const res = await API.patch(`/coordinators/${id}/deactivate`);
  return res.data;
}

async function activate(id: number) {
  const res = await API.patch(`/coordinators/${id}/activate`);
  return res.data;
}

export const CoordinatorService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};
