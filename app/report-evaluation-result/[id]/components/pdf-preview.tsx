'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react';
import { Document, DocumentProps, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

interface Props {
  pdfUrl: string;
  errors: any[];
  highlightedIndicator?: string;
}

export default function PDFPreview({
  pdfUrl,
  errors,
  highlightedIndicator,
}: Props) {
  const [numPages, setNumPages] = useState<number>();
  const [pageDimensions, setPageDimensions] = useState<
    Record<number, { width: number; height: number }>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess: DocumentProps['onLoadSuccess'] = async (pdf) => {
    const num = pdf.numPages;
    setNumPages(num);

    const dims: Record<number, { width: number; height: number }> = {};

    for (let i = 1; i <= num; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      dims[i] = {
        width: viewport.width,
        height: viewport.height,
      };
    }

    setPageDimensions(dims);
  };

  useEffect(() => {
    if (
      !containerRef.current ||
      !numPages ||
      Object.keys(pageDimensions).length === 0
    )
      return;

    const existingHighlights =
      containerRef.current.querySelectorAll('.highlight');
    existingHighlights.forEach((h) => h.remove());

    const getHighlightColor = (indicator: string) => {
      switch (indicator) {
        case 'Conformidade com Normas ABNT':
          return 'bg-red-500';
        case 'Fundamentação Teórica':
          return 'bg-blue-500';
        case 'Validação da Problemática':
          return 'bg-green-500';
        case 'Percentagem de Conteúdo Gerado por IA':
          return 'bg-yellow-500';
        default:
          return 'bg-purple-500';
      }
    };

    errors
      .filter((err) => err.indicator === highlightedIndicator)
      .forEach((err) => {
        const pageElem = containerRef.current?.querySelector(
          `[data-page-number="${err.page}"]`
        ) as HTMLElement | null;
        if (!pageElem) return;

        const { clientWidth, clientHeight } = pageElem;

        const natural = pageDimensions[err.page];
        if (!natural) return;

        const pdfWidth = natural.width;
        const pdfHeight = natural.height;

        const scaleX = clientWidth / pdfWidth;
        const scaleY = clientHeight / pdfHeight;

        const [x0, y0, x1, y1] = err.bbox;

        const top = (pdfHeight - y1) * scaleY;
        const left = x0 * scaleX;
        const width = (x1 - x0) * scaleX;
        const height = (y1 - y0) * scaleY;

        if (width <= 0 || height <= 0) return;

        const highlight = document.createElement('div');
        const colorClass = getHighlightColor(err.indicator || '');
        highlight.className = `highlight absolute ${colorClass} opacity-30 pointer-events-auto`;
        highlight.style.top = `${top}px`;
        highlight.style.left = `${left}px`;
        highlight.style.width = `${width}px`;
        highlight.style.height = `${height}px`;

        let tooltip: HTMLDivElement | null = null;

        highlight.addEventListener('mouseover', (e) => {
          tooltip = document.createElement('div');
          tooltip.textContent = err.message;
          tooltip.className =
            'absolute bg-black text-white p-2 rounded shadow-lg z-50';
          tooltip.style.top = `${e.clientY + 10}px`;
          tooltip.style.left = `${e.clientX + 10}px`;
          document.body.appendChild(tooltip);
        });

        highlight.addEventListener('mouseout', () => {
          if (tooltip) {
            tooltip.remove();
            tooltip = null;
          }
        });

        pageElem.appendChild(highlight);
      });
  }, [highlightedIndicator, errors, numPages, pageDimensions]);

  return (
    <div
      ref={containerRef}
      className='bg-sidebar h-dvh overflow-y-scroll border-l relative'
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => console.error('PDF load error:', err)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className='relative mb-4'
            renderAnnotationLayer={true}
            renderTextLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}
