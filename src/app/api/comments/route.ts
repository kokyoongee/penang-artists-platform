import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// GET - Fetch comments for a portfolio item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolioItemId = searchParams.get('portfolioItemId');

    if (!portfolioItemId) {
      return apiError('BAD_REQUEST', 'Portfolio item ID required');
    }

    const adminClient = createAdminClient();

    // Fetch top-level comments with artist info
    const { data: comments, error } = await adminClient
      .from('comments')
      .select(`
        id,
        content,
        parent_id,
        is_edited,
        created_at,
        updated_at,
        artist_id,
        artist:artists(id, display_name, slug, profile_photo)
      `)
      .eq('portfolio_item_id', portfolioItemId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Comments Fetch Error]', error);
      return apiError('INTERNAL_ERROR');
    }

    // Fetch replies for all top-level comments
    const commentIds = comments?.map(c => c.id) || [];
    let replies: typeof comments = [];

    if (commentIds.length > 0) {
      const { data: repliesData } = await adminClient
        .from('comments')
        .select(`
          id,
          content,
          parent_id,
          is_edited,
          created_at,
          updated_at,
          artist_id,
          artist:artists(id, display_name, slug, profile_photo)
        `)
        .in('parent_id', commentIds)
        .order('created_at', { ascending: true });

      replies = repliesData || [];
    }

    // Group replies by parent_id
    const repliesByParent = replies.reduce((acc, reply) => {
      const parentId = reply.parent_id as string;
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(reply);
      return acc;
    }, {} as Record<string, typeof replies>);

    // Attach replies to parent comments
    const commentsWithReplies = comments?.map(comment => ({
      ...comment,
      replies: repliesByParent[comment.id] || [],
    }));

    // Get total count
    const { count } = await adminClient
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('portfolio_item_id', portfolioItemId);

    return NextResponse.json({
      data: commentsWithReplies,
      total: count || 0,
    });
  } catch (error) {
    console.error('[Comments Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`comment:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { portfolioItemId, content, parentId } = await request.json();

    if (!portfolioItemId || !content) {
      return apiError('BAD_REQUEST', 'Portfolio item ID and content required');
    }

    if (content.length > 1000) {
      return apiError('BAD_REQUEST', 'Comment too long (max 1000 characters)');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id, display_name, slug, profile_photo')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile to comment');
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
      return apiError('BAD_REQUEST', 'Cannot comment on this item');
    }

    // If replying, verify parent comment exists
    if (parentId) {
      const { data: parentComment } = await adminClient
        .from('comments')
        .select('id')
        .eq('id', parentId)
        .eq('portfolio_item_id', portfolioItemId)
        .single();

      if (!parentComment) {
        return apiError('NOT_FOUND', 'Parent comment not found');
      }
    }

    // Create comment
    const { data: newComment, error } = await adminClient
      .from('comments')
      .insert({
        artist_id: myArtist.id,
        portfolio_item_id: portfolioItemId,
        content,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Comment Create Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'create_comment',
        supabaseError: error.message,
      });
    }

    // Return comment with artist info
    return NextResponse.json({
      data: {
        ...newComment,
        artist: myArtist,
      },
    });
  } catch (error) {
    console.error('[Comment Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// PUT - Update a comment
export async function PUT(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { commentId, content } = await request.json();

    if (!commentId || !content) {
      return apiError('BAD_REQUEST', 'Comment ID and content required');
    }

    if (content.length > 1000) {
      return apiError('BAD_REQUEST', 'Comment too long (max 1000 characters)');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile');
    }

    // Verify comment exists and belongs to user
    const { data: comment } = await adminClient
      .from('comments')
      .select('id, artist_id')
      .eq('id', commentId)
      .single();

    if (!comment) {
      return apiError('NOT_FOUND', 'Comment not found');
    }

    if (comment.artist_id !== myArtist.id) {
      return apiError('FORBIDDEN', 'You can only edit your own comments');
    }

    // Update comment
    const { error } = await adminClient
      .from('comments')
      .update({
        content,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId);

    if (error) {
      console.error('[Comment Update Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'update_comment',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Comment Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return apiError('BAD_REQUEST', 'Comment ID required');
    }

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return apiError('FORBIDDEN', 'You must have an artist profile');
    }

    // Verify comment exists
    const { data: comment } = await adminClient
      .from('comments')
      .select('id, artist_id, portfolio_item_id')
      .eq('id', commentId)
      .single();

    if (!comment) {
      return apiError('NOT_FOUND', 'Comment not found');
    }

    // Check if user is comment author or portfolio owner
    const { data: portfolioItem } = await adminClient
      .from('portfolio_items')
      .select('artist_id')
      .eq('id', comment.portfolio_item_id)
      .single();

    const isAuthor = comment.artist_id === myArtist.id;
    const isPortfolioOwner = portfolioItem?.artist_id === myArtist.id;

    if (!isAuthor && !isPortfolioOwner) {
      return apiError('FORBIDDEN', 'You cannot delete this comment');
    }

    // Delete comment (and its replies via cascade)
    const { error } = await adminClient
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('[Comment Delete Error]', error);
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'delete_comment',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Comment Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
