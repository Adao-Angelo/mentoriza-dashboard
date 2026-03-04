'use client';

import GlobalLoader from '@/components/loader';
import ABNTResultHeader from '@/components/report/abnt-results/header';
import { useReport } from '@/hooks/reports/useReport';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import dynamic from 'next/dynamic';
import DocxPreview from './components/DocxPreview';
import SidebarEvaluation from './components/sidebar-result';
const PDFPreview = dynamic(() => import('./components/pdf-preview'), {
  ssr: false,
});

export default function ReportEvaluationResultPage() {
  const params = useParams();
  const reportId = Number(params.id);
  const { data: report, isLoading } = useReport(reportId);
  const [highlightedIndicator, setHighlightedIndicator] = useState<
    string | undefined
  >(undefined);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-100'>
        <GlobalLoader variant='mini' />
      </div>
    );
  }

  if (!report?.fileUrl) {
    return <div>Relatório não encontrado ou sem PDF</div>;
  }

  return (
    <>
      <ABNTResultHeader />
      <div className='flex justify-between'>
        <SidebarEvaluation
          report={report}
          onIndicatorClick={(key) => {
            console.log('Clicou em:', key);
            setHighlightedIndicator(key);
          }}
        />

        <DocxPreview
          docxUrl={report.fileUrl}
          errors={report.errors ?? []}
          highlightedIndicator={highlightedIndicator}
        />
      </div>
    </>
  );
}
