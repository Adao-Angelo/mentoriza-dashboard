/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GlobalLoader from "@/components/loader";
import { Report } from "@/services/reports/Interfaces";
import mammoth from "mammoth";

import { useEffect, useRef, useState } from "react";

interface Props {
  docxUrl: string;
  report: Report;
  highlightedIndicator?: string;
  highlightedPoint?: string;
}

export default function DocxPreviewEnhanced({
  docxUrl,
  report,
  highlightedIndicator,
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
        console.error("Erro ao converter DOCX:", err);
        setHtmlContent(
          "<p class='text-red-500 p-4'>Erro ao carregar o documento. Tente novamente.</p>",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocx();
  }, [docxUrl]);

  useEffect(() => {
    if (!highlightedIndicator || !containerRef.current || !htmlContent) return;

    const markInstance = new (require("mark.js"))(containerRef.current);
    markInstance.unmark();

    const keyResults = report.keyResults;
    if (!keyResults) return;

    let violations: any[] = [];

    switch (highlightedIndicator) {
      case "abnt":
        if (keyResults.abnt?.abnt_points) {
          Object.values(keyResults.abnt.abnt_points).forEach((point: any) => {
            if (point?.violations) violations.push(...point.violations);
          });
        }
        if (keyResults.abnt?.violations)
          violations.push(...keyResults.abnt.violations);
        break;

      case "problematic":
        violations = keyResults.problematic?.errors || [];
        break;

      case "theoretical":
        violations = keyResults.theoretical?.errors || [];
        break;

      case "ai_detection":
        return;
      default:
        return;
    }

    violations.forEach((violation) => {
      const textToHighlight = violation.text_reference?.trim();
      if (!containerRef.current) return;

      if (textToHighlight && textToHighlight.length > 5) {
        markInstance.mark(textToHighlight, {
          caseSensitive: false,
          separateWordSearch: false,
          acrossElements: true,
          className:
            "highlight-error bg-danger/10 border-b-2 border-danger px-1 rounded font-medium cursor-help",
          each: (element: HTMLElement) => {
            element.addEventListener("mouseenter", (e) => {});

            let tooltip: HTMLDivElement | null = null;

            element.addEventListener("mouseenter", (e) => {
              tooltip = document.createElement("div");
              tooltip.textContent = violation.message;
              tooltip.className =
                "absolute bg-white border border-danger text-black-dark p-2 shadow-lg z-50 max-w-xs text-sm font-medium";
              tooltip.style.top = `${e.clientY + 10}px`;
              tooltip.style.left = `${e.clientX + 10}px`;
              document.body.appendChild(tooltip);
            });

            element.addEventListener("mouseleave", () => {
              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }
            });
          },
          done: (totalMarks: number) => {
            if (totalMarks === 0) {
              console.warn(`Texto não encontrado: "${textToHighlight}"`);
            }
          },
        });
      }
    });
  }, [highlightedIndicator, report, htmlContent]);

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
        className="docx-content prose prose-slate max-w-none mx-auto border shadow-sm bg-white p-10"
        style={{
          maxWidth: "210mm",
          minHeight: "297mm",
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
