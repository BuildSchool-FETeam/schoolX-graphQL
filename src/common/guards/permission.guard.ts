import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as _ from 'lodash'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PermissionService } from 'src/permission/services/permission.service'
import { PermissionSet } from 'src/permission/entities/Permission.entity'
import { TokenService } from '../services/token.service'
import { CacheService } from '../services/cache.service'
import { cacheConstant } from '../constants/cache.contant'
import {
  PermissionRequire,
  PERMISSION_REQUIRE_KEY,
  FlexiblePerm,
  MainPerm,
  FineGrainedPerm,
} from '../decorators/PermissionRequire.decorator'
import { Resource } from '../enums/resource.enum'
import { IS_ACTIVE_KEY } from '../decorators/IsActiveUser.decorator'
import { TokenType } from '../constants/user.constant'

export interface ICachedPermissionSet {
  payload: TokenType
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
    const requiredPermission =
      this.reflector.getAllAndOverride<PermissionRequire>(
        PERMISSION_REQUIRE_KEY,
        [graphQLContext.getHandler()]
      )

    if (!this.isResolve(graphQLContext)) {
      return true
    }

    if (_.isNil(requiredPermission)) {
      return true
    }
    const decodedToken = this.decodeToken(graphQLContext)
    if (!decodedToken) {
      return false
    }

    const { payload, token } = decodedToken

    const accoutIsActive = this.reflector.getAllAndOverride<boolean>(
      IS_ACTIVE_KEY,
      [graphQLContext.getHandler()]
    )

    if (!payload.isAdmin && accoutIsActive && !payload.isActive) {
      throw new ForbiddenException(
        'This client user is inactive! Please try active it first!'
      )
    }

    const userPermissions = await this.permissionService.getPermissionByRole(
      payload.role
    )

    await this.cacheService.setValue<ICachedPermissionSet>(
      `${cacheConstant.PERMISSION}-${token}`,
      {
        permissionSet: userPermissions,
        payload,
      }
    )

    if (!userPermissions) {
      throw new NotFoundException(
        'Cannot found proper permission, try another one!'
      )
    }

    const validPermission = _.every(
      requiredPermission,
      (permissionList, resourceName: keyof typeof Resource) => {
        const userPermBaseResource = userPermissions[resourceName].split(
          '|'
        ) as FlexiblePerm[]
        const userFineGrainedPermMap = new Map(
          userPermBaseResource.map((item) => {
            const arr = item.split(':')

            return [arr[0] as MainPerm, arr[1] as FineGrainedPerm]
          })
        )

        const isValid = permissionList.every((item) => {
          const [requiredMainPerm, requiredFineGrainedPerm] = item.split(
            ':'
          ) as [MainPerm, FineGrainedPerm]
          const userFineGrainedPerm =
            userFineGrainedPermMap.get(requiredMainPerm)

          if (requiredFineGrainedPerm === 'x') {
            return true
          }

          return ['*', '+'].includes(userFineGrainedPerm)
        })

        return isValid
      }
    )

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
        payload: this.tokenService.verifyAndDecodeToken(token),
        token,
      }
    } catch (err) {
      return null
    }
  }
}
