'use client';

import { useReports } from '@/hooks/reports/use-reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Dropzone from '@/components/dashboard/dropzone';
import GlobalLoader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Report } from '@/services/reports/Interfaces';
import { FileDown, Plus, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { EmptyReportsState } from '@/components/dashboard/empty-reports-state';
import { useUploadReportDocx } from '@/hooks/reports/use-upload-report-docx';
import { ReportsTable } from './reports-table';

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, { message: 'Selecione pelo menos um ficheiro' })
    .max(1, { message: 'Apenas um ficheiro por vez' }),
  sources: z.array(z.string().url({ message: 'Link inválido' })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useReports();
  const { mutate: uploadReport, isPending: isUploading } =
    useUploadReportDocx();

  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Report['status'] | 'all'>(
    'all'
  );
  const [newSource, setNewSource] = useState('');

  const filteredReports =
    statusFilter === 'all'
      ? reports
      : reports.filter((report) => report.status === statusFilter);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      sources: [],
    },
  });

  const handleAddSource = () => {
    if (!newSource.trim()) return;

    const currentSources = form.getValues('sources') || [];

    if (currentSources.includes(newSource.trim())) {
      toast.error('Este link já foi adicionado');
      return;
    }

    form.setValue('sources', [...currentSources, newSource.trim()], {
      shouldValidate: true,
    });

    setNewSource('');
  };

  const handleRemoveSource = (index: number) => {
    const currentSources = form.getValues('sources') || [];
    const updatedSources = currentSources.filter((_, i) => i !== index);
    form.setValue('sources', updatedSources, { shouldValidate: true });
  };

  function onSubmit(values: FormValues) {
    if (values.files.length === 0) {
      toast.error('Selecione pelo menos um ficheiro');
      return;
    }

    uploadReport(
      {
        file: values.files[0],
        sources: values.sources || [],
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          setNewSource('');
        },
      }
    );
  }

  return (
    <div className='container rounded-[12px]'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div></div>

        <Dialog open={open} onOpenChange={setOpen}>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between md:items-end gap-4 mb-5'>
            <h1 className='text-xl font-bold tracking-tight'></h1>
            <div className='flex gap-3'>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Novo Relatório
                </Button>
              </DialogTrigger>
              <Button variant={'outline'} onClick={() => {}}>
                <FileDown />
                Exportar
              </Button>
            </div>
          </div>

          <DialogContent className='sm:max-w-[620px]'>
            <DialogHeader>
              <DialogTitle>Novo Relatório</DialogTitle>
              <DialogDescription>
                Envie o relatório em formato Docx para avaliação automática.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                {/* Dropzone do Docx */}
                <FormField
                  control={form.control}
                  name='files'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Dropzone
                          files={field.value || []}
                          setFiles={(newFiles) => {
                            field.onChange(newFiles);
                          }}
                          maxFiles={1}
                          accept={{
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                              ['.docx'],
                          }}
                          title='Selecione ou arraste o Docx'
                          description='Apenas ficheiros .docx são permitidos'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seção de Links / Fontes */}
                <div>
                  <label className='text-sm font-medium mb-2 block'>
                    Fontes / Links (opcional)
                  </label>

                  <div className='flex gap-2 mb-3 '>
                    <Input
                      placeholder='https://exemplo.com/artigo'
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSource();
                        }
                      }}
                    />
                    <Button
                      type='button'
                      onClick={handleAddSource}
                      variant='outline'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>

                  {form.watch('sources') &&
                    form.watch('sources')!.length > 0 && (
                      <ul className='space-y-2 max-h-48 overflow-y-auto'>
                        {form.watch('sources')!.map((source, index) => (
                          <li
                            key={index}
                            className='flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md text-sm'
                          >
                            <span className='truncate flex-1 text-gray-700 max-w-120'>
                              {source}
                            </span>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleRemoveSource(index)}
                              className='text-danger hover:text-danger'
                            >
                              <X size={16} />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    disabled={isUploading}
                    className='bg-black'
                  >
                    {isUploading ? (
                      <GlobalLoader variant='white-mini' />
                    ) : (
                      'Enviar para Avaliação'
                    )}
                    <Send className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Restante da página (tabela, filtro, etc.) */}
      {isLoading ? (
        <div className='flex justify-center py-12'>
          <GlobalLoader variant='mini' />
        </div>
      ) : reports.length === 0 ? (
        <EmptyReportsState onOpenUpload={() => setOpen(true)} />
      ) : (
        <>
          <div className='mb-4 flex flex-wrap items-center justify-end gap-2'>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as Report['status'] | 'all')
              }
            >
              <SelectTrigger className='w-44'>
                <SelectValue placeholder='Todos' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='under_review'>Em avaliação</SelectItem>
                <SelectItem value='approved'>Aprovado</SelectItem>
                <SelectItem value='rejected'>Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            {statusFilter !== 'all' && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setStatusFilter('all')}
              >
                Limpar filtro
              </Button>
            )}
          </div>

          <ReportsTable reports={filteredReports} />
        </>
      )}
    </div>
  );
}
