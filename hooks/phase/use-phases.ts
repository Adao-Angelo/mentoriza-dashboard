import { PhaseService } from "@/services/phase/phase.service";
import { useQuery } from "@tanstack/react-query";

export function usePhases() {
  return useQuery({
    queryKey: ["phases", "list"],
    queryFn: () => PhaseService.getPhases(),
  });
}
