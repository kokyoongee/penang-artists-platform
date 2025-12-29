import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { EventsManager } from '@/components/dashboard/EventsManager';
import { Event } from '@/types';

export const metadata = {
  title: 'My Events | Artist Dashboard',
  description: 'Manage your exhibitions, workshops, and events',
};

export default async function EventsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-500 mt-1">Manage your exhibitions, workshops, and events</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-medium text-yellow-800 mb-2">
            Complete your profile first
          </h3>
          <p className="text-yellow-700 text-sm">
            You need to create your artist profile before you can add events.
            Go to <a href="/dashboard/profile" className="underline">My Profile</a> to get started.
          </p>
        </div>
      </div>
    );
  }

  // Get events for this artist
  // Using type assertion since table may not exist yet
  const { data: events, error } = await (supabase as any)
    .from('events')
    .select('*')
    .eq('artist_id', artist.id)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-500 mt-1">
          Promote your exhibitions, workshops, performances, and other events
        </p>
      </div>

      <EventsManager
        artistId={artist.id}
        events={(events as Event[]) || []}
      />
    </div>
  );
}
