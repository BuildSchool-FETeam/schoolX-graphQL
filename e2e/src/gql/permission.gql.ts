import { gql } from 'graphql-request'

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
export const SET_ROLE = gql`
  mutation SetRole($data: PermissionSetInput!, $id: ID) {
    permissionMutation {
      setPermission(data: $data, id: $id) {
        id
        roleName
      }
    }
  }
`

export const GET_PERMISSIONS = gql`
  query GET_PERM($pagination: PaginationInput) {
    permissionQuery {
      permissions(pagination: $pagination) {
        id
        roleName
      }
    }
  }
`

export const GET_PERMISSION = gql`
  query GetPermissionById($id: ID!) {
    permissionQuery {
      permissionWithId(id: $id) {
        id
        roleName
        blog
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
