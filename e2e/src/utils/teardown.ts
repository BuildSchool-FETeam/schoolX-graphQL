import { systemLogs } from './logs'
import { deletePermissons, getPermissions } from './permissionUtils'
import { E2E_PERM } from './setup'

export const removeAllCreatedPermissions = async (token: string) => {
  systemLogs('Tearing down...')
  systemLogs('Deleting all created  e2e admin')
  const permissions = await getPermissions(token)

  permissions.forEach(async (perm) => {
    if (perm.roleName === E2E_PERM) {
      await deletePermissons(perm.id, token)
    }
  })
}
