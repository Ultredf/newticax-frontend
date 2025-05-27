'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  
  // Hide on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }
  
  // Hide on dashboard pages (where sidebar is present)
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t shadow-lg">
      <div className="flex justify-around items-center">
        <NavItem 
          href="/" 
          icon={<Home size={20} />} 
          label="Home" 
          isActive={pathname === '/'} 
        />
        <NavItem 
          href="/search" 
          icon={<Search size={20} />} 
          label="Search" 
          isActive={pathname === '/search'} 
        />
        <NavItem 
          href="/dashboard/bookmarks" 
          icon={<Bookmark size={20} />} 
          label="Bookmarks" 
          isActive={pathname === '/dashboard/bookmarks'} 
        />
        <NavItem 
          href="/dashboard/profile" 
          icon={<User size={20} />} 
          label="Profile" 
          isActive={pathname === '/dashboard/profile'} 
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center py-2 w-full ${
        isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
