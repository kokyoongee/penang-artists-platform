import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getProfile } from '@/lib/supabase/server';
import { adminActionSchema, adminBulkActionSchema, adminArtistSchema } from '@/lib/validations/artist';
import { apiError, handleValidationError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';
import { ZodError } from 'zod';

// Verify admin access
async function verifyAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    return null;
  }
  return profile;
}

// Generate slug from display name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// POST - Admin actions on artists (approve, reject, suspend, feature)
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`admin-action:${clientIP}`, true);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const admin = await verifyAdmin();
    if (!admin) {
      return apiError('FORBIDDEN');
    }

    // Parse and validate request body
    const body = await request.json();
    const adminClient = createAdminClient();

    // Check if this is a bulk action
    if (body.action?.startsWith('bulk-')) {
      const { action, artistIds } = adminBulkActionSchema.parse(body);

      switch (action) {
        case 'bulk-approve': {
          const { error } = await adminClient
            .from('artists')
            .update({
              status: 'approved',
              approved_at: new Date().toISOString(),
              approved_by: admin.id,
              rejection_reason: null,
            })
            .in('id', artistIds);

          if (error) {
            return apiError('INTERNAL_ERROR', undefined, {
              operation: 'bulk_approve_artists',
              supabaseError: error.message,
            });
          }
          return NextResponse.json({ message: `${artistIds.length} artists approved` });
        }

        case 'bulk-suspend': {
          const { error } = await adminClient
            .from('artists')
            .update({
              status: 'suspended',
              rejection_reason: 'Bulk suspended by admin',
            })
            .in('id', artistIds);

          if (error) {
            return apiError('INTERNAL_ERROR', undefined, {
              operation: 'bulk_suspend_artists',
              supabaseError: error.message,
            });
          }
          return NextResponse.json({ message: `${artistIds.length} artists suspended` });
        }

        case 'bulk-feature': {
          // Toggle featured status - set all to featured
          const { error } = await adminClient
            .from('artists')
            .update({ featured: true })
            .in('id', artistIds);

          if (error) {
            return apiError('INTERNAL_ERROR', undefined, {
              operation: 'bulk_feature_artists',
              supabaseError: error.message,
            });
          }
          return NextResponse.json({ message: `${artistIds.length} artists featured` });
        }

        default:
          return apiError('BAD_REQUEST', 'Invalid bulk action');
      }
    }

    // Single artist action
    const { action, artistId, reason } = adminActionSchema.parse(body);

    switch (action) {
      case 'approve': {
        const { data, error } = await adminClient
          .from('artists')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            approved_by: admin.id,
            rejection_reason: null,
          })
          .eq('id', artistId)
          .select()
          .single();

        if (error) {
          return apiError('INTERNAL_ERROR', undefined, {
            operation: 'approve_artist',
            supabaseError: error.message,
          });
        }
        return NextResponse.json({ artist: data, message: 'Artist approved' });
      }

      case 'reject': {
        const { data, error } = await adminClient
          .from('artists')
          .update({
            status: 'rejected',
            rejection_reason: reason || 'Application rejected',
            approved_at: null,
            approved_by: null,
          })
          .eq('id', artistId)
          .select()
          .single();

        if (error) {
          return apiError('INTERNAL_ERROR', undefined, {
            operation: 'reject_artist',
            supabaseError: error.message,
          });
        }
        return NextResponse.json({ artist: data, message: 'Artist rejected' });
      }

      case 'suspend': {
        const { data, error } = await adminClient
          .from('artists')
          .update({
            status: 'suspended',
            rejection_reason: reason || 'Account suspended',
          })
          .eq('id', artistId)
          .select()
          .single();

        if (error) {
          return apiError('INTERNAL_ERROR', undefined, {
            operation: 'suspend_artist',
            supabaseError: error.message,
          });
        }
        return NextResponse.json({ artist: data, message: 'Artist suspended' });
      }

      case 'feature': {
        const { data: current } = await adminClient
          .from('artists')
          .select('featured')
          .eq('id', artistId)
          .single();

        const { data, error } = await adminClient
          .from('artists')
          .update({ featured: !current?.featured })
          .eq('id', artistId)
          .select()
          .single();

        if (error) {
          return apiError('INTERNAL_ERROR', undefined, {
            operation: 'feature_artist',
            supabaseError: error.message,
          });
        }
        return NextResponse.json({
          artist: data,
          message: data?.featured ? 'Artist featured' : 'Artist unfeatured',
        });
      }

      case 'verify': {
        const { data: current } = await adminClient
          .from('artists')
          .select('verified')
          .eq('id', artistId)
          .single();

        const { data, error } = await adminClient
          .from('artists')
          .update({ verified: !current?.verified })
          .eq('id', artistId)
          .select()
          .single();

        if (error) {
          return apiError('INTERNAL_ERROR', undefined, {
            operation: 'verify_artist',
            supabaseError: error.message,
          });
        }
        return NextResponse.json({
          artist: data,
          message: data?.verified ? 'Artist verified' : 'Artist unverified',
        });
      }

      case 'delete': {
        const { error } = await adminClient
          .from('artists')
          .delete()
          .eq('id', artistId);

        if (error) {
          return apiError('INTERNAL_ERROR', undefined, {
            operation: 'delete_artist',
            supabaseError: error.message,
          });
        }
        return NextResponse.json({ message: 'Artist deleted' });
      }

      default:
        return apiError('BAD_REQUEST', 'Invalid action');
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error);
    }
    console.error('[Admin Action Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// PUT - Create or update artist (admin can update any field)
export async function PUT(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`admin-update:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const admin = await verifyAdmin();
    if (!admin) {
      return apiError('FORBIDDEN');
    }

    // Parse and validate request body
    const body = await request.json();
    const { id, ...artistData } = adminArtistSchema.parse(body);
    const adminClient = createAdminClient();

    if (id) {
      // Update existing artist
      const { data, error } = await adminClient
        .from('artists')
        .update(artistData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return apiError('INTERNAL_ERROR', undefined, {
          operation: 'admin_update_artist',
          supabaseError: error.message,
        });
      }
      return NextResponse.json({ artist: data });
    } else {
      // Create new artist (admin-created, no user_id required)
      if (!artistData.display_name) {
        return apiError('BAD_REQUEST', 'Display name is required');
      }

      const baseSlug = generateSlug(artistData.display_name);
      let slug = baseSlug;

      const { data: slugExists } = await adminClient
        .from('artists')
        .select('slug')
        .eq('slug', baseSlug)
        .single();

      if (slugExists) {
        slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      const { data, error } = await adminClient
        .from('artists')
        .insert({
          ...artistData,
          slug,
        })
        .select()
        .single();

      if (error) {
        return apiError('INTERNAL_ERROR', undefined, {
          operation: 'admin_create_artist',
          supabaseError: error.message,
        });
      }
      return NextResponse.json({ artist: data });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error);
    }
    console.error('[Admin Update Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
