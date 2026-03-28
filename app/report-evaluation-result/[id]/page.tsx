"use client";

import GlobalLoader from "@/components/loader";
import ABNTResultHeader from "@/components/report/abnt-results/header";
import { useReport } from "@/hooks/reports/useReport";
import { useParams } from "next/navigation";
import { useState } from "react";
import DocxPreviewEnhanced from "./components/DocxPreviewEnhanced";
import SidebarABNTDetailed from "./components/sidebar-result";

export default function ReportEvaluationResultPage() {
  const params = useParams();
  const reportId = Number(params.id);
  const { data: report, isLoading } = useReport(reportId);

  const [highlightedPoint, setHighlightedPoint] = useState<string | undefined>(
    undefined,
  );

  if (isLoading || !report) return <GlobalLoader variant="mini" />;

  return (
    <>
      <ABNTResultHeader />
      <div className="flex h-[calc(100dvh-60px)]">
        <SidebarABNTDetailed
          report={report}
          onPointClick={setHighlightedPoint}
          highlightedPoint={highlightedPoint}
        />
        <div className="flex-1 overflow-hidden">
          <DocxPreviewEnhanced
            report={report}
            docxUrl={report.fileUrl || ""}
            abntData={report.keyResults?.abnt}
            highlightedPoint={highlightedPoint}
          />
        </div>
      </div>
    </>
  );
}
