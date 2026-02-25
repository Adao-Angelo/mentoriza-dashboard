"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, ArrowLeft, Loader2 } from "lucide-react";
import { reportsService } from "@/services/reports/reports.service";
import { Report } from "@/services/reports/Interfaces";

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔹 Fetch robusto do relatório
  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError("ID inválido");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const reportId = Number(id);
        if (isNaN(reportId)) {
          setError("ID inválido");
          return;
        }

        const data = await reportsService.getById(reportId);
        if (!data) {
          setError("Relatório não encontrado");
        } else {
          setReport(data);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message || err?.message || "Erro ao carregar relatório"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // 🔹 Atualizar status e sincronizar com a tabela
  const updateStatus = async (
    newStatus: "approved" | "rejected",
    rejectionReason?: string
  ) => {
    if (!report) return;

    setSaving(true);

    try {
      const updated = await reportsService.updateStatus(
        report.id,
        newStatus,
        rejectionReason
      );

      setReport(updated);

      // Força atualização da tabela
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Loader
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  // 🔹 Erro
  if (error || !report)
    return <div className="p-6 text-red-500">{error || "Não encontrado"}</div>;

  // 🔹 Status colorido
  const statusColor =
    report.status === "approved"
      ? "bg-green-100 text-green-700"
      : report.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  const formattedCreated = report.createdAt
    ? new Date(report.createdAt).toLocaleString("pt-AO")
    : "-";

  const formattedUpdated = report.updatedAt
    ? new Date(report.updatedAt).toLocaleString("pt-AO")
    : "-";

  return (
    <div className="w-full px-2 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={() => updateStatus("approved")}
            disabled={saving || report.status === "approved"}
            className="h-10.5"
          >
            {saving ? "Salvando..." : "Aprovar"}
          </Button>

          <Button
            variant="outline"
            className="border-destructive text-destructive h-10.5"
            onClick={() => setOpenModal(true)}
            disabled={report.status === "rejected"}
          >
            Reprovar
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open(report.fileUrl, "_blank")}
            className="h-10.5"
          >
            Exportar
            <FileDown className="ml-2" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{report.title}</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6 pt-4">
          <Info label="Grupo" value={`#${report.groupId}`} />
          <Info label="Data de Envio" value={formattedCreated} />
          <Info label="Última Atualização" value={formattedUpdated} />
          <Info label="Pontuação" value={report.score ?? "-"} />

          <Info
            label="Status"
            value={
              <Badge variant="outline" className={getStatusColor(report.status)}>
                {getStatusLabel(report.status)}
              </Badge>
            }
          />

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground mb-2">
              Observações / Motivo
            </p>
            <p className="font-medium whitespace-pre-wrap">
              {report.observations || "Nenhuma observação registrada."}
            </p>
          </div>

        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Reprovação</DialogTitle>
            <DialogDescription>
              Descreva o motivo para ajudar na melhoria do relatório.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Escreva aqui o motivo detalhado..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-30"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="border-black text-black"
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              disabled={!reason.trim() || saving}
              onClick={() => {
                updateStatus("rejected", reason);
                setOpenModal(false);
              }}
            >
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-medium mt-1">{value}</div>
    </div>
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "under_review":
      return "Pendente";
    case "approved":
      return "Aprovado";
    case "rejected":
      return "Reprovado";
    default:
      return "-";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "under_review":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}