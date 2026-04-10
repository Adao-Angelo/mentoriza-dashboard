import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="h-dvh flex flex-col">
      <div className="px-6 py-4 border-b space-y-3">
        <Skeleton className="h-6 w-56" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    </div>
  );
}
