'use client';

import GlobalLoader from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useReport } from '@/hooks/reports/useReport';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useParams } from 'next/navigation';

export default function ReportDetailsPage() {
  const params = useParams();

  const reportId = Number(params.id);

  const { data: report, isLoading } = useReport(reportId);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-100'>
        <GlobalLoader variant='mini' />
      </div>
    );
  }

  if (!report) {
    return <div className='p-6'>Relatório não encontrado.</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>Relatório {report.id}</h1>

        <div className='flex gap-3'>
          <Button>Aprovar Relatório</Button>
          <Button variant='outline'>Reprovar</Button>
          <Button
            onClick={() => window.open(report.fileUrl, '_blank')}
            variant='outline'
          >
            Export
          </Button>
        </div>
      </div>

      <div className='border rounded-xl p-6 space-y-6 bg-card'>
        <div className='flex justify-between'>
          <h2 className='text-lg font-semibold'>Report Information</h2>

          <Badge variant='secondary'>
            {report.status === 'approved'
              ? 'Approved'
              : report.status === 'rejected'
                ? 'Rejected'
                : 'Under Review'}
          </Badge>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          <div>
            <p className='text-sm text-muted-foreground'>Group</p>
            <p className='font-medium'>{report.group?.name}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Course</p>
            <p>{report?.group?.course ?? }</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Stage</p>
            <p>{report.submission?.stage}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Submission</p>
            <p>#{report.submissionId}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Created At</p>
            <p>
              {format(new Date(report.createdAt), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Analyzed At</p>
            <p>
              {report.analyzedAt
                ? format(new Date(report.analyzedAt), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })
                : '-'}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Score</p>
            <p>{report.score ?? '-'}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Public ID</p>
            <p className='truncate'>{report.publicId}</p>
          </div>
        </div>
      </div>

      {report?.observations?.length  > 0 && (
        <div className='border rounded-xl p-6 bg-card'>
          <h2 className='text-lg font-semibold mb-4'>Observations</h2>

          <div className='grid grid-cols-3 gap-6'>
            {report.observations?.map((obs: string, index: number) => (
              <div key={index}>
                <p className='font-medium'>{index + 1}</p>
                <p className='text-muted-foreground text-sm'>{obs}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
