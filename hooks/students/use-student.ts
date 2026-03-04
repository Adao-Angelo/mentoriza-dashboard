import { Student } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useStudent(id: number | null) {
  return useQuery<Student, AxiosError<IErrorResponse>>({
    queryKey: ["students", "detail", id],
    queryFn: () => StudentsService.getStudent(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}
