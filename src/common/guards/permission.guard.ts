import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as _ from 'lodash'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PermissionService } from 'src/permission/services/permission.service'
import { PermissionSet } from 'src/permission/entities/Permission.entity'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { TokenService } from '../services/token.service'
import { CacheService } from '../services/cache.service'
import { cacheConstant } from '../constants/cache.contant'
import {
  PermissionRequire,
  PERMISSION_REQUIRE_KEY,
} from '../decorators/PermissionRequire.decorator'

export interface ICachedPermissionSet {
  user: AdminUser | ClientUser
  permissionSet: PermissionSet
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private permissionService: PermissionService,
    private cacheService: CacheService
  ) {}

  async canActivate(context: ExecutionContext) {
    const graphQLContext = GqlExecutionContext.create(context)
    const requirePermission =
      this.reflector.getAllAndOverride<PermissionRequire>(
        PERMISSION_REQUIRE_KEY,
        [graphQLContext.getHandler()]
      )

    if (!this.isResolve(graphQLContext)) {
      return true
    }

    if (_.isNil(requirePermission)) {
      return true
    }
    const decodedToken = this.decodeToken(graphQLContext)

    if (!decodedToken) {
      return false
    }

    const { user, token } = decodedToken
    const userPermissions = await this.permissionService.getPermissionByRole(
      user.role?.name
    )

    await this.cacheService.setValue<ICachedPermissionSet>(
      `${cacheConstant.PERMISSION}-${token}`,
      {
        permissionSet: userPermissions,
        user,
      }
    )

    if (!userPermissions) {
      throw new NotFoundException(
        'Cannot found proper permission, try another one!'
      )
    }

    const validPermission = _.every(requirePermission, (value, key) => {
      const diff = _.difference(value, _.split(userPermissions[key], '|'))

      return diff.length === 0
    })

    return validPermission
  }

  private isResolve(context: GqlExecutionContext) {
    const info = context.getInfo()
    const parentType = info.parentType?.name

    if (!/query|mutation/i.test(parentType)) {
      return false
    }

    return true
  }

  private decodeToken(context: GqlExecutionContext) {
    try {
      const headers = context.getContext().req.headers as DynamicObject
      const token = headers.authorization?.split(' ')[1] as string

      return {
        user: this.tokenService.verifyAndDecodeToken(token),
        token,
      }
    } catch (err) {
      return null
    }
  }
}
