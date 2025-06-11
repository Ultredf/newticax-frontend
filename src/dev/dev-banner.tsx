'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const DevBanner = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'production' 
          ? 'https://newticax-backend-production.up.railway.app/api'
          : 'http://localhost:4000/api';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache',
        });
        
        clearTimeout(timeoutId);
        setBackendStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        console.warn('Backend check failed:', error);
        setBackendStatus('offline');
      }
    };

    if (process.env.NODE_ENV === 'development') {
      checkBackend();
    }
  }, []);

  // Only show in development mode and when backend is offline
  if (process.env.NODE_ENV !== 'development' || backendStatus !== 'offline') {
    return null;
  }

  return (
    <Alert variant="destructive" className="m-4">
      <AlertDescription>
        <strong>Development Mode:</strong> Backend server is not running. 
        Some features may not work properly. Please start the backend server on port 4000.
        <br />
        <code className="text-xs bg-gray-100 px-1 rounded mt-1 inline-block">
          cd backend && npm run dev
        </code>
      </AlertDescription>
    </Alert>
  );
};