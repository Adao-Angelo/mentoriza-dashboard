import { Phase } from "../phase/interfaces";

export interface CreateSubmissionDto {
  endDate: string;
  stage: number;
  phaseId?: number;
}

export interface UpdateSubmissionDto {
  status?: "active" | "inactive";
  endDate?: string;
  stage?: number;
  phaseId?: number;
}

export interface Submission {
  id: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  stage: number;
  phaseId?: number;
  phase?: Phase;
  createdAt: string;
  updatedAt: string;
}
