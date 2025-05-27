import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { User, LoginInput, RegisterInput } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  language: 'ENGLISH' | 'INDONESIAN';
  getMe: () => Promise<void>;
  login: (data: LoginInput) => Promise<any>;
  register: (data: RegisterInput) => Promise<any>;
  logout: () => Promise<void>;
  setLanguage: (language: 'ENGLISH' | 'INDONESIAN') => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      language: 'ENGLISH',
      
      getMe: async () => {
        try {
          set({ isLoading: true });
          const response = await api.get('/auth/me');
          set({
            isLoading: false,
            user: response.data.data,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      login: async (data: LoginInput) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/login', data);
          set({
            isLoading: false,
            user: response.data.data,
            isAuthenticated: true,
          });
          return response.data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
          });
          throw error;
        }
      },

      register: async (data: RegisterInput) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/register', data);
          set({
            isLoading: false,
            user: response.data.data,
            isAuthenticated: true,
          });
          return response.data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      
      setLanguage: async (language) => {
        set({ language });
        try {
          // If user is authenticated, update language preference on server
          if (useAuthStore.getState().isAuthenticated) {
            await api.put('/auth/language', { language });
          }
        } catch (error) {
          console.error('Failed to update language preference:', error);
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        language: state.language,
      }),
    }
  )
);