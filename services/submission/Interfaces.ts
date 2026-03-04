export interface CreateSubmissionDto {
  endDate: string;
  stage: number;
}

export interface UpdateSubmissionDto {
  status?: "active" | "inactive";
  endDate?: string;
  stage?: number;
}

export interface Submission {
  id: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  stage: number;
  createdAt: string;
  updatedAt: string;
}
