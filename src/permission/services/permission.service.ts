import { PermissionSetInput } from 'src/graphql';
import { RoleService } from './role.service';
import { PermissionSet } from '../entities/Permission.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/common/enums/resource.enum';
import * as _ from 'lodash';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class PermissionService extends BaseService<PermissionSet> {
  constructor(
    @InjectRepository(PermissionSet)
    private permissionRepo: Repository<PermissionSet>,
    private roleService: RoleService
  ) {
    super(permissionRepo)
  }

  createAdminPermission () {
    const fullPerm = 'CRUD'.split('').join('|');
    const permissionSet = this.permissionRepo.create({
      course: fullPerm,
      blog: fullPerm,
      permission: fullPerm,
      user: fullPerm,
      instructor: fullPerm,
      notification: fullPerm,
    });

    return this.permissionRepo.save(permissionSet);
  }

  async createPermission (input: PermissionSetInput) {
    const inputWithoutName = _.omit(input, 'roleName')
    const role = await this.roleService.createRole(input.roleName)
    const perSet = this.permissionRepo.create({
      ...inputWithoutName,
    });

    perSet.role = role;

    await this.permissionRepo.save(perSet);
    return {
      name: role.name,
      permissionSet: perSet
    }
  }

  async updatePermission (id: string, input: PermissionSetInput) {
    const permissionSet = await this.permissionRepo.findOne(id, { relations: ['role'] });

    if (!permissionSet) {
      throw new NotFoundException(`Resource with id "${id}" not found`)
    }
    await this.roleService.updateRole(permissionSet.role.name, input.roleName);
    _.forOwn(_.omit(input, 'roleName'), (value, key: Resource) => {
      permissionSet[key] = value;
    });

    const savedData = await this.permissionRepo.save(permissionSet);
    return {
      name: input.roleName,
      permissionSet: savedData
    }
  }
}
