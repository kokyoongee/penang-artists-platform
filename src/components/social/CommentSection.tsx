'use client';

import { useState, useEffect } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Comment } from '@/types';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { cn } from '@/lib/utils';

interface CommentWithArtist extends Comment {
  artist: {
    id: string;
    display_name: string;
    slug: string;
    profile_photo: string | null;
  };
  replies?: CommentWithArtist[];
}

interface CurrentArtist {
  id: string;
  display_name: string;
  profile_photo: string | null;
}

interface CommentSectionProps {
  portfolioItemId: string;
  portfolioOwnerId: string;
  initialCommentCount?: number;
  variant?: 'default' | 'lightbox';
  className?: string;
}

export function CommentSection({
  portfolioItemId,
  portfolioOwnerId,
  initialCommentCount = 0,
  variant = 'default',
  className,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithArtist[]>([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArtist, setCurrentArtist] = useState<CurrentArtist | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; artistName: string } | null>(null);

  // Fetch current user's artist profile
  useEffect(() => {
    const fetchCurrentArtist = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('artists')
          .select('id, display_name, profile_photo')
          .eq('user_id', user.id)
          .single() as { data: CurrentArtist | null };

        if (data) {
          setCurrentArtist(data);
        }
      }
    };

    fetchCurrentArtist();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/comments?portfolioItemId=${portfolioItemId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.data || []);
          setCommentCount(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [portfolioItemId]);

  const handleSubmitComment = async (content: string, parentId?: string) => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portfolioItemId,
        content,
        parentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    const { data: newComment } = await response.json();

    // Add the new comment to the list
    if (parentId) {
      // Add as reply
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment],
          };
        }
        return comment;
      }));
    } else {
      // Add as top-level comment
      setComments(prev => [newComment, ...prev]);
    }
    setCommentCount(prev => prev + 1);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    const response = await fetch('/api/comments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to edit comment');
    }

    // Update comment in list
    const updateComment = (comments: CommentWithArtist[]): CommentWithArtist[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content, is_edited: true };
        }
        if (comment.replies) {
          return { ...comment, replies: updateComment(comment.replies) };
        }
        return comment;
      });
    };

    setComments(prev => updateComment(prev));
  };

  const handleDeleteComment = async (commentId: string) => {
    const response = await fetch('/api/comments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    // Remove comment from list
    const removeComment = (comments: CommentWithArtist[]): CommentWithArtist[] => {
      return comments.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        if (comment.replies) {
          comment.replies = removeComment(comment.replies);
        }
        return true;
      });
    };

    setComments(prev => removeComment(prev));
    setCommentCount(prev => prev - 1);
  };

  const handleReply = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setReplyingTo({ id: commentId, artistName: comment.artist.display_name });
    }
  };

  const isLightbox = variant === 'lightbox';

  return (
    <div
      className={cn(
        isLightbox
          ? 'bg-white/10 backdrop-blur-sm rounded-xl p-4'
          : 'bg-white rounded-xl border border-[var(--color-charcoal)]/10 p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className={cn('w-5 h-5', isLightbox ? 'text-white' : 'text-[var(--color-charcoal)]')} />
        <h3 className={cn('font-medium', isLightbox ? 'text-white' : 'text-[var(--color-charcoal)]')}>
          Comments {commentCount > 0 && `(${commentCount})`}
        </h3>
      </div>

      {/* Comment Input */}
      <div className={cn(isLightbox ? 'mb-4' : 'mb-6')}>
        <CommentInput
          currentArtist={currentArtist}
          onSubmit={handleSubmitComment}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className={cn('w-6 h-6 animate-spin', isLightbox ? 'text-white' : 'text-[var(--color-teal)]')} />
        </div>
      ) : comments.length === 0 ? (
        <div className={cn('text-center py-8', isLightbox ? 'text-white/60' : 'text-[var(--color-charcoal)]/60')}>
          <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className={cn('divide-y', isLightbox ? 'divide-white/10' : 'divide-[var(--color-charcoal)]/10')}>
          {comments.map(comment => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentArtistId={currentArtist?.id ?? null}
                isPortfolioOwner={currentArtist?.id === portfolioOwnerId}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                onReply={handleReply}
              />
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8">
                  {comment.replies.map(reply => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentArtistId={currentArtist?.id ?? null}
                      isPortfolioOwner={currentArtist?.id === portfolioOwnerId}
                      onDelete={handleDeleteComment}
                      onEdit={handleEditComment}
                      depth={1}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
