import { notFound } from 'next/navigation';
import { ArtistForm } from '@/components/admin/ArtistForm';
import { createServerClient } from '@/lib/supabase/server';

interface EditArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArtistPage({ params }: EditArtistPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single();

  if (!artist) {
    notFound();
  }

  return <ArtistForm artist={artist} isEditing />;
}
