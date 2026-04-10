import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="w-full px-2 mt-3 space-y-4">
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-60 w-full rounded-xl" />
      <div className="border rounded-2xl border-[#DEDEE6] mt-20 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-60" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
