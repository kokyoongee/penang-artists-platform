import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { Artist } from '@/lib/supabase/types';

/**
 * Cached function to get artist by user ID
 * Cache is per-user and revalidates every 60 seconds
 */
export const getCachedArtist = unstable_cache(
  async (userId: string): Promise<Artist | null> => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('artists')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data as Artist | null;
  },
  ['artist-by-user'],
  { revalidate: 60, tags: ['artist'] }
);

/**
 * Cached function to get dashboard counts
 * Returns portfolio and inquiries count for an artist
 */
export const getCachedDashboardCounts = unstable_cache(
  async (artistId: string): Promise<{ portfolioCount: number; inquiriesCount: number }> => {
    const supabase = createAdminClient();

    const [portfolioResult, inquiriesResult] = await Promise.all([
      supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', artistId),
      supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', artistId),
    ]);

    return {
      portfolioCount: portfolioResult.count ?? 0,
      inquiriesCount: inquiriesResult.count ?? 0,
    };
  },
  ['dashboard-counts'],
  { revalidate: 30, tags: ['dashboard-counts'] }
);
