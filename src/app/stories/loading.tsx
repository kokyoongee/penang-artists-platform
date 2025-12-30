import { SkeletonStoryCard } from '@/components/ui/Skeleton';

export default function StoriesLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header skeleton */}
      <div className="bg-gradient-to-b from-teal/5 to-transparent py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="skeleton h-4 w-20 mx-auto mb-4" />
          <div className="skeleton h-12 w-80 mx-auto mb-4 max-w-full" />
          <div className="skeleton h-5 w-[500px] mx-auto max-w-full" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-10 w-28 rounded-full" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonStoryCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
