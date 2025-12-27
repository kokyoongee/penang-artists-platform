import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerClient, getProfile } from '@/lib/supabase/server';
import { PortfolioManager } from '@/components/dashboard/PortfolioManager';
import { AlertCircle } from 'lucide-react';
import { Artist, PortfolioItem } from '@/lib/supabase/types';

export default async function PortfolioPage() {
  const profile = await getProfile();
  const supabase = await createServerClient();

  if (!profile) {
    redirect('/login');
  }

  // Get artist data
  const { data: artistData } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  const artist = artistData as Artist | null;

  // If no artist profile, redirect to create one first
  if (!artist) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-yellow-800">Create Your Profile First</h2>
            <p className="text-yellow-700 mt-1">
              You need to create your artist profile before adding portfolio items.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-block mt-4 text-[var(--color-teal)] hover:underline font-medium"
            >
              Create Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get portfolio items
  const { data: portfolioData } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('artist_id', artist.id)
    .order('sort_order', { ascending: true });

  const portfolioItems = portfolioData as PortfolioItem[] | null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <p className="text-gray-500 mt-1">
          Showcase your best work. Add at least 3 items for a complete profile.
        </p>
      </div>

      <PortfolioManager
        artistId={artist.id}
        items={portfolioItems || []}
      />
    </div>
  );
}
