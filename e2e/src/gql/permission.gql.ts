import { gql } from 'apollo-boost'

export const HAS_ROLE_GQL = gql`
  query role($name: String!) {
    permissionQuery {
      permissionWithRole(roleName: $name) {
        id
        roleName
      }
    }
  }
`
export const CREATE_ROLE = gql`
  mutation createRole($data: PermissionSetInput!) {
    permissionMutation {
      setPermission(data: $data) {
        roleName
      }
    }
  }
`

export const GET_PERMISSIONS = gql`
  query GET_PERM {
    permissionQuery {
      permissions {
        id
        roleName
      }
    }
  }
`

export const DELETE_PERM = gql`
  mutation deletePerm($id: ID!) {
    permissionMutation {
      deletePermission(id: $id)
    }
  }
`
