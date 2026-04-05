import { Role, ROLES } from "@/constants/roles";

export type Action = "read" | "create" | "update" | "delete";
export type Resource = "advisor" | "project" | "user";

type Permissions = Record<Role, Partial<Record<Resource, Action[]>>>;

export const rolePermissions: Permissions = {
  [ROLES.STUDENT]: {
    project: ["read", "create"],
  },
  [ROLES.PT_TEACHER]: {
    project: ["read"],
  },
  [ROLES.ADVISOR]: {
    project: ["read", "update"],
    advisor: ["read"],
  },
  [ROLES.COORDINATOR]: {
    project: ["read", "create", "update", "delete"],
    advisor: ["read", "update", "delete"],
    user: ["read", "update", "delete"],
  },
  [ROLES.ADMIN]: {},
};

export function can(role: Role, action: Action, resource: Resource): boolean {
  return rolePermissions[role]?.[resource]?.includes(action) ?? false;
}
