export const ROLES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  ADVISOR: "advisor",
  STUDENT: "student",
  PT_TEACHER: "pt_teacher",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
