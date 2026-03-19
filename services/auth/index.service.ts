import { ForgotPasswordFormData } from '@/schemas/auth/forgot-password-schema';
import { LoginFormData } from '@/schemas/auth/login-schema';
import { API } from '@/services/api';
import { ResetPasswordPayload } from './types';

async function ForgotPassword({ email }: ForgotPasswordFormData) {
  const response = await API.post('/auth/forgot-password', {
    email,
  });

  return response.data;
}

async function login({ email, password }: LoginFormData) {
  const response = await API.post('/auth/login', {
    email,
    password,
  });

  return response.data;
}

async function ResetPassword({ token, newPassword }: ResetPasswordPayload) {
  const response = await API.post('/auth/reset-password', {
    token,
    newPassword,
  });

  return response.data;
}

export const AuthService = {
  login,
  ForgotPassword,
  ResetPassword,
};
