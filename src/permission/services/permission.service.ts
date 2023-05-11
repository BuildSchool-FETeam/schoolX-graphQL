import { PermissionSetInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Resource } from 'src/common/enums/resource.enum'
import * as _ from 'lodash'
import { BaseService, IStrictConfig } from 'src/common/services/base.service'
import { TokenService } from 'src/common/services/token.service'
import { CacheService } from 'src/common/services/cache.service'
import { PermissionSet } from '../entities/Permission.entity'
import { RoleService } from './role.service'
import { DEFAULT_PERM } from 'src/common/constants/permission.constant'

@Injectable()
export class PermissionService extends BaseService<PermissionSet> {
  constructor(
    @InjectRepository(PermissionSet)
    private permissionRepo: Repository<PermissionSet>,
    private roleService: RoleService,
    private tokenService: TokenService,
    public cachedService: CacheService
  ) {
    super(permissionRepo, 'Permission', cachedService)
  }

  createAdminPermission() {
    const { ROOT } = DEFAULT_PERM
    const permissionSet = this.permissionRepo.create({
      course: ROOT,
      blog: ROOT,
      permission: ROOT,
      user: ROOT,
      instructor: ROOT,
      notification: ROOT,
    })

    return permissionSet
  }

  async getClientUserPermission(isInstructor: boolean) {
    const clientPermissionName = isInstructor
      ? 'instructor_permission'
      : 'learner_permission'

    const existedRole = await this.roleService.findRoleByName(
      clientPermissionName
    )
    if (existedRole) {
      return existedRole
    }
    const { READ_ONLY, UPDATE_SELF, DENINED } = DEFAULT_PERM

    const userPermission = isInstructor ? UPDATE_SELF : READ_ONLY

    const permissionSet = this.permissionRepo.create({
      course: userPermission,
      blog: userPermission,
      instructor: userPermission,
      user: UPDATE_SELF,
      permission: DENINED,
      notification: READ_ONLY,
    })

    const role = await this.roleService.createRole(clientPermissionName)

    permissionSet.role = role
    await this.permissionRepo.save(permissionSet)

    return role
  }

  async savePermissionSet(permissionSet: PermissionSet) {
    return this.permissionRepo.save(permissionSet)
  }

  async createPermission(input: PermissionSetInput, token: string) {
    const inputWithoutName = _.omit(input, 'roleName')
    const role = await this.roleService.createRole(input.roleName)
    const adminUser = await this.tokenService.getAdminUserByToken(token)

    const perSet = this.permissionRepo.create({
      ...inputWithoutName,
      createdBy: adminUser,
    })

    perSet.role = role
    await this.permissionRepo.save(perSet)

    return {
      name: role.name,
      permissionSet: perSet,
    }
  }

  async updatePermission(
    id: string,
    permissionInput: PermissionSetInput,
    strictConfig: IStrictConfig
  ) {
    const permissionSet = await this.findById(
      id,
      {
        relations: { role: true },
      },
      strictConfig
    )

    if (!permissionSet) {
      throw new NotFoundException(`Resource with id "${id}" not found`)
    }

    const updatedRole = await this.roleService.updateRole(
      permissionSet.role.name,
      permissionInput.roleName
    )

    permissionSet.role = updatedRole

    _.forOwn(_.omit(permissionInput, 'roleName'), (value, key: Resource) => {
      permissionSet[key] = value
    })

    const savedData = await this.permissionRepo.save(permissionSet)

    return {
      name: savedData.role.name,
      permissionSet: savedData,
    }
  }

  async deletePermission(id: string, token: string) {
    const permission = await this.findById(id, { relations: { role: true } })
    await this.deleteOneById(id, {
      token,
      strictResourceName: 'permission',
    })

    await this.roleService.deleteRoleByName(permission.role.name)

    return true
  }

  async getPermissionByRole(roleName: string) {
    return this.permissionRepo
      .createQueryBuilder('perm')
      .innerJoinAndSelect('perm.role', 'role', 'role.name = :name', {
        name: roleName,
      })
      .getOne()
  }
}
