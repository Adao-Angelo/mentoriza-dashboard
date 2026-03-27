import { API } from '@/services/api';
import type {
  CreateGroupDto,
  GenerateGroupsDto,
  LinkAdvisorDto,
  LinkStudentDto,
  UpdateGroupDto,
} from './Interfaces';

async function createGroup(data: CreateGroupDto) {
  const response = await API.post('/groups', data);
  return response.data;
}

async function getAllGroups(course: string) {
  const response = await API.get('/groups', {
    params: { course },
  });
  return response.data;
}

async function getGroup(id: number) {
  const response = await API.get(`/groups/${id}`);
  return response.data;
}

async function updateGroup(id: number, data: UpdateGroupDto) {
  const response = await API.patch(`/groups/${id}`, data);
  return response.data;
}

async function deleteGroup(id: number) {
  const response = await API.delete(`/groups/${id}`);
  return response.data;
}

async function linkAdvisor(id: number, data: LinkAdvisorDto) {
  console.log('[FRONT] Enviando linkAdvisor → ', {
    groupId: id,
    payload: data,
  });
  try {
    const response = await API.post(`/groups/${id}/link-advisor`, data);
    console.log('[FRONT] Sucesso linkAdvisor → ', response.data);
    return response.data;
  } catch (err) {
    console.error('[FRONT] Erro linkAdvisor → ', err);
    throw err;
  }
}

async function changeAdvisor(id: number, data: LinkAdvisorDto) {
  const response = await API.post(`/groups/${id}/change-advisor`, data);
  return response.data;
}

async function unlinkAdvisor(id: number) {
  const response = await API.delete(`/groups/${id}/unlink-advisor`);
  return response.data;
}

async function linkCoAdvisor(id: number, data: LinkAdvisorDto) {
  const response = await API.post(`/groups/${id}/link-co-advisor`, data);
  return response.data;
}

async function unlinkCoAdvisor(id: number) {
  const response = await API.delete(`/groups/${id}/unlink-co-advisor`);
  return response.data;
}

async function linkStudent(id: number, data: LinkStudentDto) {
  const response = await API.post(`/groups/${id}/link-student`, data);
  return response.data;
}

async function unlinkStudent(id: number, studentId: number) {
  const response = await API.delete(
    `/groups/${id}/unlink-student/${studentId}`
  );
  return response.data;
}

async function generateGroups(data: GenerateGroupsDto) {
  const response = await API.post('/groups/generate', data);
  return response.data;
}
async function linkStudents(groupId: number, studentIds: number[]) {
  const response = await API.post(`/groups/${groupId}/link-students`, {
    studentIds,
  });
  return response.data;
}

export const GroupsService = {
  createGroup,
  getAllGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  linkAdvisor,
  changeAdvisor,
  unlinkAdvisor,
  linkCoAdvisor,
  unlinkCoAdvisor,
  linkStudent,
  linkStudents,
  unlinkStudent,
  generateGroups,
};
