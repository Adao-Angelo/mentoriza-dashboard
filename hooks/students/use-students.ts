import { StudentListResponse } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface StudentQueryParams {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string;
  groupId?: number;
}

export function useStudents(
  params: StudentQueryParams = { page: 1, perPage: 10 },
) {
  const query = useQuery<StudentListResponse, AxiosError<IErrorResponse>>({
    queryKey: [
      "students",
      params.page,
      params.perPage,
      params.q,
      params.status,
      params.groupId,
    ],
    queryFn: () => StudentsService.getAllStudents(params),
    staleTime: 1000 * 60 * 4,
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    data: query.data?.data ?? [],
    meta: query.data?.meta,
  };
}
