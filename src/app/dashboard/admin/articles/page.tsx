'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles, deleteArticle } from '@/services/article-service';
import { toggleTrendingArticle, toggleBreakingNews } from '@/services/admin-service';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
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
import { ArticlesTable } from '@/components/admin/articles-table';
import { toast } from 'sonner';
import { SearchIcon, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminArticlesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  
  const router = useRouter();
  const { language } = useAuthStore();
  
  // Verify admin or author access
  useAuth({
    requireAuth: true,
    requireAuthor: true,
    redirectTo: '/dashboard',
  });

  // Fetch articles
  const { 
    data: articlesData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminArticles', page, search, language],
    queryFn: () => getArticles({ page, limit: 10, language }),
  });

  // Handle article toggle trending
  const handleToggleTrending = async (id: string, isTrending: boolean) => {
    try {
      await toggleTrendingArticle(id, isTrending);
      toast.success(isTrending ? 'Article marked as trending' : 'Article removed from trending');
      refetch();
    } catch (error) {
      toast.error('Failed to update trending status');
    }
  };

  // Handle article toggle breaking
  const handleToggleBreaking = async (id: string, isBreaking: boolean) => {
    try {
      await toggleBreakingNews(id, isBreaking);
      toast.success(isBreaking ? 'Article marked as breaking news' : 'Article removed from breaking news');
      refetch();
    } catch (error) {
      toast.error('Failed to update breaking news status');
    }
  };

  // Handle article delete
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      await deleteArticle(articleToDelete);
      toast.success('Article deleted successfully');
      refetch();
      setArticleToDelete(null);
    } catch (error) {
      toast.error('Failed to delete article');
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

  // Handle create article
  const handleCreateArticle = () => {
    router.push('/dashboard/admin/articles/create');
  };

  // Handle edit article
  const handleEditArticle = (id: string) => {
    router.push(`/dashboard/admin/articles/edit/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Article Management</h1>
          <p className="text-muted-foreground">
            Manage published and draft articles
          </p>
        </div>
        <Button onClick={handleCreateArticle}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle className="flex items-center gap-4">
              All Articles
              <Select
                defaultValue={language}
                onValueChange={(value: 'ENGLISH' | 'INDONESIAN') => useAuthStore.getState().setLanguage(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENGLISH">English</SelectItem>
                  <SelectItem value="INDONESIAN">Indonesian</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search articles..."
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
              {articlesData?.data && articlesData.data.length > 0 ? (
                <div className="space-y-4">
                  <ArticlesTable
                    articles={articlesData.data}
                    onToggleTrending={handleToggleTrending}
                    onToggleBreaking={handleToggleBreaking}
                    onEdit={handleEditArticle}
                    onDelete={setArticleToDelete}
                  />
                  
                  {articlesData.pagination.pages > 1 && (
                    <div className="flex justify-center mt-6">
                      <Pagination
                        currentPage={page}
                        totalPages={articlesData.pagination.pages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {search ? 'No articles found matching your search.' : 'No articles found.'}
                  </p>
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={handleCreateArticle}
                  >
                    Create Your First Article
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Article Confirmation Dialog */}
      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Article Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone and will permanently remove the article and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteArticle} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}