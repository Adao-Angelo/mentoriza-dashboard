import { ReactNode } from "react";

interface GroupBoardProps {
  children: ReactNode;
}

export default function GroupsBoard({ children }: GroupBoardProps) {
  return (
    <div className="relative w-full min-h-0 flex-1 overflow-hidden">
      <div
        className="
          absolute inset-0 
          overflow-x-auto overflow-y-hidden 
          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
          px-4 pb-6 pt-4
        "
      >
        <div className="flex flex-row gap-5 min-w-max h-full">{children}</div>
      </div>
    </div>
  );
}
