import { Eye, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import UserProfileDisplay from '../user-profile-display';

interface MemberCardProps {
  name: string;
  email: string;
  studentId?: number;
}

export default function MemberCard({
  name,
  email,
  studentId,
}: MemberCardProps) {
  return (
    <div className='w-full  flex justify-between items-center border rounded-[12px] bg-gray-100 p-2'>
      <div className='w-auto flex gap-2 items-center'>
        <UserProfileDisplay username={name} email={email} />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='text-[#999999] border border-[#D9D9D9]'
            variant={'outline'}
            size='icon'
          >
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-44'>
          {studentId && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/students/${studentId}`}>
                <Eye className='mr-2 h-4 w-4' />
                Ver Detalhes
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem>
            <Trash2 className='mr-2 h-4 w-4' />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
