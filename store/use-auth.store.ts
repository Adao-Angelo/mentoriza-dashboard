import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SaveTokenData {
  user: User;
  token: string;
  expiresIn: string;
}

export interface User {
  username: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresIn: string | null;
  isAuthenticated: boolean;

  setAuth: (data: SaveTokenData) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresIn: null,

      isAuthenticated: false,

      setAuth: (data) =>
        set({
          user: data.user,
          token: data.token,
          expiresIn: data.expiresIn,
          isAuthenticated: true,
        }),

      updateUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          expiresIn: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
