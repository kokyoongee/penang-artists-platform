import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createServerClient, getProfile } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';
import { PlatformSettings, DEFAULT_SETTINGS } from '@/types';

// Fixed settings ID (single-row pattern)
const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

// GET - Fetch platform settings (public)
export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data, error } = await (supabase as any)
      .from('platform_settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .single();

    if (error) {
      // Table doesn't exist or no data - return defaults
      console.log('[Settings] Using default settings:', error.message);
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    return NextResponse.json({ settings: data as PlatformSettings });
  } catch (error) {
    console.error('[Settings GET Error]', error);
    // Return defaults on any error
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

// PUT - Update platform settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`settings-update:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify admin access
    const profile = await getProfile();
    if (!profile || profile.role !== 'admin') {
      return apiError('FORBIDDEN');
    }

    const body = await request.json();
    const adminClient = createAdminClient();

    // Only allow specific fields to be updated
    const allowedFields = [
      'site_name',
      'contact_email',
      'site_description',
      'auto_approve_artists',
      'allow_portfolio_uploads',
      'max_portfolio_items',
      'notify_new_registration',
      'notify_new_inquiry',
      'require_email_verification',
    ];

    const updates: Record<string, any> = {
      updated_by: profile.id,
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const { data, error } = await (adminClient as any)
      .from('platform_settings')
      .update(updates)
      .eq('id', SETTINGS_ID)
      .select()
      .single();

    if (error) {
      console.error('[Settings Update Error]', error);
      return apiError('INTERNAL_ERROR', 'Failed to update settings');
    }

    return NextResponse.json({ settings: data, message: 'Settings updated' });
  } catch (error) {
    console.error('[Settings PUT Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
