import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className='w-full py-4 space-y-4'>
      <Skeleton className='h-12 w-full rounded-xl' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-56 w-full rounded-xl' />
        ))}
      </div>
    </div>
  );
}
