import { SkeletonArtistCard } from '@/components/ui/Skeleton';

export default function ArtistsLoading() {
  return (
    <div className="min-h-screen bg-cream">
        {/* Header skeleton */}
        <div className="bg-gradient-to-b from-teal/5 to-transparent py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="skeleton h-10 w-64 mx-auto mb-4" />
            <div className="skeleton h-5 w-96 mx-auto max-w-full" />
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-10 w-24 rounded-full" />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonArtistCard key={i} />
            ))}
          </div>
        </div>
    </div>
  );
}
