import { createOrUseAdmin, signIn } from './authUtils'
import { systemLogs } from './logs'
import { setRole, hasRole } from './permissionUtils'

export const E2E_PERM = 'e2e_admin_perm'

export default async () => {
  systemLogs('Setup before test...')
  await createOrUseAdmin()
  const token = await signIn()
  const existingRole = await hasRole(E2E_PERM, token)

  if (!existingRole) {
    await setRole(
      {
        roleName: E2E_PERM,
        course: 'C:+|R:*|U:+|D:+',
        permission: 'C:+|R:+|U:+|D:+',
        user: 'C:+|R:+|U:+|D:+',
        blog: 'C:*|R:*|U:*|D:*',
        notification: 'C:*|R:*|U:*|D:*',
        instructor: 'C:*|R:*|U:*|D:*',
      },
      token
    )
  }
}
