import { SET_ADMIN_GQL, SIGNIN_GQL, SIGNUP_GQL } from '../gql/admin.gql'
import {
  IAdminUserSetInput,
  IAuthPayload,
  ISigninInput,
  ISignupInput,
} from '../interfaces/admin.interfaces'
import { gqlRequest } from './api-call'
import { systemLogs } from './logs'

export const DEFAULT_EMAIL = 'admin@gmail.com'
export const DEFAULT_PASSWORD = 'Prisdom1234'

export async function createOrUseAdmin() {
  try {
    await gqlRequest<unknown, { data: ISignupInput }>(SIGNUP_GQL, {
      data: {
        email: DEFAULT_EMAIL,
        name: 'Admin Ultimate',
        password: DEFAULT_PASSWORD,
      },
    })

    systemLogs('Create new ultimate admin!')

    return {
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    }
  } catch (error) {
    systemLogs('Existing an ultimate admin, maybe with credentials:', {
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
    })

    return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }
  }
}

/**
 * It will signin as ultimate admin if don't pass params to it.
 * The function will return token
 */
export async function signIn(emailInput?: string, passwordInput?: string) {
  const data = await gqlRequest<IAuthPayload, { data: ISigninInput }>(
    SIGNIN_GQL,
    {
      data: {
        email: emailInput || DEFAULT_EMAIL,
        password: passwordInput || DEFAULT_PASSWORD,
      },
    }
  )

  return data.adminAuthMutation.signIn.token
}

export async function createAdmin(data: IAdminUserSetInput, token: string) {
  await gqlRequest<unknown, { data: IAdminUserSetInput }>(
    SET_ADMIN_GQL,
    { data },
    token
  )
}
