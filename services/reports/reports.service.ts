import { API } from '@/services/api';
import type {
  CreateReportDto,
  UpdateAIResultsPayload,
  UpdateReportDto,
  UpdateStatusPayload,
} from './Interfaces';

async function createReport(data: CreateReportDto) {
  const res = await API.post('/reports', data);
  return res.data;
}

async function getAllReports() {
  const res = await API.get('/reports');
  return res.data;
}

async function getReportById(id: number) {
  const res = await API.get(`/reports/${id}`);
  return res.data;
}

async function getReportsBySubmission(submissionId: number) {
  const res = await API.get(`/reports/submission/${submissionId}`);
  return res.data;
}

async function getReportsByGroup(groupId: number) {
  const res = await API.get(`/reports/group/${groupId}`);
  return res.data;
}

async function updateReport(id: number, data: UpdateReportDto) {
  const res = await API.patch(`/reports/${id}`, data);
  return res.data;
}

async function updateReportStatus(id: number, payload: UpdateStatusPayload) {
  const res = await API.patch(`/reports/${id}/status`, payload);
  return res.data;
}

async function updateReportWithAIResults(
  id: number,
  payload: UpdateAIResultsPayload
) {
  const res = await API.patch(`/reports/${id}/ai-results`, payload);
  return res.data;
}

async function deleteReport(id: number) {
  const res = await API.delete(`/reports/${id}`);
  return res.data;
}

export const ReportsService = {
  createReport,
  getAllReports,
  getReportById,
  getReportsBySubmission,
  getReportsByGroup,
  updateReport,
  updateReportStatus,
  updateReportWithAIResults,
  deleteReport,
};
