/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Report } from "@/services/reports/Interfaces";
import { useEffect, useRef } from "react";

interface Props {
  htmlContent?: string;
  report: Report;
  highlightedIndicator?: string;
  highlightedPoint?: string;
}

export default function DocxPreviewEnhanced({
  htmlContent: initialHtml = "",
  report,
  highlightedIndicator,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlightedIndicator || !containerRef.current || !initialHtml) return;

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
        if (keyResults.abnt?.violations) {
          violations.push(...keyResults.abnt.violations);
        }
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
      if (!textToHighlight || textToHighlight.length < 6) return;

      markInstance.mark(textToHighlight, {
        caseSensitive: false,
        separateWordSearch: false,
        acrossElements: true,
        className:
          "highlight-error bg-red-100 border-b-2 border-red-500 px-1.5 py-0.5 rounded font-medium cursor-help",
        each: (element: HTMLElement) => {
          let tooltip: HTMLDivElement | null = null;

          const showTooltip = (e: MouseEvent) => {
            tooltip = document.createElement("div");
            tooltip.textContent = violation.message || "Erro detectado";
            tooltip.className =
              "absolute bg-white border border-red-500 text-sm p-3 shadow-xl z-50 max-w-xs rounded-md pointer-events-none";
            tooltip.style.top = `${e.clientY + 18}px`;
            tooltip.style.left = `${e.clientX + 18}px`;
            document.body.appendChild(tooltip);
          };

          const hideTooltip = () => {
            if (tooltip) {
              tooltip.remove();
              tooltip = null;
            }
          };

          element.addEventListener("mouseenter", showTooltip);
          element.addEventListener("mouseleave", hideTooltip);
        },
      });
    });

    return () => {
      markInstance.unmark();
    };
  }, [highlightedIndicator, report, initialHtml]);

  if (!initialHtml) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Nenhum conteúdo disponível para visualização.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div
        ref={containerRef}
        className="docx-content mx-auto bg-white prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: initialHtml }}
      />
    </div>
  );
}
