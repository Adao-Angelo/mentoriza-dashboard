/* eslint-disable @typescript-eslint/no-explicit-any */
import { PERMISSIONS } from "@/context/permissions";
import type { LucideIcon } from "lucide-react";
import {
  Cog,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";

export interface SidebarChild {
  title: string;
  url: string;
  icon?: LucideIcon;
  requiredPermission?: string;
}

export interface SidebarItem {
  title: string;
  icon: LucideIcon;
  url?: string;
  requiredPermission?: string;
  children?: SidebarChild[];
}

export const itemsSidebar: SidebarItem[] = [
  {
    title: "Painel",
    url: "/dashboard",
    icon: LayoutDashboard,
    requiredPermission: PERMISSIONS.STUDENT_READ,
  },
  {
    title: "Grupos",
    url: "/dashboard/groups",
    icon: Users,
    requiredPermission: PERMISSIONS.GROUP_READ,
  },
  {
    title: "Estudantes",
    url: "/dashboard/students",
    icon: Users,
    requiredPermission: PERMISSIONS.STUDENT_READ,
  },
  {
    title: "Mentores",
    url: "/dashboard/mentors",
    icon: GraduationCap,
    requiredPermission: PERMISSIONS.USER_READ,
  },
  {
    title: "Relatórios",
    url: "/dashboard/reports",
    icon: FileSpreadsheet,
    requiredPermission: PERMISSIONS.REPORT_READ,
  },
  {
    title: "Configurações",
    icon: Cog,
    children: [
      {
        title: "Indicadores",
        url: "/dashboard/configurations/indicators",
        requiredPermission: PERMISSIONS.INDICATOR_READ,
      },
      {
        title: "Submissões",
        url: "/dashboard/configurations/submissions",
        requiredPermission: PERMISSIONS.SUBMISSION_READ,
      },
    ],
  },
];
