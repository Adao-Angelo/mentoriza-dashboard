/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import GlobalLoader from '@/components/loader';
import mammoth from 'mammoth';
import Mark from 'mark.js';
import { useEffect, useRef, useState } from 'react';

interface Props {
  docxUrl: string;
  errors: any[];
  highlightedIndicator?: string;
}

export default function DocxPreview({
  docxUrl,
  errors,
  highlightedIndicator,
}: Props) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDocx = async () => {
      try {
        setLoading(true);
        const response = await fetch(docxUrl);
        const arrayBuffer = await response.arrayBuffer();

        const result = await mammoth.convertToHtml({ arrayBuffer });
        let html = result.value;

        html = html.replace(/<p>/g, '<p class="mb-3">');

        setHtmlContent(html);
      } catch (err) {
        console.error('Erro ao carregar DOCX', err);
        setHtmlContent('<p>Erro ao carregar documento.</p>');
      } finally {
        setLoading(false);
      }
    };

    loadDocx();
  }, [docxUrl]);

  useEffect(() => {
    if (!highlightedIndicator || !htmlContent || !containerRef.current) return;

    const markInstance = new Mark(containerRef.current);
    markInstance.unmark();

    const relevantErrors = errors.filter(
      (e) => e.indicator === highlightedIndicator && e.text_reference?.trim()
    );

    relevantErrors.forEach((err) => {
      const text = err.text_reference.trim();
      if (!text || text.length < 10) {
        console.warn(`Erro global (sem highlight possível): ${err.message}`);
        return;
      }

      markInstance.mark(text, {
        caseSensitive: false,
        separateWordSearch: false,
        acrossElements: true,
        className: 'highlight bg-destructive rounded px-0.5 cursor-pointer',
        done: (totalMarks) => {
          if (totalMarks === 0) {
            console.warn(`Nenhum match encontrado para: "${text}"`);
          }
        },
        each: (element: HTMLElement) => {
          let tooltip: HTMLDivElement | null = null;
          element.addEventListener('mouseenter', (e) => {
            tooltip = document.createElement('div');
            tooltip.textContent = err.message;
            tooltip.className =
              'absolute bg-primary text-white p-2 rounded-lb-lg  shadow-lg z-50 max-w-xs text-sm font-medium';
            tooltip.style.top = `${e.clientY + 10}px`;
            tooltip.style.left = `${e.clientX + 10}px`;
            document.body.appendChild(tooltip);
          });

          element.addEventListener('mouseleave', () => {
            if (tooltip) {
              tooltip.remove();
              tooltip = null;
            }
          });
        },
      });
    });
  }, [highlightedIndicator, errors, htmlContent]);

  if (loading)
    return (
      <div className='flex items-center justify-center min-h-dvh flex-1'>
        <GlobalLoader />
      </div>
    );

  return (
    <div className='max-h-dvh overflow-y-scroll'>
      <div
        ref={containerRef}
        className='docx-content prose max-w-none p-6 bg-white min-h-screen'
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}
