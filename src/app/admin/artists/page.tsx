import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';
import { ArtistsTable } from '@/components/admin/ArtistsTable';

interface ArtistsPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminArtistsPage({ searchParams }: ArtistsPageProps) {
  const params = await searchParams;
  const supabase = await createServerClient();

  let query = supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: false });

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }

  if (params.search) {
    query = query.ilike('display_name', `%${params.search}%`);
  }

  const { data: artists, error } = await query;

  // Get counts for each status
  const { count: totalCount } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true });

  const { count: pendingCount } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: approvedCount } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: draftCount } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  const statusTabs = [
    { label: 'All', value: 'all', count: totalCount || 0 },
    { label: 'Pending', value: 'pending', count: pendingCount || 0 },
    { label: 'Approved', value: 'approved', count: approvedCount || 0 },
    { label: 'Draft', value: 'draft', count: draftCount || 0 },
  ];

  const currentStatus = params.status || 'all';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artists</h1>
          <p className="text-gray-500">Manage artist profiles</p>
        </div>
        <Link href="/admin/artists/new">
          <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]">
            <Plus className="w-4 h-4 mr-2" />
            Add Artist
          </Button>
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex gap-4 px-6" aria-label="Tabs">
            {statusTabs.map((tab) => (
              <Link
                key={tab.value}
                href={`/admin/artists${tab.value !== 'all' ? `?status=${tab.value}` : ''}`}
                className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  currentStatus === tab.value
                    ? 'border-[var(--color-teal)] text-[var(--color-teal)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    currentStatus === tab.value
                      ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Artists Table */}
        <ArtistsTable artists={artists || []} />
      </div>
    </div>
  );
}
