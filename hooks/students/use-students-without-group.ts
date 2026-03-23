import { Student } from "@/services/students/Interfaces";
import { StudentsService } from "@/services/students/students.service";
import { useQuery } from "@tanstack/react-query";

export function useStudentsWithoutGroup(course?: string) {
  return useQuery<Student[], Error>({
    queryKey: ["students", "without-group", course],
    queryFn: () => StudentsService.getStudentsWithoutGroup(course),
    staleTime: 5 * 60 * 1000,
  });
}
