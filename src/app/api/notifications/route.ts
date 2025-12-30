import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';

// GET - Fetch notifications for current user
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const adminClient = createAdminClient();

    // Get current user's artist profile
    const { data: myArtist } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!myArtist) {
      return NextResponse.json({ data: [], unreadCount: 0 });
    }

    // Build query
    let query = adminClient
      .from('notifications')
      .select(`
        id,
        notification_type,
        is_read,
        created_at,
        payload,
        actor_id,
        actor:artists!notifications_actor_id_fkey(id, display_name, slug, profile_photo)
      `)
      .eq('recipient_id', myArtist.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('[Notifications Fetch Error]', error);
      return apiError('INTERNAL_ERROR');
    }

    // Get unread count
    const { count: unreadCount } = await adminClient
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', myArtist.id)
      .eq('is_read', false);

    return NextResponse.json({
      data: notifications || [],
      unreadCount: unreadCount || 0,
    });
  } catch (error) {
    console.error('[Notifications Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
