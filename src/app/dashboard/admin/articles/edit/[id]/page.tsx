'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { ArticleEditor } from '@/components/editor/article-editor';
import { getArticleBySlug } from '@/services/article-service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function EditArticlePage() {
  const { id } = useParams();
  
  // Verify admin or author access
  useAuth({
    requireAuth: true,
    requireAuthor: true,
    redirectTo: '/dashboard',
  });

  // Fetch article
  const { data: article, isLoading } = useQuery({
    queryKey: ['editArticle', id],
    queryFn: () => getArticleBySlug(id as string),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Article not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <p className="text-muted-foreground">
          Edit and update the article
        </p>
      </div>

      <ArticleEditor article={article} isEdit />
    </div>
  );
}