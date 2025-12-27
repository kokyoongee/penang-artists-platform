import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getProfile } from '@/lib/supabase/server';

// Verify admin access
async function verifyAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    return null;
  }
  return profile;
}

// POST - Admin actions on artists (approve, reject, suspend, feature)
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, artistId, reason } = await request.json();

    if (!action || !artistId) {
      return NextResponse.json(
        { error: 'Action and artistId required' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

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

        if (error) throw error;
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

        if (error) throw error;
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

        if (error) throw error;
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

        if (error) throw error;
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

        if (error) throw error;
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

        if (error) throw error;
        return NextResponse.json({ message: 'Artist deleted' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
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

// PUT - Create or update artist (admin can update any field)
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, ...artistData } = await request.json();
    const adminClient = createAdminClient();

    if (id) {
      // Update existing artist
      const { data, error } = await adminClient
        .from('artists')
        .update(artistData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ artist: data });
    } else {
      // Create new artist (admin-created, no user_id required)
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

      if (error) throw error;
      return NextResponse.json({ artist: data });
    }
  } catch (error: any) {
    console.error('Admin update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
