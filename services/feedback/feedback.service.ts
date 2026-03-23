import { API } from "@/services/api";
import type {
  CreateFeedbackDto,
  Feedback,
  UpdateFeedbackDto,
} from "./interfaces";

async function getFeedbacks(params?: { groupId?: number; reportId?: number }) {
  const res = await API.get<Feedback[]>("/feedbacks", { params });
  return res.data;
}

async function createFeedback(data: CreateFeedbackDto) {
  const res = await API.post<Feedback>("/feedbacks", data);
  return res.data;
}

async function updateFeedback(id: number, data: UpdateFeedbackDto) {
  const res = await API.patch<Feedback>(`/feedbacks/${id}`, data);
  return res.data;
}

async function deleteFeedback(id: number) {
  const res = await API.delete(`/feedbacks/${id}`);
  return res.data;
}

export const FeedbackService = {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
