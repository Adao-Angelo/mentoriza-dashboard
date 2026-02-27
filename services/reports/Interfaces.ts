type ReportStatus = 'under_review' | 'approved' | 'rejected';

export interface CreateReportDto {
  groupId: number;
  submissionId: number;
  fileUrl: string;
  publicId?: string;
  score?: number;
  observations?: string[];
}

export interface UpdateReportDto {
  groupId?: number;
  submissionId?: number;
  fileUrl?: string;
  publicId?: string;
  score?: number;
  observations?: string[];
}

export interface Report {
  id: number;
  groupId: number;
  submissionId: number;
  fileUrl: string;
  publicId?: string;
  status: ReportStatus;
  score?: number;
  observations?: string;
  keyResults?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ReportListResponse = Report[];

export interface ReportSingleResponse {
  data: Report;
}

export interface UpdateStatusPayload {
  status: ReportStatus;
}

export interface UpdateAIResultsPayload {
  score: number;
  observations: string[];
  keyResults: Record<string, unknown>;
}
