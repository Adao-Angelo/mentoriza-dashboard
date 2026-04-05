export interface Phase {
  id: number;
  name: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhaseDto {
  name: string;
  description?: string;
  order?: number;
}

export interface UpdatePhaseDto {
  name?: string;
  description?: string;
  order?: number;
}
