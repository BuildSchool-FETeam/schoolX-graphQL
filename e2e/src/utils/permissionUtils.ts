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
import { gqlMutation, gqlQuery } from './api-call'

export async function hasRole(roleName: string, token: string) {
  try {
    const data = await gqlQuery<IPermissionWithRole, { name: string }>(
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
  await gqlMutation<unknown, { data: IPermissionSetInput }>(
    CREATE_ROLE,
    {
      data,
    },
    token
  )
}

export async function getPermissions(token: string) {
  const res = await gqlQuery<IPermissionQuery>(GET_PERMISSIONS, {}, token)

  return res.permissionQuery.permissions
}

export async function deletePermissons(id: string, token: string) {
  return await gqlMutation<boolean, { id: string }>(DELETE_PERM, { id }, token)
}
