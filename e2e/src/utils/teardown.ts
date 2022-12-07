import { systemLogs } from './logs'
import { deletePermissons, getPermissions } from './permissionUtils'

export const ULTIMATE_ADMIN = 'ultimateAdmin'

export const removeAllCreatedPermissions = async (token: string) => {
  systemLogs('Tearing down...')
  systemLogs('Deleting all created admin')
  const permissions = await getPermissions(token)

  permissions.forEach(async (perm) => {
    if (perm.roleName !== ULTIMATE_ADMIN) {
      await deletePermissons(perm.id, token)
    }
  })
}
