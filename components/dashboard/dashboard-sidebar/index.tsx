'use client';

import { ChevronDown, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Logo } from '@/components/logo';
import { itemsSidebar } from '@/constants/dashboard/sidebar-items';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isProfileActive = pathname.startsWith('/dashboard/my-profile');

  return (
    <Sidebar className='border-r bg-red-200'>
      <SidebarContent>
        <SidebarHeader className='mt-3'>
          <Logo isPrimary />
        </SidebarHeader>

        <SidebarGroup className='mt-6'>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>

          <SidebarGroupContent className='mt-4'>
            <SidebarMenu>
              {itemsSidebar.map((item) => {
                const hasChildren = !!item.children;

                const isParentActive = hasChildren
                  ? item.children!.some((child) =>
                      pathname.startsWith(child.url)
                    )
                  : pathname === item.url ||
                    (item.url !== '/dashboard' &&
                      pathname.startsWith(item.url!));

                const isOpen = openMenu === item.title || isParentActive;

                if (hasChildren) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => setOpenMenu(isOpen ? null : item.title)}
                        className={cn(
                          'h-10.5 rounded-lg gap-3 font-medium justify-between border-l-2 border-transparent transition-all duration-200',
                          isParentActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <div className='flex items-center gap-3'>
                          <item.icon className='h-5 w-5' />
                          <span className='text-sm'>{item.title}</span>
                        </div>

                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </SidebarMenuButton>

                      {isOpen && (
                        <div className='ml-6 mt-2 space-y-1 border-l border-sidebar-border pl-2'>
                          {item.children!.map((child) => {
                            const isActive = pathname.startsWith(child.url);

                            return (
                              <SidebarMenuButton
                                key={child.title}
                                asChild
                                className={cn(
                                  'h-9 gap-3 rounded-lg border-l-2 border-transparent transition-all duration-200',
                                  isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-primary'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                                )}
                              >
                                <Link href={child.url}>
                                  {child.icon && (
                                    <child.icon className='h-4 w-4' />
                                  )}
                                  <span className='text-sm'>{child.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            );
                          })}
                        </div>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        'h-10.5 rounded-lg gap-3 transition-all duration-200 font-medium border-l-2 border-transparent',
                        isParentActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Link href={item.url!}>
                        <item.icon className='h-5 w-5' />
                        <span className='text-sm'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                'h-10.5 rounded-lg gap-3 transition-all duration-200 font-medium border-l-2 border-transparent',
                isProfileActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Link
                href='/dashboard/my-profile'
                className='flex items-center gap-3 w-full'
              >
                <UserIcon className='h-5 w-5' />
                <span className='text-sm'>Meu Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
