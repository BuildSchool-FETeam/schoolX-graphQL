/* eslint-disable no-unused-vars */
import { SetMetadata } from '@nestjs/common'
import { Resource } from '../enums/resource.enum'

export type FineGrainedPerm = 'x' | '+' | '*'
export type MainPerm = 'C' | 'R' | 'U' | 'D'

export type FlexiblePerm = `${MainPerm}:${FineGrainedPerm}`

export type PermissionRequire = {
  [key in Resource]?: Array<FlexiblePerm>
}

export const PERMISSION_REQUIRE_KEY = 'PermissionRequire'
export const PermissionRequire = (permission: PermissionRequire) =>
  SetMetadata(PERMISSION_REQUIRE_KEY, permission)
