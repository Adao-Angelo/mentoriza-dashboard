export interface Student {
  id: number;
  name: string;
  email: string;
  ra?: string;
  course?: string;
  class?: string;
  phone?: string;
  birthDate?: string;
  active: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  group?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

export type StudentListResponse = Student[];

export interface StudentSingleResponse {
  data: Student;
}

export interface CreateStudentDto {
  email: string;
  name: string;
  ra?: string;
  course?: string;
  class?: string;
  phone?: string;
  birthDate?: string;
}

export interface UpdateStudentDto {
  email?: string;
  name?: string;
  ra?: string;
  course?: string;
  class?: string;
  phone?: string;
  birthDate?: string;
}

export interface LinkGroupDto {
  groupId: number;
}

export interface LinkUserDto {
  email: string;
}
