import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';

// GET - Fetch trending artists (most new followers in last 7 days)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    const adminClient = createAdminClient();

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get artists with most new followers in last 7 days
    const { data: followCounts, error: followError } = await adminClient
      .from('follows')
      .select('following_id')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (followError) {
      console.error('[Trending Follows Error]', followError);
      // Fall back to just showing artists with highest follower count
      const { data: fallbackArtists, error: fallbackError } = await adminClient
        .from('artists')
        .select(`
          id,
          display_name,
          slug,
          tagline,
          primary_medium,
          location,
          profile_photo,
          featured_image,
          follower_count
        `)
        .eq('status', 'approved')
        .order('follower_count', { ascending: false })
        .limit(limit);

      if (fallbackError) {
        return apiError('INTERNAL_ERROR');
      }

      return NextResponse.json({
        data: fallbackArtists || [],
        period: 'all_time',
      });
    }

    // Count follows per artist
    const followCountMap: Record<string, number> = {};
    (followCounts || []).forEach(follow => {
      const id = follow.following_id;
      followCountMap[id] = (followCountMap[id] || 0) + 1;
    });

    // Get artist IDs sorted by new follower count
    const sortedArtistIds = Object.entries(followCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit * 2) // Get more to account for filtering
      .map(([id]) => id);

    if (sortedArtistIds.length === 0) {
      // No recent activity, fall back to featured artists
      const { data: featuredArtists, error: featuredError } = await adminClient
        .from('artists')
        .select(`
          id,
          display_name,
          slug,
          tagline,
          primary_medium,
          location,
          profile_photo,
          featured_image,
          follower_count
        `)
        .eq('status', 'approved')
        .eq('featured', true)
        .order('follower_count', { ascending: false })
        .limit(limit);

      if (featuredError) {
        return apiError('INTERNAL_ERROR');
      }

      return NextResponse.json({
        data: featuredArtists || [],
        period: 'featured',
      });
    }

    // Fetch artist details for trending artists
    const { data: trendingArtists, error: artistsError } = await adminClient
      .from('artists')
      .select(`
        id,
        display_name,
        slug,
        tagline,
        primary_medium,
        location,
        profile_photo,
        featured_image,
        follower_count
      `)
      .eq('status', 'approved')
      .in('id', sortedArtistIds);

    if (artistsError) {
      console.error('[Trending Artists Error]', artistsError);
      return apiError('INTERNAL_ERROR');
    }

    // Sort by new follower count and add the count to response
    const sortedArtists = (trendingArtists || [])
      .map(artist => ({
        ...artist,
        new_followers: followCountMap[artist.id] || 0,
      }))
      .sort((a, b) => b.new_followers - a.new_followers)
      .slice(0, limit);

    return NextResponse.json({
      data: sortedArtists,
      period: '7_days',
    });
  } catch (error) {
    console.error('[Trending Artists Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
