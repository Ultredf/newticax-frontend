import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Comment, CommentInput } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { addComment } from '@/services/article-service';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/pagination';

interface ArticleCommentsProps {
  articleId: string;
  comments: Comment[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onCommentAdded: () => void;
}

export function ArticleComments({ 
  articleId,
  comments,
  isLoading,
  pagination,
  onCommentAdded,
}: ArticleCommentsProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  
  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      setIsSubmitting(true);
      await addComment(articleId, { content: commentText });
      setCommentText('');
      toast.success('Comment added successfully');
      onCommentAdded();
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get user initials for avatar
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-8">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={!commentText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
          <p>Please <a href="/login" className="text-blue-600 hover:underline">sign in</a> to leave a comment.</p>
        </div>
      )}
      
      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6 last:border-b-0">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.image || ''} alt={comment.user.name} />
                  <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{comment.user.name}</h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  
                  {/* Reply button */}
                  {isAuthenticated && (
                    <button className="text-sm text-blue-600 mt-2">Reply</button>
                  )}
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.user.image || ''} alt={reply.user.name} />
                            <AvatarFallback>{getInitials(reply.user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{reply.user.name}</h4>
                              <span className="text-xs text-gray-500">
                                {format(new Date(reply.createdAt), 'MMM d, yyyy • h:mm a')}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* View more replies */}
                  {comment._count && comment._count.replies > (comment.replies?.length || 0) && (
                    <button className="text-sm text-blue-600 mt-2">
                      View {comment._count.replies - (comment.replies?.length || 0)} more {comment._count.replies - (comment.replies?.length || 0) === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => {
                // This would typically update query params to fetch the correct page
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}