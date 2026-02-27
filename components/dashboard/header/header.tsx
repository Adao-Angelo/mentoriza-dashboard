'use client';
import { useGetSidebarTitle } from '@/hooks/dashboard/use-get-sidebar-title';
import HeaderUserSection from './header-user-section';

export default function DashboardHeader() {
  const { dashboardTitle } = useGetSidebarTitle();

  return (
    <div className='w-full h-18 flex justify-between items-center bg-white border-b px-5 sticky top-0 z-50'>
      <h1 className='text-[18px] font-semibold'>{dashboardTitle}</h1>

      <HeaderUserSection />
    </div>
  );
}
