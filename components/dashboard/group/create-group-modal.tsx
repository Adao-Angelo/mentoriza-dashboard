/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Textarea } from '@/components/ui/textarea';
import { useCreateGroup } from '@/hooks/groups/use-create-group';
import { usePTTeachers } from '@/hooks/pt-teachers/use-pt-teachers';
import { useAuthStore } from '@/store/use-auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  course: z.string().min(1, { message: 'Curso é obrigatório' }),
  title: z.string().optional(),
  description: z.string().optional(),
  information: z.string().optional(),
  advisorId: z.number().optional().nullable(),
  coAdvisorId: z.number().optional().nullable(),
});

type CreateGroupFormData = z.infer<typeof formSchema>;

interface CreateGroupModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGroupModal({
  isOpen,
  onOpenChange,
}: CreateGroupModalProps) {
  const { mutate: createGroup, isPending } = useCreateGroup();
  const { user } = useAuthStore();
  const { data: ptTeachers = [] } = usePTTeachers();

  const isCoordinator = user?.roles.some((r) =>
    ['ADMIN', 'COORDINATOR'].includes(r)
  );
  const ptProfile = ptTeachers.find((t) => t.user.name === user?.username);
  const teacherCourse = ptProfile?.course;

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      course: '',
      title: '',
      description: '',
      information: '',
      advisorId: null,
      coAdvisorId: null,
    },
  });

  useEffect(() => {
    if (!isCoordinator && teacherCourse && isOpen) {
      form.setValue('course', teacherCourse);
    }
  }, [isCoordinator, teacherCourse, isOpen, form]);

  const onSubmit = (data: CreateGroupFormData) => {
    createGroup(data as any, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Criar Novo Grupo</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo grupo abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo *</FormLabel>
                  <FormControl>
                    <Input placeholder='Nome do grupo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='course'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      disabled={!isCoordinator && !!teacherCourse}
                    >
                      <SelectTrigger className='w-full h-12!'>
                        <SelectValue placeholder='Selecione curso' />
                      </SelectTrigger>
                      <SelectContent>
                        {isCoordinator && (
                          <SelectItem value='none'>Nenhum</SelectItem>
                        )}
                        <SelectItem value='informatica'>Informática</SelectItem>
                        <SelectItem value='electronica'>Eletrônica</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Tema ou título do projeto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descrição do projeto ou grupo'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='information'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Informação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Informação adicional sobre o grupo'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='flex justify-end gap-2 pt-4'>
              <Button
                variant='outline'
                type='button'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Criando...' : 'Criar Grupo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
