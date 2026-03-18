import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useCreateStudent } from '@/hooks/students/use-create-student';
import { CreateStudentDto } from '@/services/students/Interfaces';

export const createStudentSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  ra: z.string().min(1, { message: 'RA é obrigatório' }),
  course: z.string().min(1, { message: 'Curso é obrigatório' }),
  class: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export function useCreateStudentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createStudent, isPending: isCreating } = useCreateStudent();

  const form = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      email: '',
      name: '',
      ra: 'none',
      course: 'none',
      class: '',
      phone: '',
      birthDate: '',
    },
  });

  async function onSubmit(values: CreateStudentInput) {
    const payload: CreateStudentDto = {
      email: values.email,
      name: values.name,
      ra: values.ra === 'none' ? undefined : values.ra,
      course: values.course === 'none' ? undefined : values.course,
      class: values.class || undefined,
      phone: values.phone || undefined,
      birthDate: values.birthDate || undefined,
    };

    createStudent(payload, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset({
          email: '',
          name: '',
          ra: '',
          course: '',
          class: '',
          phone: '',
          birthDate: '',
        });
      },
    });
  }

  return {
    isOpen,
    setIsOpen,
    form,
    onSubmit,
    isCreating,
  };
}
