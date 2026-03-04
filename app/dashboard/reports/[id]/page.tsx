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

  const observations = report?.observations ?? [];

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
        <h1 className='text-xl font-semibold'>Relatório #{report.id}</h1>

        <div className='flex gap-3'>
          <Button>Aprovar Relatório</Button>
          <Button variant='outline'>Reprovar Relatório</Button>
          <Button
            onClick={() => window.open(report.fileUrl, '_blank')}
            variant='outline'
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className='border rounded-xl p-6 space-y-6 bg-card'>
        <div className='flex justify-between'>
          <h2 className='text-md font-semibold'>Informações do Relatório</h2>

          <Badge variant='secondary'>
            {report.status === 'approved'
              ? 'Aprovado'
              : report.status === 'rejected'
                ? 'Reprovado'
                : 'Em Análise'}
          </Badge>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          <div>
            <p className='text-sm text-muted-foreground'>Grupo</p>
            <p className='font-medium text-sm'>{report.group?.name}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Curso</p>
            <p className='text-sm'>
              {report?.group?.course ?? 'Nao informado'}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Etapa</p>
            <p className='text-sm'>
              {report.submission?.stage ?? 'Nao informado'}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Submissão</p>
            <p className='text-sm'>{report.submissionId}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Data de Criação</p>
            <p className='text-sm'>
              {format(new Date(report.createdAt), 'dd/MM/yyyy', {
                locale: ptBR,
              })}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Data da Análise</p>
            <p className='text-sm'>
              {report.analyzedAt
                ? format(new Date(report.analyzedAt), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })
                : '-'}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>Pontuação</p>
            <p>{report.score ?? '0%'}</p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>
              Identificador Público
            </p>
            <p className='truncate text-sm'>{report.publicId}</p>
          </div>
        </div>
      </div>

      {observations?.length > 0 && (
        <div className='border rounded-xl p-6 bg-card'>
          <h2 className='text-md font-semibold mb-4'>Observações</h2>

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
