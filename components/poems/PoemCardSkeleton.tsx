import Skeleton from "@/components/ui/Skeleton";

export default function PoemCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden border border-outline-variant bg-surface-container-lowest">
      {/* Image Skeleton */}
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-col gap-2">
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-3/4" />
          {/* Author Skeleton */}
          <Skeleton className="h-4 w-1/4" />
        </div>

        <div className="mb-6 flex-1 flex flex-col gap-2">
          {/* Content Skeletons */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-8 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
