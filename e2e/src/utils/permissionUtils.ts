import {
  CREATE_ROLE,
  DELETE_PERM,
  GET_PERMISSIONS,
  HAS_ROLE_GQL,
} from '../gql/permission.gql'
import {
  IPermissionQuery,
  IPermissionSetInput,
  IPermissionWithRole,
} from '../interfaces/permission.interface'
import { gqlRequest } from './api-call'

export async function hasRole(roleName: string, token: string) {
  try {
    const data = await gqlRequest<IPermissionWithRole, { name: string }>(
      HAS_ROLE_GQL,
      { name: roleName },
      token
    )

    return Boolean(data)
  } catch (error) {
    return false
  }
}

export async function createNewRole(data: IPermissionSetInput, token: string) {
  await gqlRequest<unknown, { data: IPermissionSetInput }>(
    CREATE_ROLE,
    {
      data,
    },
    token
  )
}

export async function getPermissions(token: string) {
  const res = await gqlRequest<IPermissionQuery>(GET_PERMISSIONS, {}, token)

  return res.permissionQuery.permissions
}

export async function deletePermissons(id: string, token: string) {
  return await gqlRequest<boolean, { id: string }>(DELETE_PERM, { id }, token)
}
