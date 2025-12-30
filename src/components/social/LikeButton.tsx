'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  portfolioItemId: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  variant?: 'default' | 'overlay' | 'compact';
  showCount?: boolean;
  onLikeChange?: (isLiked: boolean, newCount: number) => void;
  className?: string;
}

export function LikeButton({
  portfolioItemId,
  initialLikeCount = 0,
  initialIsLiked = false,
  variant = 'default',
  showCount = true,
  onLikeChange,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [myArtistId, setMyArtistId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth and get current user's artist ID
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        const { data } = await supabase
          .from('artists')
          .select('id')
          .eq('user_id', user.id)
          .single() as { data: { id: string } | null };

        if (data) {
          setMyArtistId(data.id);

          // Check if already liked (table may not exist yet)
          try {
            const { data: likeData } = await (supabase as any)
              .from('likes')
              .select('id')
              .eq('artist_id', data.id)
              .eq('portfolio_item_id', portfolioItemId)
              .single();

            setIsLiked(!!likeData);
          } catch {
            // Table may not exist yet
          }
        }
      }
    };

    init();
  }, [portfolioItemId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading || !myArtistId) return;

    setIsLoading(true);

    // Optimistic update
    const wasLiked = isLiked;
    const newLikeCount = wasLiked ? likeCount - 1 : likeCount + 1;
    setIsLiked(!wasLiked);
    setLikeCount(newLikeCount);

    try {
      const response = await fetch('/api/likes', {
        method: wasLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioItemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      onLikeChange?.(!wasLiked, newLikeCount);
    } catch {
      // Rollback on error
      setIsLiked(wasLiked);
      setLikeCount(wasLiked ? likeCount + 1 : likeCount - 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Show count only (for non-authenticated users)
  if (!isAuthenticated) {
    if (variant === 'overlay') {
      return (
        <div className={cn('flex items-center gap-1.5 text-white', className)}>
          <Heart className="w-4 h-4" />
          {showCount && likeCount > 0 && (
            <span className="text-sm font-medium">{likeCount}</span>
          )}
        </div>
      );
    }
    return null;
  }

  // User doesn't have an artist profile
  if (!myArtistId) {
    return null;
  }

  if (variant === 'overlay') {
    return (
      <button
        onClick={handleToggleLike}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1.5 text-white transition-all duration-200 hover:scale-110',
          className
        )}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart
            className={cn(
              'w-5 h-5 transition-all duration-200',
              isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent'
            )}
          />
        )}
        {showCount && likeCount > 0 && (
          <span className="text-sm font-medium">{likeCount}</span>
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggleLike}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-1 text-[var(--color-charcoal)]/70 hover:text-red-500 transition-colors',
          isLiked && 'text-red-500',
          className
        )}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              'w-4 h-4 transition-all duration-200',
              isLiked ? 'fill-current' : 'fill-transparent'
            )}
          />
        )}
        {showCount && likeCount > 0 && (
          <span className="text-sm">{likeCount}</span>
        )}
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200',
        isLiked
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-[var(--color-cream)] text-[var(--color-charcoal)]/70 hover:text-red-500 hover:bg-red-50',
        className
      )}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart
          className={cn(
            'w-5 h-5 transition-all duration-200',
            isLiked ? 'fill-current' : 'fill-transparent'
          )}
        />
      )}
      {showCount && (
        <span className="text-sm font-medium">
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </span>
      )}
    </button>
  );
}
