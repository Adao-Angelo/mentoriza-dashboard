"use client";

import { useState } from "react";

import GlobalLoader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateReportStatus } from "@/hooks/reports/use-update-report-status";
import { useReport } from "@/hooks/reports/useReport";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams } from "next/navigation";

export default function ReportDetailsPage() {
  const params = useParams();
  const reportId = Number(params.id);

  const { data: report, isLoading } = useReport(reportId);
  const updateStatus = useUpdateReportStatus();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const observations = report?.observations ?? [];

  const handleApprove = () => {
    if (!report) return;
    updateStatus.mutate({
      id: report.id,
      payload: { status: "approved" },
    });
  };

  const handleReject = () => {
    if (!report) return;

    updateStatus.mutate({
      id: report.id,
      payload: { status: "rejected", rejectionReason },
    });

    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-100">
        <GlobalLoader variant="mini" />
      </div>
    );
  }

  if (!report) {
    return <div className="p-6">Relatório não encontrado.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Relatório #{report.id}</h1>

        <div className="flex gap-3">
          <Button
            onClick={handleApprove}
            disabled={report.status === "approved"}
          >
            Aprovar Relatório
          </Button>

          <Dialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" disabled={report.status === "rejected"}>
                Reprovar Relatório
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Reprovar relatório</DialogTitle>
                <DialogDescription>
                  Informe a razão pela qual o relatório está sendo rejeitado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Motivo da reprovação"
                  className="min-h-[140px]"
                />
              </div>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectionReason("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant={"destructive"}
                  disabled={!rejectionReason.trim() || updateStatus.isPending}
                  onClick={handleReject}
                >
                  {updateStatus.isPending ? "Reprovar..." : "Enviar reprovação"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => window.open(report.fileUrl, "_blank")}
            variant="outline"
          >
            Baixar Ficheiro
          </Button>
        </div>
      </div>

      <div className="border rounded-xl p-6 space-y-6 bg-card">
        <div className="flex justify-between">
          <h2 className="text-md font-semibold">Informações do Relatório</h2>

          <Badge
            variant={
              report.status === "approved"
                ? "default"
                : report.status === "rejected"
                  ? "destructive"
                  : "outline"
            }
          >
            {report.status === "approved"
              ? "Aprovado"
              : report.status === "rejected"
                ? "Reprovado"
                : "Em Análise"}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Grupo</p>
            <p className="font-medium text-sm">{report.group?.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Curso</p>
            <p className="text-sm">
              {report?.group?.course ?? "Nao informado"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Etapa</p>
            <p className="text-sm">
              {report.submission?.stage ?? "Nao informado"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Submissão</p>
            <p className="text-sm">{report.submissionId}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Data de Criação</p>
            <p className="text-sm">
              {format(new Date(report.createdAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Data da Análise</p>
            <p className="text-sm">
              {report.analyzedAt
                ? format(new Date(report.analyzedAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Pontuação</p>
            <p>{report.score ?? "0%"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Identificador Público
            </p>
            <p className="truncate text-sm">{report.publicId}</p>
          </div>
        </div>

        {report.rejectionReason && (
          <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4">
            <h3 className="text-sm font-semibold text-destructive">
              Motivo da reprovação
            </h3>
            <p className="text-sm text-destructive-foreground">
              {report.rejectionReason}
            </p>
          </div>
        )}
      </div>

      {observations?.length > 0 && (
        <div className="border rounded-xl p-6 bg-card">
          <h2 className="text-md font-semibold mb-4">Observações</h2>

          <div className="grid grid-cols-3 gap-6">
            {report.observations?.map((obs: string, index: number) => (
              <div key={index}>
                <p className="font-medium">{index + 1}</p>
                <p className="text-muted-foreground text-sm">{obs}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
