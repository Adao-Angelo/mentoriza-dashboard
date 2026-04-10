import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Skeleton className='h-7 w-44' />
        <div className='flex gap-3'>
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>
      <Skeleton className='h-56 w-full rounded-xl' />
      <Skeleton className='h-56 w-full rounded-xl' />
    </div>
  );
}
