import type { Student } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { useQuery } from "@tanstack/react-query";

export function useStudentById(studentId: number | undefined) {
  return useQuery<Student>({
    queryKey: ["students", "detail", studentId],
    queryFn: () => StudentsService.getStudent(studentId!),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 2,
  });
}
