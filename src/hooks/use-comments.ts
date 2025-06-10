import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment, updateComment, deleteComment } from '@/services/article-service';
import { toast } from 'sonner';
import { Comment, CommentInput } from '@/types';

export function useComments(articleId: string) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['comments', articleId, page],
    queryFn: () => getComments(articleId, { page, limit: 10 }),
    enabled: !!articleId,
  });

  const addCommentMutation = useMutation({
    mutationFn: (commentData: CommentInput) => addComment(articleId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    }
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => 
      updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      toast.success('Comment updated successfully');
    },
    onError: () => {
      toast.error('Failed to update comment');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      toast.success('Comment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    }
  });

  return {
    comments: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    addComment: addCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    page,
    setPage,
    refetch
  };
}
