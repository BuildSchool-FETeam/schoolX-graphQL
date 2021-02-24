import { SetMetadata } from "@nestjs/common";

enum Resource {
  course = 'course',
  permission = 'permission',
  user = 'user',
  blog = 'blog',
  notification = 'notification',
  instructor = 'instructor',
}

enum ResourceAction {
  C = 'C',
  R = 'R',
  U = 'U',
  D = 'D',
}

type PermissionRequire = {
  [key in Resource]: ResourceAction[];
};

export const PERMISSION_REQUIRE_KEY = 'PermissionRequire';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PermissionRequire = (permission: PermissionRequire) => SetMetadata(PERMISSION_REQUIRE_KEY, permission)