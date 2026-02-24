"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, ArrowLeft, Loader2 } from "lucide-react";
import { Report } from "@/services/reports/Interfaces";
import { reportsService } from "@/services/reports/reports.service";

export default function ReportDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const reportId = parseInt(id, 10);

  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      if (isNaN(reportId)) {
        setError("ID inválido");
        setLoading(false);
        return;
      }
      try {
        const data = await reportsService.getById(reportId);
        setReport(data);
      } catch (err: any) {
        setError(err.message || "Não foi possível carregar o relatório");
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  const updateStatus = async (newStatus: 'approved' | 'rejected', rejectionReason?: string) => {
    if (!report) return;
    setSaving(true);
    try {
      const updated = await reportsService.updateStatus(report.id, newStatus, rejectionReason);
      setReport(updated);
      router.back();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error || !report) return <div className="p-6 text-red-500">{error || "Relatório não encontrado."}</div>;

  const statusColor =
    report.status === "approved"
      ? "bg-green-100 text-green-700"
      : report.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="w-full px-4 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
        <div className="flex gap-3">
          <Button onClick={() => updateStatus("approved")} disabled={saving}>Aprovar</Button>
          <Button variant="outline" className="border-destructive text-destructive" onClick={() => setOpenModal(true)}>Reprovar</Button>
          <Button variant="outline">Exportar <FileDown className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-2xl">{report.title}</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 pt-4">
          <Info label="Grupo" value={`#${report.groupId}`} />
          <Info label="Tema (PDF)" value={report.title} />
          <Info label="Data de Envio" value={new Date(report.createdAt).toLocaleString('pt-AO')} />
          <Info label="Última Atualização" value={new Date(report.updatedAt).toLocaleString('pt-AO')} />
          <Info label="Pontuação" value={report.score?.toString() || "-"} />
          <Info label="Status" value={<Badge variant="outline" className={statusColor}>
            {report.status === "under_review" ? "Pendente" : report.status === "approved" ? "Aprovado" : "Reprovado"}
          </Badge>} />

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground mb-2">Observações / Motivo</p>
            <p className="font-medium whitespace-pre-wrap">{report.observations || "Nenhuma observação registrada."}</p>
          </div>

          <div className="md:col-span-2 mt-4">
            <p className="text-sm text-muted-foreground mb-2">Pré-visualização do PDF</p>
            <iframe src={report.fileUrl} className="w-full h-96 border rounded-lg" title="Pré-visualização do relatório" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Reprovação</DialogTitle>
            <DialogDescription>Descreva o motivo para ajudar na melhoria do relatório.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Escreva aqui o motivo detalhado..." value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-30" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { updateStatus("rejected", reason); setOpenModal(false); }} disabled={!reason.trim() || saving}>Confirmar Reprovação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-medium mt-1">{value}</div>
    </div>
  );
}