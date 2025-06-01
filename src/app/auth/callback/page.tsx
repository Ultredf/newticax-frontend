'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMe } = useAuthStore();
  
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const provider = searchParams.get('provider');

  useEffect(() => {
    const handleCallback = async () => {
      if (success === 'true') {
        // Authentication successful, fetch user data
        try {
          await getMe();
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Redirect to login on error
          setTimeout(() => {
            router.push('/login?error=callback_failed');
          }, 3000);
        }
      } else if (error) {
        // Authentication failed, redirect to login with error
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(error)}`);
        }, 3000);
      }
    };

    handleCallback();
  }, [success, error, getMe, router]);

  // Show loading state by default
  if (!success && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-4 text-xl font-semibold">Processing authentication...</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please wait while we complete your {provider || 'social'} login.
          </p>
        </div>
      </div>
    );
  }

  // Show success state
  if (success === 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Login Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You have successfully logged in with {provider || 'your social account'}. 
              Redirecting to your dashboard...
            </p>
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'access_denied':
        return 'You cancelled the login process.';
      case 'invalid_request':
        return 'There was an issue with the authentication request.';
      case 'unauthorized_client':
        return 'The application is not authorized for this login method.';
      case 'server_error':
        return 'A server error occurred during authentication.';
      case 'temporarily_unavailable':
        return 'The authentication service is temporarily unavailable.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Failed</h2>
          
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {getErrorMessage(error || 'unknown_error')}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Redirecting to login page in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}