import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { EventsDirectory } from '@/components/events/EventsDirectory';
import { EventWithArtist } from '@/types';

export const metadata = {
  title: 'Events | Penang Artists Platform',
  description: 'Discover exhibitions, workshops, performances, and art events by Penang artists',
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getEvents(): Promise<EventWithArtist[]> {
  const supabase = await createServerClient();

  // Get current date for filtering upcoming events
  const now = new Date().toISOString();

  // Using type assertion since table may not exist yet
  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      *,
      artist:artists!inner(
        id,
        slug,
        display_name,
        profile_photo,
        primary_medium
      )
    `)
    .eq('is_published', true)
    .gte('start_date', now)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return (data as EventWithArtist[]) || [];
}

async function getPastEvents(): Promise<EventWithArtist[]> {
  const supabase = await createServerClient();

  const now = new Date().toISOString();

  const { data, error } = await (supabase as any)
    .from('events')
    .select(`
      *,
      artist:artists!inner(
        id,
        slug,
        display_name,
        profile_photo,
        primary_medium
      )
    `)
    .eq('is_published', true)
    .lt('start_date', now)
    .order('start_date', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching past events:', error);
    return [];
  }

  return (data as EventWithArtist[]) || [];
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents(),
    getPastEvents(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--color-charcoal)] to-[var(--color-soft-black)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Discover Art Events
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Exhibitions, workshops, performances, and more from Penang&apos;s creative community
          </p>
        </div>
      </section>

      {/* Events Directory */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Suspense fallback={<div className="text-center py-12">Loading events...</div>}>
            <EventsDirectory
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
