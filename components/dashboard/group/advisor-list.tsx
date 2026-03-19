import { ReactNode } from 'react';

interface AdvisorListProps {
  children: ReactNode;
}

export default function AdvisorList({ children }: AdvisorListProps) {
  return <div className='flex flex-col gap-3 p-2 pt-3 mb-10'>{children}</div>;
}
