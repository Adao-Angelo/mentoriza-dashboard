export interface Feedback {
  id: number;
  groupId: number;
  reportId?: number;
  authorId?: number;
  message: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackDto {
  groupId: number;
  reportId?: number;
  authorId?: number;
  message: string;
  type?: string;
}

export interface UpdateFeedbackDto {
  message?: string;
  type?: string;
  authorId?: number;
}
