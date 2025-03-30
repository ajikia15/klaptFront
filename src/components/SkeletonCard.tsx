import { FC } from "react";

export const SkeletonCard: FC = () => {
  return (
    <div className="relative max-h-84 bg-neutral-900 overflow-hidden transition-all duration-300 rounded-xl border border-neutral-700">
      {/* Image Container Skeleton */}
      <div className="h-40 p-2 flex items-center justify-center relative">
        <div className="h-full w-full bg-neutral-800 rounded-md animate-pulse">
          {/* Empty skeleton for image */}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2 bg-neutral-800 p-4">
        {/* Title Skeleton */}
        <div className="h-7 w-3/4 bg-neutral-700 rounded-md animate-pulse"></div>

        {/* Description Skeleton - Two lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-neutral-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-2/3 bg-neutral-700 rounded-md animate-pulse"></div>
        </div>

        {/* Price and Button Row */}
        <div className="flex items-center justify-between pt-3">
          {/* Price Skeleton */}
          <div className="h-8 w-24 bg-purple-900/40 rounded-md animate-pulse"></div>

          {/* Button Skeleton */}
          <div className="h-10 w-28 bg-secondary-500/50 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
