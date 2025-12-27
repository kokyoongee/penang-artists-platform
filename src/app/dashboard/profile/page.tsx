import { redirect } from 'next/navigation';
import { createServerClient, getProfile } from '@/lib/supabase/server';
import { ArtistProfileForm } from '@/components/dashboard/ArtistProfileForm';

export default async function ProfileEditorPage() {
  const profile = await getProfile();
  const supabase = await createServerClient();

  if (!profile) {
    redirect('/login');
  }

  // Get artist data if exists
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', profile.id)
    .single();

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
