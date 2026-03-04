import { GroupsService } from "@/services/groups/groups.service";
import { Group } from "@/services/groups/Interfaces";
import { IErrorResponse } from "@/shared/Interface/IErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGroups() {
  return useQuery<Group[], AxiosError<IErrorResponse>>({
    queryKey: ["groups", "list"],
    queryFn: GroupsService.getAllGroups,
    staleTime: 1000 * 60 * 5,
  });
}
