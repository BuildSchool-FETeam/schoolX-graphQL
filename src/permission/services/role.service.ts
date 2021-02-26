import { PermissionSet } from './../entities/Permission.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Role } from '../entities/Role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  createAdminRole(assignedPermission: PermissionSet) {
    const role = this.roleRepo.create({
      name: 'ultimateAdmin',
      permissionSet: assignedPermission,
    });

    return this.roleRepo.save(role);
  }

  async createRole(name: string, permissionSet: PermissionSet) {
    const existedRole = await this.roleRepo.findOne({ name });

    if (existedRole) {
      throw new Error('This name has been taken please choose another one');
    }
    const newRole = this.roleRepo.create({
      name,
      permissionSet,
    });

    return this.roleRepo.save(newRole);
  }

  async deleteRole(options: FindConditions<Role>) {
    return this.roleRepo.delete(options);
  }

  async findRoles(options: FindManyOptions<Role>) {
    return this.roleRepo.find(options);
  }

  async findRoleByOption(name: string, options?: FindOneOptions<Role>) {
    return this.roleRepo.findOne(name, options);
  }
}
