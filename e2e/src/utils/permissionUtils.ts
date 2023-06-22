import {
  SET_ROLE,
  DELETE_PERM,
  GET_PERMISSION,
  GET_PERMISSIONS,
  HAS_ROLE_GQL,
} from '../gql/permission.gql'
import { PaginationInput } from '../interfaces/base.interface'
import {
  GqlPermissionReponse,
  IPermissionQuery,
  IPermissionSetInput,
} from '../interfaces/permission.interface'
import { DEFAULT_PERMISSION } from '../tests/common/constant'
import { gqlRequest } from './api-call'

export async function hasRole(roleName: string, token: string) {
  try {
    const data = await gqlRequest<GqlPermissionReponse, { name: string }>(
      HAS_ROLE_GQL,
      { name: roleName },
      token
    )

    return data.permissionQuery.permissionWithRole
  } catch (error) {
    console.log('ERROR', error)

    return false
  }
}

export function getPermissionInput(
  input: Partial<IPermissionSetInput>
): IPermissionSetInput {
  const { DENINED } = DEFAULT_PERMISSION

  return {
    roleName: 'role 1',
    course: DENINED,
    blog: DENINED,
    permission: DENINED,
    notification: DENINED,
    user: DENINED,
    instructor: DENINED,
    ...input,
  }
}

interface SetRoleOptions {
  id?: string
  ultimateAdminToken?: string
}
export async function setRole(
  data: IPermissionSetInput,
  token: string,
  options: SetRoleOptions = {}
) {
  const hasroleRes = await hasRole(
    data.roleName,
    options.ultimateAdminToken || token
  )
  if (hasroleRes && !options.id) {
    console.log(`Role named ${data.roleName} is existed`)

    return { id: hasroleRes.id, roleName: hasroleRes.roleName }
  }
  const res = await gqlRequest<
    GqlPermissionReponse,
    { data: IPermissionSetInput; id?: string }
  >(
    SET_ROLE,
    {
      data,
      id: options.id,
    },
    token
  )

  return res.permissionMutation.setPermission
}

export async function getPermissions(
  token: string,
  pagination?: PaginationInput
) {
  const res = await gqlRequest<IPermissionQuery>(
    GET_PERMISSIONS,
    { pagination },
    token
  )

  return res.permissionQuery.permissions
}

export async function getPermById(token: string, id: string) {
  const res = await gqlRequest<GqlPermissionReponse>(
    GET_PERMISSION,
    { id },
    token
  )

  return res.permissionQuery.permissionWithId
}

export async function deletePermissons(id: string, token: string) {
  const res = await gqlRequest<GqlPermissionReponse, { id: string }>(
    DELETE_PERM,
    { id },
    token
  )

  return res.permissionMutation.deletePermission
}
