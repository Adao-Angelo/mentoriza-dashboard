import { Student } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useStudents() {
  return useQuery<Student[], AxiosError<IErrorResponse>>({
    queryKey: ["students", "list"],
    queryFn: StudentsService.getAllStudents,
    staleTime: 1000 * 60 * 4,
  });
}
