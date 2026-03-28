/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GlobalLoader from "@/components/loader";
import { Report } from "@/services/reports/Interfaces";
import mammoth from "mammoth";
import { useEffect, useRef, useState } from "react";

interface Props {
  docxUrl: string;
  abntData: any;
  highlightedPoint?: string;
  report: Report;
}

export default function DocxPreviewEnhanced({
  docxUrl,
  abntData,
  highlightedPoint,
}: Props) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDocx = async () => {
      try {
        setLoading(true);
        const res = await fetch(docxUrl);
        const arrayBuffer = await res.arrayBuffer();

        const result = await mammoth.convertToHtml({ arrayBuffer });
        let html = result.value;
        html = html.replace(/<p>/g, '<p class="mb-4 leading-relaxed">');

        setHtmlContent(html);
      } catch (err) {
        console.error(err);
        setHtmlContent(
          "<p class='text-red-500'>Erro ao carregar o documento.</p>",
        );
      } finally {
        setLoading(false);
      }
    };
    loadDocx();
  }, [docxUrl]);

  useEffect(() => {
    if (!highlightedPoint || !containerRef.current) return;

    const markInstance = new (require("mark.js"))(containerRef.current);
    markInstance.unmark();

    const pointData = abntData?.abnt_points?.[highlightedPoint];
    if (!pointData?.violations) return;

    pointData.violations.forEach((violation: any) => {
      const textToHighlight = violation.text_reference || violation.message;

      if (textToHighlight && textToHighlight.length > 8) {
        markInstance.mark(textToHighlight, {
          caseSensitive: false,
          separateWordSearch: false,
          acrossElements: true,
          className:
            "abnt-highlight bg-red-200 border-b-2 border-red-500 px-1 rounded",
        });
      }
    });
  }, [highlightedPoint, abntData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white p-8">
      <div
        ref={containerRef}
        className="docx-content prose prose-slate max-w-none mx-auto border p-6"
        style={{ maxWidth: "210mm", minHeight: "297mm" }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
