'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  targetArtistId: string;
  initialIsFollowing?: boolean;
  initialFollowerCount?: number;
  variant?: 'default' | 'compact';
  onFollowChange?: (isFollowing: boolean, newCount: number) => void;
  className?: string;
}

export function FollowButton({
  targetArtistId,
  initialIsFollowing = false,
  initialFollowerCount = 0,
  variant = 'default',
  onFollowChange,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [myArtistId, setMyArtistId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);

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

          // Check if already following (table may not exist yet)
          try {
            const { data: followData } = await (supabase as any)
              .from('follows')
              .select('id')
              .eq('follower_id', data.id)
              .eq('following_id', targetArtistId)
              .single();

            setIsFollowing(!!followData);
          } catch {
            // Table may not exist yet
          }
        }
      }
    };

    init();
  }, [targetArtistId]);

  // Don't show button if user is not authenticated or is viewing own profile
  if (!isAuthenticated || myArtistId === targetArtistId) {
    return null;
  }

  // Show nothing if user doesn't have an artist profile
  if (isAuthenticated && !myArtistId) {
    return null;
  }

  const handleToggleFollow = async () => {
    if (isLoading || !myArtistId) return;

    setIsLoading(true);

    // Optimistic update
    const wasFollowing = isFollowing;
    const newFollowerCount = wasFollowing ? followerCount - 1 : followerCount + 1;
    setIsFollowing(!wasFollowing);
    setFollowerCount(newFollowerCount);

    try {
      const response = await fetch('/api/follows', {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetArtistId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      onFollowChange?.(!wasFollowing, newFollowerCount);
    } catch {
      // Rollback on error
      setIsFollowing(wasFollowing);
      setFollowerCount(wasFollowing ? followerCount + 1 : followerCount - 1);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggleFollow}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200',
          isFollowing
            ? isHovered
              ? 'bg-red-100 text-red-600'
              : 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]'
            : 'bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal)]/90',
          className
        )}
        aria-label={isFollowing ? 'Unfollow' : 'Follow'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing && isHovered ? (
          <UserMinus className="w-4 h-4" />
        ) : isFollowing ? (
          <UserMinus className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant={isFollowing ? 'outline' : 'default'}
      className={cn(
        'min-w-[100px] transition-all duration-200',
        isFollowing
          ? isHovered
            ? 'border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600'
            : 'border-[var(--color-teal)] text-[var(--color-teal)]'
          : 'bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing && isHovered ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}
