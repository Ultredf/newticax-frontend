import { formatDistanceToNow } from 'date-fns';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onRoleChange: (userId: string, role: 'USER' | 'AUTHOR' | 'ADMIN') => void;
  onDeleteClick: (userId: string) => void;
}

export function UsersTable({ users, onRoleChange, onDeleteClick }: UsersTableProps) {
  // Get user initials for avatar
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'AUTHOR':
        return 'default';
      default:
        return 'outline';
    }
  };

  // Get provider badge color
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'GOOGLE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'GITHUB':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ''} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    {user.bio && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 max-w-xs">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: 'USER' | 'AUTHOR' | 'ADMIN') => 
                    onRoleChange(user.id, value)
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">
                      <Badge variant="outline">USER</Badge>
                    </SelectItem>
                    <SelectItem value="AUTHOR">
                      <Badge variant="default">AUTHOR</Badge>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <Badge variant="destructive">ADMIN</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProviderColor(user.provider || 'EMAIL')}`}>
                  {user.provider || 'EMAIL'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {user.language === 'ENGLISH' ? 'EN' : 'ID'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" 
                    onClick={() => onDeleteClick(user.id)}
                    disabled={user.role === 'ADMIN'} // Prevent deleting admins
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}