import {
  Mutation,
  Resolver,
  Args,
  ResolveField,
  Context,
} from '@nestjs/graphql'
import { PermissionSetInput } from 'src/graphql'
import { BadRequestException, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import * as _ from 'lodash'
import { PermissionSet } from '../entities/Permission.entity'
import { PermissionService } from '../services/permission.service'

@UseGuards(AuthGuard)
@Resolver('PermissionMutation')
export class PermissionMutationResolver {
  constructor(private permissionService: PermissionService) {}

  @Mutation()
  permissionMutation() {
    return {}
  }

  @PermissionRequire({ permission: ['C:*', 'R:*', 'U:*', 'D:x'] })
  @ResolveField()
  async setPermission(
    @Args('data') data: PermissionSetInput,
    @Context() { req }: DynamicObject,
    @Args('id') id: string
  ) {
    let result: {
      name: string
      permissionSet: PermissionSet
    }
    if (!this.isRightFormat(data)) {
      throw new BadRequestException(
        'Wrong format with permission, it should be like this "C:*|R:*|U:x|D:+"'
      )
    }
    const token = _.split(req.headers.authorization, ' ')[1]

    if (!id) {
      result = await this.permissionService.createPermission(data, token)
    } else {
      result = await this.permissionService.updatePermission(id, data, {
        token,
        strictResourceName: 'permission',
      })
    }

    return {
      ...result.permissionSet,
      roleName: result.name,
    }
  }

  @PermissionRequire({ permission: ['C:x', 'R:*', 'U:x', 'D:*'] })
  @ResolveField()
  async deletePermission(
    @Args('id') id: string,
    @Context() { req }: DynamicObject
  ) {
    const token = this.permissionService.getTokenFromHttpHeader(req.headers)

    return this.permissionService.deletePermission(id, token)
  }

  private isRightFormat(perm: PermissionSetInput) {
    const pattern = /([CRUD]:[*+x]\|?){4}/
    const permissionSetOnly = _.omit(perm, 'roleName')

    const isValidPattern = _.every(permissionSetOnly, (value) => {
      return pattern.test(value)
    })

    return isValidPattern
  }
}
