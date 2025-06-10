'use client';

import { useEffect, useRef, useCallback } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  children: React.ReactNode;
  loader?: React.ReactNode;
}

export function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
  children,
  loader
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: `${threshold}px`,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div>
      {children}
      
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          {isLoading && (
            loader || (
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Loading more articles...</p>
              </div>
            )
          )}
        </div>
      )}
      
      {!hasMore && !isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>You've reached the end of the articles.</p>
        </div>
      )}
    </div>
  );
}