import { Role } from "@/constants/roles";
import { useUserPermission } from "@/hooks/rbac/useUserPermission";
import { Action, Resource } from "@/lib/rbac/permissions";

import { ReactNode } from "react";

interface CanProps {
  role?: Role | Role[];
  permission?: string;
  resource?: Resource;
  action?: Action;
  children: ReactNode | ((allowed: boolean) => ReactNode);
  fallback?: ReactNode;
}

export function Can({
  role,
  permission,
  resource,
  action,
  children,
  fallback = null,
}: CanProps) {
  const allowed = useUserPermission({ role, permission, resource, action });

  if (typeof children === "function") {
    return <>{children(allowed)}</>;
  }

  return <>{allowed ? children : fallback}</>;
}
