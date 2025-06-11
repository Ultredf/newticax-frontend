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
          set({ isLoading: true, error: null });
          
          console.log('🔄 Fetching user data...');
          const response = await api.get('/auth/me');
          const userData = response.data.data;
          
          console.log('✅ User data fetched successfully:', {
            userId: userData?.id,
            email: userData?.email,
            hasPreference: !!userData?.preference,
          });
          
          set({
            isLoading: false,
            user: userData,
            isAuthenticated: true,
            language: userData.language || 'ENGLISH',
            error: null,
          });
        } catch (error: any) {
          console.error('❌ Failed to fetch user data:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            code: error.response?.data?.code,
          });
          
          set({
            isLoading: false,
            user: null,
            isAuthenticated: false,
            error: null, // Don't set error for getMe failures
          });
        }
      },

      login: async (data: LoginInput) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('🔐 Attempting login...', { 
            email: data.email,
            timestamp: new Date().toISOString(),
          });
          
          const response = await api.post('/auth/login', data);
          const userData = response.data.data;
          
          console.log('✅ Login response received:', {
            success: response.data.success,
            hasUserData: !!userData,
            userId: userData?.id,
            hasToken: !!response.data.token,
            hasCookie: !!response.headers['set-cookie'],
          });
          
          set({
            isLoading: false,
            user: userData,
            isAuthenticated: true,
            language: userData.language || 'ENGLISH',
            error: null,
          });

          // CRITICAL: Verify authentication by calling getMe
          try {
            console.log('🔄 Verifying authentication with /me endpoint...');
            await get().getMe();
            console.log('✅ Authentication verified successfully');
          } catch (meError) {
            console.error('❌ Auth verification failed:', meError);
            // Login was successful but verification failed
            // This might indicate a cookie/session issue
            throw new Error('Authentication verification failed. Please try logging in again.');
          }

          return response.data;
        } catch (error: any) {
          console.error('❌ Login failed:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            code: error.response?.data?.code,
            data: error.response?.data,
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.response?.data?.error ||
                             error.message ||
                             'Login failed';
          
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (data: RegisterInput) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('📝 Attempting registration...', { 
            email: data.email,
            username: data.username,
            timestamp: new Date().toISOString(),
          });
          
          const response = await api.post('/auth/register', data);
          const userData = response.data.data;
          
          console.log('✅ Registration response received:', {
            success: response.data.success,
            hasUserData: !!userData,
            userId: userData?.id,
            hasToken: !!response.data.token,
          });
          
          set({
            isLoading: false,
            user: userData,
            isAuthenticated: true,
            language: userData.language || data.language || 'ENGLISH',
            error: null,
          });

          // Verify registration by calling getMe
          try {
            console.log('🔄 Verifying registration with /me endpoint...');
            await get().getMe();
            console.log('✅ Registration verified successfully');
          } catch (meError) {
            console.error('❌ Registration verification failed:', meError);
            // Registration was successful but verification failed
            throw new Error('Registration verification failed. Please try logging in.');
          }

          return response.data;
        } catch (error: any) {
          console.error('❌ Registration failed:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            errors: error.response?.data?.errors,
          });
          
          let errorMessage = 'Registration failed';
          
          if (error.response?.data) {
            const errorData = error.response.data;
            
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessage = errorData.errors.map((err: any) => err.message || err).join(', ');
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          console.log('🚪 Logging out...');
          
          // Call logout endpoint to clear server-side session
          await api.post('/auth/logout');
          
          console.log('✅ Logout successful');
        } catch (error) {
          console.error('❌ Logout API call failed:', error);
          // Continue with client-side logout even if server call fails
        } finally {
          // Always clear client-side state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          
          // Clear any stored auth data
          localStorage.removeItem('auth-storage');
          
          // Dispatch logout event for other components
          const event = new CustomEvent('auth:logout');
          window.dispatchEvent(event);
        }
      },
      
      setLanguage: async (language) => {
        const currentState = get();
        set({ language });
        
        try {
          if (currentState.isAuthenticated) {
            console.log('🌐 Updating language preference...', { language });
            
            await api.put('/auth/preferences', { language });
            
            if (currentState.user) {
              set({
                user: {
                  ...currentState.user,
                  language
                }
              });
            }
            
            console.log('✅ Language preference updated');
          }
        } catch (error) {
          console.error('❌ Failed to update language preference:', error);
          
          // Revert language on failure
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
        // Don't persist user data for security
      }),
      skipHydration: typeof window === 'undefined',
    }
  )
);

// Add global auth event listener
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    const store = useAuthStore.getState();
    store.logout();
  });
}