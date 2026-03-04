import { GroupsService } from "@/services/groups/groups.service";
import { Group } from "@/services/groups/Interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGroup(id: number | null) {
  return useQuery<Group, AxiosError<IErrorResponse>>({
    queryKey: ["groups", "detail", id],
    queryFn: () => GroupsService.getGroup(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });
}
