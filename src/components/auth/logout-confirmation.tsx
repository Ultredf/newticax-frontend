'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

interface LogoutConfirmationProps {
  onClose: () => void;
}

export function LogoutConfirmation({ onClose }: LogoutConfirmationProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Keluar dari Akun?</h2>
          <p className="mt-2 text-gray-600">
            Apakah Anda yakin ingin keluar dari akun Anda?
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="sm:order-2"
          >
            Keluar
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="sm:order-1"
          >
            Batal
          </Button>
        </div>
      </div>
    </div>
  );
}
