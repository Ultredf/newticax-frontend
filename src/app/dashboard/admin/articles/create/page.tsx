'use client';

import { useAuth } from '@/hooks/use-auth';
import { ArticleEditor } from '@/components/editor/article-editor';

export default function CreateArticlePage() {
  // Verify admin or author access
  useAuth({
    requireAuth: true,
    requireAuthor: true,
    redirectTo: '/dashboard',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Article</h1>
        <p className="text-muted-foreground">
          Write and publish a new article
        </p>
      </div>

      <ArticleEditor />
    </div>
  );
}