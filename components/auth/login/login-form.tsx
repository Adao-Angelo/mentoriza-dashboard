'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import GlobalLoader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/auth/use-login';
import { LoginFormData, loginSchema } from '@/schemas/auth/login-schema';
import { LockKeyhole, Mail } from 'lucide-react';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormData) {
    login(data);
    return data;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 w-full max-w-sm'
      >
        <div className='flex flex-col gap-3 mb-8'>
          <h1 className='text-3xl font-bold'>Bem vindo de volta</h1>
          <p className='text-zinc-500'>Faça login no seu painel</p>
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<Mail size={18} strokeWidth={1.5} />}
                  placeholder='exemplo@email.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<LockKeyhole size={18} strokeWidth={1.5} />}
                  type='password'
                  placeholder='••••••••'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='text-right'>
          <Link
            href='/forgot-password'
            className='text-sm text-primary hover:underline font-medium'
          >
            Esqueceste a senha?
          </Link>
        </div>

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? <GlobalLoader variant='white-mini' /> : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
