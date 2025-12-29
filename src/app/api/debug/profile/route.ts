import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Debug endpoint to understand the profile/auth state
export async function GET() {
  try {
    const supabase = await createServerClient();
    const adminClient = createAdminClient();

    // 1. Get current user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({
        step: 'getUser',
        error: userError.message,
        user: null,
      });
    }

    if (!user) {
      return NextResponse.json({
        step: 'getUser',
        error: 'No user in session',
        user: null,
      });
    }

    // 2. Query profile by user ID (what middleware does)
    const { data: profileById, error: profileByIdError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // 3. Query profile by email (backup check)
    const { data: profileByEmail, error: profileByEmailError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    // 4. Check if artist profile exists
    const { data: artistProfile, error: artistError } = await adminClient
      .from('artists')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 5. List all profiles (to see what exists)
    const { data: allProfiles } = await adminClient
      .from('profiles')
      .select('id, email, role, full_name')
      .limit(10);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      },
      profileById: profileById || null,
      profileByIdError: profileByIdError?.message || null,
      profileByEmail: profileByEmail || null,
      profileByEmailError: profileByEmailError?.message || null,
      artistProfile: artistProfile || null,
      artistError: artistError?.message || null,
      allProfiles: allProfiles || [],
      diagnosis: getDiagnosis(user, profileById, profileByEmail),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function getDiagnosis(
  user: { id: string; email?: string },
  profileById: unknown,
  profileByEmail: unknown
): string {
  if (!profileById && !profileByEmail) {
    return 'NO PROFILE EXISTS - Auth callback failed to create profile';
  }

  if (!profileById && profileByEmail) {
    return 'PROFILE EXISTS BUT ID MISMATCH - Profile was created with different user ID';
  }

  if (profileById) {
    const profile = profileById as { role?: string };
    if (profile.role !== 'artist') {
      return `PROFILE EXISTS BUT WRONG ROLE - Role is "${profile.role}" instead of "artist"`;
    }
    return 'PROFILE OK - Should work, check middleware';
  }

  return 'UNKNOWN STATE';
}
