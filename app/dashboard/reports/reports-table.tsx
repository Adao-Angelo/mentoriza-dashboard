'use client';

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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  MoreHorizontal,
  Trash2,
  XCircle,
} from 'lucide-react';

import { useDeleteReport } from '@/hooks/reports/use-delete-report'; // ajusta se necessário
import { Report } from '@/services/reports/Interfaces';
import { useRouter } from 'next/navigation';

interface ReportsTableProps {
  reports: Report[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const router = useRouter();
  const { mutate: deleteReport } = useDeleteReport();

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant='default' className='gap-1'>
            <CheckCircle2 className='h-3.5 w-3.5' />
            Aprovado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant='destructive' className='gap-1'>
            <XCircle className='h-3.5 w-3.5' />
            Rejeitado
          </Badge>
        );
      case 'under_review':
      default:
        return (
          <Badge variant='secondary' className='gap-1'>
            <Clock className='h-3.5 w-3.5' />
            Em avaliação
          </Badge>
        );
    }
  };

  return (
    <div className='border rounded-lg overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grupo</TableHead>
            <TableHead>Submissão</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className='font-medium'>
                Grupo {report.groupId}
              </TableCell>

              <TableCell>Submissão #{report.submissionId}</TableCell>

              <TableCell>
                {format(new Date(report.createdAt), "dd 'de' MMM yyyy", {
                  locale: ptBR,
                })}
              </TableCell>

              <TableCell>
                {report.score !== undefined ? `${report.score}/100` : '-'}
              </TableCell>

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
                          className='text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer'
                        >
                          <Trash2 className='mr-2 h-4 w-4 text-destructive' />
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
