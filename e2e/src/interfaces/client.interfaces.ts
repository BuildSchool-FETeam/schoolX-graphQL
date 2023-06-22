export enum SignupEnumType {
  LEARNER = 'LEARNER',
  INSTRUCTOR = 'INSTRUCTOR',
}

export interface ClientUserSignupInput {
  name: string
  email: string
  password: string
  type: SignupEnumType
}

export interface ClientUserAuthResponse {
  id: string
  email: string
  token: string
  type: SignupEnumType
}

export interface ClientUserSigninInput {
  email: string
  password: string
}

export interface GqlClientResponse {
  clientUserAuthMutation: {
    signUp?: ClientUserAuthResponse
    signIn?: ClientUserAuthResponse
  }
}
