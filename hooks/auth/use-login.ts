/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginFormData } from '@/schemas/auth/login-schema';
import { AuthService } from '@/services/auth/index.service';
import { IErrorResponse } from '@/shared/Interface/IErrorResponse';
import { useAuthStore } from '@/store/use-auth.store';
import { saveToken } from '@/utils/save-token';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginFormData) => AuthService.login(data),

    onSuccess: (data) => {
      setAuth(data);

      toast.success('Login efetuado com sucesso');
      router.replace('/dashboard');

      saveToken({ token: data.token });
    },

    onError: (error: AxiosError<IErrorResponse>) => {
      const message = error.response?.data?.message;

      const formattedMessage = Array.isArray(message)
        ? message[0]
        : message || 'Erro inesperado';

      toast.error(formattedMessage);
    },
  });
}
