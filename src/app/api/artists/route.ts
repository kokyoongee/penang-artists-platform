import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createServerClient, getUser } from '@/lib/supabase/server';

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
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const adminClient = createAdminClient();

    // Check if user already has an artist profile
    const { data: existing } = await adminClient
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Artist profile already exists' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = generateSlug(body.display_name);
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
        ...body,
        slug,
        user_id: user.id,
        status: body.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating artist:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ artist });
  } catch (error: any) {
    console.error('Artist creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing artist profile
export async function PUT(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Artist ID required' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Verify user owns this artist profile
    const { data: artist } = await adminClient
      .from('artists')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!artist || artist.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update artist profile
    const { data: updated, error } = await adminClient
      .from('artists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating artist:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ artist: updated });
  } catch (error: any) {
    console.error('Artist update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
