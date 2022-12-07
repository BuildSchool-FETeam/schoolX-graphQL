import { IBase } from './base.interface'

export interface ISignupInput {
  email: string
  name: string
  password: string
}

export interface ISigninInput {
  email: string
  password: string
}

export interface IAuthPayload {
  adminAuthMutation: {
    signIn: {
      token: string
    }
  }
}

export interface IAdminUserSetInput {
  email: string

  name: string

  role: string

  password: string
}

export interface IAdminUser extends IBase {
  name: string
  role: string
  createdBy: Partial<IAdminUser>
  email: string
}

export interface IAdminUserQuery {
  adminUserQuery: {
    adminUsers: IAdminUser[]
  }
}
