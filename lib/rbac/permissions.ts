import { Role } from "./roles";

export type Action = "read" | "create" | "update" | "delete";
export type Resource = "advisor" | "project" | "user";

type Permissions = Record<Role, Partial<Record<Resource, Action[]>>>;

export const rolePermissions: Permissions = {
  [Role.STUDENT]: {
    project: ["read", "create"],
  },
  [Role.TEACHER]: {
    project: ["read"],
  },
  [Role.ADVISOR]: {
    project: ["read", "update"],
    advisor: ["read"],
  },
  [Role.COORDINATOR]: {
    project: ["read", "create", "update", "delete"],
    advisor: ["read", "update", "delete"],
    user: ["read", "update", "delete"],
  },
};

export function can(role: Role, action: Action, resource: Resource): boolean {
  return rolePermissions[role]?.[resource]?.includes(action) ?? false;
}
