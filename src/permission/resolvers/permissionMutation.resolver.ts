import {
  Mutation,
  Resolver,
  Args,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { PermissionSetInput } from 'src/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import * as _ from 'lodash';
import { PermissionSet } from '../entities/Permission.entity';
import { PermissionService } from '../services/permission.service';

@UseGuards(AuthGuard)
@Resolver('PermissionMutation')
export class PermissionMutationResolver {
  constructor(private permissionService: PermissionService) {}

  @Mutation()
  permissionMutation() {
    return {};
  }

  @PermissionRequire({ permission: ['C', 'U'] })
  @ResolveField()
  async setPermission(
    @Args('data') data: PermissionSetInput,
    @Context() { req }: DynamicObject,
    @Args('id') id: string,
  ) {
    let result: {
      name: string;
      permissionSet: PermissionSet;
    };
    if (!this.isRightFormat(data)) {
      throw new BadRequestException(
        'Wrong format with permission, it should be like this "C|R|U|D|S" or "R" or ""(nothing)"',
      );
    }
    const token = _.split(req.headers.authorization, ' ')[1];

    if (!id) {
      result = await this.permissionService.createPermission(data, token);
    } else {
      result = await this.permissionService.updatePermission(id, data, {
        token,
        strictResourceName: 'permission',
      });
    }

    return {
      ...result.permissionSet,
      roleName: result.name,
    };
  }

  @PermissionRequire({ permission: ['D'] })
  @ResolveField()
  async deletePermission(
    @Args('id') id: string,
    @Context() { req }: DynamicObject,
  ) {
    const token = this.permissionService.getTokenFromHttpHeader(req.headers);

    return this.permissionService.deletePermission(id, token);
  }

  private isRightFormat(perm: PermissionSetInput) {
    const pattern_1 = /^[CRUDS]{0,1}$/;
    const pattern_2 = /^[CRUDS]{1}(\|[CRUDS]){1,4}$/;

    const permissionSetOnly = _.omit(perm, 'roleName');

    const isValidPattern = _.every(permissionSetOnly, (value) => {
      if (!pattern_1.test(value) && !pattern_2.test(value)) {
        return false;
      }

      return true;
    });

    return isValidPattern;
  }
}
