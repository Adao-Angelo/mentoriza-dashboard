'use client';

import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { BarChart3, Eye, FileText, MoreHorizontal, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useDeleteReport } from '@/hooks/reports/use-delete-report';
import { Report } from '@/services/reports/Interfaces';
import { useRouter } from 'next/navigation';

interface ReportsTableProps {
  reports: Report[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const router = useRouter();
  const { mutate: deleteReport } = useDeleteReport();
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);

  const allSelected =
    reports.length > 0 && selectedReportIds.length === reports.length;

  const toggleSelectAll = () => {
    setSelectedReportIds(allSelected ? [] : reports.map((report) => report.id));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedReportIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const statusConfig: Record<
    Report['status'],
    { label: string; variant: 'default' | 'destructive' | 'secondary' }
  > = {
    approved: { label: 'Aprovado', variant: 'default' },
    rejected: { label: 'Rejeitado', variant: 'destructive' },
    under_review: { label: 'Em avaliação', variant: 'secondary' },
  };

  const getStatusBadge = (status: Report['status']) => {
    const config = statusConfig[status];

    return (
      <Badge variant={config.variant} className='space-x-2'>
        {config.label}
      </Badge>
    );
  };

  const destinationConfig: Record<
    Report['destination'],
    { label: string; variant: 'outline' | 'secondary' | 'default' }
  > = {
    PERSONAL_TEST: { label: 'Teste pessoal', variant: 'outline' },
    MENTOR_REVIEW: { label: 'Mentores', variant: 'secondary' },
    FINAL_SUBMISSION: { label: 'Submissão final', variant: 'default' },
  };

  const getDestinationBadge = (destination: Report['destination']) => {
    const config = destinationConfig[destination];

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className='border rounded-lg overflow-hidden'>
      {selectedReportIds.length > 0 && (
        <div className='px-4 py-2 border-b bg-muted/30 flex items-center justify-between'>
          <p className='text-sm font-medium'>
            Selecionados: {selectedReportIds.length}
          </p>
          <Button
            size='sm'
            variant='outline'
            onClick={() => setSelectedReportIds([])}
          >
            Limpar seleção
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type='checkbox'
                checked={allSelected}
                onChange={toggleSelectAll}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                aria-label='Selecionar todos os relatórios'
              />
            </TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Submissão</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Pontuação no Mentoriza</TableHead>
            <TableHead>Nota Final</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <input
                  type='checkbox'
                  checked={selectedReportIds.includes(report.id)}
                  onChange={() => toggleSelectOne(report.id)}
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  aria-label={`Selecionar relatório ${report.id}`}
                />
              </TableCell>
              <TableCell className='font-medium'>
                {report.group?.name || 'Não vinculado'}
              </TableCell>
              <TableCell className='font-medium'>
                {report?.group?.course || 'Não disponível'}
              </TableCell>

              <TableCell className='text-center'>
                <span className='border border-Gray font-bold text-Gray flex items-center justify-center h-8 w-8'>
                  {report.submissionId}
                </span>
              </TableCell>

              <TableCell>
                {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </TableCell>

              <TableCell>
                {report.score != undefined || report.score != null
                  ? `${report.score}%`
                  : 'Em avaliação'}
              </TableCell>

              <TableCell className='font-medium text-black-dark'>
                {report.grade != undefined || report.grade != null
                  ? report.grade
                  : 'Sem nota'}
              </TableCell>

              <TableCell>{getDestinationBadge(report.destination)}</TableCell>

              <TableCell>{getStatusBadge(report.status)}</TableCell>

              <TableCell className='text-right'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground border-Gray'
                    >
                      <span className='sr-only'>Abrir menu</span>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align='end' className='w-48'>
                    <DropdownMenuItem
                      className='cursor-pointer'
                      onClick={() => window.open(report.fileUrl, '_blank')}
                    >
                      <FileText className='mr-2 h-4 w-4' />
                      Ver ficheiro
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className='cursor-pointer'
                      onClick={() =>
                        router.push(`/dashboard/reports/${report.id}`)
                      }
                    >
                      <Eye className='mr-2 h-4 w-4' />
                      Ver detalhes
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className='cursor-pointer'
                      onClick={() =>
                        router.push(`/report-evaluation-result/${report.id}`)
                      }
                    >
                      <BarChart3 className='mr-2 h-4 w-4' />
                      Ver análises
                    </DropdownMenuItem>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='text-danger focus:bg-danger/10 focus:text-danger cursor-pointer'
                        >
                          <Trash2 className='mr-2 h-4 w-4 text-danger' />
                          Remover
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem a certeza que deseja remover este relatório?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel size='sm'>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            size='sm'
                            onClick={() => deleteReport(report.id)}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
