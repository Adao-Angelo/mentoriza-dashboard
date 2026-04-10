/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { FileDown, FileSearch2, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { AdvisorCard } from "@/components/advisor/advisor-card-a";
import { AdvisorFormDialog } from "@/components/advisor/advisor-form-dialog";
import { Can } from "@/components/rbac/can";
import { PERMISSIONS } from "@/context/permissions";
import { useAdvisors } from "@/hooks/advisors/use-advisors";
import { Advisor } from "@/services/advisor/interfaces";
import { PageSkeleton } from "./page-skeleton";

export default function AdvisorsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);

  const { data: advisors = [], isLoading } = useAdvisors();

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-3">
        <Button variant={"outline"} onClick={() => setOpenCreateDialog(true)}>
          <FileDown className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Can permission={PERMISSIONS.GROUP_ADD_MENTOR}>
          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orientador
          </Button>
        </Can>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <PageSkeleton />
        </div>
      ) : advisors.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <div className="flex justify-center item-center">
            <FileSearch2
              strokeWidth={1.5}
              className="h-12 w-12 text-muted-foreground mb-4"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhum orientador criado ainda
          </p>
          <Can permission={PERMISSIONS.GROUP_ADD_MENTOR}>
            <Button
              size={"lg"}
              className="mt-6"
              variant={"outline"}
              onClick={() => setOpenCreateDialog(true)}
            >
              <Plus />
              Criar o primeiro orientador
            </Button>
          </Can>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-3  lg:grid-cols-4">
          {advisors.map((advisor) => (
            <AdvisorCard
              key={advisor.id}
              advisor={advisor}
              onEdit={() => setEditingAdvisor(advisor)}
            />
          ))}
        </div>
      )}

      <AdvisorFormDialog
        open={openCreateDialog || !!editingAdvisor}
        onOpenChange={(open: any) => {
          if (!open) {
            setOpenCreateDialog(false);
            setEditingAdvisor(null);
          }
        }}
        advisor={editingAdvisor}
      />
    </div>
  );
}
