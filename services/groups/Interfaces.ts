import { Student } from "../students/Interfaces";

export interface AdvisorUser {
  name: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  course: string;
  advisor?: {
    id: number;
    specialty: string;
    user: AdvisorUser;
  };
  coAdvisor?: {
    id: number;
    specialty: string;
    user: AdvisorUser;
  } | null;
  students: Array<Student>;
  createdAt: string;
  updatedAt: string;
}

export type GroupListResponse = Group[];

export interface GroupSingleResponse {
  data: Group;
}

export interface CreateGroupDto {
  name: string;
  course: string;
  advisorId?: number;
  coAdvisorId?: number;
}

export interface UpdateGroupDto {
  name?: string;
  course?: string;
  advisorId?: number;
  coAdvisorId?: number;
}

export interface LinkAdvisorDto {
  advisorId: number;
}

export interface LinkStudentDto {
  studentId: number;
}

export interface GenerateGroupsDto {
  groupSize: number;
  course: string;
}
