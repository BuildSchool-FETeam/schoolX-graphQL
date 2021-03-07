import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PermissionRequire,
  PERMISSION_REQUIRE_KEY,
} from '../decorators/PermissionRequire.decorator';
import * as _ from 'lodash';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenService } from '../services/token.service';
import { PermissionService } from 'src/permission/services/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const graphQLContext = GqlExecutionContext.create(context);
    const requirePermission = this.reflector.getAllAndOverride<PermissionRequire>(
      PERMISSION_REQUIRE_KEY,
      [graphQLContext.getHandler()],
    );

    if (!this.isResolve(graphQLContext)) {
      return true;
    }
    if (_.isNil(requirePermission)) {
      return true;
    }
    const validToken = this.decodeToken(graphQLContext);

    if (!validToken) {
      return false;
    }
    const userPermissions = await this.permissionService.getPermissionByRole(
      validToken.role.name,
    );

    if (!userPermissions) {
      throw new NotFoundException(
        'Cannot found proper permission, try another one!',
      );
    }

    const validPermission = _.every(requirePermission, (value, key) => {
      const diff = _.difference(value, _.split(userPermissions[key], '|'));
      return diff.length === 0;
    });

    return validPermission;
  }

  private isResolve(context: GqlExecutionContext) {
    const info = context.getInfo();
    const parentType = info.parentType.name;

    if (!/query|mutation/i.test(parentType)) {
      return false;
    }

    return true;
  }

  private decodeToken(context: GqlExecutionContext) {
    try {
      const headers = context.getContext().req.headers as DynamicObject;
      const token = headers.authorization?.split(' ')[1] as string;
      return this.tokenService.verifyAndDecodeToken(token);
    } catch (err) {
      return null;
    }
  }
}
