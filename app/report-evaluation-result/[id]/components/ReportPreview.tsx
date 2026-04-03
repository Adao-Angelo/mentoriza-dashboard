"use client";

import { Preview } from "@/services/reports/Interfaces";
import React from "react";

interface ReportPreviewProps {
  preview?: Preview | string | null;
}

export default function ReportPreview({ preview }: ReportPreviewProps) {
  const htmlContent = React.useMemo(() => {
    if (!preview) return "";

    if (typeof preview === "string") {
      return preview;
    }

    if (preview?.html) {
      return preview.html;
    }

    return "";
  }, [preview]);

  if (!htmlContent) {
    return (
      <div className="flex h-full items-center justify-center">
        Nenhum preview disponível para este relatório.
      </div>
    );
  }

  return (
    <div className="report-preview-wrapper h-screen overflow-hidden bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto p-8 flex justify-center h-full">
        <div
          className="docx-preview-container"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
