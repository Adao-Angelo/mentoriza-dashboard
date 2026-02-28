import type { LucideIcon } from 'lucide-react';
import {
  Cog,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Users,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  icon: LucideIcon;
  url?: string;
  children?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export const itemsSidebar: SidebarItem[] = [
  {
    title: 'Painel',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Grupos',
    url: '/dashboard/groups',
    icon: Users,
  },
  {
    title: 'Estudantes',
    url: '/dashboard/students',
    icon: Users,
  },
  {
    title: 'Mentores',
    url: '/dashboard/mentors',
    icon: GraduationCap,
  },
  {
    title: 'Relatórios',
    url: '/dashboard/reports',
    icon: FileSpreadsheet,
  },
  {
    title: 'Configurações',
    icon: Cog,
    children: [
      {
        title: 'Indicadores',
        url: '/dashboard/configurations/indicators',
      },
      {
        title: 'Submissões',
        url: '/dashboard/configurations/submissions',
      },
    ],
  },
];
