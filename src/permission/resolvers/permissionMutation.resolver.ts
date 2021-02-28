import { Mutation, Resolver, Args, ResolveField } from '@nestjs/graphql';
import { PermissionSetInput } from 'src/graphql';
import { PermissionService } from '../services/permission.service';
import { PermissionSet } from '../entities/Permission.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import * as _ from 'lodash';

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
    if (!id) {
      result = await this.permissionService.createPermission(data);
    } else {
      result = await this.permissionService.updatePermission(id, data);
    }

    return {
      ...result.permissionSet,
      roleName: result.name,
    };
  }

  @PermissionRequire({ permission: ['D'] })
  @ResolveField()
  async deletePermission(@Args('id') id: string) {
    const permissions = await this.permissionService.deleteOneById(id);
    return !!permissions;
  }

  private isRightFormat(perm: PermissionSetInput) {
    const pattern_1 = /^[CRUDS]{0,1}$/;
    const pattern_2 = /^[CRUDS]{1}(\|[CRUDS]){1,3}$/;

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
