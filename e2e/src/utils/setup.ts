import { createOrUseAdmin, signIn } from './authUtils'
import { systemLogs } from './logs'
import { createNewRole, hasRole } from './permissionUtils'

export const SECONDARY_PERM = 'secondaryAdmin'

export default async () => {
  systemLogs('Setup before test...')
  await createOrUseAdmin()
  const token = await signIn()
  const existingRole = await hasRole(SECONDARY_PERM, token)

  if (!existingRole) {
    await createNewRole(
      {
        roleName: SECONDARY_PERM,
        course: 'C|R|U|D',
        permission: 'C|R|U|D|S',
        user: 'C|R|U|D|S',
        blog: 'C|R|U|D',
        notification: 'C|R|U|D',
        instructor: 'C|R|U|D',
      },
      token
    )
  }
}
