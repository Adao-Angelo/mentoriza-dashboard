"use client";

import { Eye, MoreHorizontal, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

import { useActivateAdvisor } from "@/hooks/advisors/use-activate-advisor";
import { useDeactivateAdvisor } from "@/hooks/advisors/use-deactivate-advisor";
import { useDeleteAdvisor } from "@/hooks/advisors/use-delete-advisor";
import { useConfirm } from "@/hooks/use-confirm";
import type { Advisor } from "@/services/advisor/interfaces";
import UserProfileDisplay from "../user-profile-display";
interface AdvisorCardProps {
  advisor: Advisor;
  onEdit: () => void;
}

export function AdvisorCard({ advisor, onEdit }: AdvisorCardProps) {
  const { mutate: activate } = useActivateAdvisor();
  const { mutate: deactivate } = useDeactivateAdvisor();
  const { mutate: remove } = useDeleteAdvisor();
  const confirm = useConfirm();

  const handleToggleActive = async () => {
    if (advisor.user?.status == "active") {
      const confirmed = await confirm({
        title: "Desativar Orientador",
        message: `Deseja desativar "${advisor.name}"? O usuário associado também será desativado.`,
      });
      if (confirmed) deactivate(advisor.id);
    } else {
      activate(advisor.id);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Remover Orientador",
      message: `Tem certeza que deseja remover "${advisor.name}" permanentemente?`,
    });
    if (confirmed) remove(advisor.id);
  };

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-start mb-2">
        <UserProfileDisplay
          username={advisor.user?.name}
          email={advisor.user?.email}
          status={advisor.user?.status}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-color-stroke text-Gray"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/mentors/${advisor.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleToggleActive}
              className="flex justify-between"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {advisor.user?.status == "active" ? "Desativar" : "Ativar"}
              <Switch
                checked={advisor.user?.status == "active"}
                className="ml-2"
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm mb-4 mt-4 bg-purple-100 text-primary p-1 px-2 w-fit rounded-full">
        {advisor.specialty || "Especialidade não definida"}
      </p>
      <p className="text-sm text-muted-foreground font-bold">
        {advisor.user?.phone || "Não fornecido"}
      </p>

      <div className="w-full border-b mt-4"></div>
      <div className="mt-2">
        <h1 className="font-bold text-[12px] text-Gray">GRUPOS ASSOCIADOS</h1>
        <div className="flex flex-wrap gap-2 mt-3">
          {advisor.advisedGroups?.map((group, index) => (
            <span
              key={`${group.name} + ${index}`}
              className="text-[14px] bg-gray-200 text-gray-800 p-1 px-2 rounded-[8px] font-semibold"
            >
              {group.name}
            </span>
          ))}
          {advisor.coAdvisedGroups?.map((group, index) => (
            <span
              key={`${group.name} + ${index}`}
              className="text-[14px] bg-gray-200 text-gray-800 p-1 px-2 rounded-[8px] font-semibold"
            >
              {group.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
