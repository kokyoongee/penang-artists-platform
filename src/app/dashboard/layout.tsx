import { redirect } from 'next/navigation';
import { createServerClient, getProfile } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Artist } from '@/lib/supabase/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const supabase = await createServerClient();

  if (!profile) {
    redirect('/login');
  }

  // Get artist data for this user
  const { data: artistData } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  const artist = artistData as Artist | null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar profile={profile} artist={artist} />
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <DashboardHeader profile={profile} artist={artist} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
