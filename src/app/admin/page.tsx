import Link from 'next/link';
import { Users, Clock, CheckCircle, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Artist, Inquiry } from '@/lib/supabase/types';

type RecentArtist = Pick<Artist, 'id' | 'slug' | 'display_name' | 'primary_medium' | 'status' | 'created_at'>;

async function getStats() {
  const supabase = await createServerClient();

  // Get artist counts by status
  const { count: totalArtists } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true });

  const { count: pendingArtists } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: approvedArtists } = await supabase
    .from('artists')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  // Get recent inquiries count (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentInquiries } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString());

  return {
    totalArtists: totalArtists || 0,
    pendingArtists: pendingArtists || 0,
    approvedArtists: approvedArtists || 0,
    recentInquiries: recentInquiries || 0,
  };
}

async function getRecentArtists(): Promise<RecentArtist[]> {
  const supabase = await createServerClient();

  const { data: artists } = await supabase
    .from('artists')
    .select('id, slug, display_name, primary_medium, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (artists as RecentArtist[]) || [];
}

async function getRecentInquiries() {
  const supabase = await createServerClient();

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select(`
      id,
      name,
      email,
      inquiry_type,
      created_at,
      artists (display_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return inquiries || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentArtists = await getRecentArtists();
  const recentInquiries = await getRecentInquiries();

  const statCards = [
    {
      name: 'Total Artists',
      value: stats.totalArtists,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Review',
      value: stats.pendingArtists,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Approved',
      value: stats.approvedArtists,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Inquiries (7d)',
      value: stats.recentInquiries,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Artists */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Artists</h2>
            <Link
              href="/admin/artists"
              className="text-sm text-[var(--color-teal)] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentArtists.length > 0 ? (
              recentArtists.map((artist) => (
                <div key={artist.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-gray-900">{artist.display_name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {artist.primary_medium.replace('-', ' ')}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      artist.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : artist.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {artist.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No artists yet</p>
                <Link
                  href="/admin/artists/new"
                  className="text-sm text-[var(--color-teal)] hover:underline"
                >
                  Add your first artist
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm text-[var(--color-teal)] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry: any) => (
                <div key={inquiry.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{inquiry.name}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    To: {inquiry.artists?.display_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize mt-1">
                    {inquiry.inquiry_type.replace('_', ' ')}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No inquiries yet</p>
                <p className="text-sm">Inquiries will appear here when visitors contact artists</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/artists/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-teal)] text-white rounded-lg hover:bg-[var(--color-deep-teal)] transition-colors"
          >
            <Users className="w-4 h-4" />
            Add New Artist
          </Link>
          <Link
            href="/admin/artists?status=pending"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Review Pending ({stats.pendingArtists})
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            View Live Site
          </Link>
        </div>
      </div>
    </div>
  );
}
