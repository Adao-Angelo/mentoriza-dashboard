import {
  CoordinatorService,
  CreateCoordinatorDto,
  UpdateCoordinatorDto,
} from "@/services/coordinator/coordinator.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useCoordinators() {
  return useQuery({
    queryKey: ["coordinators"],
    queryFn: () => CoordinatorService.getAll(),
  });
}

export function useCoordinator(id: number) {
  return useQuery({
    queryKey: ["coordinators", id],
    queryFn: () => CoordinatorService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCoordinator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoordinatorDto) => CoordinatorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
      toast.success("Coordenador criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao criar coordenador",
      );
    },
  });
}

export function useUpdateCoordinator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCoordinatorDto }) =>
      CoordinatorService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
      queryClient.invalidateQueries({
        queryKey: ["coordinators", variables.id],
      });
      toast.success("Coordenador atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar coordenador",
      );
    },
  });
}

export function useDeactivateCoordinator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CoordinatorService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
      toast.success("Coordenador desativado!");
    },
  });
}

export function useActivateCoordinator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CoordinatorService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
      toast.success("Coordenador ativado!");
    },
  });
}
