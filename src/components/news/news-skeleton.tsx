import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton({ isCompact = false }: { isCompact?: boolean }) {
  if (isCompact) {
    return (
      <div className="flex bg-white rounded-lg overflow-hidden shadow-sm border">
        <div className="w-1/3 min-w-[100px] aspect-video">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="p-4 w-2/3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-3 w-1/4" />
            <div className="flex space-x-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
      <div className="aspect-video">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-1/4 mb-2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-4 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 4, compact = false }: { count?: number; compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <NewsCardSkeleton key={index} isCompact={compact} />
        ))}
    </div>
  );
}
