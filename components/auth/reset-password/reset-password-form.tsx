"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
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
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/schemas/auth/reset-password-schema";
import { LockKeyhole } from "lucide-react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ResetPasswordFormData) {
    if (token) {
      resetPassword({ token, newPassword: data.password });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-sm"
      >
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-4xl font-bold">Redefinir sua senha</h1>
          <p className="text-zinc-500">
            Crie uma nova senha para sua conta. Certifique-se de que é forte e
            fácil para você lembrar.
          </p>
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<LockKeyhole size={18} strokeWidth={1.5} />}
                  type="password"
                  {...field}
                  placeholder="Digite a sua nova senha"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input
                  leftIcon={<LockKeyhole size={18} strokeWidth={1.5} />}
                  type="password"
                  {...field}
                  placeholder="Confirme a tua nova senha"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Carregando..." : "Redefinir senha"}
        </Button>
      </form>
    </Form>
  );
}
