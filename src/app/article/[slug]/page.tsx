'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { 
  getArticleBySlug, 
  incrementViewCount, 
  getComments,
  likeArticle,
  unlikeArticle,
  bookmarkArticle,
  removeBookmark,
  incrementShareCount 
} from '@/services/article-service';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  ArticleHeader, 
  ArticleContent, 
  ArticleActions, 
  ArticleComments,
  ArticleMeta,
  RelatedArticles
} from '@/components/article';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ArticlePage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  
  // Fetch article
  const { 
    data: article, 
    isLoading,
    refetch: refetchArticle
  } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug as string),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch comments
  const { 
    data: comments, 
    isLoading: isCommentsLoading,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['comments', article?.id],
    queryFn: () => article?.id ? getComments(article.id) : Promise.resolve({ 
      data: [], 
      pagination: { page: 1, limit: 10, total: 0, pages: 0 } 
    }),
    enabled: !!article?.id,
  });

  // Record view count
  useEffect(() => {
    if (article?.id) {
      incrementViewCount(article.id).catch(() => {
        // Silent fail for view counting
      });
    }
  }, [article?.id]);

  // Like handlers
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like this article');
      return;
    }

    if (!article) return;

    try {
      if (article.isLiked) {
        await unlikeArticle(article.id);
        toast.success('Article unliked');
      } else {
        await likeArticle(article.id);
        toast.success('Article liked');
      }
      refetchArticle();
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  // Bookmark handlers
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to bookmark this article');
      return;
    }

    if (!article) return;

    try {
      if (article.isBookmarked) {
        await removeBookmark(article.id);
        toast.success('Bookmark removed');
      } else {
        await bookmarkArticle(article.id);
        toast.success('Article bookmarked');
      }
      refetchArticle();
    } catch (error) {
      toast.error('Failed to update bookmark status');
    }
  };

  // Share handler
  const handleShare = async () => {
    if (!article) return;

    try {
      // Get current URL
      const url = `${window.location.origin}/article/${article.slug}`;
      
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
      
      // Increment share count
      await incrementShareCount(article.id);
    } catch (error) {
      // User might have cancelled share
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p>The article you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <ArticleHeader
            title={article.title}
            image={article.image}
            category={article.category}
          />
          
          {/* Article Metadata */}
          <ArticleMeta
            author={article.author}
            publishedAt={article.publishedAt}
            source={article.source}
            sourceUrl={article.sourceUrl}
            viewCount={article.viewCount}
            likeCount={article._count?.likes || 0}
            commentCount={article._count?.comments || 0}
          />
          
          {/* Article Actions */}
          <ArticleActions
            isLiked={article.isLiked}
            isBookmarked={article.isBookmarked}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
          
          {/* Article Content */}
          <ArticleContent
            content={article.content}
          />
          
          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Article Comments */}
          <ArticleComments
            articleId={article.id}
            comments={comments?.data || []}
            isLoading={isCommentsLoading}
            pagination={comments?.pagination}
            onCommentAdded={refetchComments}
          />
        </article>
        
        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <RelatedArticles
            articles={article.relatedArticles}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}