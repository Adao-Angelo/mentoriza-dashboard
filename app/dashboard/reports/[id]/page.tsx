"use client";

import { useState } from "react";

import GlobalLoader from "@/components/loader";
import { Can } from "@/components/rbac/can";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PERMISSIONS } from "@/context/permissions";
import { useCreateFeedback } from "@/hooks/feedback/use-create-feedback";
import { useUpdateReportGrade } from "@/hooks/reports/use-update-report-grade";
import { useUpdateReportStatus } from "@/hooks/reports/use-update-report-status";
import { useReport } from "@/hooks/reports/useReport";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCheck,
  GraduationCap,
  MessageSquareShare,
  MonitorCheck,
  PrinterCheck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = Number(params.id);

  const { data: report, isLoading } = useReport(reportId);
  const updateStatus = useUpdateReportStatus();
  const updateGrade = useUpdateReportGrade();
  const createFeedback = useCreateFeedback();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [grade, setGrade] = useState("");

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  const handleSaveGrade = () => {
    if (!report || !grade) return;
    updateGrade.mutate({
      id: report.id,
      payload: { grade: Number(grade) },
    });
    setIsGradeDialogOpen(false);
    setGrade("");
  };

  const handleSendFeedback = () => {
    if (!report || !feedbackMessage) return;
    createFeedback.mutate({
      reportId: report.id,
      groupId: report.groupId,
      message: feedbackMessage,
      type: "manual",
    });
    setIsFeedbackDialogOpen(false);
    setFeedbackMessage("");
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
          <Can permission={PERMISSIONS.REPORT_APPROVE}>
            <Button
              onClick={handleApprove}
              disabled={report.status === "approved"}
            >
              <CheckCheck />
              Aprovar
            </Button>
          </Can>

          <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
            <Can permission={PERMISSIONS.REPORT_REVIEW}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <GraduationCap />
                  Dar Nota
                </Button>
              </DialogTrigger>
            </Can>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Atribuir Nota</DialogTitle>
                <DialogDescription>
                  Atribua uma nota para este relatório.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Nota 0 a 2</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={grade}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        value == "" ||
                        (Number(value) >= 0 && Number(value) <= 2)
                      ) {
                        setGrade(value);
                      } else {
                        toast.error("A nota deve ser um número entre 0 e 2");
                      }
                    }}
                    placeholder="Digite a nota aqui"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsGradeDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={!grade || updateGrade.isPending}
                  onClick={handleSaveGrade}
                >
                  {updateGrade.isPending ? "Salvando..." : "Salvar Nota"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isFeedbackDialogOpen}
            onOpenChange={setIsFeedbackDialogOpen}
          >
            <Can permission={PERMISSIONS.FEEDBACK_CREATE}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <MessageSquareShare />
                  Enviar Feedback
                </Button>
              </DialogTrigger>
            </Can>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Enviar Feedback</DialogTitle>
                <DialogDescription>
                  Escreva um feedback direto para este relatório.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Seu feedback aqui..."
                  className="min-h-35"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsFeedbackDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={!feedbackMessage || createFeedback.isPending}
                  onClick={handleSendFeedback}
                >
                  {createFeedback.isPending ? "Enviando..." : "Enviar Feedback"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => {
              router.push(`/report-evaluation-result/${report.id}`);
            }}
            variant="default"
          >
            <MonitorCheck />
            Ver Analises
          </Button>
          <Button
            onClick={() => window.open(report.fileUrl, "_blank")}
            variant="outline"
          >
            <PrinterCheck />
            Baixar Ficheiro
          </Button>

          <Dialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
          >
            <Can permission={PERMISSIONS.REPORT_REJECT}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={report.status === "rejected"}
                >
                  Reprovar
                </Button>
              </DialogTrigger>
            </Can>
            <DialogContent className="sm:max-w-125">
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
                  className="min-h-35"
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
                : "Em análise"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Pontuação IA</p>
            <p>{report.score ? `${report.score}%` : "0%"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Nota</p>
            <p className="font-semibold text-primary">
              {report.grade ?? "Pendente"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Identificador Público
            </p>
            <p className="truncate text-sm">{report.publicId}</p>
          </div>
        </div>

        {report.rejectionReason && (
          <div className="rounded-md border border-danger/50 bg-danger/5 p-4">
            <h3 className="text-sm font-semibold text-danger">
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
