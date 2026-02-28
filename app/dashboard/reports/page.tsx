'use client';

import { useReports } from '@/hooks/reports/use-reports';
import { useUploadReportPdf } from '@/hooks/reports/use-upload-report-pdf';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import Dropzone from '@/components/dashboard/dropzone'; // Reutiliza o mesmo Dropzone
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
import { FileDown, Plus, Send } from 'lucide-react';

import { EmptyReportsState } from '@/components/dashboard/empty-reports-state';
import toast from 'react-hot-toast';
import { ReportsTable } from './reports-table';

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, { message: 'Selecione pelo menos um ficheiro' })
    .max(1, { message: 'Apenas um ficheiro por vez' }),
});

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useReports();
  const { mutate: uploadReport, isPending: isUploading } = useUploadReportPdf();
  const [files, setFiles] = useState<File[]>([]);

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um ficheiro CSV');
      return;
    }
    uploadReport(
      { file: values.files[0], groupId: 3 },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
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

          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Novo Relatório</DialogTitle>
              <DialogDescription>
                Envie o relatório em PDF para avaliação automática.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
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
                            setFiles(newFiles);
                          }}
                          maxFiles={1}
                          accept={{ 'application/pdf': ['.pdf'] }}
                          title='Selecione ou arraste o PDF'
                          description='Apenas ficheiros PDF são permitidos'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    disabled={isUploading}
                    className='bg-black'
                  >
                    {isUploading ? (
                      <>
                        <GlobalLoader variant='white-mini' />
                      </>
                    ) : (
                      'Enviar para Avaliação'
                    )}

                    <Send />
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <GlobalLoader variant='mini' />
        </div>
      ) : reports.length === 0 ? (
        <EmptyReportsState onOpenUpload={() => setOpen(true)} />
      ) : (
        <ReportsTable reports={reports} />
      )}
    </div>
  );
}
