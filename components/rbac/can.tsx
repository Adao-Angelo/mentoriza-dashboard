import { ReactNode } from "react";
import { Role } from "@/lib/rbac/roles";
import { Resource, Action, can } from "@/lib/rbac/permissions";

interface CanProps {
  role: Role;
  resource: Resource;
  action: Action;
  children: ReactNode;
}

export function Can({ role, resource, action, children }: CanProps) {
  const allowed = can(role, action, resource);
  if (!allowed) return null;
  return <>{children}</>;
}
