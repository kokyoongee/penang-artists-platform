import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// POST - Like a portfolio item
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`like:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { portfolioItemId } = await request.json();

    if (!portfolioItemId) {
      return apiError('BAD_REQUEST', 'Portfolio item ID required');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile to like items');
    }

    // Verify portfolio item exists and belongs to approved artist
    const { data: portfolioItem } = await adminClient
      .from('portfolio_items')
      .select('id, artist_id')
      .eq('id', portfolioItemId)
      .single();

    if (!portfolioItem) {
      return apiError('NOT_FOUND', 'Portfolio item not found');
    }

    // Verify the artist is approved
    const { data: artist } = await adminClient
      .from('artists')
      .select('id, status')
      .eq('id', portfolioItem.artist_id)
      .single();

    if (!artist || artist.status !== 'approved') {
      return apiError('BAD_REQUEST', 'Cannot like this item');
    }

    // Check if already liked
    const { data: existingLike } = await adminClient
      .from('likes')
      .select('id')
      .eq('artist_id', myArtist.id)
      .eq('portfolio_item_id', portfolioItemId)
      .single();

    if (existingLike) {
      return apiError('BAD_REQUEST', 'Already liked this item');
    }

    // Create like
    const { error } = await adminClient
      .from('likes')
      .insert({
        artist_id: myArtist.id,
        portfolio_item_id: portfolioItemId,
      });

    if (error) {
      console.error('[Like Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'create_like',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Like Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// DELETE - Unlike a portfolio item
export async function DELETE(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`unlike:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { portfolioItemId } = await request.json();

    if (!portfolioItemId) {
      return apiError('BAD_REQUEST', 'Portfolio item ID required');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile to unlike');
    }

    // Delete like
    const { error } = await adminClient
      .from('likes')
      .delete()
      .eq('artist_id', myArtist.id)
      .eq('portfolio_item_id', portfolioItemId);

    if (error) {
      console.error('[Unlike Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'delete_like',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Unlike Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
