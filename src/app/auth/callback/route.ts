import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Use admin client for database operations (bypasses RLS and strict typing)
      const adminClient = createAdminClient();

      // Check if profile exists
      const { data: profile } = await adminClient
        .from('profiles')
        .select('id, role')
        .eq('id', data.user.id)
        .single();

      // If no profile exists, create one (for new OAuth users)
      if (!profile) {
        const { error: profileError } = await adminClient
          .from('profiles')
          .insert({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Artist',
            email: data.user.email,
            role: 'artist',
            status: 'pending',
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Redirect new users to complete their profile
        return NextResponse.redirect(new URL('/dashboard/profile', requestUrl.origin));
      }

      // Redirect existing users based on role
      if (profile.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', requestUrl.origin));
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If there's an error, redirect to login with error message
  return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin));
}
