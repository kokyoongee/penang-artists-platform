import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// POST - Follow an artist
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`follow:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { targetArtistId } = await request.json();

    if (!targetArtistId) {
      return apiError('BAD_REQUEST', 'Target artist ID required');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile to follow others');
    }

    // Prevent self-follow
    if (myArtist.id === targetArtistId) {
      return apiError('BAD_REQUEST', 'Cannot follow yourself');
    }

    // Verify target artist exists and is approved
    const { data: targetArtist } = await adminClient
      .from('artists')
      .select('id, status')
      .eq('id', targetArtistId)
      .single();

    if (!targetArtist) {
      return apiError('NOT_FOUND', 'Artist not found');
    }

    if (targetArtist.status !== 'approved') {
      return apiError('BAD_REQUEST', 'Cannot follow this artist');
    }

    // Check if already following
    const { data: existingFollow } = await adminClient
      .from('follows')
      .select('id')
      .eq('follower_id', myArtist.id)
      .eq('following_id', targetArtistId)
      .single();

    if (existingFollow) {
      return apiError('BAD_REQUEST', 'Already following this artist');
    }

    // Create follow
    const { error } = await adminClient
      .from('follows')
      .insert({
        follower_id: myArtist.id,
        following_id: targetArtistId,
      });

    if (error) {
      console.error('[Follow Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'create_follow',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Follow Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// DELETE - Unfollow an artist
export async function DELETE(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`unfollow:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { targetArtistId } = await request.json();

    if (!targetArtistId) {
      return apiError('BAD_REQUEST', 'Target artist ID required');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile to unfollow');
    }

    // Delete follow
    const { error } = await adminClient
      .from('follows')
      .delete()
      .eq('follower_id', myArtist.id)
      .eq('following_id', targetArtistId);

    if (error) {
      console.error('[Unfollow Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'delete_follow',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Unfollow Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// GET - Get followers or following list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    const type = searchParams.get('type') || 'followers'; // 'followers' or 'following'
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!artistId) {
      return apiError('BAD_REQUEST', 'Artist ID required');
    }

    const adminClient = createAdminClient();

    if (type === 'followers') {
      // Get followers of this artist
      const { data, error, count } = await adminClient
        .from('follows')
        .select(`
          id,
          created_at,
          follower:artists!follows_follower_id_fkey(
            id,
            display_name,
            slug,
            profile_photo,
            tagline,
            primary_medium,
            location
          )
        `, { count: 'exact' })
        .eq('following_id', artistId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('[Get Followers Error]', error);
        return apiError('INTERNAL_ERROR');
      }

      return NextResponse.json({
        data: data?.map((f) => f.follower) || [],
        total: count || 0,
      });
    } else {
      // Get artists this person is following
      const { data, error, count } = await adminClient
        .from('follows')
        .select(`
          id,
          created_at,
          following:artists!follows_following_id_fkey(
            id,
            display_name,
            slug,
            profile_photo,
            tagline,
            primary_medium,
            location
          )
        `, { count: 'exact' })
        .eq('follower_id', artistId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('[Get Following Error]', error);
        return apiError('INTERNAL_ERROR');
      }

      return NextResponse.json({
        data: data?.map((f) => f.following) || [],
        total: count || 0,
      });
    }
  } catch (error) {
    console.error('[Get Follows Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
