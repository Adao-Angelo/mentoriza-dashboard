"use client";

import {
  Eye,
  MoreHorizontal,
  Pencil,
  PhoneCall,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useActivateAdvisor } from "@/hooks/advisors/use-activate-advisor";
import { useDeactivateAdvisor } from "@/hooks/advisors/use-deactivate-advisor";
import { useDeleteAdvisor } from "@/hooks/advisors/use-delete-advisor";
import { useConfirm } from "@/hooks/use-confirm";
import type { Advisor } from "@/services/advisor/interfaces";
import { Group } from "@/services/groups/Interfaces";
import { Badge } from "../ui/badge";
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
    if (advisor.user?.status === "active") {
      const confirmed = await confirm({
        title: "Desativar Orientador",
        message: `Deseja desativar "${advisor.user?.name}"? O usuário associado também será desativado.`,
      });
      if (confirmed) deactivate(advisor.id);
    } else {
      activate(advisor.id);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Remover Orientador",
      message: `Tem certeza que deseja remover "${advisor.user?.name}" permanentemente?`,
    });
    if (confirmed) remove(advisor.id);
  };

  const GroupItem = ({
    group,
    isCoAdvisor = false,
  }: {
    group: Group;
    isCoAdvisor?: boolean;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="bg-card">
          <div
            className={`bg-card text-[14px] p-1 px-2 border-b font-semibold w-full hover:border-l border-l-primary cursor-help ${
              isCoAdvisor ? "bg-text-stroke text-gray-800 border-b-0" : ""
            }`}
          >
            <span className="text-black-dark">{group?.name}</span>
            {isCoAdvisor && (
              <span className="text-xs text-stroke ml-1">(Co-orientador)</span>
            )}
            <p className="text-Gray font-normal text-xs">{group?.course}</p>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="right"
          className="max-w-xs bg-card border rounded-lg p-4"
        >
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-sm text-black-dark">
                {group?.name}
              </p>
              <p className="text-xs text-muted-foreground">{group?.course}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Título do Projeto
              </p>
              {group.title && (
                <p className="text-sm">
                  {group?.title || "Título não definido"}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Descrição</p>
              <p className="text-sm line-clamp-3">
                {group?.description || "Descrição não definida"}
              </p>
            </div>

            {group.information && (
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Informações Adicionais
                </p>
                <p className="text-sm">{group?.information}</p>
              </div>
            )}

            <div className="pt-1 border-t text-xs text-muted-foreground">
              {group.name} Criado em{" "}
              {new Date(group?.createdAt).toLocaleDateString("pt-AO")}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="w-auto border rounded-lg py-4 px-3 bg-card">
      <div className="flex justify-between mb-3">
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
              className="h-8 w-8 shrink-0 border-Gray text-Gray hover:bg-transparent hover:text-foreground"
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
              className="flex justify-between items-center"
            >
              <div className="flex items-center">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {advisor.user?.status === "active" ? "Desativar" : "Ativar"}
              </div>
              <Switch
                checked={advisor.user?.status === "active"}
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

      <div className="flex justify-between items-center mb-3 mt-2">
        <p className="text-sm  border border-black-dark text-black-dark p-1 px-3 w-fit rounded-full">
          {advisor.specialty || "Especialidade não definida"}
        </p>

        <Badge
          variant={
            advisor.user?.status === "active" ? "success" : "destructive"
          }
        >
          <p className="font-bold">
            {advisor.user?.status === "active" ? "Ativo" : "Inativo"}
          </p>
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground font-bold flex items-center gap-2">
        <PhoneCall size={18} />
        {advisor.user?.phone || "Não fornecido"}
      </p>

      <div className="w-full border-b mt-5 mb-3"></div>

      <div>
        <h1 className="font-bold text-[12px] text-Gray mb-3">
          GRUPOS ASSOCIADOS
        </h1>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border rounded-lg">
          {advisor.advisedGroups?.map((group) => (
            <GroupItem key={group.id} group={group} />
          ))}

          {advisor.coAdvisedGroups?.map((group) => (
            <GroupItem key={`co-${group.id}`} group={group} isCoAdvisor />
          ))}

          {!advisor.advisedGroups?.length &&
            !advisor.coAdvisedGroups?.length && (
              <p className="text-sm text-muted-foreground italic py-2">
                Nenhum grupo associado
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
