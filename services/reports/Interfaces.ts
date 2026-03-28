/* eslint-disable @typescript-eslint/no-explicit-any */

type ReportStatus = "under_review" | "approved" | "rejected";

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

export interface ABNTPoint {
  sub_score: number;
  violations: ABNTViolation[];
  details: Record<string, any>;
}

export interface ABNTViolation {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  indicator: string;
  text_reference?: string;
}

export interface ABNTResult {
  conformity_percentage: number;
  score: number;
  violations: ABNTViolation[];
  abnt_points: {
    structure: ABNTPoint;
    citations: ABNTPoint;
    formatting: ABNTPoint;
    tables_figures: ABNTPoint;
  };
  details: {
    fonts_used: string[];
    sizes_used: number[];
    margins_cm: {
      top: number;
      left: number;
      right: number;
      bottom: number;
    };
    sections_found?: string[];
    spacing_issues?: number;
  };
}

export interface AIResult {
  ai_percentage: number;
  is_ai_generated: boolean;
  confidence?: number;
  error?: string;
}

export interface ProblematicResult {
  score?: number;
  violations?: any[];
  details?: any;
}

export interface TheoreticalResult {
  score?: number;
  violations?: any[];
  details?: any;
}

export interface Group {
  id: number;
  name: string;
  course: string;
  title?: string;
  description?: string;
  hasApprovedReport: boolean;
  advisorId?: number;
  coAdvisorId?: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  stage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: number;
  groupId: number;
  submissionId: number;
  fileUrl: string;
  publicId?: string;
  status: ReportStatus;
  rejectionReason?: string | null;
  score?: number;
  observations?: string[];

  /** Resultados detalhados por indicador */
  keyResults?: {
    abnt?: ABNTResult;
    ai_detection?: AIResult;
    problematic?: ProblematicResult;
    theoretical?: TheoreticalResult;
  };

  /** Erros gerais do processamento */
  errors: any[];

  /** Relacionamentos */
  group?: Group;
  submission?: Submission;

  /** Datas */
  createdAt: string;
  updatedAt: string;
  analyzedAt?: string;
  deletedAt?: string | null;
}

export type ReportListResponse = Report[];

export interface ReportSingleResponse {
  data: Report;
}

export interface UpdateStatusPayload {
  status: ReportStatus;
  rejectionReason?: string;
}

export interface UpdateAIResultsPayload {
  score: number;
  observations: string[];
  keyResults: Record<string, unknown>;
}
