import { gql } from 'graphql-request'

export const INSTRUCTOR_SIGNUP = gql`
  mutation SignUpClient($data: ClientUserSignupInput!) {
    clientUserAuthMutation {
      signUp(data: $data) {
        token
        id
      }
    }
  }
`

export const INSTRUCTOR_SIGNIN = gql`
  mutation SigninClient($data: ClientUserSigninInput!) {
    clientUserAuthMutation {
      signIn(data: $data) {
        token
        id
      }
    }
  }
`
