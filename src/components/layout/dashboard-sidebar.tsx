'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Bookmark, 
  Settings, 
  Users, 
  FileText, 
  Globe,
  RefreshCw,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link href="/" className="text-xl font-bold text-blue-600" onClick={closeSidebar}>
              NewticaX
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              <NavItem
                href="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                isActive={pathname === '/dashboard'}
                onClick={closeSidebar}
              />
              <NavItem
                href="/dashboard/bookmarks"
                icon={<Bookmark size={20} />}
                label="Bookmarks"
                isActive={pathname === '/dashboard/bookmarks'}
                onClick={closeSidebar}
              />
              <NavItem
                href="/dashboard/profile"
                icon={<Settings size={20} />}
                label="Profile Settings"
                isActive={pathname === '/dashboard/profile'}
                onClick={closeSidebar}
              />
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="mt-6">
                <div
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                >
                  <span>Admin</span>
                  {adminMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                
                {adminMenuOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    <NavItem
                      href="/dashboard/admin"
                      icon={<LayoutDashboard size={18} />}
                      label="Admin Dashboard"
                      isActive={pathname === '/dashboard/admin'}
                      onClick={closeSidebar}
                    />
                    <NavItem
                      href="/dashboard/admin/articles"
                      icon={<FileText size={18} />}
                      label="Articles"
                      isActive={pathname === '/dashboard/admin/articles' || 
                                pathname.startsWith('/dashboard/admin/articles/')}
                      onClick={closeSidebar}
                    />
                    <NavItem
                      href="/dashboard/admin/users"
                      icon={<Users size={18} />}
                      label="Users"
                      isActive={pathname === '/dashboard/admin/users'}
                      onClick={closeSidebar}
                    />
                    <NavItem
                      href="/dashboard/admin/sync"
                      icon={<RefreshCw size={18} />}
                      label="Sync News"
                      isActive={pathname === '/dashboard/admin/sync'}
                      onClick={closeSidebar}
                    />
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/logout" onClick={closeSidebar}>
                  <LogOut size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
