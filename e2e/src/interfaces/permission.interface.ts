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
  blog: string
}

export interface IPermissionQuery {
  permissionQuery: {
    permissions: IPermission[]
  }
}

export interface GqlPermissionReponse {
  permissionMutation: {
    setPermission?: IPermission
    deletePermission?: boolean
  }
  permissionQuery: {
    permissionWithRole?: IPermission
    permissionWithId?: IPermission
  }
}
