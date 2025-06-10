'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onUnlike: () => void;
  disabled?: boolean;
  showCount?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LikeButton({
  isLiked,
  likeCount,
  onLike,
  onUnlike,
  disabled = false,
  showCount = true,
  className,
  variant = 'outline',
  size = 'default'
}: LikeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    // Optimistic update
    const newLikedState = !optimisticLiked;
    setOptimisticLiked(newLikedState);
    setOptimisticCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      if (optimisticLiked) {
        await onUnlike();
      } else {
        await onLike();
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticLiked(isLiked);
      setOptimisticCount(likeCount);
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={optimisticLiked ? 'default' : variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        'transition-all duration-200',
        optimisticLiked && 'bg-red-600 hover:bg-red-700 text-white',
        className
      )}
    >
      <Heart 
        className={cn(
          'h-4 w-4',
          showCount && size !== 'icon' && 'mr-2',
          optimisticLiked && 'fill-current'
        )} 
      />
      {showCount && size !== 'icon' && (
        <span>{optimisticCount}</span>
      )}
    </Button>
  );
}