import { SkeletonCard } from '@/components/ui/Skeleton';

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header skeleton */}
      <div className="bg-gradient-to-b from-teal/5 to-transparent py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="skeleton h-12 w-72 mx-auto mb-4" />
          <div className="skeleton h-5 w-[450px] mx-auto max-w-full" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-10 w-28 rounded-lg" />
          ))}
        </div>

        {/* Section title skeleton */}
        <div className="skeleton h-8 w-48 mb-6" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
