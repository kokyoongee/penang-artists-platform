import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';

// POST - Mark a notification as read
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return apiError('BAD_REQUEST', 'Notification ID required');
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

    // Update notification (only if it belongs to the user)
    const { error } = await adminClient
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('recipient_id', myArtist.id);

    if (error) {
      console.error('[Mark Read Error]', error);
      return apiError('INTERNAL_ERROR');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Notifications Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
