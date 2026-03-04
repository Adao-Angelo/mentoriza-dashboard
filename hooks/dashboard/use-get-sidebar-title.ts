"use client";

import { usePathname } from "next/navigation";
import { itemsSidebar } from "@/constants/dashboard/sidebar-items";

export function useGetSidebarTitle() {
  const pathname = usePathname();

  let dashboardTitle = "";

  for (const item of itemsSidebar) {
    if (item.url && pathname.startsWith(item.url)) {
      dashboardTitle = item.title;
    }

    if (item.children) {
      const child = item.children.find((child) =>
        pathname.startsWith(child.url),
      );

      if (child) {
        dashboardTitle = child.title;
      }
    }
  }

  if (pathname.startsWith("/dashboard/my-profile")) {
    dashboardTitle = "Meu Perfil";
  }

  return { dashboardTitle };
}
