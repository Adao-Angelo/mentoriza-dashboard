import { ReactNode } from 'react';

interface GroupBoardProps {
  children: ReactNode;
}

export default function GroupsBoard({ children }: GroupBoardProps) {
  return (
    <div className='relative w-full flex-1 overflow-hidden'>
      <div
        className='
         w-full h-full
          overflow-x-auto overflow-y-hidden 
          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
          px-4 pb-6 pt-4
        '
      >
        <div className='flex flex-row items-start gap-5 min-w-max pb-4'>
          {children}
        </div>
      </div>
    </div>
  );
}
