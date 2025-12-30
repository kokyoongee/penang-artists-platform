export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero skeleton */}
      <div className="relative h-[80vh] flex items-center">
        <div className="skeleton-shimmer absolute inset-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="skeleton h-4 w-48 mb-6" />
            <div className="skeleton h-14 w-full mb-4" />
            <div className="skeleton h-14 w-3/4 mb-6" />
            <div className="skeleton h-5 w-full mb-2" />
            <div className="skeleton h-5 w-2/3 mb-8" />
            <div className="flex gap-4">
              <div className="skeleton h-12 w-36 rounded-lg" />
              <div className="skeleton h-12 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="skeleton h-8 w-64 mx-auto mb-4" />
        <div className="skeleton h-5 w-96 mx-auto mb-12 max-w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="skeleton h-48 mb-4" />
              <div className="skeleton h-6 w-3/4 mb-2" />
              <div className="skeleton h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
