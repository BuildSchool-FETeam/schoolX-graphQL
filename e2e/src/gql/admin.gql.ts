import { gql } from 'apollo-boost'

export const SIGNUP_GQL = gql`
  mutation SIGNUP($data: SignUpInput!) {
    adminAuthMutation {
      signUp(data: $data) {
        role
        userName
        token
      }
    }
  }
`

export const SIGNIN_GQL = gql`
  mutation SIGNIN($data: SignInInput!) {
    adminAuthMutation {
      signIn(data: $data) {
        token
      }
    }
  }
`

export const SET_ADMIN_GQL = gql`
  mutation setAdmin($data: AdminUserSetInput!) {
    adminUserMutation {
      setAdminUser(data: $data) {
        email
      }
    }
  }
`

export const ADMIN_USERS = gql`
  query ListAdmin($pagination: PaginationInput, $search: SearchOptionInput) {
    adminUserQuery {
      adminUsers(pagination: $pagination, searchOption: $search) {
        name
        role
        email
        createdBy {
          email
        }
      }
    }
  }
`
