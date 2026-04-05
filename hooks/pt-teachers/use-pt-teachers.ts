/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreatePTTeacherDto,
  PTTeacherService,
  UpdatePTTeacherDto,
} from "@/services/pt-teacher/pt-teacher.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function usePTTeachers() {
  return useQuery({
    queryKey: ["pt-teachers"],
    queryFn: () => PTTeacherService.getAll(),
  });
}

export function usePTTeacher(id: number) {
  return useQuery({
    queryKey: ["pt-teachers", id],
    queryFn: () => PTTeacherService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePTTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePTTeacherDto) => PTTeacherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pt-teachers"] });
      toast.success("Professor criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erro ao criar professor");
    },
  });
}

export function useUpdatePTTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePTTeacherDto }) =>
      PTTeacherService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pt-teachers"] });
      queryClient.invalidateQueries({
        queryKey: ["pt-teachers", variables.id],
      });
      toast.success("Professor atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar professor",
      );
    },
  });
}

export function useDeactivatePTTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PTTeacherService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pt-teachers"] });
      toast.success("Professor desativado!");
    },
  });
}

export function useActivatePTTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PTTeacherService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pt-teachers"] });
      toast.success("Professor ativado!");
    },
  });
}
