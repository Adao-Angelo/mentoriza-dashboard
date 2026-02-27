'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import Dropzone from '@/components/dashboard/dropzone';
import GlobalLoader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useStudents } from '@/hooks/students/use-students';
import { useUploadStudentsCsv } from '@/hooks/students/use-upload-students-csv';
import {
  ArrowRight,
  CloudUpload,
  FileSearch2,
  Loader2,
  Plus,
  Upload,
  X,
} from 'lucide-react';
import StudentsTable from './students-table';

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, { message: 'Selecione pelo menos um ficheiro' })
    .max(1, { message: 'Apenas um ficheiro por vez' }),
});

export default function StudentsPage() {
  const [showDropzone, setShowDropzone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { mutate: uploadCsv, isPending: isUploading } = useUploadStudentsCsv();

  const { data: students = [], isLoading } = useStudents();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  async function onSubmit() {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um ficheiro CSV');
      return;
    }

    uploadCsv(files[0], {
      onSuccess: () => {
        setFiles([]);
      },
    });
  }

  return (
    <div className='container'>
      <div className='space-y-8'>
        <div className=''>
          {showDropzone && (
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
                      <div className='flex items-start justify-between mb-4'>
                        <FormLabel className='mt-0 font-semibold text-[16px]'>
                          Carregar Estudantes
                        </FormLabel>
                        <button
                          onClick={() => setShowDropzone(false)}
                          className='rounded-full p-1.5 hover:bg-muted transition-colors'
                          aria-label='Fechar upload'
                        >
                          <X className='h-4 w-4 text-muted-foreground hover:text-foreground' />
                        </button>
                      </div>

                      <FormControl>
                        <Dropzone
                          files={field.value || []}
                          setFiles={(newFiles) => {
                            field.onChange(newFiles);
                            setFiles(newFiles);
                          }}
                          maxFiles={1}
                          title='Selecione o ficheiro CSV'
                          description='O arquivo deve conter: nome, email, curso, turma, telefone, RA, data de nascimento'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end'>
                  <Button
                    type='submit'
                    size='sm'
                    disabled={isUploading || files.length === 0}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />A
                        processar...
                      </>
                    ) : (
                      <>
                        Enviar ficheiro
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
          {!showDropzone && (
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <h1 className='text-[18px] font-bold tracking-tight'></h1>

                <div className='flex items-center gap-3'>
                  <Button
                    variant='default'
                    size={'lg'}
                    onClick={() => setShowDropzone(true)}
                  >
                    <Upload />
                    Upload CSV
                  </Button>

                  <Button
                    variant='outline'
                    size={'lg'}
                    onClick={() => {
                      toast.error(
                        'Funcionalidade de adicionar novo estudante em breve'
                      );
                    }}
                  >
                    <Plus />
                    Novo Estudante
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <div className='text-center py-12 text-muted-foreground flex justify-center'>
                  <GlobalLoader variant='mini' />
                </div>
              ) : students.length === 0 ? (
                <div className=''>
                  <EmptyUploadState onReopen={() => setShowDropzone(true)} />
                </div>
              ) : (
                <StudentsTable students={students} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyUploadState({ onReopen }: { onReopen: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <FileSearch2
        strokeWidth={1.5}
        className='h-12 w-12 text-muted-foreground mb-4'
      />
      <h3 className='text-[14px] font-medium'>Nenhum upload ativo</h3>
      <p className='text-[12px] text-muted-foreground mt-1 max-w-md'>
        Clique no botão abaixo para abrir o carregador de arquivos CSV.
      </p>
      <Button className='mt-6 gap-2 w-50' onClick={onReopen}>
        <CloudUpload className='h-4 w-4' />
        Carregar ficheiro
      </Button>
    </div>
  );
}
