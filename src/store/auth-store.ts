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
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      language: 'ENGLISH',
      
      getMe: async () => {
        try {
          set({ isLoading: true });
          const response = await api.get('/auth/me');
          const userData = response.data.data;
          
          set({
            isLoading: false,
            user: userData,
            isAuthenticated: true,
            language: userData.language || 'ENGLISH',
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
          const userData = response.data.data;
          
          set({
            isLoading: false,
            user: userData,
            isAuthenticated: true,
            language: userData.language || 'ENGLISH',
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
          const userData = response.data.data;
          
          set({
            isLoading: false,
            user: userData,
            isAuthenticated: true,
            language: userData.language || data.language || 'ENGLISH',
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
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },
      
      setLanguage: async (language) => {
        const currentState = get();
        set({ language });
        
        try {
          if (currentState.isAuthenticated) {
            await api.put('/auth/preferences', { language });
            
            if (currentState.user) {
              set({
                user: {
                  ...currentState.user,
                  language
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to update language preference:', error);
          if (currentState.isAuthenticated) {
            set({ language: currentState.language });
          }
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
      // Tambahkan check untuk browser
      skipHydration: typeof window === 'undefined',
    }
  )
);