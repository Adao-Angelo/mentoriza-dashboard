import { Role } from "@/constants/roles";
import { Action, can, Resource } from "@/lib/rbac/permissions";

import { useAuthStore } from "@/store/use-auth.store";

interface UseUserPermissionProps {
  role?: Role | Role[];
  permission?: string;
  resource?: Resource;
  action?: Action;
}

export function useUserPermission({
  role,
  permission,
  resource,
  action,
}: UseUserPermissionProps): boolean {
  const user = useAuthStore((s) => s.user);

  if (!user) return false;

  const userRoles: Role[] = user.roles ?? [];
  const userPermissions: string[] = user.permissions ?? [];

  if (permission && userPermissions.includes(permission)) return true;

  if (resource && action) {
    for (const r of userRoles) {
      if (can(r, action, resource)) return true;
    }
  }

  if (role && Array.isArray(role)) {
    for (const r of role) {
      if (userRoles.includes(r)) return true;
    }
  } else if (role && userRoles.includes(role)) {
    return true;
  }

  return false;
}
