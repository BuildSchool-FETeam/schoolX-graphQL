export interface IPermissionWithRole {
  permissionWithRole: {
    roleName: string
  }
}

export interface IPermissionSetInput {
  roleName: string
  course: string
  permission: string
  user: string
  blog: string
  notification: string
  instructor: string
}

export interface IPermission {
  id: string
  roleName: string
}

export interface IPermissionQuery {
  permissionQuery: {
    permissions: IPermission[]
  }
}
