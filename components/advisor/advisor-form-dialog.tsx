// src/components/advisors/AdvisorFormDialog.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Loader2 } from 'lucide-react';

import { useCreateAdvisor } from '@/hooks/advisors/use-create-advisor';
import { useUpdateAdvisor } from '@/hooks/advisors/use-update-advisor';
import {
  Advisor,
  CreateAdvisorDto,
  UpdateAdvisorDto,
} from '@/services/advisor/interfaces';

const advisorSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  specialty: z.string().optional(),
  lattes: z
    .string()
    .url({ message: 'URL inválida' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
});

type AdvisorFormValues = z.infer<typeof advisorSchema>;

interface AdvisorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advisor?: Advisor | null;
}

export function AdvisorFormDialog({
  open,
  onOpenChange,
  advisor,
}: AdvisorFormDialogProps) {
  const isEdit = !!advisor;
  const { mutate: create, isPending: isCreating } = useCreateAdvisor();
  const { mutate: update, isPending: isUpdating } = useUpdateAdvisor();

  const form = useForm<AdvisorFormValues>({
    resolver: zodResolver(advisorSchema),
    defaultValues: {
      email: advisor?.email || '',
      name: advisor?.name || '',
      specialty: advisor?.specialty || '',
      lattes: advisor?.lattes || '',
      phone: advisor?.user?.phone || '',
    },
  });

  function onSubmit(values: AdvisorFormValues) {
    if (isEdit && advisor) {
      update({ id: advisor.id, data: values as UpdateAdvisorDto });
    } else {
      create(values as CreateAdvisorDto);
    }
    onOpenChange(false);
  }

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Orientador' : 'Novo Orientador'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os detalhes do orientador.'
              : 'Crie um novo orientador.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder='Dr. Carlos Silva' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='orientador@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='specialty'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Input placeholder='Inteligência Artificial' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder='(244) 912-345678' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isEdit ? 'Atualizar' : 'Criar Orientador'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
