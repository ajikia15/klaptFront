export const LaptopDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 pt-6 pb-16">
      <div className="container mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="h-3 w-16 bg-neutral-800 rounded animate-pulse"></div>
              {i < 4 && <div className="mx-2 text-neutral-700">/</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery skeleton */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Main Image skeleton */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 overflow-hidden aspect-[4/3] flex items-center justify-center">
              <div className="w-full h-full bg-neutral-800 rounded animate-pulse"></div>
            </div>

            {/* Thumbnails skeleton */}
            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 border-neutral-700 bg-neutral-800 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="order-1 lg:order-2">
            <div className="bg-neutral-800/90 rounded-2xl p-8 border border-neutral-700/50 h-full flex flex-col">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="h-6 w-24 bg-neutral-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-16 bg-neutral-700 rounded-full animate-pulse"></div>
              </div>

              <div className="mb-2">
                <div className="h-4 w-32 bg-neutral-700 rounded animate-pulse"></div>
              </div>

              <div className="h-8 w-3/4 bg-neutral-700 rounded mb-6 animate-pulse"></div>

              <div className="mb-6">
                <div className="h-10 w-32 bg-neutral-700 rounded animate-pulse"></div>
              </div>

              {/* Description skeleton */}
              <div className="mb-8 space-y-2">
                <div className="h-4 w-full bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-neutral-700 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-neutral-700 rounded animate-pulse"></div>
              </div>

              {/* Key Highlights skeleton */}
              <div className="mb-8">
                <div className="py-2 flex items-center gap-2 mb-4">
                  <div className="h-1 w-5 bg-neutral-700 rounded-full"></div>
                  <div className="h-5 w-32 bg-neutral-700 rounded animate-pulse"></div>
                </div>

                <div className="pl-7 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-neutral-700/20 rounded-lg p-3 border border-neutral-700/30"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 bg-neutral-700 rounded animate-pulse"></div>
                          <div className="h-5 w-40 bg-neutral-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-12 w-full bg-neutral-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Specifications skeleton */}
        <div className="mb-16">
          <div className="h-8 w-56 bg-neutral-700 rounded mb-8 animate-pulse"></div>

          <div className="relative overflow-hidden bg-neutral-900 rounded-2xl border border-neutral-700/50 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-5 relative z-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-neutral-700/30 last:border-r-0 last:border-b-0"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 animate-pulse"></div>
                    <div className="h-4 w-20 bg-neutral-700 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-neutral-700 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-8 w-64 bg-neutral-700 rounded mb-8 animate-pulse"></div>

          {/* Detailed Specs Section skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5].map((groupIndex) => (
              <div
                key={groupIndex}
                className="bg-neutral-800/70 rounded-2xl overflow-hidden border border-neutral-700/50"
              >
                <div className="px-6 py-4 border-b border-neutral-700/50 bg-neutral-800/50 flex items-center gap-3">
                  <div className="h-5 w-5 bg-neutral-700 rounded animate-pulse"></div>
                  <div className="h-5 w-40 bg-neutral-700 rounded animate-pulse"></div>
                </div>

                <div className="divide-y divide-neutral-700/30">
                  {[1, 2, 3, 4].map((specIndex) => (
                    <div key={specIndex} className="px-6 py-2 grid grid-cols-2">
                      <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-neutral-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information skeleton */}
        <div className="bg-neutral-800/70 rounded-2xl p-8 border border-neutral-700/50">
          <div className="h-7 w-56 bg-neutral-700 rounded mb-6 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-10">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-neutral-700 rounded mb-1 animate-pulse"></div>
                <div className="h-5 w-32 bg-neutral-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
