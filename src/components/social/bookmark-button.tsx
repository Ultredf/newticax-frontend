'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onBookmark: () => void;
  onRemoveBookmark: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export function BookmarkButton({
  isBookmarked,
  onBookmark,
  onRemoveBookmark,
  disabled = false,
  className,
  variant = 'outline',
  size = 'default',
  showText = true
}: BookmarkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(isBookmarked);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    // Optimistic update
    const newBookmarkedState = !optimisticBookmarked;
    setOptimisticBookmarked(newBookmarkedState);

    try {
      if (optimisticBookmarked) {
        await onRemoveBookmark();
      } else {
        await onBookmark();
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticBookmarked(isBookmarked);
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={optimisticBookmarked ? 'default' : variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        'transition-all duration-200',
        optimisticBookmarked && 'bg-blue-600 hover:bg-blue-700 text-white',
        className
      )}
    >
      <Bookmark 
        className={cn(
          'h-4 w-4',
          showText && size !== 'icon' && 'mr-2',
          optimisticBookmarked && 'fill-current'
        )} 
      />
      {showText && size !== 'icon' && (
        <span>{optimisticBookmarked ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
}