import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface GroupMemberListProps {
  children: ReactNode;
  id: string;
}

export default function GroupMemberList({
  children,
  id,
}: GroupMemberListProps) {
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <div ref={setNodeRef} className='flex flex-col gap-3 p-2 pt-3'>
      {children}
    </div>
  );
}
