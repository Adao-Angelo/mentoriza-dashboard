/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FileSearch2,
  MoreHorizontal,
  Pencil,
  Plus,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import GlobalLoader from "@/components/loader";
import { SubmissionFormDialog } from "@/components/submissions/submission-form-dialog";
import { useDeleteSubmission } from "@/hooks/submissions/use-delete-submission";
import { useSubmissions } from "@/hooks/submissions/use-submissions";
import { useUpdateSubmission } from "@/hooks/submissions/use-update-submission";
import { useConfirm } from "@/hooks/use-confirm";
import { Submission } from "@/services/submission/Interfaces";
import { Can } from "@/components/rbac/can";
import { PERMISSIONS } from "@/context/permissions";

export default function SubmissionsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null,
  );

  const { data: submissions = [], isLoading } = useSubmissions();
  const { mutate: update } = useUpdateSubmission();
  const { mutate: remove } = useDeleteSubmission();
  const confirm = useConfirm();

  const handleClose = async (submission: Submission) => {
    if (submission.status === "inactive") return;

    const confirmed = await confirm({
      title: "Fechar Submissão",
      message: `Deseja fechar a submissão #${submission.id} (Etapa ${submission.stage})? Não será possível reabrir.`,
    });

    if (confirmed) {
      update({ id: submission.id, data: { status: "inactive" } });
    }
  };

  const handleDelete = async (submission: Submission) => {
    const confirmed = await confirm({
      title: "Remover Submissão",
      message: `Tem certeza que deseja remover a submissão #${submission.id}? Esta ação é irreversível.`,
    });

    if (confirmed) {
      remove(submission.id);
    }
  };

  return (
    <div className="container rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-xl font-bold tracking-tight"></h1>
        <Can permission={PERMISSIONS.SUBMISSION_CREATE}>
          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus /> Nova Submissão
          </Button>
        </Can>  
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <GlobalLoader variant="mini" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <div className="flex justify-center item-center">
            <FileSearch2
              strokeWidth={1.5}
              className="h-12 w-12 text-muted-foreground mb-4"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhuma submissão criada ainda
          </p>
          <Button
            size={"lg"}
            className="mt-6"
            onClick={() => setOpenCreateDialog(true)}
          >
            <Plus /> Criar a primeira submissão
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fase</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.stage}</TableCell>
                  <TableCell>
                    {new Date(submission.startDate).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    {new Date(submission.endDate).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        submission.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800",
                      )}
                    >
                      {submission.status === "active" ? "Aberta" : "Fechada"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Can permission={PERMISSIONS.SUBMISSION_MANAGE}>
                          <DropdownMenuItem
                            onClick={() => setEditingSubmission(submission)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        </Can>
                        {submission.status === "active" && (
                          <Can permission={PERMISSIONS.SUBMISSION_MANAGE}>
                            <DropdownMenuItem
                              onClick={() => handleClose(submission)}
                            >
                              <PowerOff className="mr-2 h-4 w-4 text-warning" />
                              Fechar
                            </DropdownMenuItem>
                          </Can>
                        )}
                        <Can permission={PERMISSIONS.SUBMISSION_MANAGE}>
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={() => handleDelete(submission)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </Can>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <SubmissionFormDialog
        open={openCreateDialog || !!editingSubmission}
        onOpenChange={(open: any) => {
          if (!open) {
            setOpenCreateDialog(false);
            setEditingSubmission(null);
          }
        }}
        submission={editingSubmission}
      />
    </div>
  );
}
