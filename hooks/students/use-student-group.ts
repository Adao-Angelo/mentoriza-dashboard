import { StudentListResponse } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useStudentGroup(studentId: number | null) {
  return useQuery<StudentListResponse | null, AxiosError<IErrorResponse>>({
    queryKey: ["students", "group", studentId],
    queryFn: async () => {
      try {
        return await StudentsService.getStudentGroup(studentId!);
      } catch (error) {
        return error;
        return null;
      }
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 10,
    placeholderData: null,
  });
}
