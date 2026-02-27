'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/use-auth.store';
import { removeToken } from '@/utils/remove-token';
import { getInitials } from 'initials-extractor';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderUserSection() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    removeToken();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex items-center gap-2 cursor-pointer'>
          <div className='flex items-center justify-center w-10 h-10 border rounded-[14px]'>
            <h1 className='font-semibold text-[16px] text-Gray'>
              {getInitials(user?.username ?? 'A')}
            </h1>
          </div>

          <div className='hidden md:flex flex-col text-left'>
            <p className='text-[16px] font-bold text-black'>{user?.username}</p>
            <p className='text-[12px] text-Gray'>{user?.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='w-48'>
        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut className='mr-2 h-4 w-4' />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
