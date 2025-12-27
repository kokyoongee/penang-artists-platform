import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { artistSchema, artistUpdateSchema } from '@/lib/validations/artist';
import { apiError, handleValidationError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';
import { ZodError } from 'zod';

// Generate slug from display name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// POST - Create new artist profile
export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`artist-create:${clientIP}`, true);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = artistSchema.parse(body);

    const adminClient = createAdminClient();

    // Check if user already has an artist profile
    const { data: existing } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return apiError('BAD_REQUEST', 'Artist profile already exists');
    }

    // Generate unique slug
    const baseSlug = generateSlug(validatedData.display_name);
    let slug = baseSlug;

    const { data: slugExists } = await adminClient
      .from('artists')
      .select('slug')
      .eq('slug', baseSlug)
      .single();

    if (slugExists) {
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // Create artist profile
    const { data: artist, error } = await adminClient
      .from('artists')
      .insert({
        ...validatedData,
        slug,
        user_id: user.id,
        status: validatedData.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'create_artist',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ artist });
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error);
    }
    console.error('[Artist Create Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}

// PUT - Update existing artist profile
export async function PUT(request: NextRequest) {
  try {
    // Rate limit check
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`artist-update:${clientIP}`);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED');
    }

    // Parse and validate request body
    const body = await request.json();
    const { id, ...updateData } = artistUpdateSchema.parse(body);

    if (!id) {
      return apiError('BAD_REQUEST', 'Artist ID required');
    }

    const adminClient = createAdminClient();

    // Verify user owns this artist profile
    const { data: artist } = await adminClient
      .from('artists')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!artist) {
      return apiError('NOT_FOUND');
    }

    if (artist.user_id !== user.id) {
      return apiError('FORBIDDEN');
    }

    // Update artist profile
    const { data: updated, error } = await adminClient
      .from('artists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return apiError('INTERNAL_ERROR', undefined, {
        operation: 'update_artist',
        supabaseError: error.message,
      });
    }

    return NextResponse.json({ artist: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error);
    }
    console.error('[Artist Update Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
