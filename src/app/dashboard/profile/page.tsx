import { redirect } from 'next/navigation';
import { createServerClient, createAdminClient, getProfile } from '@/lib/supabase/server';
import { ArtistProfileForm } from '@/components/dashboard/ArtistProfileForm';

export default async function ProfileEditorPage() {
  const profile = await getProfile();
  const supabase = await createServerClient();

  if (!profile) {
    redirect('/login');
  }

  // Get artist data if exists
  let { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  // Auto-create draft artist profile if none exists (fixes "join twice" UX issue)
  if (!artist) {
    const adminClient = createAdminClient();
    const userName = profile.full_name || profile.email?.split('@')[0] || 'Artist';

    const baseSlug = userName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const { data: newArtist, error } = await adminClient
      .from('artists')
      .insert({
        user_id: profile.id,
        display_name: userName,
        slug: slug,
        bio: '',
        art_types: [],
        status: 'draft',
      })
      .select()
      .single();

    if (!error && newArtist) {
      artist = newArtist;
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {artist ? 'Edit Your Profile' : 'Create Your Profile'}
        </h1>
        <p className="text-gray-500 mt-1">
          {artist
            ? 'Update your information to keep your profile fresh'
            : 'Fill in your details to create your artist profile'}
        </p>
      </div>

      <ArtistProfileForm
        profile={profile}
        artist={artist}
      />
    </div>
  );
}
