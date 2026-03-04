"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schemas/auth/forgot-password-schema";
import { Loader2, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordFormData) {
    forgotPassword(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-sm"
      >
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-4xl font-bold">Esqueceu sua senha?</h1>
          <p className="text-zinc-500">
            Sem problemas! Digite o endereço de e-mail associado à sua conta e
            enviaremos um link para redefinir sua senha.
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<Mail size={18} strokeWidth={1.5} />}
                  placeholder="exemplo@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" /> Enviando...
            </div>
          )}
          {!isPending && <p> Enviar link de recuperação</p>}
        </Button>
      </form>
    </Form>
  );
}
