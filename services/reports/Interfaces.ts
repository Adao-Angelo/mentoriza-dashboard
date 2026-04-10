/* eslint-disable @typescript-eslint/no-explicit-any */

export type ReportStatus = "under_review" | "approved" | "rejected";

export type ReportDestination =
  | "PERSONAL_TEST"
  | "MENTOR_REVIEW"
  | "FINAL_SUBMISSION";

export interface CreateReportDto {
  groupId: number;
  submissionId: number;
  fileUrl: string;
  publicId?: string;
  score?: number;
  grade?: number;
  observations?: string[];
  destination?: ReportDestination;
}

export interface UpdateReportDto {
  groupId?: number;
  submissionId?: number;
  fileUrl?: string;
  publicId?: string;
  score?: number;
  grade?: number;
  observations?: string[];
  destination?: ReportDestination;
}

export interface ABNTViolation {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  indicator: string;
  text_reference?: string;
}

export interface ABNTPoint {
  sub_score: number;
  violations: ABNTViolation[];
  details: Record<string, any>;
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

export interface Metadata {
  margins_px: MarginsPx;
  paragraph_count: number;
}

export interface MarginsPx {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ProblematicViolation {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  indicator: string;
  text_reference?: string;
}

export interface ProblematicResult {
  score: number;
  errors: ProblematicViolation[];
  key_results?: Record<string, number>;
  observations?: string[];
  details?: Record<string, any>;
}

export interface TheoreticalViolation {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  indicator: string;
  text_reference?: string;
}

export interface TheoreticalResult {
  score: number;
  errors: TheoreticalViolation[];
  key_results?: Record<string, number>;
  observations?: string[];
  details?: Record<string, any>;
}

export interface AIResult {
  ai_percentage: number;
  is_ai_generated: boolean;
  confidence?: number;
  error?: string;
}

export interface Group {
  id: number;
  name: string;
  course: string;
  title?: string;
  description?: string;
  information?: string;
  hasApprovedReport: boolean;
  advisorId?: number;
  coAdvisorId?: number;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Submission {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  stage: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Preview {
  html: string;
  metadata: Metadata;
}

export interface Metadata {
  margins_px: MarginsPx;
  paragraph_count: number;
}

export interface MarginsPx {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Report {
  id: number;
  groupId: number;
  submissionId: number;
  fileUrl: string;
  publicId?: string;
  preview?: Preview;
  destination: ReportDestination;

  status: ReportStatus;
  rejectionReason?: string | null;

  score?: number;
  grade?: number;
  observations?: string[];

  /** Resultados detalhados por indicador */
  keyResults?: {
    abnt?: ABNTResult;
    problematic?: ProblematicResult;
    theoretical?: TheoreticalResult;
    ai_detection?: AIResult;
  };

  /** Erros gerais do processamento (nível superior) */
  errors: any[];

  /** Fontes utilizadas (quando aplicável) */
  sources?: string[];

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
