import Link from 'next/link';
import { Image, Plus, Eye, Trash2, ExternalLink } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
  artist: {
    display_name: string;
    slug: string;
  } | null;
}

export default async function AdminPortfolioPage() {
  const supabase = await createServerClient();

  const { data: portfolioItems, count: totalCount } = await supabase
    .from('portfolio_items')
    .select(`
      id,
      title,
      description,
      image_url,
      created_at,
      artist:artists (display_name, slug)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Items</h1>
          <p className="text-gray-500">Manage artwork across all artists</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-teal)]/10">
              <Image className="w-5 h-5 text-[var(--color-teal)]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-xl font-bold text-gray-900">{totalCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {(portfolioItems as PortfolioItem[] | null)?.length ? (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(portfolioItems as PortfolioItem[]).map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  {/* Image */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {item.title}
                    </p>
                    {item.artist && (
                      <Link
                        href={`/artists/${item.artist.slug}`}
                        target="_blank"
                        className="text-white/70 text-xs hover:text-white flex items-center gap-1"
                      >
                        by {item.artist.display_name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No portfolio items yet</p>
            <p className="text-sm text-gray-400">
              Portfolio items will appear here when artists add artwork to their profiles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
