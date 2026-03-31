export const PERMISSIONS = {
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_MANAGE_ROLES: "user:manage-roles",

  ADVISOR_CREATE: "advisor:create",
  ADVISOR_READ: "advisor:read",
  ADVISOR_UPDATE: "advisor:update",
  ADVISOR_DELETE: "advisor:delete",

  STUDENT_CREATE: "student:create",
  STUDENT_READ: "student:read",
  STUDENT_UPDATE: "student:update",
  STUDENT_DELETE: "student:delete",
  STUDENT_LINK_GROUP: "student:link-group",

  GROUP_CREATE: "group:create",
  GROUP_READ: "group:read",
  GROUP_UPDATE: "group:update",
  GROUP_PUBLISH: "group:publish",
  GROUP_DELETE: "group:delete",
  GROUP_ADD_MENTOR: "group:add-mentor",
  GROUP_REMOVE_MENTOR: "group:remove-mentor",
  GROUP_ADD_STUDENT: "group:add-student",
  GROUP_REMOVE_STUDENT: "group:remove-student",

  REPORT_SUBMIT: "report:submit",
  REPORT_READ_OWN: "report:read-own",
  REPORT_READ_ALL: "report:read-all",
  REPORT_REVIEW: "report:review",
  REPORT_READ: "report:read",
  REPORT_APPROVE: "report:approve",
  REPORT_REJECT: "report:reject",

  FEEDBACK_CREATE: "feedback:create",
  FEEDBACK_READ: "feedback:read",
  FEEDBACK_UPDATE_OWN: "feedback:update-own",

  ASSESSMENT_SUBMIT: "assessment:submit",
  ASSESSMENT_READ: "assessment:read",

  INDICATOR_MANAGE: "indicator:manage",
  INDICATOR_READ: "indicator:read",
  DEADLINE_MANAGE: "deadline:manage",
  DEADLINE_READ: "deadline:read",

  DOCUMENT_CREATE: "document:create",
  DOCUMENT_READ: "document:read",
  DOCUMENT_UPDATE: "document:update",
  DOCUMENT_DELETE: "document:delete",

  SUBMISSION_MANAGE: "submission:manage",
  SUBMISSION_READ: "submission:read",

  SUBMISSION_CREATE: "submission:create",
} as const;
