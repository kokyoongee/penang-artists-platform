import { NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';

// POST - Mark all notifications as read
export async function POST() {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
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

    // Update all unread notifications for this user
    const { error } = await adminClient
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', myArtist.id)
      .eq('is_read', false);

    if (error) {
      console.error('[Mark All Read Error]', error);
      return apiError('INTERNAL_ERROR');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Notifications Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
