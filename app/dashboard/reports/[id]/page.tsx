"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileDown } from "lucide-react";

export default function ReportDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("reports");
    if (!stored) return;

    const reports = JSON.parse(stored);
    const found = reports.find((r: any) => r.id === id);

    if (found) setReport(found);
  }, [id]);

  const updateStatus = (newStatus: string, rejectionReason?: string) => {
    const stored = localStorage.getItem("reports");
    if (!stored) return;

    const reports = JSON.parse(stored);

    const updated = reports.map((r: any) =>
      r.id === id
        ? {
            ...r,
            status: newStatus,
            analyzedAt: new Date().toLocaleDateString(),
            observations:
              newStatus === "Reprovado" ? rejectionReason : r.observations,
          }
        : r
    );

    localStorage.setItem("reports", JSON.stringify(updated));

    router.back();
  };

  if (!report) {
    return <div className="p-6">Relatório não encontrado.</div>;
  }

  const statusColor =
    report.status === "Aprovado"
      ? "bg-green-100 text-green-700"
      : report.status === "Reprovado"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="w-full px-2 mt-2">

        <div className="flex justify-end gap-2 mb-6">
          <Button
            onClick={() => updateStatus("Aprovado")}
            className="h-11"
          >
            Aprovar
          </Button>

          <Button
            variant="destructive"
            onClick={() => setOpenModal(true)}
            className="h-11"
          >
            Reprovar
          </Button>

          <Button variant="outline" className="w-28 h-11">
            Exportar
            <FileDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

      <Card className="p-3">
        <CardHeader>
          <CardTitle>Detalhes do Relatório</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">

          <Info label="Grupo" value={`#${report.groupNumber}`} />
          <Info label="Tema" value={report.theme} />
          <Info label="Versão" value={report.version || "-"} />
          <Info label="Curso" value={report.course || "-"} />
          <Info label="Nível" value={report.level || "-"} />
          <Info label="Pontuação" value={report.score || "-"} />
          <Info label="Data de Envio" value={report.date} />
          <Info label="Analisado em" value={report.analyzedAt || "-"} />

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <span className={`px-3 py-1 text-xs rounded-full ${statusColor}`}>
              {report.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">ID Público</p>
            <Badge variant="secondary">PUB-{report.id}</Badge>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Observações</p>
            <p className="font-medium">
              {report.observations || "-"}
            </p>
          </div>

        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Reprovação</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Explique o motivo da reprovação..."
            value={reason}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReason(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => updateStatus("Reprovado", reason)}
              disabled={!reason}
            >
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}