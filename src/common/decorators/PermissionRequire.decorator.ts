/* eslint-disable no-unused-vars */
import { SetMetadata } from '@nestjs/common'
import { Resource } from '../enums/resource.enum'

export type PermissionRequire = {
  [key in Resource]?: Array<'U' | 'C' | 'D' | 'R'>
}

export const PERMISSION_REQUIRE_KEY = 'PermissionRequire'
export const PermissionRequire = (permission: PermissionRequire) =>
  SetMetadata(PERMISSION_REQUIRE_KEY, permission)
