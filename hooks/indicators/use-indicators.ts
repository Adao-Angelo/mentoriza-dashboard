import { IndicatorsService } from "@/services/indicator/indicators.service";
import type { Indicator } from "@/services/indicator/Interfaces";
import { useQuery } from "@tanstack/react-query";

export function useIndicators() {
  return useQuery<Indicator[], Error>({
    queryKey: ["indicators", "list"],
    queryFn: IndicatorsService.getAllIndicators,
    staleTime: 1000 * 60 * 5,
  });
}
