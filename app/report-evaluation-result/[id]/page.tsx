"use client";

import ABNTResultHeader from "@/components/report/abnt-results/header";
import { Button } from "@/components/ui/button";
import { useReport } from "@/hooks/reports/useReport";
import { useParams } from "next/navigation";
import { useState } from "react";

import SidebarEvaluationDynamic from "./components/SidebarEvaluationDynamic";

import { Can } from "@/components/rbac/can";
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
import { PERMISSIONS } from "@/context/permissions";
import { useUpdateReportStatus } from "@/hooks/reports/use-update-report-status";
import { CheckCheck, PrinterCheck } from "lucide-react";
import DocxPreviewEnhanced from "./components/DocxPreviewEnhanced";
import { PageSkeleton } from "./page-skeleton";

export default function ReportEvaluationResultPage() {
  const params = useParams();
  const reportId = Number(params.id);

  const { data: report, isLoading } = useReport(reportId);

  const [highlightedIndicator, setHighlightedIndicator] = useState<
    string | undefined
  >(undefined);
  const [highlightedPoint, setHighlightedPoint] = useState<string | undefined>(
    undefined,
  );

  const updateStatus = useUpdateReportStatus();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

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

  const handleIndicatorClick = (indicator: string) => {
    setHighlightedIndicator(indicator);
    if (indicator !== "abnt") {
      setHighlightedPoint(undefined);
    }
  };

  const handlePointClick = (pointKey: string) => {
    setHighlightedPoint(pointKey);
    if (highlightedIndicator !== "abnt") {
      setHighlightedIndicator("abnt");
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!report) {
    return <div className="p-6">Relatório não encontrado.</div>;
  }

  return (
    <>
      <ABNTResultHeader />

      <div className="bg-white sticky top-0 z-10 px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Relatório #{report.id}</h1>

          <div className="flex gap-3">
            <Can permission={PERMISSIONS.REPORT_APPROVE}>
              <Button
                onClick={handleApprove}
                disabled={report.status === "approved"}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
            </Can>

            <Button
              onClick={() => window.open(report.fileUrl, "_blank")}
              variant="outline"
            >
              <PrinterCheck className="mr-2 h-4 w-4" />
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
                    onChange={(e) => setRejectionReason(e.target.value)}
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
                    variant="destructive"
                    disabled={!rejectionReason.trim() || updateStatus.isPending}
                    onClick={handleReject}
                  >
                    {updateStatus.isPending
                      ? "Reprovar..."
                      : "Enviar reprovação"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex h-dvh border-t">
        <SidebarEvaluationDynamic
          report={report}
          onIndicatorClick={handleIndicatorClick}
          onPointClick={handlePointClick}
          highlightedIndicator={highlightedIndicator}
          highlightedPoint={highlightedPoint}
        />
        <div className="flex-1 overflow-hidden">
          {/* <ReportPreview preview={report.preview} /> */}
          <DocxPreviewEnhanced
            report={report}
            htmlContent={report.preview?.html}
            highlightedIndicator={highlightedIndicator}
            highlightedPoint={highlightedPoint}
          />
        </div>
      </div>
    </>
  );
}
