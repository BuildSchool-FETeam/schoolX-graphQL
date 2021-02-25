import { SetMetadata } from '@nestjs/common';
import { Resource } from '../enums/resource.enum';
import { ResourceAction } from '../enums/resourceAction.enum';

type PermissionRequire = {
  [key in Resource]: ResourceAction[];
};

export const PERMISSION_REQUIRE_KEY = 'PermissionRequire';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PermissionRequire = (permission: PermissionRequire) =>
  SetMetadata(PERMISSION_REQUIRE_KEY, permission);
