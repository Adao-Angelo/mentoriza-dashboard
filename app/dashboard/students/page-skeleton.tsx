import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className='w-full py-4 space-y-4'>
      <Skeleton className='h-12 w-full rounded-xl' />
      <Skeleton className='h-96 w-full rounded-xl' />
    </div>
  );
}
