/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import {
  useCreatePTTeacher,
  useUpdatePTTeacher,
} from '@/hooks/pt-teachers/use-pt-teachers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  course: z.enum(['informatica', 'electronica'], {
    message: 'Selecione um curso',
  }),
});

interface PTTeacherFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ptTeacher?: any;
}

export function PTTeacherFormDialog({
  open,
  onOpenChange,
  ptTeacher,
}: PTTeacherFormDialogProps) {
  const isEdit = !!ptTeacher;
  const createMutation = useCreatePTTeacher();
  const updateMutation = useUpdatePTTeacher();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      course: 'informatica',
    },
  });

  useEffect(() => {
    if (ptTeacher) {
      form.reset({
        name: ptTeacher.user.name,
        email: ptTeacher.user.email,
        phone: ptTeacher.user.phone || '',
        course: ptTeacher.course || 'informatica',
        password: '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        phone: '',
        course: 'informatica',
      });
    }
  }, [ptTeacher, form, open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit) {
      const { password, ...updateData } = values;
      await updateMutation.mutateAsync({ id: ptTeacher.id, data: updateData });
    } else {
      await createMutation.mutateAsync(values as any);
    }
    onOpenChange(false);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Professor' : 'Novo Professor'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder='Nome completo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email@exemplo.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='******' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder='Ex: 11999998888' {...field} />
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
                  <FormLabel>Curso</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um curso' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='informatica'>Informática</SelectItem>
                      <SelectItem value='electronica'>Eletrônica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
