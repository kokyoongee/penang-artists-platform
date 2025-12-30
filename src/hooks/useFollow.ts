'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseFollowResult {
  isFollowing: boolean;
  isLoading: boolean;
  followerCount: number;
  followingCount: number;
  toggleFollow: () => Promise<void>;
  error: string | null;
}

interface UseFollowOptions {
  targetArtistId: string;
  initialIsFollowing?: boolean;
  initialFollowerCount?: number;
  initialFollowingCount?: number;
}

export function useFollow({
  targetArtistId,
  initialIsFollowing = false,
  initialFollowerCount = 0,
  initialFollowingCount = 0,
}: UseFollowOptions): UseFollowResult {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);
  const [error, setError] = useState<string | null>(null);
  const [myArtistId, setMyArtistId] = useState<string | null>(null);

  // Get current user's artist ID on mount
  useEffect(() => {
    const fetchMyArtistId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
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

    fetchMyArtistId();
  }, [targetArtistId]);

  const toggleFollow = useCallback(async () => {
    if (!myArtistId || myArtistId === targetArtistId) {
      setError('Cannot follow yourself');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Optimistic update
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowerCount((prev) => (wasFollowing ? prev - 1 : prev + 1));

    try {
      const response = await fetch('/api/follows', {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetArtistId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update follow status');
      }
    } catch (err) {
      // Rollback optimistic update
      setIsFollowing(wasFollowing);
      setFollowerCount((prev) => (wasFollowing ? prev + 1 : prev - 1));
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [myArtistId, targetArtistId, isFollowing]);

  return {
    isFollowing,
    isLoading,
    followerCount,
    followingCount,
    toggleFollow,
    error,
  };
}
