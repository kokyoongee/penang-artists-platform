'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { FeedCard, FeedEmptyState } from '@/components/feed';
import { Button } from '@/components/ui/button';
import { ActivityType, MediumCategory } from '@/types';

interface FeedArtist {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
  primary_medium: MediumCategory;
}

interface FeedActivity {
  id: string;
  activity_type: ActivityType;
  created_at: string;
  artist: FeedArtist;
  entity_data: {
    title?: string;
    description?: string;
    image_url?: string;
    portfolio_item_id?: string;
    like_count?: number;
    event_title?: string;
    event_type?: string;
    start_date?: string;
    venue?: string;
    event_id?: string;
    service_title?: string;
    service_type?: string;
    price_display?: string;
    service_id?: string;
  } | null;
}

export default function FeedPage() {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async (cursor?: string) => {
    try {
      const url = cursor
        ? `/api/feed?limit=20&cursor=${encodeURIComponent(cursor)}`
        : '/api/feed?limit=20';

      const response = await fetch(url);

      if (response.status === 401) {
        setError('Please sign in to view your feed');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const data = await response.json();

      if (cursor) {
        setActivities(prev => [...prev, ...data.data]);
      } else {
        setActivities(data.data);
        setFollowingCount(data.followingCount);
      }

      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError('Failed to load feed. Please try again.');
      console.error('Feed error:', err);
    }
  }, []);

  useEffect(() => {
    const loadFeed = async () => {
      setIsLoading(true);
      setError(null);
      await fetchFeed();
      setIsLoading(false);
    };

    loadFeed();
  }, [fetchFeed]);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    await fetchFeed(nextCursor);
    setIsLoadingMore(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    setActivities([]);
    await fetchFeed();
    setIsLoading(false);
  };

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-cream)] pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center py-16">
          <p className="text-[var(--color-charcoal)]/60 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="rounded-full">
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-semibold text-[var(--color-charcoal)]">
              Your Feed
            </h1>
            <p className="text-sm text-[var(--color-charcoal)]/60 mt-1">
              Updates from artists you follow
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className="text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-teal)]" />
          </div>
        ) : activities.length === 0 ? (
          <FeedEmptyState followingCount={followingCount} />
        ) : (
          <>
            {/* Activity Feed */}
            <div className="space-y-6">
              {activities.map(activity => (
                <FeedCard key={activity.id} activity={activity} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
