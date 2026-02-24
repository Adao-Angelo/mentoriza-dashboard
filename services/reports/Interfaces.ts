export interface ReportKeyResults {
  aiContent: number
  abntCompliance: number
  plagiarism: number
}

export interface Report {
  title: string
  id: number
  groupId: number
  submissionId: number
  fileUrl: string
  publicId: string
  status: 'under_review' | 'approved' | 'rejected'
  score: number
  observations: string
  keyResults: ReportKeyResults
  createdAt: string
  updatedAt: string
}