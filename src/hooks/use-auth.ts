import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  requireAdmin?: boolean;
  requireAuthor?: boolean;
  redirectIfAuthenticated?: boolean;
  redirectAuthenticatedTo?: string;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const {
    requireAuth = false,
    redirectTo = '/login',
    requireAdmin = false,
    requireAuthor = false,
    redirectIfAuthenticated = false,
    redirectAuthenticatedTo = '/dashboard',
  } = options;

  const { isAuthenticated, user, isLoading, getMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Fetch user data if needed
    if (!isAuthenticated && !isLoading) {
      getMe();
    }
  }, [getMe, isAuthenticated, isLoading]);

  useEffect(() => {
    // Skip redirection if still loading
    if (isLoading) return;

    // Redirect if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Redirect if admin role is required but user is not admin
    if (requireAdmin && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push(redirectTo);
      return;
    }

    // Redirect if author role is required but user is not author or admin
    if (requireAuthor && (!isAuthenticated || (user?.role !== 'AUTHOR' && user?.role !== 'ADMIN'))) {
      router.push(redirectTo);
      return;
    }

    // Redirect if user is authenticated but shouldn't be (e.g., login page)
    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectAuthenticatedTo);
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    requireAuth,
    requireAdmin,
    requireAuthor,
    redirectIfAuthenticated,
    redirectTo,
    redirectAuthenticatedTo,
    router,
    user?.role,
  ]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    isAuthor: user?.role === 'AUTHOR' || user?.role === 'ADMIN',
  };
};