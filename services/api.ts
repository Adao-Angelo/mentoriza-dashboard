/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from '@/store/use-auth.store';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (
      token &&
      !config.url?.includes('/auth/login') &&
      !config.url?.includes('/auth/refresh')
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => API(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {}
      );

      const { accessToken, expiresIn } = refreshResponse.data;

      useAuthStore.setState({
        token: accessToken,
        expiresIn,
        isAuthenticated: true,
      });

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue();

      return API(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {
        window.location.href = '/login?sessionExpired=true';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { API };
