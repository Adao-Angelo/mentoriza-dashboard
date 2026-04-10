import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className='w-full py-4 space-y-4'>
      <div className='flex justify-end'>
        <Skeleton className='h-10 w-44' />
      </div>
      <Skeleton className='h-96 w-full rounded-xl' />
    </div>
  );
}
