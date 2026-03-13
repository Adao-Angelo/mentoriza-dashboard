export interface CreateAdvisorDto {
  email: string;
  name: string;
  specialty?: string;
  lattes?: string;
  phone?: string;
}

export interface UpdateAdvisorDto {
  email?: string;
  name?: string;
  specialty?: string;
  lattes?: string;
  phone?: string;
}

export interface Advisor {
  id: number;
  name: string;
  email: string;
  specialty?: string;
  lattes?: string;

  active: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    status: string;
    phone?: string;
  };
  groups?: Array<{ id: number; name: string }>;
  advisedGroups: Array<{ name: string }>;
  coAdvisedGroups: Array<{ name: string }>;
}
