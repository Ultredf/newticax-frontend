'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, updateUserRole, deleteUser } from '@/services/user-service';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UsersTable } from '@/components/admin/users-table';
import { toast } from 'sonner';
import { SearchIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Verify admin access
  useAuth({
    requireAuth: true,
    requireAdmin: true,
    redirectTo: '/dashboard',
  });

  // Fetch users
  const { 
    data: usersData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => getUsers({ page, limit: 10, search }),
  });

  // Handle role change
  const handleRoleChange = async (userId: string, role: 'USER' | 'AUTHOR' | 'ADMIN') => {
    try {
      await updateUserRole(userId, role);
      toast.success(`User role updated to ${role}`);
      refetch();
    } catch {
      toast.error('Failed to update user role');
    }
  };

  // Handle user delete
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete);
      toast.success('User deleted successfully');
      refetch();
      setUserToDelete(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pr-10"
                />
                <SearchIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <Button type="submit" size="sm">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {usersData?.data && usersData.data.length > 0 ? (
                <div className="space-y-4">
                  <UsersTable
                    users={usersData.data}
                    onRoleChange={handleRoleChange}
                    onDeleteClick={setUserToDelete}
                  />
                  
                  {usersData.pagination.pages > 1 && (
                    <div className="flex justify-center mt-6">
                      <CustomPagination
                        currentPage={page}
                        totalPages={usersData.pagination.pages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {search ? 'No users found matching your search.' : 'No users found.'}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}