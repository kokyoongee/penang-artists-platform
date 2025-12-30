import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';

// GET - Fetch activity feed for current user
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor'); // created_at of last item for pagination

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return NextResponse.json({ data: [], followingCount: 0, hasMore: false });
    }

    // Get list of followed artists
    const { data: following } = await adminClient
      .from('follows')
      .select('following_id')
      .eq('follower_id', myArtist.id);

    const followingIds = following?.map(f => f.following_id) || [];

    if (followingIds.length === 0) {
      return NextResponse.json({ data: [], followingCount: 0, hasMore: false });
    }

    // Build activities query
    let query = adminClient
      .from('activities')
      .select(`
        id,
        activity_type,
        entity_type,
        entity_id,
        entity_data,
        created_at,
        artist:artists(id, display_name, slug, profile_photo, primary_medium)
      `)
      .in('artist_id', followingIds)
      .order('created_at', { ascending: false })
      .limit(limit + 1); // Fetch one extra to check if there are more

    // Apply cursor pagination
    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data: activities, error } = await query;

    if (error) {
      console.error('[Feed Fetch Error]', error);
      return apiError('INTERNAL_ERROR');
    }

    // Check if there are more results
    const hasMore = activities && activities.length > limit;
    const feedActivities = hasMore ? activities.slice(0, limit) : activities;

    // Get like counts for portfolio items
    const portfolioItemIds = feedActivities
      ?.filter(a => a.activity_type === 'portfolio_item_added' && a.entity_id)
      .map(a => a.entity_id) || [];

    let likeCounts: Record<string, number> = {};
    if (portfolioItemIds.length > 0) {
      const { data: counts } = await adminClient
        .from('portfolio_items')
        .select('id, like_count')
        .in('id', portfolioItemIds);

      likeCounts = counts?.reduce((acc, item) => {
        acc[item.id] = item.like_count || 0;
        return acc;
      }, {} as Record<string, number>) || {};
    }

    // Enrich activities with like counts
    const enrichedActivities = feedActivities?.map(activity => {
      if (activity.activity_type === 'portfolio_item_added' && activity.entity_id) {
        return {
          ...activity,
          entity_data: {
            ...(activity.entity_data as Record<string, unknown>),
            like_count: likeCounts[activity.entity_id] || 0,
          },
        };
      }
      return activity;
    });

    return NextResponse.json({
      data: enrichedActivities || [],
      followingCount: followingIds.length,
      hasMore,
      nextCursor: hasMore && feedActivities?.length
        ? feedActivities[feedActivities.length - 1].created_at
        : null,
    });
  } catch (error) {
    console.error('[Feed Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
