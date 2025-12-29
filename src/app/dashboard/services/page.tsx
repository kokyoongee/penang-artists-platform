import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { ServicesManager } from '@/components/dashboard/ServicesManager';
import { Service } from '@/lib/supabase/types';

export const metadata = {
  title: 'My Services | Artist Dashboard',
  description: 'Manage your services and offerings',
};

export default async function ServicesPage() {
  const supabase = await createServerClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get artist profile for this user
  const { data: artist } = await supabase
    .from('artists')
    .select('id')
    .eq('user_id', user.id)
    .single() as { data: { id: string } | null };

  if (!artist) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-500 mt-1">Manage your services and offerings</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-medium text-yellow-800 mb-2">
            Complete your profile first
          </h3>
          <p className="text-yellow-700 text-sm">
            You need to create your artist profile before you can add services.
            Go to <a href="/dashboard/profile" className="underline">My Profile</a> to get started.
          </p>
        </div>
      </div>
    );
  }

  // Get services for this artist
  // Using type assertion since table may not exist yet
  const { data: services, error } = await (supabase as any)
    .from('services')
    .select('*')
    .eq('artist_id', artist.id)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <p className="text-gray-500 mt-1">
          Add services and products to let visitors know what you offer
        </p>
      </div>

      <ServicesManager
        artistId={artist.id}
        services={(services as Service[]) || []}
      />
    </div>
  );
}
