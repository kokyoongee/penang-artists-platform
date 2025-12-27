import { createServerClient } from '@/lib/supabase/server';
import { Artist } from '@/types';
import { ArtistsDirectory } from '@/components/artists/ArtistsDirectory';

export const revalidate = 60; // Revalidate every 60 seconds

async function getApprovedArtists(): Promise<Artist[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('status', 'approved')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching artists:', error);
    return [];
  }

  return (data as Artist[]) || [];
}

export default async function ArtistsDirectoryPage() {
  const artists = await getApprovedArtists();

  return <ArtistsDirectory artists={artists} />;
}
