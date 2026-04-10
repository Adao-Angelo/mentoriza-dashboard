import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="w-full py-4 space-y-4">
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
